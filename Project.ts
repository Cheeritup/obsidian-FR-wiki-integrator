import { PropertyData } from "TemplateBuilder/TemplateHandler";
import * as fs from "fs";
import { Notice } from "obsidian";
import { getTemplateFromName } from "./TemplateHandlerIterator";
import { fixCurlyBraces } from "./fixCurlyBraces";
type CaptureValue = string;
function writeFile(body: string, phase: string, num: number) {
	if (process.env.DEBUG) {
		fs.writeFileSync(`./output/article.${num}_${phase}.txt`, body);
	}
}
//gets Title
function getTitle(article: string) {
	const match = article.match(/'''(?<Title>.*?)'''/);
	if (!match) {
		console.error(
			`Error: regexp /'''(?<Title>.*?)'''/ failed to match "Title".`
		);
		new Notice("Failed fetching name. see dev console for more details");
	}
	return match?.groups?.Title ?? "untitled";
}
//remove <> tags
function fixTags(article: string) {
	const regexp =
		/<(?<tag>[a-zA-Z]{1,20})(?:(?:.|\s)*?)(?:(?:<\/(?<closingTag>[a-zA-Z]{1,20})>)|(?:\/>))/g;
	return article.replaceAll(
		regexp,
		function replacer(match, tag, closingTag) {
			if (tag === closingTag || !closingTag) {
				return "";
			}
			return match;
		}
	);
}
//makes sure there is no excess characters afther the end of a [[link]](here):
const allowedExcess: string[] = ["s"]; //list of strings to add right after a value name, if the excess is outside the link ie [[human]]s -> [[humans]]
function fixLinkProperty(properties: string) {
	const excessArray: string[] = [];
	const result = properties.replace(
		/\[\[(?<linkValue>.*)\]\](?<excess>.+)/gm,
		function replacer(match, linkValue, excess) {
			if (excess) {
				excessArray.push(excess);
				return `[[${linkValue}${excess}]]`;
			}
			return match;
		}
	);
	return result;
}
const unsupportedProperties = ["allignment", "useon"];
const unsupportedPropertyValues = ["yes", "no"]; // consider allowing "yes" to allow sorting by linking into categories
// Reformats properties (properties, body) and outputs properties as useable data(PropertyData[])
function fixProperties(article: string): {
	body: string;
	properties: string;
	propertyData: PropertyData[];
} {
	const propertyData: PropertyData[] = [];
	const regexp = /^\|\s(?<name>.*?)\s+=\s(?<value>.*?)\s*$\n/gm;
	const match = article.match(regexp);
	if (!match) {
		return { body: article, properties: "", propertyData: [] };
	}
	let matchIndex = 0;
	const totalMatches = match.length;
	let result = article.replace(
		regexp,
		function replacer(match, name: CaptureValue, value: CaptureValue) {
			//should eventually be refactored
			matchIndex += 1;
			//General checks for each value:
			if (value) {
				name = name.replaceAll(" ", "_"); // replaces spaces in the name with underscores
			}
			if (
				!value ||
				unsupportedProperties.includes(name) ||
				unsupportedPropertyValues.includes(value)
			) {
				if (value && !unsupportedProperties.includes(name)) {
					propertyData.push({ name, value });
				}
				let result = "";
				if (matchIndex === totalMatches) {
					result += "---\n";
				}
				return result;
			}
			const value_split = value.split(", ");

			if (value_split.length === 1) {
				// One value:
				propertyData.push({ name, value });
				let result = `${name}: ${value}\n`;
				if (matchIndex === totalMatches) {
					result += "---\n";
				}
				return result;
			}
			// Multiple values:
			propertyData.push({ name, value: value_split });
			const multiline = value_split.map(function (value) {
				return `  - ${value}`;
			});
			let result = `${name}:\n${multiline.join("\n")}\n`;
			if (matchIndex === totalMatches) {
				result += "---\n";
			}
			return result;
		}
	);
	const propertyResult = `---\n${result}`; // insert "obsidianUIMode: preview\n" before result if wanted
	const formatRegexp: RegExp =
		/(?<Properties>^(?:---\n){1}(?:.*\n)*---\n)(?<Body>(?:.|\n)*)/m;
	const formatMatch = propertyResult.match(formatRegexp);
	let body: string = "";
	let properties: string = "";
	if (!formatMatch) {
		console.log(
			"Error: properties formatter failed to match body and properties"
		);
		return { body: propertyResult, properties: "", propertyData };
	}
	if (formatMatch && formatMatch.groups) {
		body = formatMatch?.groups.Body;
		properties = formatMatch?.groups.Properties;
	}
	properties = fixLinkProperty(properties);
	return {
		body,
		properties,
		propertyData,
	};
}
// fixes heading formating, i.e =content= -> #content
function fixHeadings(article: string) {
	article = article.replaceAll(/:;/gm, "#### ");
	const regexp = /(?<start>^=+)(?<content>.+?)(?:=+$)/gm;
	return article.replaceAll(regexp, function replacer(match, start, content) {
		return `${start.replaceAll("=", "#")} ${content}`;
	});
}

// Makes links link to the Forgotten Realm wiki
//consider making a clause that checks if there is a local file in the vault with the same name and if so, skips this step.
function fixLinks(article: string) {
	const regexp = /\[\[(?!frw:)/g;
	return article.replaceAll(regexp, function replacer(match) {
		return "[[frw:";
	});
}

export const parseArticle = function (article: string): {
	parsedArticle: string;
	title: string;
} {
	//Ensures compatibility and consistency in formatting:
	let body = article.replace(/\r/g, "");
	//Fix tags:
	body = fixTags(body);
	writeFile(body, "tags", 1);
	//Fix curly braces:
	const { result: fixCurlyBracesResult, templateName } = fixCurlyBraces(body);
	body = fixCurlyBracesResult;
	writeFile(body, "braces", 2);
	//Fix properties:
	const {
		body: propertyBody,
		properties,
		propertyData,
	} = fixProperties(body);
	body = propertyBody;
	writeFile(body, "properties", 3);
	//Fix headings:
	body = fixHeadings(body);
	writeFile(body, "headings", 4);
	//Fix links:
	body = fixLinks(body);
	writeFile(body, "links", 5);
	//Template checking:
	const template = getTemplateFromName(templateName, propertyData);
	//Final ordering:
	const result = `${properties}\n${template}\n${body}`;
	writeFile(result, "final", 6);
	return { parsedArticle: result, title: getTitle(article) };
};

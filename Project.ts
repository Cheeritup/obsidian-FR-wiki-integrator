const fs = require("fs");

import { PropertyData } from "TemplateHandler";

const example = fs.readFileSync("./example.txt").toString();
type CaptureValue = string;
//text cleaner: remove tags
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

//curly braces fixer (quote fixer,percentage table) !!unfinished!!
//TODO: return template name
function fixCurlyBraces(article: string) {
	const regexp = /{{(?<name>[/a-zA-Z0-9]*)(?<content>[^\n]*)}}\n/g;
	return (
		// change replaceAll parameter to function insead of string for specific cases
		article
			.replaceAll(regexp, "")
			.replace(/^{{.*\n/, "")
			.replace(/^}}$\n/m, "")
	);
}
const unsupportedProperties = ["allignment"];
const unsupportedPropertyValues = ["yes", "no"];
// removes empty properties and reformats properties into "name:value" (result)
// returns an array with PropertyData
function fixProperties(article: string): {
	result: string;
	propertyData: PropertyData[];
} {
	const regexp = /^\|\s(?<name>.*?)\s+=\s(?<value>.*?)\s*$\n/gm;
	const match = article.match(regexp);
	if (!match) {
		return { result: article, propertyData: [] };
	}
	const totalMatches = match.length;
	let matchIndex = 0;
	const propertyData: PropertyData[] = [];
	let result = article.replace(
		regexp,
		function replacer(match, name: CaptureValue, value: CaptureValue) {
			matchIndex += 1;
			if (
				!value ||
				unsupportedProperties.includes(name) ||
				unsupportedPropertyValues.includes(value)
			) {
				let result = "";
				if (matchIndex === totalMatches) {
					result += "---\n";
				}
				return result;
			}
			let currentPair: PropertyData = { name, value };
			propertyData.push(currentPair);
			const value_split = value.split(", ");
			if (value_split.length === 1) {
				let result = `${name}: ${value}\n`;
				if (matchIndex === totalMatches) {
					result += "---\n";
				}
				return result;
			}
			const multiline = value_split.map(function (value) {
				return `  - ${value}`;
			});
			let result = `${name}:\n${multiline.join("\n")}`;
			if (matchIndex === totalMatches) {
				result += "---\n";
			}
			return result;
		}
	);
	result = `---\nobsidianUIMode: preview\n${result}`;
	return {
		result,
		propertyData,
	};
}

// fixes heading formating, i.e =content= -> #content
function fixHeadings(article: string) {
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

export const parseArticle = function (article: string) {
	let result = article.replace(/\r/g, "");
	result = fixTags(result);
	result = fixCurlyBraces(result);
	result = fixProperties(result).result;
	console.log(fixProperties(example).propertyData);
	result = fixHeadings(result);
	result = fixLinks(result);
	return result;
};
//console.log(parseArticle(example));
parseArticle(example);

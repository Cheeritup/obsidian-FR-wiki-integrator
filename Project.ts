import { PropertyData } from "TemplateBuilder/TemplateHandler";
import { locationTemplateHandler } from "./TemplateBuilder/InfoboxTemplateHandler";
import * as fs from "fs";
import { Notice } from "obsidian";
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

// removes unneccesary {} tags(result), also returns the template name(templateName)
function fixCurlyBraces(article: string): {
	result: string;
	templateName: string;
} {
	const regexp = /{{(?<name>[/a-zA-Z0-9]*)(?<content>[^\n]*)}}\n/g; //does not remove {{}} in the middle of lines to support future implementations (quotes/cites)
	let templateName: string = "";
	const result = article
		.replaceAll(regexp, "")
		.replace(
			/^{{(?<template>.*)\n/,
			function replacer(match, template: string) {
				templateName = template;
				return "";
			}
		)
		.replace(/^}}$\n/m, "")
		.replace(/^}}/m, "");
	return { result, templateName };
}

const unsupportedProperties = ["allignment"];
const unsupportedPropertyValues = ["yes", "no"]; // consider allowing "yes" to allow sorting by linking into categories
// Reformats properties (properties, body) and outputs properties as useable data(PropertyData[])
function fixProperties(article: string): {
	body: string;
	properties: string;
	propertyData: PropertyData[];
} {
	const regexp = /^\|\s(?<name>.*?)\s+=\s(?<value>.*?)\s*$\n/gm;
	const match = article.match(regexp);
	if (!match) {
		return { body: article, properties: "", propertyData: [] };
	}
	const totalMatches = match.length;
	let matchIndex = 0;
	const propertyData: PropertyData[] = [];
	let result = article.replace(
		regexp,
		function replacer(match, name: CaptureValue, value: CaptureValue) {
			//should eventually be refactored
			matchIndex += 1;
			if (value) {
				name = name.replaceAll(" ", "_"); // replaces spaces in the name with underscore
			}
			if (
				!value ||
				unsupportedProperties.includes(name) ||
				unsupportedPropertyValues.includes(value)
			) {
				if (value) {
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
				propertyData.push({ name, value });
				let result = `${name}: ${value}\n`;
				if (matchIndex === totalMatches) {
					result += "---\n";
				}
				return result;
			}
			// If more than one value:
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
	const propertyResult = `---\nobsidianUIMode: preview\n${result}`; //TODO: decide on preferred UI mode
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
	return {
		body,
		properties,
		propertyData,
	};
} // fixes heading formating, i.e =content= -> #contentfunction fixHeadings(article: string) {
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

export const parseArticle = function (article: string): {
	parsedArticle: string;
	title: string;
} {
	let body = article.replace(/\r/g, "");
	body = fixTags(body);
	writeFile(body, "tags", 1);
	body = fixCurlyBraces(body).result;
	writeFile(body, "braces", 2);
	const {
		body: propertyBody,
		properties,
		propertyData,
	} = fixProperties(body);
	body = propertyBody;
	writeFile(body, "properties", 3);
	body = fixHeadings(body);
	writeFile(body, "headings", 4);
	body = fixLinks(body);
	writeFile(body, "links", 5);
	const template = locationTemplateHandler.getTemplate(propertyData);
	const result = `${properties}\n${template}\n${body}`;
	writeFile(result, "final", 6);
	return { parsedArticle: result, title: getTitle(article) };
};

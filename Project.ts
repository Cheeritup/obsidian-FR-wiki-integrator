import { PropertyData } from "TemplateBuilder/TemplateHandler";
type CaptureValue = string;

//const fs = require("fs");
//const example = fs.readFileSync("./example.txt").toString();

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
	const regexp = /{{(?<name>[/a-zA-Z0-9]*)(?<content>[^\n]*)}}\n/g;
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
		.replace(/^}}$\n/m, "");
	return { result, templateName };
}

const unsupportedProperties = ["allignment"];
const unsupportedPropertyValues = ["yes", "no"]; // consider allowing "yes" to allow sorting by linking into categories
// Reformats properties (result) and outputs properties as useable data(PropertyData[])
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
	result = fixCurlyBraces(result).result;
	result = fixProperties(result).result;
	result = fixHeadings(result);
	result = fixLinks(result);
	return result;
};
//console.log(parseArticle(example));
//parseArticle(example);

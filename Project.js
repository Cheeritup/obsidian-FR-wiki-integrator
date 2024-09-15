//const fs = require("fs");
//const example = fs.readFileSync("./example.txt").toString();
//text cleaner: remove tags
/** @param {string} article */
function fixTags(article) {
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
/** @returns {string} */

//curly braces fixer (quote fixer,percentage table) !!unfinished!!
/** @param {string} article */
function fixCurlyBraces(article) {
	const regexp = /{{(?<name>[/a-zA-Z0-9]*)(?<content>[^\n]*)}}\n/g;
	return (
		// change replaceAll parameter to function insead of string for specific cases
		article
			.replaceAll(regexp, "")
			.replace(/^{{.*\n/, "")
			.replace(/^}}$\n/m, "")
	);
}
/** @returns {string} */

const unsupportedProperties = ["allignment"];
const unsupportedPropertyValues = ["yes", "no"];
// removes empty properties and reformats properties into "name:value" (and corrosponding multivalue lines).
/** @param {string} article */
function fixProperties(article) {
	const regexp = /^\|\s(?<name>.*?)\s+=\s(?<value>.*?)\s*$\n/gm;
	const totalMatches = article.match(regexp).length;
	let matchIndex = 0;
	let result = article.replace(regexp, function replacer(match, name, value) {
		matchIndex += 1;
		const value_split = value.split(", ");
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
		if (value_split.length === 1) {
			let result = `${name}: ${value}\n`;
			if (matchIndex === totalMatches) {
				result += "---\n";
			}
			return result;
		}
		if (value_split.length > 1) {
			const multiline = value_split.map(function (value) {
				return `  - ${value}`;
			});
			let result = `${name}:\n${multiline.join("\n")}`;
			if (matchIndex === totalMatches) {
				result += "---\n";
			}
			return result;
		}
	});
	return `---\nobsidianUIMode: preview\n${result}`;
}
/** @returns {string} */

// fixes heading formating, i.e =content= -> #content
/** @param {string} article */
function fixHeadings(article) {
	const regexp = /(?<start>^=+)(?<content>.+?)(?:=+$)/gm;
	return article.replaceAll(regexp, function replacer(match, start, content) {
		return `${start.replaceAll("=", "#")} ${content}`;
	});
}
/** @returns {string} */

// Makes links link to the Forgotten Realm wiki
//consider making a clause that checks if there is a local file in the vault with the same name and if so, skips this step.
/** @param {string} article */
function fixLinks(article) {
	const regexp = /\[\[(?!frw:)/g;
	return article.replaceAll(regexp, function replacer(match) {
		return "[[frw:";
	});
}
/** @returns {string} */

/** @param {string} article */
module.exports.parseArticle = function (article) {
	let result = article.replace(/\r/g, "");
	result = fixTags(result);
	result = fixCurlyBraces(result);
	result = fixProperties(result);
	result = fixHeadings(result);
	result = fixLinks(result);
	return result;
};
/** @returns {string} */
const parseArticle = module.exports.parseArticle;
//console.log(parseArticle(example));

/** @param */
/**
 * function
 */
/** @return */

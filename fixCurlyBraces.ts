//isolates quote blocks from the main process. also returns an array of each quote block.
//TODO: add support for quotes
function quotesHandler(article: string) {
	const quotes: string[] = [];
	const regexp = /(?:{{fq){1}(?:.*\n)*}}/gm;
	const result = article.replace(regexp, function replacer(match) {
		quotes.push(match);
		return ""; //this should be the proccessed quote block
	});
	return { result, quotes };
}
// removes unneccesary {} tags(result), also returns the template name(templateName)
export function fixCurlyBraces(article: string): {
	result: string;
	templateName: string;
} {
	const regexp = /{{(?<name>[/a-zA-Z0-9]*)(?<content>[^\n]*)}}\n/g; //does not remove {{}} in the middle of lines to support future implementations (quotes/cites)
	let templateName: string = "";
    article = quotesHandler(article).result
	let result = article
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

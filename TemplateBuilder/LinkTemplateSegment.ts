import { property } from "lodash";
import { ConstantTemplateSegment } from "./ConstantTemplateSegment";
import { TemplateHandler } from "./TemplateHandler";
import { TemplateData, TemplateSegment } from "./TemplateSegment";
export class LinksTemplateSegment extends TemplateSegment {
	constructor() {
		super();
	}

	protected getIncludeSegment(arg: TemplateData): boolean {
		return arg.propertyData.some((property) => property.value === "yes");
	}
	protected getSegmentText(arg: TemplateData): string {
		let articleName = arg.propertyData.find(
			(property) => property.name === "name"
		)?.value; //should check what is returned if no "name" is found
		return (
			arg.propertyData
				.filter((property) => property.value === "yes")
				.map((property) => this.getLinkDisplayedName(property.name))
				.map(
					(property) =>
						(property = `\`=link("frwc:${property} of ${articleName}")\``)
				)
				.join("\n") + "\n"
		);
	}

	private getLinkDisplayedName(string: string): string {
		const caped = string.charAt(0).toUpperCase() + string.slice(1);
		return caped.replaceAll(" ", "");
	}
}

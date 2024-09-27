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
		return (
			arg.propertyData
				.filter((property) => property.value === "yes")
				.map((property) => this.getLinkDisplayedName(property.name))
				.join("\n") + "\n"
		);
	}

	private getLinkDisplayedName(string: string): string {
		const caped = string.charAt(0).toUpperCase() + string.slice(1);
		return caped.replaceAll(" ", "");
	}
}

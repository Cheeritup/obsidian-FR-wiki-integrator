import { ConstantTemplateSegment } from "./ConstantTemplateSegment";
import { TemplateData, TemplateSegment } from "./TemplateSegment";

export class SectionEntryTemplateSegment extends TemplateSegment {
	private parameter: string;
	private propertyName: string;

	constructor(parameter: string, propertyName?: string) {
		super();
		this.parameter = parameter;
		if (propertyName) {
			this.propertyName = propertyName;
		} else {
			this.propertyName = parameter.toLowerCase();
		}
	}

	public getIncludeSegment(arg: TemplateData): boolean {
		return arg.propertyData.some(
			(property) => property.name === this.propertyName
		);
	}

	public getSegmentText(arg: TemplateData): string {
		const property = arg.propertyData.find(
			(property) => property.name === this.propertyName
		);
		if (!property) throw new Error("Missing required property");
		const value = property.value;

		const isLink =
			typeof value === "string" &&
			value.startsWith("[[") &&
			value.endsWith("]]");

		if (isLink) {
			return `> ${this.parameter} | \`=link(this.${this.propertyName})\`|\n`;
		}
		return `> ${this.parameter} | \`=this.${this.propertyName}\`|\n`;
	}
}

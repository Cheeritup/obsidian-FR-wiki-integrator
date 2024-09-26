import * as _ from "lodash";
import { TemplateSegment } from "./TemplateSegment";
import { ConstantTemplateSegment } from "./ConstantTemplateSegment";
import { InfoboxTitleTemplateSegment } from "./InfoboxTitleTemplateSegment";
import { SectionTemplateSegment } from "./SectionTemplateSegment";
import { SectionEntryTemplateSegment } from "./SectionEntryTemplateSegment";
import { LinksTemplateSegment } from "./LinkTemplateSegment";
export interface PropertyData {
	name: string;
	value: string | string[]; // might not be possible for it to be an array
}

export class TemplateHandler {
	private name: string;
	private segments: TemplateSegment[];
	constructor(name: string, segments: TemplateSegment[]) {
		this.name = name;
		this.segments = segments;
	}
	public getName() {
		return this.name;
	}
	public getTemplate(properties: PropertyData[]) {
		return this.segments
			.map((segment) => segment.getSegment({ propertyData: properties }))
			.join("");
	}
}

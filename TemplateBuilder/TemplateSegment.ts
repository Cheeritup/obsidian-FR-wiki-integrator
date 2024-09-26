import { PropertyData } from "./TemplateHandler";

export interface TemplateData {
	propertyData: PropertyData[];
}
export class TemplateSegment {
	public getSegment(arg: TemplateData): string {
		if (this.getIncludeSegment(arg)) {
			return this.getSegmentText(arg);
		}
		return "";
	}
	protected getSegmentText(arg: TemplateData): string {
		return "";
	}
	protected getIncludeSegment(arg: TemplateData): boolean {
		return true;
	}
}

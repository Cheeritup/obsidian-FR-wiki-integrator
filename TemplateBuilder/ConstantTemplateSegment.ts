import { TemplateData, TemplateSegment } from "./TemplateSegment";

export class ConstantTemplateSegment extends TemplateSegment {
	protected content: string;

	constructor(content: string) {
		super();
		this.content = content;
	}

	protected getSegmentText(arg: TemplateData): string {
		return this.content;
	}
}

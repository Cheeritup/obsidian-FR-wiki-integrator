import { SectionEntryTemplateSegment } from "./SectionEntryTemplateSegment";
import { TemplateData, TemplateSegment } from "./TemplateSegment";

export class SectionTemplateSegment extends TemplateSegment {
	private entries: SectionEntryTemplateSegment[];
	private name: string;

	constructor(name: string, entries: SectionEntryTemplateSegment[]) {
		super();
		this.name;
		this.entries = entries;
	}

	protected getIncludeSegment(arg: TemplateData): boolean {
		return this.entries.some((entry) => entry.getIncludeSegment(arg));
	}
	protected getSegmentText(arg: TemplateData): string {
		return `> ##### ${this.name}\n> ||\n> ---|---|\n`.concat(
			...this.entries.map((entry) => entry.getSegment(arg))
		);
	}
}

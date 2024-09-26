import { InfoboxTitleTemplateSegment } from "./InfoboxTitleTemplateSegment";
import { LinksTemplateSegment } from "./LinkTemplateSegment";
import { SectionEntryTemplateSegment } from "./SectionEntryTemplateSegment";
import { SectionTemplateSegment } from "./SectionTemplateSegment";
import { TemplateHandler } from "./TemplateHandler";
import { TemplateSegment } from "./TemplateSegment";

const titleSegmentHandler = new InfoboxTitleTemplateSegment();
const linkSegmentHandler = new LinksTemplateSegment();

interface InfoboxSection {
	name: string;
	entries: {
		parameter: string;
		property?: string;
	}[];
}

export class InfoboxTemplateHandler extends TemplateHandler {
	constructor(name: string, segments: TemplateSegment[]) {
		super(name, [titleSegmentHandler, ...segments, linkSegmentHandler]);
	}

	static generateFromData(infoboxSections: InfoboxSection[]) {
		return new InfoboxTemplateHandler(
			this.name,
			infoboxSections.map(
				(section) =>
					new SectionTemplateSegment(
						section.name,
						section.entries.map(
							(entry) =>
								new SectionEntryTemplateSegment(
									entry.parameter,
									entry.property
								)
						)
					)
			)
		);
	}
}

const locationTemplateHandler = new InfoboxTemplateHandler("Location", [
	new SectionTemplateSegment("Geography", [
		new SectionEntryTemplateSegment("Aliases"),
		new SectionEntryTemplateSegment("Type"),
		new SectionEntryTemplateSegment("Region"),
		new SectionEntryTemplateSegment("Capital", "capital"),
	]),
	new SectionTemplateSegment("Society", [
		new SectionEntryTemplateSegment("Races"),
		new SectionEntryTemplateSegment("Religions"),
		new SectionEntryTemplateSegment("Alignments"),
	]),
	new SectionTemplateSegment("Commerce", [
		new SectionEntryTemplateSegment("Exports"),
		new SectionEntryTemplateSegment("Currency"),
	]),
	new SectionTemplateSegment("Politics", [
		new SectionEntryTemplateSegment("Govt Type", "politics"),
		new SectionEntryTemplateSegment("Ruler", "leader"),
		new SectionEntryTemplateSegment("Defense", "defences"),
	]),
	new SectionTemplateSegment("History", [
		new SectionEntryTemplateSegment("Population"),
	]),
]);

InfoboxTemplateHandler.generateFromData([
	{
		name: "Geography",
		entries: [
			{
				parameter: "Aliases",
			},
		],
	},
]);

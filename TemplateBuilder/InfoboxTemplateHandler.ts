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

export const locationTemplateHandler = new InfoboxTemplateHandler("Location", [
	new SectionTemplateSegment("Geography", [
		new SectionEntryTemplateSegment("Alt Spelling", "alt_spelling"),
		new SectionEntryTemplateSegment("Aliases"),
		new SectionEntryTemplateSegment("Type"),
		new SectionEntryTemplateSegment("Region"),
		new SectionEntryTemplateSegment("Size"),
		new SectionEntryTemplateSegment("Elevation"),
		new SectionEntryTemplateSegment("Depth"),
		new SectionEntryTemplateSegment("Capital"),
		new SectionEntryTemplateSegment("Largest City", "largest_city"),
	]),
	new SectionTemplateSegment("Society", [
		new SectionEntryTemplateSegment("Demonym"),
		new SectionEntryTemplateSegment("Population"),
		new SectionEntryTemplateSegment("Races"),
		new SectionEntryTemplateSegment("Languages"),
		new SectionEntryTemplateSegment("Religion"),
		new SectionEntryTemplateSegment("Alignment"),
	]),
	new SectionTemplateSegment("Commerce", [
		new SectionEntryTemplateSegment("Imports"),
		new SectionEntryTemplateSegment("Exports"),
		new SectionEntryTemplateSegment("Currency"),
	]),
	new SectionTemplateSegment("Politics", [
		new SectionEntryTemplateSegment("Government"),
		new SectionEntryTemplateSegment("Ruler Type", "rulertype"),
		new SectionEntryTemplateSegment("Ruler"),
		new SectionEntryTemplateSegment("Head of State Title", "head_of_state"),
		new SectionEntryTemplateSegment("Head of State", "leader1"),
		new SectionEntryTemplateSegment(
			"Head of Government Title",
			"head_of_government"
		),
		new SectionEntryTemplateSegment("Head of Government", "leader2"),
		new SectionEntryTemplateSegment("Executive"),
		new SectionEntryTemplateSegment("Legislature"),
		new SectionEntryTemplateSegment("Judiciary"),
		new SectionEntryTemplateSegment("Allegiances"),
	]),
	new SectionTemplateSegment("History", [
		new SectionEntryTemplateSegment("Established"),
		new SectionEntryTemplateSegment("Start Event", "start_event"),
		new SectionEntryTemplateSegment("Start Date", "start_date"),
		new SectionEntryTemplateSegment("Population"),
		// needs support for number of events+their dates
		new SectionEntryTemplateSegment("Disestablished"),
		new SectionEntryTemplateSegment("End Event", "end_event"),
		new SectionEntryTemplateSegment("Disestablished"),
		new SectionEntryTemplateSegment("End Date", "end_date"),
		new SectionEntryTemplateSegment("Predecessor"),
		new SectionEntryTemplateSegment("Successor"),
		// needs support for population1,2,3 so forth
		// needs support for popyear1,2,3 so forth
		new SectionEntryTemplateSegment("Population Table", "poptable"),
		// needs support for ruler1,2,3 so forth
		new SectionEntryTemplateSegment("Ruler Table", "rulertable"),
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

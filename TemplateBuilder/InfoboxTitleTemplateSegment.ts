import { ConstantTemplateSegment } from "./ConstantTemplateSegment";

export class InfoboxTitleTemplateSegment extends ConstantTemplateSegment {
	constructor() {
		super("> [!infobox]\n> ###### **`=this.file.name`**\n");
	}
}

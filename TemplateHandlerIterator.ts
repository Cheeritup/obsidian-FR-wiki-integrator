import { PropertyData, TemplateHandler } from "TemplateBuilder/TemplateHandler";
import { locationTemplateHandler } from "./TemplateBuilder/InfoboxTemplateHandler";
//FIXME: eventually implement templateHandlers correctly
const templateHandlers: TemplateHandler[] = [locationTemplateHandler];
export function getTemplateFromName(
	templateName: string,
	propertyData: PropertyData[]
) {
	let correctTemplate: string | undefined = "";
	for (const templateHandler of templateHandlers) {
		if (templateName === templateHandler.getName()) {
			correctTemplate = templateHandler.getTemplate(propertyData);
			break;
		}
		if (correctTemplate === "") {
			return console.error("Error: failed to find matching template");
		}
	}
	return correctTemplate;
}

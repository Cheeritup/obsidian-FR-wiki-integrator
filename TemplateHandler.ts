import * as _ from "lodash";
export interface PropertyData {
	name: string;
	value: string | string[]; // might not be possible for it to be an array
}
export interface BuildData {
	content: string;
	requiredProperties?: string | string[];
}
export class TemplateHandler {
	private name: string;
	private buildData: BuildData[];

	constructor(name: string, buildData: BuildData[]) {
		this.name = name;
		this.buildData = buildData;
	}
	public getName() {
		return this.name;
	}
	public getTemplate(properties: PropertyData[]) {
		const propertyNames = new Set(properties.map((prop) => prop.name));
		return this.buildData.reduce((acc, step) => {
			const reqArray = _.castArray(step.requiredProperties ?? []);
			if (reqArray.every((required) => propertyNames.has(required))) {
				return acc + step.content;
			}
			return acc;
		}, "");
	}
}

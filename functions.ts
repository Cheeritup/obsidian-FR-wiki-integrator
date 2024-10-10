import { App, Notice } from "obsidian";
const requiredPrefix = {
	prefix: "frw",
	target: "https://forgottenrealms.fandom.com/wiki/%s",
	wordSeparator: "",
};
const secondaryPrefix = {
	prefix: "frwc",
	target: "https://forgottenrealms.fandom.com/wiki/Category:%s",
	wordSeparator: "",
};
interface QuickLinksPrefix {
	prefix: string;
	target: string;
	wordSeparator: string;
}
export async function ensureQuickLinksSupport(app: App) {
	try {
		const quickLinks = app.plugins.getPlugin("quick-links");
		if (!quickLinks) {
			new Notice(
				"Error: Plugin QuickLinks not found. External links will be broken."
			);
			return false;
		}
		const jsonData = await quickLinks.loadData();
		const prefixes = jsonData.quickLinks as QuickLinksPrefix[];
		if (
			!prefixes.some((prefix) => prefix.prefix === requiredPrefix.prefix)
		) {
			prefixes.push(requiredPrefix);
			await quickLinks.saveData(jsonData);
			await quickLinks.unload();
			await quickLinks.load();
		}
		if (
			!prefixes.some((prefix) => prefix.prefix === secondaryPrefix.prefix)
		) {
			prefixes.push(secondaryPrefix);
			await quickLinks.saveData(jsonData);
			await quickLinks.unload();
			await quickLinks.load();
		}
		return true;
	} catch (error) {
		console.error(error);
		new Notice("Error fixing external Forgotten Realms links");
		return false;
	}
}

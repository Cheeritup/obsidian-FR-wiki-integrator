import { App, Notice } from "obsidian";
const requiredPrefix = {
	prefix: "frw",
	target: "https://forgottenrealms.fandom.com/wiki/%s",
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
			return;
		}
		const jsonData = await quickLinks.loadData();
		// handle noquickLinks (notice + return)
		const prefixes = jsonData.quickLinks as QuickLinksPrefix[];
		if (
			!prefixes.some((prefix) => prefix.prefix === requiredPrefix.prefix)
		) {
			prefixes.push(requiredPrefix);
			await quickLinks.saveData(jsonData);
			await quickLinks.unload();
			await quickLinks.load();
		} return true
	} catch (error) {
		// prinToConsole(error)
		new Notice("Error fixing external Forgotten Realms links");
		return false
	}
}

function ensureQuickLinksSupport(dataFile) {
	const requiredPrefix = {
		prefix: "frw",
		target: "https://forgottenrealms.fandom.com/wiki/%s",
		wordSeparator: "",
	};
	try {
		const jsonData = JSON.parse(JSON.stringify(dataFile)); // make sure it reaches the data.json file
		const prefixes = jsonData.quickLinks;
		if (!prefixes.includes(requiredPrefix)) {
			prefixes.push(requiredPrefix);
			new Notice(
				"External links should now work with the Forgotten Realms wiki!"
			);
		} else
			new Notice(
				"External links already work with the Forgotten Realms wiki!"
			);
		return prefixes;
	} catch (error) {
		new Notice("Error fixing external Forgotten Realms links");
	}
}

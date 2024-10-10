import {
	App,
	Editor,
	MarkdownView,
	Modal,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
	TFile,
} from "obsidian";
import { parseArticle } from "./Project";
import { ensureQuickLinksSupport } from "./functions";
// Remember to rename these classes and interfaces!

interface FRWIntegrationPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: FRWIntegrationPluginSettings = {
	mySetting: "default",
};

export default class FRWIntegrationPlugin extends Plugin {
	settings: FRWIntegrationPluginSettings;

	async onload() {
		// Quicklinks prefix check
		const quickLinksSupport = await ensureQuickLinksSupport(this.app);
		if (!quickLinksSupport){
			new Notice (`"Quick Links" setup failed."`);
		}
		await this.loadSettings();
		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon(
			"dice",
			"FR Wiki Integrator Test",
			(evt: MouseEvent) => {
				// Called when the user clicks the icon.
				new Notice("This ensures the plugin is loaded for debugging.");
			}
		);
		// Actual function, integrates an article's source code into the editor
		this.addCommand({
			id: "frw-integration-command",
			name: "Fix Source Code",
			editorCallback: async (editor: Editor, view: MarkdownView) => {
				try {
					//Replacement of text:
					const article = parseArticle(editor.getSelection());
					editor.replaceSelection(article.parsedArticle);
					//Renaming file:
					const currentNote =
						this.app.workspace.getActiveFile() as TFile;
					const newPath = currentNote.path.replace(
						`${currentNote.basename}.${currentNote.extension}`,
						`${article.title}.${currentNote.extension}`
					);
					this.app.fileManager.renameFile(currentNote, newPath);
				} catch (error) {
					new Notice(
						`${error.name}\nError Occured. Check dev console for more details.`
					);
					if (error instanceof Error) {
						console.error(`${error.name}: ${error.message}`);
					} else console.error(error);
				}
			},
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, "click", (evt: MouseEvent) => {
			console.log("click", evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(
			window.setInterval(() => console.log("setInterval"), 5 * 60 * 1000)
		);
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.setText("Woah!");
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: FRWIntegrationPlugin;

	constructor(app: App, plugin: FRWIntegrationPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Add Category Support")
			.setDesc(
				"Manually add support for new categories. Yet to be implemented fully."
			)
			.addText((text) =>
				text
					.setPlaceholder("Enter your secret")
					.setValue(this.plugin.settings.mySetting)
					.onChange(async (value) => {
						this.plugin.settings.mySetting = value;
						await this.plugin.saveSettings();
					})
			);
	}
}

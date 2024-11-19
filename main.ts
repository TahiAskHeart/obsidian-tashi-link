import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, SettingTab } from 'obsidian';

// Remember to rename these classes and interfaces!
interface TashiLinkSettings {
	enableCreateAnchorLinkMenu: boolean;
	enableCreateBlockLinkMenu: boolean;
	enableCreateAnchorQuoteMenu: boolean;
	enableCreateBlockQuoteMenu: boolean;
}

const DEFAULT_SETTINGS: TashiLinkSettings = {
	enableCreateAnchorLinkMenu: true,
	enableCreateBlockLinkMenu: true,
	enableCreateAnchorQuoteMenu: false,
	enableCreateBlockQuoteMenu: false
};

export default class TashiLink extends Plugin {
	settings: TashiLinkSettings;

	async onload() {
		console.log('加载插件');

		await this.loadSettings();

		this.CreateAnchorLinkMenu();	//创建锚链接
		this.CreateBlockLinkMenu();		//创建块链接

		this.CreateAnchorQuoteMenu();	//创建锚引用
		this.CreateBlockQuoteMenu();	//创建块引用

		// 注册设置选项卡
		this.addSettingTab(new TashiLinkSettingTab(this.app, this));
	}

	onunload() {
		console.log('卸载插件');
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	//创建锚链接
	CreateAnchorLinkMenu() {
		// 注册右键菜单项
		this.app.workspace.on('editor-menu', (menu, editor, event) => {
			// 检查是否有选中的文本
			if (editor.getSelection() && this.settings.enableCreateAnchorLinkMenu) {
				// 获取选中的文本
				const selectedText = editor.getSelection();
				const replaceText = `[[##${selectedText}|${selectedText}]]`;

				menu.addItem((item) => {
					item.setTitle(`创建锚链接 ${replaceText}`)
						.setIcon("link") // 设置一个图标
						.onClick(() => {
							editor.replaceSelection(replaceText);
							const cursorPosition = editor.getCursor();
							editor.setCursor({ line: cursorPosition.line, ch: cursorPosition.ch - selectedText.length - 3 });
						});
				});
			}
		});
	}

	//创建块链接
	CreateBlockLinkMenu() {
		// 注册右键菜单项
		this.app.workspace.on('editor-menu', (menu, editor, event) => {
			// 检查是否有选中的文本
			if (editor.getSelection() && this.settings.enableCreateBlockLinkMenu) {
				// 获取选中的文本
				const selectedText = editor.getSelection();
				const replaceText = `[[^^${selectedText}|${selectedText}]]`;

				menu.addItem((item) => {
					item.setTitle(`创建块链接 ${replaceText}`)
						.setIcon("link-2") // 设置一个图标
						.onClick(() => {

							editor.replaceSelection(replaceText);

							const cursorPosition = editor.getCursor();
							editor.setCursor({ line: cursorPosition.line, ch: cursorPosition.ch - selectedText.length - 3 });
						});
				});
			}
		});
	}

	//创建锚引用
	CreateAnchorQuoteMenu() {
		// 注册右键菜单项
		this.app.workspace.on('editor-menu', (menu, editor, event) => {
			// 检查是否有选中的文本
			if (editor.getSelection() && this.settings.enableCreateAnchorQuoteMenu) {
				// 获取选中的文本
				const selectedText = editor.getSelection();
				const replaceText = `![[##${selectedText}|${selectedText}]]`;

				menu.addItem((item) => {
					item.setTitle(`创建锚引用 ${replaceText}`)
						.setIcon("link") // 设置一个图标
						.onClick(() => {
							editor.replaceSelection(replaceText);
							const cursorPosition = editor.getCursor();
							editor.setCursor({ line: cursorPosition.line, ch: cursorPosition.ch - selectedText.length - 3 });
						});
				});
			}
		});
	}

	//创建块引用
	CreateBlockQuoteMenu() {
		// 注册右键菜单项
		this.app.workspace.on('editor-menu', (menu, editor, event) => {
			// 检查是否有选中的文本
			if (editor.getSelection() && this.settings.enableCreateBlockQuoteMenu) {
				// 获取选中的文本
				const selectedText = editor.getSelection();
				const replaceText = `![[^^${selectedText}|${selectedText}]]`;

				menu.addItem((item) => {
					item.setTitle(`创建块引用 ${replaceText}`)
						.setIcon("link-2") // 设置一个图标
						.onClick(() => {
							editor.replaceSelection(replaceText);
							const cursorPosition = editor.getCursor();
							editor.setCursor({ line: cursorPosition.line, ch: cursorPosition.ch - selectedText.length - 3 });
						});
				});
			}
		});
	}
}

class TashiLinkSettingTab extends PluginSettingTab {
	plugin: TashiLink;

	constructor(app: App, plugin: TashiLink) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('创建锚链接')
			.setDesc('启用 创建锚链接')
			.addToggle(toggle =>
				toggle.setValue(this.plugin.settings.enableCreateAnchorLinkMenu)
					.onChange(async (value) => {
						this.plugin.settings.enableCreateAnchorLinkMenu = value;
						await this.plugin.saveSettings();
						this.display(); // 重新渲染设置页面以反映更改
					})
			);

		new Setting(containerEl)
			.setName('创建块链接')
			.setDesc('启用 创建块链接')
			.addToggle(toggle =>
				toggle.setValue(this.plugin.settings.enableCreateBlockLinkMenu)
					.onChange(async (value) => {
						this.plugin.settings.enableCreateBlockLinkMenu = value;
						await this.plugin.saveSettings();
						this.display(); // 重新渲染设置页面以反映更改
					})
			);

		new Setting(containerEl)
			.setName('创建锚引用')
			.setDesc('启用 创建锚引用')
			.addToggle(toggle =>
				toggle.setValue(this.plugin.settings.enableCreateAnchorQuoteMenu)
					.onChange(async (value) => {
						this.plugin.settings.enableCreateAnchorQuoteMenu = value;
						await this.plugin.saveSettings();
						this.display(); // 重新渲染设置页面以反映更改
					})
			);

		new Setting(containerEl)
			.setName('创建块引用')
			.setDesc('启用 创建块引用')
			.addToggle(toggle =>
				toggle.setValue(this.plugin.settings.enableCreateBlockQuoteMenu)
					.onChange(async (value) => {
						this.plugin.settings.enableCreateBlockQuoteMenu = value;
						await this.plugin.saveSettings();
						this.display(); // 重新渲染设置页面以反映更改
					})
			);
	}
}
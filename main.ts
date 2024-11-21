import { App, Plugin, Setting, PluginSettingTab, MenuItem, Menu, Editor, Notice, MarkdownEditView } from 'obsidian';

// Remember to rename these classes and interfaces!
interface TashiLinkSettings {
	enableCreateAnchorLink: boolean;
	enableCreateAnchorQuote: boolean;
	enableCreateBlockLink: boolean;
	enableCreateBlockQuote: boolean
}

const DEFAULT_SETTINGS: TashiLinkSettings = {
	//启用锚链接
	enableCreateAnchorLink: true,
	//启用锚引用，默认不启用
	enableCreateAnchorQuote: true,
	//启用块链接
	enableCreateBlockLink: true,
	//启用块引用，默认不启用	
	enableCreateBlockQuote: true
};

export default class TashiLink extends Plugin {
	settings: TashiLinkSettings;

	//监听锚链接
	createAnchorLinkListener: any;
	//监听锚引用
	createAnchorQuoteListener: any;
	//监听块链接
	createBlockLinkListener: any;
	//监听块引用
	createBlockQuoteListener: any;

	async onload() {
		console.log('加载 Tashi Link');

		//设置选项
		await this.loadSettings();

		//创建锚链接
		this.CreateAnchorLinkMenu();
		this.CreateAnchorLinkCommand();

		//创建锚引用
		this.CreateAnchorQuoteMenu();
		this.CreateAnchorQuoteCommand();

		//创建块链接
		this.CreateBlockLinkMenu();
		this.CreateBlockLinkCommand();

		//创建块引用
		this.CreateBlockQuoteMenu();
		this.CreateBlockQuoteCommand();

		this.addSettingTab(new TashiLinkSettingTab(this.app, this));
	}

	//卸载插件
	onunload() {
		console.log('卸载 Tashi Link');

		// 移除事件监听器
		if (this.createAnchorLinkListener) {
			this.app.workspace.off('editor-menu', this.createAnchorLinkListener);
		}
		if (this.createAnchorQuoteListener) {
			this.app.workspace.off('editor-menu', this.createAnchorQuoteListener);
		}

		if (this.createBlockLinkListener) {
			this.app.workspace.off('editor-menu', this.createBlockLinkListener);
		}
		if (this.createBlockQuoteListener) {
			this.app.workspace.off('editor-menu', this.createBlockQuoteListener);
		}

		this.removeCommand("create_anchor_link_command");
		this.removeCommand("create_anchor_quote_command");
		this.removeCommand("create_block_link_command");
		this.removeCommand("create_block_quote_command");
	}

	//加载设置
	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	//保存设置
	async saveSettings() {
		await this.saveData(this.settings);
	}

	//创建锚链接菜单
	CreateAnchorLinkMenu() {
		// 创建一个事件监听器函数
		this.createAnchorLinkListener = (menu: Menu, editor: Editor) => {
			// 检查是否有选中的文本
			if (editor.getSelection() && this.settings.enableCreateAnchorLink) {
				// 获取选中的文本
				const selected文本 = editor.getSelection();
				const replace文本 = `[[##${selected文本}|${selected文本}]]`;

				menu.addItem((item: MenuItem) => {
					item.setTitle(`创建锚链接 [[## 文本|别名]]`)
						.setIcon("link-2") // 设置一个图标
						.onClick(() => {
							editor.replaceSelection(replace文本);
							const cursorPosition = editor.getCursor();
							editor.setCursor({ line: cursorPosition.line, ch: cursorPosition.ch - selected文本.length - 3 });
						});
				});
			}
		};

		// 注册右键菜单项
		this.app.workspace.on('editor-menu', this.createAnchorLinkListener);
	}

	//创建锚引用菜单
	CreateAnchorQuoteMenu() {
		// 创建一个事件监听器函数
		this.createAnchorQuoteListener = (menu: Menu, editor: Editor) => {
			// 检查是否有选中的文本
			if (editor.getSelection() && this.settings.enableCreateAnchorQuote) {
				// 获取选中的文本
				const selected文本 = editor.getSelection();
				const replace文本 = `![[##${selected文本}]]`;

				menu.addItem((item: MenuItem) => {
					item.setTitle(`创建锚引用 ![[## 文本]]`)
						.setIcon("text-quote") // 设置一个图标
						.onClick(() => {
							editor.replaceSelection(replace文本);
							const cursorPosition = editor.getCursor();
							editor.setCursor({ line: cursorPosition.line, ch: cursorPosition.ch - selected文本.length });
						});
				});
			}
		};

		// 注册右键菜单项
		this.app.workspace.on('editor-menu', this.createAnchorQuoteListener);

	}

	//创建块链接菜单
	CreateBlockLinkMenu() {
		// 创建一个事件监听器函数
		this.createBlockLinkListener = (menu: Menu, editor: Editor) => {
			// 检查是否有选中的文本
			if (editor.getSelection() && this.settings.enableCreateBlockLink) {
				// 获取选中的文本
				const selected文本 = editor.getSelection();
				const replace文本 = `[[^^${selected文本}|${selected文本}]]`;

				menu.addItem((item: MenuItem) => {
					item.setTitle(`创建块链接 [[^^ 文本|别名]]`)
						.setIcon("link-2") // 设置一个图标
						.onClick(() => {
							editor.replaceSelection(replace文本);
							const cursorPosition = editor.getCursor();
							editor.setCursor({ line: cursorPosition.line, ch: cursorPosition.ch - selected文本.length - 3 });
						});
				});
			}
		};

		// 注册右键菜单项
		this.app.workspace.on('editor-menu', this.createBlockLinkListener);

	}

	//创建块引用菜单
	CreateBlockQuoteMenu() {
		// 创建一个事件监听器函数
		this.createBlockQuoteListener = (menu: Menu, editor: Editor) => {
			// 检查是否有选中的文本
			if (editor.getSelection() && this.settings.enableCreateBlockQuote) {
				// 获取选中的文本
				const selected文本 = editor.getSelection();
				const replace文本 = `![[^^${selected文本}]]`;

				menu.addItem((item: MenuItem) => {
					item.setTitle(`创建块引用 ![[^^ 文本]]`)
						.setIcon("text-quote") // 设置一个图标
						.onClick(() => {
							editor.replaceSelection(replace文本);
							const cursorPosition = editor.getCursor();
							editor.setCursor({ line: cursorPosition.line, ch: cursorPosition.ch - selected文本.length });
						});
				});
			}
		};

		// 注册右键菜单项
		this.app.workspace.on('editor-menu', this.createBlockQuoteListener);
	}

	//创建锚链接命令
	CreateAnchorLinkCommand() {
		// 添加 创建锚链接 命令
		this.addCommand({
			id: 'create_anchor_link_command',
			name: '创建锚链接 [[## 文本|别名]]',
			icon: "link-2",
			hotkeys: [{ modifiers: ['Mod', 'Shift'], key: '1' }],
			editorCheckCallback: (checking: boolean, editor: Editor) => {
				if (checking) {
					return true;
				} else {
					// 检查是否有选中的文本
					if (editor.getSelection()) {
						// 获取选中的文本
						const selected文本 = editor.getSelection();
						const replace文本 = `[[##${selected文本}|${selected文本}]]`;
						//替换文本
						editor.replaceSelection(replace文本);
						const cursorPosition = editor.getCursor();
						editor.setCursor({ line: cursorPosition.line, ch: cursorPosition.ch - selected文本.length - 3 });
					}
					else {
						new Notice("请选择 创建锚链接 [[## 文本|别名]] 的文本");
					}

				}
			}
		});
	}

	//创建锚引用命令
	CreateAnchorQuoteCommand() {
		// 添加 创建锚引用 命令
		this.addCommand({
			id: 'create_anchor_quote_command',
			name: '创建锚引用 ![[## 文本]]',
			icon: "text-quote",
			hotkeys: [{ modifiers: ['Mod', 'Shift'], key: '2' }],
			editorCheckCallback: (checking: boolean, editor: Editor) => {
				if (checking) {
					return true;
				} else {
					// 检查是否有选中的文本
					if (editor.getSelection()) {
						// 获取选中的文本
						const selected文本 = editor.getSelection();
						const replace文本 = `![[##${selected文本}]]`;

						editor.replaceSelection(replace文本);
						const cursorPosition = editor.getCursor();
						editor.setCursor({ line: cursorPosition.line, ch: cursorPosition.ch - selected文本.length });

					} else {
						new Notice("请选择 创建锚引用 ![[## 文本]] 的文本");
					}
				}
			}
		});
	}

	//创建块链接命令
	CreateBlockLinkCommand() {
		// 添加 创建块链接 命令
		this.addCommand({
			id: 'create_block_link_command',
			name: '创建块链接 [[^^ 文本|别名]]',
			icon: "link-2",
			hotkeys: [{ modifiers: ['Mod', 'Shift'], key: '3' }],
			editorCheckCallback: (checking: boolean, editor: Editor) => {
				if (checking) {
					return true;
				} else {
					// 检查是否有选中的文本
					if (editor.getSelection()) {
						// 获取选中的文本
						const selected文本 = editor.getSelection();
						const replace文本 = `[[^^${selected文本}|${selected文本}]]`;

						editor.replaceSelection(replace文本);
						const cursorPosition = editor.getCursor();
						editor.setCursor({ line: cursorPosition.line, ch: cursorPosition.ch - selected文本.length - 3 });
					} else {
						new Notice("请选择 创建块链接 [[^^ 文本|别名]] 的文本");
					}
				}
			}
		});
	}

	//创建块引用命令
	CreateBlockQuoteCommand() {
		// 添加 创建块引用 命令
		this.addCommand({
			id: 'create_block_quote_command',
			name: '创建块引用 ![[^^文本]]',
			icon: "text-quote",
			hotkeys: [{ modifiers: ['Mod', 'Shift'], key: '4' }],
			editorCheckCallback: (checking: boolean, editor: Editor) => {
				if (checking) {
					return true;
				} else {
					// 检查是否有选中的文本
					if (editor.getSelection()) {
						// 获取选中的文本
						const selected文本 = editor.getSelection();
						const replace文本 = `![[^^${selected文本}]]`;

						editor.replaceSelection(replace文本);
						const cursorPosition = editor.getCursor();
						editor.setCursor({ line: cursorPosition.line, ch: cursorPosition.ch - selected文本.length });
					} else {
						new Notice(`请选择 创建块引用 ![[^^ 文本]] 的文本`);
					}
				}
			}
		});
	}
}

//设置标签
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
			.setName('创建锚链接 [[## 文本|别名]]')
			.setDesc('启用 创建锚链接，创建后按 空格 即可选择相关内容，可手动添加到 移动端工具栏。')
			.addToggle(toggle =>
				toggle.setValue(this.plugin.settings.enableCreateAnchorLink)
					.onChange(async (value) => {
						this.plugin.settings.enableCreateAnchorLink = value;
						await this.plugin.saveSettings();
						this.display(); // 重新渲染设置页面以反映更改
					})
			);

		new Setting(containerEl)
			.setName('创建锚引用 ![[## 文本]]')
			.setDesc('启用 创建锚引用，创建后按 空格 即可选择相关内容，可手动添加到 移动端工具栏。')
			.addToggle(toggle =>
				toggle.setValue(this.plugin.settings.enableCreateAnchorQuote)
					.onChange(async (value) => {
						this.plugin.settings.enableCreateAnchorQuote = value;
						await this.plugin.saveSettings();
						this.display(); // 重新渲染设置页面以反映更改
					})
			);

		new Setting(containerEl)
			.setName('创建块链接 [[^^ 文本|别名]]')
			.setDesc('启用 创建块链接，创建后按 空格 即可选择相关内容，可手动添加到 移动端工具栏。')
			.addToggle(toggle =>
				toggle.setValue(this.plugin.settings.enableCreateBlockLink)
					.onChange(async (value) => {
						this.plugin.settings.enableCreateBlockLink = value;
						await this.plugin.saveSettings();
						this.display(); // 重新渲染设置页面以反映更改
					})
			);

		new Setting(containerEl)
			.setName('创建块引用 ![[^^ 文本]]')
			.setDesc('启用 创建块引用，创建后按 空格 即可选择相关内容，可手动添加到 移动端工具栏。')
			.addToggle(toggle =>
				toggle.setValue(this.plugin.settings.enableCreateBlockQuote)
					.onChange(async (value) => {
						this.plugin.settings.enableCreateBlockQuote = value;
						await this.plugin.saveSettings();
						this.display(); // 重新渲染设置页面以反映更改
					})
			);
	}
}
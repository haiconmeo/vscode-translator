'use strict';
import axios from "axios";
import * as vscode from 'vscode';
import * as Constants from './constants';
import { Utility } from "./utility";
import { AppInsightsClient } from "./appInsightsClient";

export class Translator {
    private outputChannel: vscode.OutputChannel;
    private captureWordStatusBarItem: vscode.StatusBarItem;
    private static targetLanguage: string;
    private static sourceLang: any;

    constructor() {
        this.outputChannel = vscode.window.createOutputChannel('Translator');
        this.captureWordStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, -999999);
        this.captureWordStatusBarItem.text = Utility.getConfiguration().get(Constants.CaptureWordKey) ? Constants.CaptureWordText : Constants.NotCaptureWordText;
        this.captureWordStatusBarItem.command = 'translator.toggleCaptureWord';
        this.captureWordStatusBarItem.show();
        if (!Translator.sourceLang) {
            Translator.sourceLang = Utility.getConfiguration().get('sourceLanguage', 'en'); // Default to 'en' if not set
        }
        if (!Translator.targetLanguage) {
            Translator.targetLanguage = Utility.getConfiguration().get('targetLanguage', 'vi'); // Default to 'en' if not set
        }
        
    }

    public async translate() {
        AppInsightsClient.sendEvent('translate');
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        const selection = editor.selection;
        const text = selection.isEmpty ? editor.document.getText() : editor.document.getText(editor.selection);

        await vscode.window.withProgress({
            title: `Translating`,
            location: vscode.ProgressLocation.Notification,
        }, async () => {
            const target = await Translator.translate(text, true);
            if (!target) {
                return;
            }
            this.outputChannel.show();
            this.outputChannel.appendLine(target);
            this.outputChannel.appendLine('\n');
        });
    }

    public async replaceWithTranslation() {
        AppInsightsClient.sendEvent('replaceWithTranslation');
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        const selection = editor.selection;
        if (selection.isEmpty) {
            return;
        }
        const text = editor.document.getText(editor.selection);

        await vscode.window.withProgress({
            title: `Replacing with Translation`,
            location: vscode.ProgressLocation.Notification,
        }, async () => {
            const target = await Translator.translate(text,true);
            if (!target) {
                return;
            }
            await editor.edit(editBuilder => {
                editBuilder.replace(selection, target);
            });
        });
    }

    public static async translate(source: string, showErrorMessage: boolean = false): Promise<string> {
        try {
            const sourceLang = encodeURIComponent(Translator.sourceLang);
            const targetLang = encodeURIComponent(Translator.targetLanguage);
            const text = encodeURIComponent(source);
            const result = (await axios.get(`https://mute-art-ba3b.hoanghuumanh54.workers.dev/?source_lang=${sourceLang}&target_lang=${targetLang}&text=${text}`)).data;
            return result['translated_text'];
        } catch (error) {
            if (showErrorMessage) {
                vscode.window.showErrorMessage((error as Error).message);
            }
            return "";
        }
    }

    public toggleCaptureWord() {
        AppInsightsClient.sendEvent('toggleCaptureWord');
        if (this.captureWordStatusBarItem.text === Constants.CaptureWordText) {
            this.captureWordStatusBarItem.text = Constants.NotCaptureWordText;
        } else {
            this.captureWordStatusBarItem.text = Constants.CaptureWordText;
        }
        const config = Utility.getConfiguration();
        config.update(Constants.CaptureWordKey, !config.get(Constants.CaptureWordKey), true);
    }
}
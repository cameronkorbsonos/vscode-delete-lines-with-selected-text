// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.deleteLinesWithText', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }

        const selection = editor.selection;
        const selectedText = editor.document.getText(selection);

        if (!selectedText) {
            vscode.window.showInformationMessage('No text selected');
            return;
        }

        const document = editor.document;
        const fullText = document.getText();

        const regex = new RegExp(`.*${escapeRegExp(selectedText)}.*\n?`, 'g');
        const newText = fullText.replace(regex, '');

        editor.edit(editBuilder => {
            const start = new vscode.Position(0, 0);
            const end = new vscode.Position(document.lineCount, 0);
            const entireRange = new vscode.Range(start, end);
            editBuilder.replace(entireRange, newText);
        });
    });

    context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}

function escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

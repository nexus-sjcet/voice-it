import * as vscode from 'vscode';
import { disposable as hoverImageDisposable } from './lib/hover';
import { addCommentFunc } from './lib/add-comment';
import { cmd } from './lib/cmd';
import { consoler } from './util/console';

export function activate(context: vscode.ExtensionContext) {

	const cache: Cache = {};

	const addCommentDisposable = addCommentFunc("addComment");



	context.subscriptions.push(addCommentDisposable);
	context.subscriptions.push(hoverImageDisposable);

	const openFileCommand = vscode.commands.registerCommand(cmd.openFile, (dynamicFilePath) => {
		if (dynamicFilePath) {
			consoler.log(dynamicFilePath);
			// const decodedFilePath = decodeURIComponent(dynamicFilePath);
			// vscode.workspace.openTextDocument(decodedFilePath).then((document) => {
			// 	vscode.window.showTextDocument(document);
			// });
		}
	});

	// Register the command
	context.subscriptions.push(openFileCommand);
}
export function deactivate() { }

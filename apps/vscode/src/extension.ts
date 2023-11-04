import * as vscode from 'vscode';
import { disposable as hoverImageDisposable } from './lib/hover';
import { addCommentFunc } from './lib/add-comment';
import { cmd } from './lib/cmd';
import { consoler } from './util/console';
import * as path from 'path';
import { cacheState } from './util/cache';
import * as fs from "fs";
import { jsonInit } from './lib/json';
import { readJson, writeJson } from './util/json-control';
import { getWorkplace } from './lib/workspace';


export function activate(context: vscode.ExtensionContext) {

	context.subscriptions.push(jsonInit);
	
	
	const addCommentDisposable = addCommentFunc();

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

	context.subscriptions.push(
		vscode.commands.registerCommand(cmd.openLink, async (word) => {
			const filePath = path.join(vscode.workspace.rootPath || "", word);
			const document = await vscode.workspace.openTextDocument(filePath);
			vscode.window.showTextDocument(document);
		})
	);

	// Register the command
	context.subscriptions.push(openFileCommand);
}
export function deactivate() { }

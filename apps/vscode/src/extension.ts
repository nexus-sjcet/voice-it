import * as vscode from 'vscode';
import { disposable as hoverImageDisposable } from './lib/hover';
import { addCommentFunc } from './lib/add-comment';
import { cmd } from './lib/cmd';
import { consoler } from './util/console';
import * as path from 'path';
import { cacheState } from './util/cache';
import * as fs from "fs";

export function activate(context: vscode.ExtensionContext) {
	let config;

	const { getCache, initCache } = cacheState();

	context.subscriptions.push(vscode.commands.registerCommand(cmd.activate, () => {

		const basePath = vscode.workspace.rootPath;
		const absoluteFilePath = path.join(basePath || "", "./comment.config.json");

		try {
			let file = fs.readFileSync(absoluteFilePath, 'utf-8');
			config = JSON.parse(file) as Config;
			
			const absoluteFile = path.join(basePath || "", config?.root ,"./comment.json");
			let commentFile = fs.readFileSync(absoluteFile, 'utf-8');

			initCache(JSON.parse(commentFile) as Cache);

			consoler.log(JSON.stringify(getCache()));
		}
		catch (err) {

			consoler.log(JSON.stringify(err));

		}
			// const workspaceFolders = vscode.workspace.workspaceFolders;
			// const config = vscode.workspace.getConfiguration("comment", vscode.Uri.file("./comment.config.json"));


			// if (workspaceFolders) {

			// }
		}));



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

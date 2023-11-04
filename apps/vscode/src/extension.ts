import * as vscode from 'vscode';
import { disposable as hoverImageDisposable } from './lib/hover';
import { addCommentFunc } from './lib/add-comment';
import { cmd } from './lib/cmd';
import { consoler } from './util/console';
import * as path from 'path';
import { cacheState } from './util/cache';
import * as fs from "fs";
import { jsonInit, sidebarAction, workspaceInit } from './lib/json';
import { readJson, writeJson } from './util/json-control';
import { getWorkplace } from './lib/workspace';
import { openFileCommand } from './lib/open-file';


export function activate(context: vscode.ExtensionContext) {
	// const {getPage} = cacheState();
	context.subscriptions.push(jsonInit);
	context.subscriptions.push(workspaceInit);
	context.subscriptions.push(sidebarAction);
	
	
	const addCommentDisposable = addCommentFunc();

	context.subscriptions.push(addCommentDisposable);
	context.subscriptions.push(hoverImageDisposable);
	context.subscriptions.push(openFileCommand);
	

	

	context.subscriptions.push(
		vscode.commands.registerCommand(cmd.openLink, async (word) => {
			const filePath = path.join(vscode.workspace.rootPath || "", word);
			const document = await vscode.workspace.openTextDocument(filePath);
			vscode.window.showTextDocument(document);
		})
	);

}
export function deactivate() { }

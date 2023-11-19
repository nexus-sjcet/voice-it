import * as path from 'path';
import * as vscode from 'vscode';
import { addCommentFunc } from './lib/add-comment';
import { cmd } from './lib/cmd';
import { disposable as hoverImageDisposable } from './lib/hover';
import { activateCurrectPage, sidebarAction, workspaceInit } from './lib/json';
import { openFileCommand } from './lib/open-file';
import { build } from './util/build';
import { consoler } from './util/console';
import { decorationType } from './components/gutter';
import { updateGutter } from './lib/line-control';


export function activate(context: vscode.ExtensionContext) {

	if (vscode.workspace.name === undefined) {
		consoler.warn("No Workplace found to activate multimedia comments");
	}

	context.subscriptions.push(activateCurrectPage);
	context.subscriptions.push(workspaceInit);
	context.subscriptions.push(sidebarAction);


	const addCommentDisposable = addCommentFunc();

	context.subscriptions.push(addCommentDisposable);
	context.subscriptions.push(hoverImageDisposable);
	context.subscriptions.push(openFileCommand);

	context.subscriptions.push(build);


	
	context.subscriptions.push(decorationType);

	// New feature comming soon (gutter icon with folding)
	// vscode.workspace.onDidChangeTextDocument(event => {
    //     updateGutter();
    // });


	// chat comment disposal

	// const commentController = vscode.comments.createCommentController('comment-sample', 'Comment API Sample');
	// context.subscriptions.push(commentController);

	// commentController.commentingRangeProvider = {
	// 	provideCommentingRanges: (document: vscode.TextDocument, token: vscode.CancellationToken) => {
	// 		const lineCount = document.lineCount;
	// 		const decorationRanges = new vscode.Range(0, 0, lineCount - 1, 0);
	// 		return [decorationRanges];
	// 	}
	// };





	context.subscriptions.push(
		vscode.commands.registerCommand(cmd.openLink, async (word:string) => {

			console.log("OpenLink", word)

			const filePath = path.join(vscode.workspace.rootPath || "", word);
			const document = await vscode.workspace.openTextDocument(filePath);
			vscode.window.showTextDocument(document);
		})
	);

}
export function deactivate() { }


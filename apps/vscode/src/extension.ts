import * as vscode from 'vscode';
import { disposable as hoverImageDisposable } from './lib/hover';
import { addCommentFunc } from './lib/add-comment';
import { cmd } from './lib/cmd';
import { consoler } from './util/console';
import { AudioRecorder } from './test/voice';


let isToggled = false;

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
	const audioRecorder = new AudioRecorder();

	let startRecordingDisposable = vscode.commands.registerCommand('project-name.startRecording', () => {
		audioRecorder.startRecording();
	});

	let stopRecordingDisposable = vscode.commands.registerCommand('project-name.stopRecording', () => {
		audioRecorder.stopRecording();
	});

	context.subscriptions.push(startRecordingDisposable, stopRecordingDisposable);


	const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right);
	statusBarItem.text = isToggled ? "ON" : "OFF";
	statusBarItem.tooltip = "Click this button";
	statusBarItem.command = "project-name.myCommand"; // Replace with your command name
	statusBarItem.show();
	
	const x = vscode.commands.registerCommand('project-name.myCommand', () => {

		isToggled = !isToggled;
		if (isToggled) {
			vscode.commands.executeCommand('project-name.startRecording');
		} else {
			vscode.commands.executeCommand('project-name.stopRecording');
		}
		statusBarItem.text = isToggled ? "ON" : "OFF";
		statusBarItem.tooltip = "Toggle Button";
		statusBarItem.command = "project-name.myCommand";
		statusBarItem.show();


	});
	context.subscriptions.push(x);
	context.subscriptions.push(statusBarItem);
}

export function deactivate() { }

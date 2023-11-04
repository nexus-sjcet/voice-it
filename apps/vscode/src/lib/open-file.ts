import { window, workspace, Uri,commands } from 'vscode';
import { consoler } from '../util/console';
import { cmd } from './cmd';
import { pathJoin } from './workspace';

export const openFileCommand = commands.registerCommand(cmd.openFile, (dynamicFilePath) => {
	const basePath = workspace.rootPath;
	if (dynamicFilePath && basePath) {

		if (dynamicFilePath.includes(".png")) {
			const x = pathJoin(basePath,dynamicFilePath);
			const webview = window.createWebviewPanel("comment-image", x, 1);
			webview.webview.html = '<h1>Hello, Image View!</h1>';
			return;
		}

		// const array = dynamicFilePath.match(/.(mp4|mp3|gif|)/);

		const x = pathJoin(basePath,dynamicFilePath);
		consoler.log(x);

		workspace.openTextDocument(x).then((document) => {
			window.showTextDocument(document);
		  });
	}
});

export async function openFile() {
	return new Promise((resolve, reject) => {

		window.showOpenDialog({
			canSelectFolders: false,
			canSelectFiles: true,
			canSelectMany: false,
			filters: {
				'All Files': ['*'],
			},
		})
			.then((uris) => {
				if (uris && uris.length > 0) {
					const selectedFile = uris[0];

					const pack = selectedFile.path.split(".");
					const type = pack[pack.length - 1];

					resolve({
						path: selectedFile.path,
						fs: selectedFile.fsPath,
						type,
						file: selectedFile
					});
				} else {
					reject();
				}
			});
	}) as Promise<{ path: string, fs: string, type: string, file: any }>;
}
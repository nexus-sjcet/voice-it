import { window } from 'vscode';

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
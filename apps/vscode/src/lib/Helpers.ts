import * as vscode from 'vscode';
import { cacheState } from '../util/cache';

const customConfigFileUri = vscode.Uri.file('comment.config.json');

// Access the custom configuration settings
const config = vscode.workspace.getConfiguration('myExtension', customConfigFileUri);
// usage
//const anotherSetting = config.get('anotherSetting');

async function copyFileToWorkspace(sourceFilePath: any, newFileName?: string) {

    const workspaceFolder = vscode.workspace.workspaceFolders?.[0]; // Assuming you want to copy to the first workspace folder

    if (workspaceFolder) {
        // Ask the user for a new name for the copied file
        if (!newFileName) {
            newFileName = await vscode.window.showInputBox({
                prompt: 'Enter a new name for the copied file (including extension)',
                placeHolder: 'NewFileName.ext'
            });
        }
        if (newFileName) {
            const targetUri = vscode.Uri.joinPath(workspaceFolder.uri, newFileName);

            try {
                // Copy the selected file to the workspace with the new name
                await vscode.workspace.fs.copy(sourceFilePath, targetUri, { overwrite: false });
                vscode.window.showInformationMessage(`File copied to workspace: ${targetUri.fsPath}`);
            } catch (error) {
                vscode.window.showErrorMessage(`Error copying file to workspace: ${error}`);
            }
        }
    } else {
        vscode.window.showErrorMessage('No workspace folder found. Please open a workspace.');
    }
}

export {
    copyFileToWorkspace, config
}
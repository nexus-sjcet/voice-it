import { cmd, editorComment } from "./cmd";
import * as vscode from 'vscode';
import * as path from 'path';
import { readJson } from "../util/json-control";
import { consoler } from "../util/console";
const customConfigFileUri = vscode.Uri.joinPath(vscode.workspace.workspaceFolders![0].uri,'comment.config.json');

// Access the custom configuration settings
const config = vscode.workspace.getConfiguration('myExtension', customConfigFileUri);

export const jsonInit = vscode.commands.registerCommand(cmd.activate, () => {
        consoler.log(editorComment.addComment, "Extension Comment Activated", config.get("host") || "");
});
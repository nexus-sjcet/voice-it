import * as vscode from 'vscode';
const md = require('markdown-it')();
import * as fs from "fs";
import * as path from 'path';

export const getMD = (dir: string, panel: vscode.WebviewPanel) => {
    let link = dir.trim();
    const basePath = vscode.workspace.rootPath;
    const absoluteFilePath = path.join(basePath || "", link);

    try {
        let file = fs.readFileSync(absoluteFilePath, 'utf-8');

        file = file.replace(
            /!\[([^\]]*)\]\((\.[/\\].*?)\)/g,
            (match, altText, imagePath) => {
                const newImagePath = vscode.Uri.file(path.join(basePath || "", imagePath));
                return `![${altText}](${panel.webview.asWebviewUri(newImagePath)})`;
            }
        );
        panel.webview.html = md.render(file);

    } catch (err) {
        console.error(err);
    }
};
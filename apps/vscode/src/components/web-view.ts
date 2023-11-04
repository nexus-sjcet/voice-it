import * as vscode from 'vscode';
const md = require('markdown-it')();
import * as fs from "fs";
import * as path from 'path';

export const getMD = (link: string) => {
    const panel = vscode.window.createWebviewPanel("markdown", link, vscode.ViewColumn.One, { enableScripts: true });
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

export const getMultiMedia = (link: string, type: "audio" | "video") => {

    
    const panel = vscode.window.createWebviewPanel(type, link, vscode.ViewColumn.Three, { enableScripts: true });

    const basePath = vscode.workspace.rootPath;
    const absoluteFilePath = path.join(basePath || "", link);
    const mediaPath = vscode.Uri.file(absoluteFilePath);

    const src = panel.webview.asWebviewUri(mediaPath);

    const style = `margin: 4rem;`;


    const template = type === "audio" ? `
    <audio controls style="${style}">
        <source src="${src}" type="audio/${link.split(".").pop()}">
        </audio>
        ` : `
    <video controls>
        <source src="${src}" type="video/${link.split(".").pop()}">
        </video>
        `;

    panel.webview.html = template;

}; 
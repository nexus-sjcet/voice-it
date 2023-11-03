import * as vscode from 'vscode';
import { language } from './languages';
import { consoler } from '../util/console';
import { getMD } from '../components/web-view';


function getImage(path: string, dir: string = "") {
    let link = dir.trim();
    link = link.replaceAll("\\", "/");

    const parent = path.split("/").slice(0, -1).join("/");
    const fullPath = `${parent}/${link}`;

    return `![${fullPath}](${vscode.Uri.file(fullPath)})`;
}

const hoverTypeSwitch = (lineText: string, path: string) => {
    const regexPattern = /✦(.*)\.(\w+)(?:\s(.+))?/;

    const splitted = lineText.match(regexPattern);
    // consoler.log(JSON.stringify(splitted)); // ["✦ \\comments\\assets\\gif.gif","\\comments\\assets","gif","gif", null]
    if (!splitted) {
        return;
    }

    switch (splitted[2]) {
        case "png":
        case "jpg":
        case "jpeg":
        case "gif":

            return getImage(path, `${splitted[1]}.${splitted[2]}`);

        case "md": {

            const webViewPanel = vscode.window.createWebviewPanel("test", "test", vscode.ViewColumn.One, { enableScripts: true });
            getMD(`${splitted[1]}.${splitted[2]}`, webViewPanel);

            return null;    
        }
        // case "json":
        // case "txt":
        // case "html":
        // case "css":
        // case "js":
        // case "ts":
        // case "tsx":
        // case "jsx":
        //     return;
        // case "mp4":
        // case "webm":
        // case "mp3":
        // case "wav":
        // case "ogg":
        //     vscode.window.createWebviewPanel("test", "test", vscode.ViewColumn.One, { enableScripts: true });




        default: {

            const fullPath = '${splitted[1]}.${splitted[2]}';

            const hoverContent = new vscode.MarkdownString();
            hoverContent.appendMarkdown(`[Use activiy bar to open ${splitted[2]} file](command:extension.openFile?${fullPath})`);


            return hoverContent;
        }
    }


};

export const disposable = vscode.languages.registerHoverProvider({ language: "*" }, {
    provideHover(document, position, token) {
        const lineNumber = position.line;

        const lineText = document.lineAt(lineNumber).text;
        const delimiter = language[document.languageId as keyof typeof language];
        const lineArray = lineText.split(delimiter ?? "//");

        if (lineArray.length >= 1) {
            // consoler.log(lineArray[1], document.languageId);

            const content = hoverTypeSwitch(lineArray[lineArray.length - 1], document.uri.path);
            return content ? new vscode.Hover(content) : null;
        }
        return null;

    }
});
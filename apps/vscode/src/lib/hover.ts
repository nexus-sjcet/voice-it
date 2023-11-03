import * as vscode from 'vscode';
import { language } from './languages';
import { consoler } from '../util/console';
import { getMD, getMultiMedia } from '../components/web-view';
import { cmd } from './cmd';


function getImage(path: string, link: string) {

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

    const fileName = `${splitted[1]}.${splitted[2]}`.trim().replaceAll("\\", "/");

    switch (splitted[2]) {
        case "png":
        case "jpg":
        case "jpeg":
        case "gif":
        case "webm":

            return getImage(path, fileName);

        case "md": {
            const action = {
                text: "Open",
                callback: () => getMD(fileName)
            };
            consoler.action(`Do you like to open ${fileName} ?`,  [action]);
            
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
        case "mp3":
        case "wav":
        case "ogg": {

            const action = {
                text: "Open",
                callback: () => getMultiMedia(fileName, "audio")
            };
            consoler.action(`Do you like to open ${fileName} ?`,  [action]);
            
            return null;
        }
        case "mp4": {

            const action = {
                text: "Open",
                callback: () => getMultiMedia(fileName, "video")
            };
            consoler.action(`Do you like to open ${fileName} ?`,  [action]);
            
            return null;
        }




        default: {

            // const action = {
            //     text: "Open",
            //     callback: () => getMultiMedia(fileName, "video")
            // };
            // consoler.action(`Do you like to open ${fileName} ?`,  [action]);
            

            const hoverContent = new vscode.MarkdownString();
            const text = `command:${cmd.openLink}?${encodeURIComponent(fileName)}`;
            hoverContent.appendMarkdown(`[Use activiy bar to open ${splitted[2]} file](${text})`);

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
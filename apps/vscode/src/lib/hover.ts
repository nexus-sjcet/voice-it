import * as vscode from 'vscode';
import { language } from './languages';
import { consoler } from '../util/console';
import { getMD, getMultiMedia } from '../components/web-view';
import { cmd } from './cmd';
import { cacheState } from '../util/cache';
import { getWorkplace, pathJoin, replaceSlash } from './workspace';
import { readJson } from '../util/json-control';
import { myDecorationType } from '../components/gutter';


function getImage(path?: string) {
    return path ? `![${path}](${vscode.Uri.file(path)})` : null;

}
function getCode(path?: string) {
    return path ? `![${path}](${vscode.Uri.file(path)})` : null;

}

const hoverTypeSwitch = (lineText: string) => {
    // const regexPattern = /✦(.*)\.(\w+)(?:\s(.+))?/;
    const regexPattern = /✦ (\S+)(?: (.*))?/;

    const splitted = lineText.match(regexPattern);
    // consoler.log(JSON.stringify(splitted), path); // ["✦ 123456789","123456789", null]
    if (!splitted || !splitted[1]) {
        return;
    }

    const fileNameId = splitted[1] || "";
    const { getPageContent } = cacheState();
    const work = getWorkplace();
    const path = replaceSlash(work.file?.replace(work.path || "", "") || "");
    const fileName = getPageContent(path || "", fileNameId)?.body;
    // consoler.log(fileName);

    const finalPath = pathJoin(work.path || "", fileName);



    switch (fileName.split(".").pop()) {
        case "png":
        case "jpg":
        case "jpeg":
        case "gif":
        case "webm":

            return getImage(finalPath);

        case "md": {
            const action = {
                text: "Open",
                callback: () => getMD(fileName)
            };
            consoler.action(`Do you like to open ${fileName} ?`, [action]);

            return null;
        }
        case "json":
            const hoverContent = new vscode.MarkdownString();
            const file = readJson(finalPath);
            const text = "```" + `${JSON.stringify(file, null, 2)}` + "```";
            hoverContent.appendMarkdown(text);
            return hoverContent;

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
            consoler.action(`Do you like to open ${fileName} ?`, [action]);

            return null;
        }
        case "mp4": {

            const action = {
                text: "Open",
                callback: () => getMultiMedia(fileName, "video")
            };
            consoler.action(`Do you like to open ${fileName} ?`, [action]);

            return null;
        }




        default: {

            // const action = {
            //     text: "Open",
            //     callback: () => getMultiMedia(finalPath, "video")
            // };
            // consoler.action(`Do you like to open ${fileName} ?`,  [action]);


            const hoverContent = new vscode.MarkdownString();
            const text = `command:${cmd.openLink}?${encodeURIComponent(finalPath)}`;
            hoverContent.appendMarkdown(`[Use activiy bar to open ${splitted?.[1]} file](${text})`);

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

            const content = hoverTypeSwitch(lineArray[lineArray.length - 1]);

            const editor = vscode.window.activeTextEditor; // Get the active text editor

            if (editor && content) {
                // const decorationRanges = [
                //     new vscode.Range(new vscode.Position(lineNumber, 0), new vscode.Position(lineNumber, lineText.length)), // Apply to line 1
                // ];

                // editor.setDecorations(myDecorationType, decorationRanges);
                return content ? new vscode.Hover(content) : null;
            }
        }
        return null;

    }
});
import * as path from 'path';
import * as vscode from 'vscode';
import { getMultiMedia } from '../components/web-view';
import { cacheState } from '../util/cache';
import { consoler } from '../util/console';
import { readFile, readJson } from '../util/json-control';
import { language } from './languages';
import { getWorkplace, pathJoin, replaceSlash } from './workspace';


function getImage(path: string, altText?: string) {
    return `![${altText || path}](${vscode.Uri.file(path)})`;

}
function getCode(path?: string) {
    return path ? `![${path}](${vscode.Uri.file(path)})` : null;

}

const hoverTypeSwitch = (lineText: string) => {
    const regexPattern = /✦ (\S+)(?: (.*))?/;

    const splitted = lineText.match(regexPattern);
    // consoler.log(JSON.stringify(splitted), path); // ["✦ 123456789","123456789", null]
    if (!splitted || !splitted[1]) {
        return;
    }

    const fileNameId = splitted[1] || "";
    const { getPageContent } = cacheState();
    const work = getWorkplace();
    const pathFile = replaceSlash(work.file?.replace(work.path || "", "") || "");
    const file = getPageContent(pathFile || "", fileNameId)
    const fileName = file?.body;
    // consoler.log(fileName);

    const finalPath = pathJoin(work.path || "", fileName);


    const filenameTemp = file?.type as string;
    switch (filenameTemp) {
        case "png":
        case "jpg":
        case "jpeg":
        case "gif":
        case "webm":

            return getImage(finalPath);

        case "txt":
        case "md": {
            let text = readFile(finalPath) || "";
            const imagePathDir = path.dirname(finalPath);
            text = text.replace(
                /!\[([^\]]*)\]\((.*?)\)/g, // dont touch this
                (match, altText, imagePath) => {
                    const newImagePath = pathJoin(imagePathDir || "", imagePath);
                    return getImage(newImagePath, altText);
                }
            );

            const MD = new vscode.MarkdownString();
            MD.isTrusted = true;
            MD.supportThemeIcons = true;
            MD.supportHtml = true;
            MD.appendMarkdown("$(markdown)\n");
            MD.appendMarkdown(`[Open the File](${vscode.Uri.file(finalPath)})\n\n`);
            MD.appendMarkdown(text);

            return MD;
        }
        case "json": {

            const file = readJson(finalPath);
            const text = JSON.stringify(file, null, 2);

            const MD = new vscode.MarkdownString();
            MD.isTrusted = true;
            MD.supportThemeIcons = true;
            MD.supportHtml = true;
            MD.appendMarkdown("$(file-code)\n");
            MD.appendMarkdown(`[Open the File](${vscode.Uri.file(finalPath)})\n\n`);
            MD.appendCodeblock(text, "json");

            return MD;
        }

        case "html":
        case "css":
        case "js":
        case "ts":
        case "tsx":
        case "jsx": {
            const text = readFile(finalPath) || "";

            const MD = new vscode.MarkdownString();
            MD.isTrusted = true;
            MD.supportThemeIcons = true;
            MD.supportHtml = true;
            MD.appendMarkdown("$(file-code)\n");
            MD.appendMarkdown(`[Open the File](${vscode.Uri.file(finalPath)})\n\n`);
            MD.appendCodeblock(text);

            return MD;
        }
        default: {

            if (["mp3", "wav", "ogg", "mp4"].some(() => filenameTemp)) {
                const action = {
                    text: "Open",
                    callback: () => getMultiMedia(fileName, filenameTemp === "mp4" ? "video" : "audio")
                };
                consoler.action(`Do you like to open ${fileName} ?`, [action]);
            }

            const MD = new vscode.MarkdownString();
            MD.isTrusted = true;
            MD.supportThemeIcons = true;
            MD.supportHtml = true;
            MD.appendMarkdown("$(file-media)\n");
            MD.appendMarkdown(`[Open the File](${vscode.Uri.file(finalPath)})`);

            return MD;
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

                // editor.setDecorations(decorationType, decorationRanges);
                return content ? new vscode.Hover(content) : null;
            }
        }
        return null;

    }
});
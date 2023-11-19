import * as cuid from 'cuid';
import * as vscode from 'vscode';
import { cacheState } from '../util/cache';
import { consoler } from '../util/console';
import { copyFileToWorkspace } from './Helpers';
import { cmd, editorComment } from './cmd';
import { language } from './languages';
import { openFile } from './open-file';
import { getWorkplace } from "./workspace";

export const addCommentFunc = () => {
    return vscode.commands.registerCommand(cmd.addComment, () => {
        const { addPageContent, getConfig } = cacheState();

        const x = getConfig();
        const assetsPath = x ? x.assets : "";

        const editor = vscode.window.activeTextEditor;

        if (editor) {
            openFile().then((file) => {
                editor.edit((editBuilder) => {
                    const work = getWorkplace();
                    const relativePath = file.fs.replace(work.path || "", "");

                    const comment = editor.document.languageId;

                    const currentFile = editor.document.fileName.replace(work.path || "", "").replaceAll("\\", "/");

                    const id = cuid();
                    const text = `${language[comment]} ${editorComment.addComment} ${id}`;

                    const fileType = relativePath.split(".").pop() || "md" as any;
                    const body = relativePath !== file.fs ? `.${relativePath.replaceAll("\\", "/")}` : `${assetsPath}/${id}.${fileType}`;
                    const data: singleCommentData = {
                        body,
                        type: fileType,
                    };

                    addPageContent(currentFile, { key: id, value: data });

                    editBuilder.insert(editor.selection.active, text);
                    if (relativePath == file.fs) {
                        copyFileToWorkspace(file.file, `${assetsPath}/${id}.${fileType}`);
                    }
                    consoler.log(`Done 👍 Added ${file.type} file`);

                    vscode.commands.executeCommand("comment-current-file.refreshEntry");
                });
            });
        }
    });
};
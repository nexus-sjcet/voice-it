import * as vscode from 'vscode';
import { openFile } from './open-file';
import { getWorkplace } from "./workspace";
import { cmd, editorComment } from './cmd';
import { language } from './languages';
import { consoler } from '../util/console';
import * as cuid from 'cuid';
import { CacheState, cacheState } from '../util/cache';
import { copyFileToWorkspace } from './Helpers';
import path = require('path');

export const addCommentFunc = () => {
    return vscode.commands.registerCommand(cmd.addComment, () => {
        const { addPageContent, getCache, getConfig } = cacheState();

        const x = getConfig()
        const assetsPath = x ? x.assets : ""

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

                    const file_type = relativePath.split(".").pop() || "md" as any
                    const body = relativePath != file.fs ? `.${relativePath.replaceAll("\\", "/")}` : `${assetsPath}/${id}.${file_type}`
                    const data: singleCommentData = {
                        // body: `.${relativePath.replaceAll("\\", "/")}`,
                        body,
                        type: file_type,
                    };

                    addPageContent(currentFile, { key: id, value: data });

                    editBuilder.insert(editor.selection.active, text);
                    if (relativePath == file.fs) {
                        copyFileToWorkspace(file.file, `${assetsPath}/${id}.${file_type}`)
                    }
                    consoler.log(`Done 👍 Added ${file.type} file`);

                    vscode.commands.executeCommand("comment-current-file.refreshEntry");
                });
            });
        }
    });
};
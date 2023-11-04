import * as vscode from 'vscode';
import { openFile } from './open-file';
import { getWorkplace } from "./workspace";
import { cmd, editorComment } from './cmd';
import { language } from './languages';
import { consoler } from '../util/console';
import * as cuid from 'cuid';
import { CacheState, cacheState } from '../util/cache';

export const addCommentFunc = () => {
    return vscode.commands.registerCommand(cmd.addComment, () => {
        const { addPageContent, getCache } = cacheState();
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


                    const data:singleCommentData = {
                        body: `.${relativePath.replaceAll("\\", "/")}`,
                        type: relativePath.split(".").pop() || "md" as any,
                    };

                    addPageContent(currentFile, {key: id, value: data});

                    editBuilder.insert(editor.selection.active, text);

                    consoler.log(`Done 👍 Added ${file.type} file`);
                });
            });
        }
    });
};
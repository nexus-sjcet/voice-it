import * as vscode from 'vscode';
import { openFile } from './open-file';
import { getWorkplace } from "./workspace";
import { cmd, editorComment } from './cmd';
import { language } from './languages';
import { consoler } from '../util/console';
import { copyFileToWorkspace } from './Helpers';



export const addCommentFunc = (type: keyof typeof cmd) => {
    return vscode.commands.registerCommand(cmd[type], () => {
        const editor = vscode.window.activeTextEditor;

        if (editor) {
            openFile().then((file) => {

                editor.edit((editBuilder) => {
                    const work = getWorkplace();
                    const relativePath = file.fs.replace(work.path || "", "");
                    const comment = editor.document.languageId
                    const text = `${language[comment]} ${editorComment[type]} ${relativePath}`;
                    editBuilder.insert(editor.selection.active, text);
                    copyFileToWorkspace(file.file, 'new')
                    consoler.log(`Done 👍 Added ${file.type} file`);
                });

            });
        }
    });
};
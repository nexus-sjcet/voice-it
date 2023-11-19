import { cmd, editorComment, langLogo, logoFiles } from "./cmd";
import * as vscode from 'vscode';
import * as path from 'path';
import { readJson } from "../util/json-control";
import { consoler } from "../util/console";
import { MyTreeItem, myTreeDataProvider } from "../components/tree";
import { cacheState } from "../util/cache";
import { getWorkplace, replaceSlash } from "./workspace";

export const activateCurrectPage = vscode.commands.registerCommand(cmd.activate, () => {
        const {getPage} = cacheState();
        const name = getWorkplace().file?.replace(getWorkplace().path || "", "")
        const datas = name ? getPage( replaceSlash(name) ) : {};

        myTreeDataProvider.data = Object.entries(datas).map(([k,v]) =>
                new MyTreeItem(`${langLogo[v.type]} ${v.header || ""}`, [
                        new MyTreeItem(`${editorComment.addComment}  ${k}`, [], v.type)
                ], v.body)
        );
        
        const myTreeView = vscode.window.createTreeView('comment-current-file', {
                treeDataProvider: myTreeDataProvider,
        });

        // myTreeView.
        
        consoler.log(editorComment.addComment, "Extension Comment Activated");
        // myTreeDataProvider.refresh();
        
});

export const sidebarAction = vscode.commands.registerCommand("comment-current-file.refreshEntry", () => {
        vscode.commands.executeCommand(cmd.activate);
});

export const workspaceInit = vscode.commands.registerCommand(cmd.workspace, () => {
        const {getCache} = cacheState();
        const datas = getCache();

        myTreeDataProvider.data = Object.entries(datas).map(([k,v]) =>
                new MyTreeItem(`${editorComment.openFile} ${k.replace("/", "")}`, [
                        ...Object.entries(v).map(([k,v]) => new MyTreeItem(`${langLogo[v.type]} ${v.header || ""}`, [
                                new MyTreeItem(k, [], v.header ? v.type : "")
                        ],  v.body))
                ], "")
        );
        
        const myTreeView = vscode.window.createTreeView('comment-entire-workspace', {
                treeDataProvider: myTreeDataProvider,
        });

        // myTreeView.
        
        consoler.log(editorComment.addComment, "Extension Comment Activated");
        // myTreeDataProvider.refresh();
})

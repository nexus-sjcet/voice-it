import * as vscode from 'vscode'

class MyTreeDataProvider {
    data: MyTreeItem[];
    constructor() {
        this.data = []; // Your array of data
    }

    getTreeItem(element: MyTreeItem) {
        return element;
    }

    getChildren(element: MyTreeItem) {
        return element ? element.children : this.data;
    }
}

type all = Pretty<vscode.TreeItem>;

export class MyTreeItem extends vscode.TreeItem {
    children: MyTreeItem[];
    constructor(label:string, children: MyTreeItem[], filePath:string) {
        super(label, vscode.TreeItemCollapsibleState.Collapsed);
        this.children = children;
        this.tooltip = filePath;
        this.description = filePath;
        this.command = {
            command: "project-name.openFile",
            title: "Open File",
            arguments: [filePath],
            tooltip: "Open File"
        };
    }
}

export const myTreeDataProvider = new MyTreeDataProvider();

//   myTreeDataProvider.refresh();
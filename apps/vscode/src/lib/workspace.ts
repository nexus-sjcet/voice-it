import { workspace } from 'vscode';

export function getWorkplace() {
    let name = workspace.name; // get the open folder name
    let path = workspace.rootPath; // get the open folder path

    return {
        name,
        path,
    };

}
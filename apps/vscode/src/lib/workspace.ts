import { workspace, window } from 'vscode';
import * as path from 'path';

export function getWorkplace() {
    let name = workspace.name; // get the open folder name
    let path = workspace.rootPath; // get the open folder path
    let file = window.activeTextEditor?.document.fileName;

    return {
        name,
        path,
        file
    };

}

export const pathJoin = (...paths: string[]) => {
    return path.join(...paths).replaceAll(/(\/\/|\\)/g, '/');
};

export const replaceSlash = (path: string) => {
    return path.replaceAll(/(\/\/|\\)/g, '/');
}
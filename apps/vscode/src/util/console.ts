import {window} from 'vscode';

export const consoler = {
    log: (...args: any[]) => {
        window.showInformationMessage(args.join(" "));
    }
}
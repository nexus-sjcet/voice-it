import { window } from 'vscode';

type Action = {
    text: string;
    callback: () => void;
};

const action = (text: string, actions: Action[], model?: boolean) => {
    window.showInformationMessage(
        text, { modal: model },
        ...actions.map((action) => action.text),
    ).then((selectedAction) => {
        const action = actions.find((action) => action.text === selectedAction);

        if (action) {
            action.callback();
        }
    });
};

export const consoler = {
    log: (...args: string[]) => window.showInformationMessage(args.join(" ")),
    warn: (...args: string[]) => window.showWarningMessage(args.join(" ")),
    error: (...args: string[]) => window.showErrorMessage(args.join(" ")),
    action,
};

import * as path from 'path';
import * as fs from 'fs';

export function makeAllDirs(root: string, list: string[], data:string[]) {
    list.forEach((p, i) => {
        const x = path.join(root, p);
        const directoryPath = x.split(path.basename(x))[0];
        try {
            if (!fs.existsSync(directoryPath)) {
                fs.mkdirSync(directoryPath, { recursive: true });
                console.log(`Created directory: ${directoryPath}`);
            }
            if (x.includes(".")) {
                fs.writeFileSync(x, data[i]);
                console.log(`Created file: ${x}`);
            }
        } catch (error) {
            console.error(`Error creating directory: ${directoryPath}`, error);
        }
    });
}
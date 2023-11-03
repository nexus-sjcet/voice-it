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
    log: (...args: string[]) => {
        window.showInformationMessage(args.join(" "));
    },
    action
};
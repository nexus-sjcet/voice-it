import * as vscode from 'vscode';
import * as path from 'path';

export const decorationType = vscode.window.createTextEditorDecorationType({
    gutterIconPath: path.join(__filename,"../../assets/logo.svg"),
    gutterIconSize: "contain",
    backgroundColor: new vscode.ThemeColor("widget.shadow"),
    // color: new vscode.ThemeColor("disabledForeground"),
    isWholeLine: true,
    after: {
        contentText: " ✦ ",
        contentIconPath: path.join(__filename,"../assets/logo.svg"),
        width: "100%",
        margin: "0 0 0 10px"
    }
});
// import * as vscode from 'vscode';
// import * as path from 'path';

// import { myDecorationType } from '../components/gutter';
// const regexPattern = /✦ (\S+)(?: (.*))?/g;



// export const line = vscode.languages.match({ language: "*" }, {
//     provideHover(document, position, token) {
//         const lineNumber = position.line;

//         const lineText = document.lineAt(lineNumber).text;
//         const editor = vscode.window.activeTextEditor;

//         let match;
//         let firstIndex = -1;
//         let lastIndex = -1;

//         while ((match = regexPattern.exec(lineText)) !== null) {
//             if (firstIndex === -1) {
//                 firstIndex = match.index;
//             }
//             lastIndex = match.index;
//         }

//         if (editor) {
//             const decorationRanges = [
//                 new vscode.Range(new vscode.Position(lineNumber, firstIndex), new vscode.Position(lineNumber, lastIndex))
//             ];

//             lastIndex !== -1 && editor.setDecorations(myDecorationType, decorationRanges);
//         }

//         return null;

//     }

// });
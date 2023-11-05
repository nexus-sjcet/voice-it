import * as vscode from 'vscode';

// const rootCustomConfig = workspace.getConfiguration("coverage-gutters.customizable");


export const myDecorationType = vscode.window.createTextEditorDecorationType({
    gutterIconPath: './out/assets/logo.svg', // Path to your icon image
    overviewRulerLane: vscode.OverviewRulerLane.Full, // Specify the gutter lane
    light: {
        // Define the appearance for light themes
        before: {
            // contentText: '■', // Text or HTML content for the gutter
        },
    },
    dark: {
        outline: 'green',
        outlineWidth: '10px',
        outlineStyle: 'solid ',
        backgroundColor: 'lightgreen',
        before: {
            margin: '1px',
            // color: 'red',
            // contentText: '■', // Text or HTML content for the gutter
        },
    },

});                                                                                                                                                                
const envProjectName = "project-name"; // || process.env

export const cmd:{[k in keyof CMD]:string} = {
    addComment: envProjectName + ".addComment",
    openFile: envProjectName + ".openFile",
    openLink: envProjectName + ".openLink",
    activate: envProjectName + ".activate",
};

export const editorComment:{[k in keyof CMD]:string} = {
    addComment: "✦",
    openFile: "📂",
    openLink: "🔗",
    activate: "⚡",
};
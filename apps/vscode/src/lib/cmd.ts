const envProjectName = "project-name"; // || process.env

export const cmd:{[k in keyof CMD]:string} = {
    addComment: envProjectName + ".addComment",
    openFile: envProjectName + ".openFile",
    openLink: envProjectName + ".openLink",
    activate: envProjectName + ".activate",
    workspace: envProjectName + ".workspaceactivate",
    builddocs: envProjectName + ".builddocs",
};

export const editorComment:{[k in keyof CMD]:string} = {
    addComment: "✦",
    openFile: "📂",
    openLink: "🔗",
    activate: "⚡",
    workspace: "📚",
    builddocs: "🛠️",
};

export const logoFiles:{[key in (singleCommentData["type"] | "code" | "txt")]:string} = {
    audio: "🎶",
    video: "🎥",
    image: "📷",
    json: "📝",
    md: "📝",
    code: "📄",
    txt: "📄",
};

export const langLogo:{[k in any]:string} = {
    "mp3": logoFiles.audio,
    "mp4": logoFiles.video,
    "wav": logoFiles.audio,
    "ogg": logoFiles.audio,
    "png": logoFiles.image,
    "jpg": logoFiles.image,
    "jpeg": logoFiles.image,
    "gif": logoFiles.image,
    "webm": logoFiles.video,
    "md": logoFiles.md,
    "json": logoFiles.json,
    "html": logoFiles.code,
    "css": logoFiles.code,
    "js": logoFiles.code,
    "ts": logoFiles.code,
    "tsx": logoFiles.code,
    "jsx": logoFiles.code,
    "txt": logoFiles.txt,
    "py": logoFiles.code,
    "c": logoFiles.code,
    "cpp": logoFiles.code,  
    "java": logoFiles.code,
    "php": logoFiles.code,
};
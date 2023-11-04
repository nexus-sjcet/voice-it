type singleCommentData = {
    header?: string;
    body: string;
    type: "md" | "image" | "audio" | "video" | "json";
}

type Cache = {
    [key: string]: {
        [key: string]: singleCommentData
    }
}

type Config = {
    "host": "localhost" | string,
    "root": string,
    "assets": string,
}

type CMD = {
    addComment: "✦",
    openFile: "📂",
    openLink: "🔗",

    activate: "⚡",
}

type ObtainKeys<Obj, Type = any> = {
    [Prop in keyof Obj]: Obj[Prop] extends Type ? Prop : never
}[keyof Obj]

type ObtainValues<Obj, Type = any> = Obj[keyof Obj]

type Pretty<T> = {
    [K in keyof T]: T[K]
} & {}

type ArrayedType<T> = Pretty<{
    [K in keyof T]: T[K][];
}>;

type GetValueTypeByKey<T, K extends keyof T> = T[K];

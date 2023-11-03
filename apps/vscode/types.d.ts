type Cache = {
    [key: string]: {
        [key: string]: {
            header: string;
            body: string;
        }
    }
}

type CMD = {
    addComment: "✦",
    openFile: "📂",
}

type ObtainKeys<Obj, Type=any> = {
    [Prop in keyof Obj]: Obj[Prop] extends Type ? Prop : never
}[keyof Obj]

type ObtainValues<Obj, Type=any> = Obj[keyof Obj]

type Pretty<T> = {
    [K in keyof T]: T[K]
} & {}

type ArrayedType<T> = Pretty<{
    [K in keyof T]: T[K][];
}>;

type GetValueTypeByKey<T, K extends keyof T> = T[K];

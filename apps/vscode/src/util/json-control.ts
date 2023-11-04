import * as fs from 'fs';
import { consoler } from './console';



export function readJson<T>(filePath: string): (T|null) {
    try {
        const file = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(file);

    }
    catch (e) {
        consoler.log(e as string);
        return null;
    }
}

export function writeJson(filePath: string, content: any) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(content, null, 4));
        return true;
    }
    catch (e) {
        consoler.log(e as string);
        return false;
    }
}

export function appendJson(filePath: string, content: {}) {
    try {
        const file = readJson<{}>(filePath);
        const newFile = { ...file, ...content };
        writeJson(filePath, newFile);
        return true;
    }
    catch (e) {
        consoler.log(e as string);
        return false;
    }
}




export function appendDataToJson(filePath: string, key: string, data: any) {
    try {
        let file = readJson<{}>(filePath);
        
        
        return true;
    }
    catch (e) {
        console.log(e);
        return false;
    }
}
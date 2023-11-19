import * as fs from 'fs';
import * as path from 'path';
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
export function readFile(filePath: string): (string|null) {
    try {
        return fs.readFileSync(filePath, 'utf-8');
    }
    catch (e) {
        consoler.log(e as string);
        return null;
    }
}

export function writeJson(filePath: string, content: any): boolean {
    try {
        const directoryPath = path.dirname(filePath);

        // Ensure the directory structure exists
        if (!fs.existsSync(directoryPath)) {
            fs.mkdirSync(directoryPath, { recursive: true });
        }

        // Write the JSON file
        fs.writeFileSync(filePath, JSON.stringify(content, null, 4));

        return true;
    } catch (e) {
        console.error(e);
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
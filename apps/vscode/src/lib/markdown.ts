const regex = /#(.*?)\s+#{6}\s✦\s(\d.+)+\s([\s\S]*?)(?=(?:#|$))/g;
//                           ☝️ identifier


export function extractMD(markdown: string) {

    const doc: Cache[any] = {};

    let match;
    while ((match = regex.exec(markdown)) !== null) {
        const header = match[1].trim();
        const id = match[2];
        const body = match[3].trim();

        doc[id] = { header, body, type: "md" };
    }

    return doc;
}

import * as fs from 'fs';
import * as path from 'path';

export function writeMD(filePath: string, content: any): boolean {
    try {
        const directoryPath = path.dirname(filePath);

        // Ensure the directory structure exists
        if (!fs.existsSync(directoryPath)) {
            fs.mkdirSync(directoryPath, { recursive: true });
        }

        // Write the Markdown file
        fs.writeFileSync(filePath, content, 'utf-8');

        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}

export function readMD(filePath: string): (string|null) {
    try {
        return fs.readFileSync(filePath, 'utf-8');

    }
    catch (e) {
        console.log(e as string);
        return null;
    }
}
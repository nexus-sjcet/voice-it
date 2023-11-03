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


export function readMD(workspace: string, fileName: string) {
    try {
        console.log(workspace, fileName);
        const file = fs.readFileSync(path.join(__dirname, fileName), 'utf-8');
        // const file = await fs.readFile(filePath, 'utf-8');
        return file;

    }
    catch (e) {
        console.log(e);
        return "";
    }

}
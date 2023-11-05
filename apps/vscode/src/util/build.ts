import { window, workspace, Uri, commands } from 'vscode';
import { consoler } from '../util/console';
import { cmd } from '../lib/cmd';
import { cacheState } from './cache';
import { getWorkplace, pathJoin, replaceSlash } from '../lib/workspace';
import { editorComment } from '../lib/cmd';
import * as path from 'path';
import { readMD, writeMD } from '../lib/markdown';
import * as fs from 'fs';
import { readJson } from './json-control';

export const build = commands.registerCommand(cmd.builddocs, () => {

    try {

        const { getCache, getConfig } = cacheState();


        consoler.log(editorComment.builddocs, "Building docs");

        const config = getConfig();
        const cache = getCache();
        const basePath = getWorkplace().path;

        if (!config || !cache || !basePath) {

            consoler.log(editorComment.builddocs, "Building failed");
            return;
        }

        

        let buildFail = 0;

        Object.entries(cache).forEach(([k1, v1]) => {

            let final = "";
            const destination = pathJoin(basePath, config.build, k1 + ".md");
            const directoryPath = path.dirname(destination);
            if (!fs.existsSync(directoryPath)) {
                fs.mkdirSync(directoryPath, { recursive: true });
            }

            const replaceDot = Array(k1.split("/").length - 1).fill('..').join('/');



            Object.entries(v1).forEach(([k2, v2]) => {


                const sameHeader = `\n\n# ${v2.header || "Header"} \n###### ✦ ${k2}\n\n`;

                const source = pathJoin(basePath, v2.body);
                if (v2.type === "md") {
                    let sourcor = readMD(source);
                    if (!sourcor) return null;

                    sourcor = sourcor.replace(
                        /!\[([^\]]*)\]\((\.[/\\].*?)\)/g,
                        (match, altText, imagePath) => {


                            const x = imagePath.replace(config.root, replaceDot);
                            consoler.log(imagePath, x);
                            return `![${altText}](${x})`;
                        }
                    );


                    const singleData = sameHeader + `${sourcor}`;
                    final = final.concat(singleData);

                }
                else if (["png", "jpg", "jpeg", "gif", "webm"].includes(v2.type)) {
                    const x = v2.body.replace(config.root, replaceDot);
                    final = final.concat(sameHeader, `![${v2.header || ""}](${x})\n\n`);

                    console.log(editorComment.builddocs,final);
                }
                else if (v2.type === "json") {
                    const file = readJson<{}>(source);
                    final = final.concat(sameHeader, "```json\n" + `${JSON.stringify(file, null, 2)}\n` + "```\n\n");
                }
                else if (["mp3", "wav",].includes(v2.type)) {

                    const x = v2.body.replace(config.root, replaceDot);
                    const template = `<audio controls>
    <source src="${x}" type="audio/${v2.type}">
</audio>\n\n`;

                    final = final.concat(sameHeader, template);

                }

                else if (["mp4", "wma", "mkv"].includes(v2.type)) {
                    const x = v2.body.replace(config.root, replaceDot);
                    const template = `<video controls>
    <source src="${x}" type="video/${v2.type}">
</video>\n\n`;

                    final = final.concat(sameHeader, template);

                }
                else consoler.log(editorComment.builddocs, (++buildFail) + " Build failed");

                

            });

            
            writeMD(destination, final);
        });






        consoler.log(editorComment.builddocs, "Done Building docs");

    }
    catch (err) {
        consoler.log(editorComment.builddocs, "Building failed");
        return;
    }
});
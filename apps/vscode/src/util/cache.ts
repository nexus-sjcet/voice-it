import { getWorkplace } from "../lib/workspace";
import { consoler } from "./console";
import { readJson, writeJson } from "./json-control";
import * as path from 'path';

const wrapper = () => {
    const basePath = getWorkplace().path;
    const commentConfigJson = path.join(basePath || "", "./comment.config.json");

    let config = readJson<Config>(commentConfigJson);

    if (!config) {
		const configNew:Config = {
			root: "./docs",
			assets: "./docs/static",
			host: "localhost"
		};
		// createFolder = (folderPath:string) => {};
		const action = {
			text: "Create config file",
			callback: () => {
                config = configNew;
				writeJson(commentConfigJson, configNew);
				// create folder;
			}
		};
		consoler.action("No comment config file found, ", [action]);
	}

    const commentJson = path.join(basePath || "", config?.root || "./docs", "./comment.json");
    
    let cache = readJson<Cache>(commentJson) || {};


    const cacheState = () => {
        const initCache = (init: Cache) => {
            cache = init;
        };

        const getConfig = () => config;
        const getCache = () => cache;

        const addPageContent = (pageID: string, data: { key: string, value: any }) => {
            if (data) {
                cache[pageID] = {
                    ...cache[pageID],
                    [data.key]: data.value
                };
            }
            writeJson(commentJson, cache);
            return cache;
        };

        const getPage = (pageID: string) => {
            return cache[pageID];
        };

        const getPageContent = (pageID: string, key: string) => {
            return cache[pageID][key];
        };

        const removePage = (pageID: string) => {
            delete cache[pageID];
            return cache;
        };

        const removePageContent = (pageID: string, key: string) => {
            delete cache[pageID][key];
            return cache;
        };

        return {
            initCache,
            getCache,
            getConfig,
            addPageContent,
            getPage,
            getPageContent,
            removePage,
            removePageContent,
        };
    };

    return {
        cacheState,
        cache,
        config
    };
};

export const { cacheState, cache, config } = wrapper();

export type CacheState = {
    initCache: (init: Cache) => void,
    getCache: () => Cache,
    addPage: (data: { key: string, value: object }) => Cache,
    addPageContent: (pageID: string, data: { key: string, value: any }) => Cache,
    getPage: (pageID: string) => Cache,
    getPageContent: (pageID: string, key: string) => Cache,
    removePage: (pageID: string) => Cache,
    removePageContent: (pageID: string, key: string) => Cache,
    clearPage: () => Cache,
    clearPageContent: (pageID: string) => Cache,
};
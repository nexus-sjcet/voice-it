export const cacheState = (init?:Cache) => {
    let cache:Cache = init ?? {};

    const initCache = (init:Cache) => {
        cache = init;
    };

    const getCache = () => cache;

    const addPage = (data:{key:string, value:object}) => { 
        if (data) {
            cache[data.key] = {...data.value};
        }
        return cache;
    };

    const addPageContent = (pageID:string, data:{key:string, value:any}) => {
        if (data) {
            cache[pageID] = {
                ...cache[pageID],
                [data.key]: data.value
            };
        }
        return cache;
    };

    const getPage = (pageID:string) => {
        return cache[pageID];
    };

    const getPageContent = (pageID:string, key:string) => {
        return cache[pageID][key];
    };

    const removePage = (pageID:string) => {
        delete cache[pageID];
        return cache;
    };

    const removePageContent = (pageID:string, key:string) => {
        delete cache[pageID][key];
        return cache;
    };

    const clearPage = () => {
        Object.keys(cache).forEach((key) => {
            delete cache[key];
        });
        return cache;
    };

    const clearPageContent = (pageID:string) => {
        Object.keys(cache[pageID]).forEach((key) => {
            delete cache[pageID][key];
        });
        return cache;
    };


    return {
        initCache,
        getCache,
        addPage,
        addPageContent,
        getPage,
        getPageContent,
        removePage,
        removePageContent,
        clearPage,
        clearPageContent
    }
};
chrome.runtime.onMessage.addListener((githubMessage: GitHubMessage, _, sendResponse) => {
    const { action, message } = githubMessage;
    let responseData = {};

    if (action === 'getGitHubData') {
        const githubRepoUrlRegex = /^https:\/\/github\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9_.-]+\/blob\/[a-zA-Z0-9-]+\/([^/]+(\/[^/]+)*)$/;
        const { url, username, repo, branch, path } = message;

        if (!githubRepoUrlRegex.test(url)) {
            responseData = { message: 'Not Repo', response: '' };
            sendResponse(responseData);
        } else {
            chrome.storage.local.get(['githubPat'], async (result) => {
                const headers = {
                    'Authorization': `token ${result.githubPat}`,
                };
                try {
                    const config = await loadConfig(username, repo, branch, headers);
                    if (!config) {
                        responseData = { message: 'Init Error', response: '' };
                    } else {
                        const { root } = config;
                        const response = await loadContents(username, repo, branch, path, root, headers);
                        responseData = { message, response };
                    }
                } catch (error) {
                    responseData = { message: 'Error: ' + error.message, response: '' };
                } finally {
                    sendResponse(responseData);
                }
            });
        }
    }
    // Return true to indicate that sendResponse will be called asynchronously
    return true;
});

chrome.runtime.onMessage.addListener(({ action, message }, _, sendResponse) => {
    if (action === 'storePAT') {
        storePat(message);
    }
})


// Load comment.config.json content from Github
const loadConfig = async (username: string, repo: string, branch: string, headers: HeadersInit) => {
    const apiUrl: string = `https://api.github.com/repos/${username}/${repo}/contents/comment.config.json?ref=${branch}`;
    const response = await fetch(apiUrl, {
        headers,
    });

    if (response.ok) {
        const data = await response.json();
        const content = JSON.parse(atob(data.content));
        return content; // Return the parsed content
    } else {
        return null;
    }
};

// Load comment contents from Github
const loadContents = async (username: string, repo: string, branch: string, path: string, root: string, headers: HeadersInit) => {
    const apiUrl = `https://api.github.com/repos/${username}/${repo}/contents/${root}/comment.json?ref=${branch}`;
    const response = await fetch(apiUrl, { headers });
    if (response.ok) {
        const data = await response.json();
        const finalContent = {}
        const content: Content = JSON.parse(atob(data.content));
        const currentPageContent: CurrentPageContent = content[path];
        for (const key in currentPageContent) {
            const currentContent = currentPageContent[key];
            finalContent[key] = {
                ...currentContent,
                "body": `https://github.com/${username}/${repo}/blob/${branch}${currentContent.body}`
            };
        }
        return ({ ...response, content: finalContent, message: 'Success' });
    } else {
        return ({ ...response, message: 'Init Error' });
    }
}

// Saving GitHub PAT to extension storage
const storePat = (patValue: string) => {
    chrome.storage.local.set({ 'githubPat': patValue });
}

const resetPat = () => {
    chrome.storage.local.remove('githubPat', () => {
        console.log('GitHub PAT has been removed from extension storage.');
    });
}
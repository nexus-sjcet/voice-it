chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
    if (message.action === 'getGitHubData') {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const githubRepoUrlRegex = /^https:\/\/github\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9_.-]+\/blob\/[a-zA-Z0-9-]+\/([^/]+(\/[^/]+)*)$/;
            const currentUrl = tabs[0].url;
            chrome.tabs.sendMessage(tabs[0].id, { action: 'getGitHubData' }, async (response) => {
                if (!githubRepoUrlRegex.test(currentUrl)) {
                    sendResponse({ ...response, message: 'Not Repo' });
                }
                else {
                    const { username, repo, branch, path } = response;
                    chrome.storage.local.get(['githubPat'], async (result) => {
                        // Set headers for github auth
                        const headers = {
                            'Authorization': `token ${result.githubPat}`,
                        };
                        // Get comment.config.json content from Github
                        const config = await loadConfig(username, repo, branch, headers);
                        if (!config)
                            sendResponse({ ...response, message: 'Init Error' });
                        else {
                            const { root } = config;
                            sendResponse(loadContents(username, repo, branch, path, root, headers));
                        }
                    });
                }
            });
        });
        return true;
    }
});
// Load comment.config.json content from Github
const loadConfig = async (username, repo, branch, headers) => {
    const apiUrl = `https://api.github.com/repos/${username}/${repo}/contents/comment.config.json?ref=${branch}`;
    const response = await fetch(apiUrl, {
        headers,
    });
    if (response.ok) {
        const data = await response.json();
        const content = JSON.parse(atob(data.content));
        return content; // Return the parsed content
    }
    else {
        return null;
    }
};
// Load comment contents from Github
const loadContents = async (username, repo, branch, path, root, headers) => {
    const apiUrl = `https://api.github.com/repos/${username}/${repo}/contents/${root}/comment.json?ref=${branch}`;
    const response = await fetch(apiUrl, { headers });
    if (response.ok) {
        const data = await response.json();
        const finalContent = {};
        const content = JSON.parse(atob(data.content));
        const currentPageContent = content[path];
        for (const key in currentPageContent) {
            const currentContent = currentPageContent[key];
            finalContent[key] = {
                ...currentContent,
                "body": `https://github.com/${username}/${repo}/blob/${branch}${currentContent.body}`
            };
        }
        return ({ ...response, content: finalContent, message: 'Success' });
    }
    else {
        console.error('Error fetching file content:', response.statusText);
        return ({ ...response, message: 'Init Error' });
    }
};

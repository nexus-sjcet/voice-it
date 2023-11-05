if (window.location.hostname === "github.com") {
    console.log('Content');
    const urlParts = window.location.pathname.split('/');
    const username = urlParts[1];
    const repo = urlParts[2];
    const branch = urlParts[4];
    const path = `/${urlParts.slice(5).join('/')}`;
    const data = {
        username,
        repo,
        branch,
        path,
        content: {},
        message: ''
    };
    chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
        if (message.action === 'getGitHubData') {
            sendResponse(data);
        }
    });
}

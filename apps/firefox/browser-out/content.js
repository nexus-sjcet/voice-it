let data = {
    type: 'Nil',
    message: "Not Found"
};
// Custom Functions
const extractWord = (span) => {
    let word = '';
    const childSpans = span.querySelectorAll('span[data-code-text]');
    childSpans.forEach(childSpan => {
        word += childSpan.getAttribute('data-code-text');
    });
    return word;
};
const injectPopup = () => {
    const regexPattern = /✦ (\S+)(?: (.*))?/;
    const plCSpans = document.querySelectorAll('.pl-c');
    plCSpans.forEach(span => {
        const word = extractWord(span);
        if (word.match(regexPattern)) {
            const newDiv = document.createElement('div');
            newDiv.innerHTML = `<h1 style="color: blue;">${data.message}</h1>`;
            newDiv.style.background = '#fff';
            newDiv.style.color = 'rgb(0, 0, 0)';
            newDiv.style.borderRadius = '2px';
            newDiv.style.padding = '3px';
            newDiv.style.margin = '20px 0px 0px';
            newDiv.style.zIndex = '100px';
            newDiv.style.display = 'block';
            newDiv.style.minWidth = '260px';
            const parent = span.parentNode;
            const lineNumber = parent.getAttribute('data-line-number');
            const clickElement = document.querySelector(`.react-line-number[data-line-number="${lineNumber}"]`);
            clickElement.addEventListener('mouseenter', () => {
                parent.appendChild(newDiv);
            });
            clickElement.addEventListener('mouseleave', () => {
                console.log(`Line No: ${lineNumber}`);
                parent.removeChild(newDiv);
            });
        }
    });
};
if (window.location.hostname === "github.com") {
    const urlParts = window.location.pathname.split('/');
    const username = urlParts[1];
    const repo = urlParts[2];
    const branch = urlParts[4];
    const path = `/${urlParts.slice(5).join('/')}`;
    const data = {
        url: window.location.href,
        username,
        repo,
        branch,
        path,
        content: {},
        message: '',
    };
    chrome.runtime.sendMessage({ action: 'getGitHubData', message: data }, (response) => {
        console.log(response);
    });
    injectPopup();
}

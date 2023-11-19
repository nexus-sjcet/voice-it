if (window.location.hostname === "github.com") {
    console.log('Content');
    const urlParts = window.location.pathname.split('/');
    const username = urlParts[1];
    const repo = urlParts[2];
    const branch = urlParts[4];
    const path = `/${urlParts.slice(5).join('/')}`;

    const data: Data = {
        username,
        repo,
        branch,
        path,
        content: {},
        message: ''
    };

    chrome.runtime.onMessage.addListener((message: GitHubMessage, _, sendResponse) => {
        if (message.action === 'getGitHubData') {
            sendResponse(data);
        }
    });

    const link = document.createElement('link');
    link.href = chrome.runtime.getURL('inject.css');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    let currentDiv = null;
    const regexPattern = /✦ (\S+)(?: (.*))?/;

    const elementsToModify = document.querySelectorAll('.pl-c');
    const elementToModify2 = document.querySelector('.cpgGLU');

    if (elementToModify2) {
        (elementToModify2 as HTMLElement).style.pointerEvents = 'all';
    }

    elementsToModify.forEach((elementToModify) => {
        const value = (elementToModify as HTMLElement).attributes
            .getNamedItem('data-code-text')
            ?.value.replace('// ', '')
            .match(regexPattern);
        console.log(value);
        if (value) {
            const newDiv = document.createElement('div');
            newDiv.textContent = value[1];
            newDiv.classList.add('cmtpopup');

            (elementToModify.parentElement as HTMLElement).insertBefore(newDiv, elementToModify);

            elementToModify.addEventListener('mouseenter', () => {
                if (currentDiv) {
                    currentDiv.style.display = 'none';
                }
                if (newDiv) {
                    newDiv.style.display = 'block';
                    currentDiv = newDiv;
                }
            });

            if (elementToModify instanceof HTMLElement) {
                elementToModify.style.position = 'absolute';
                elementToModify.style.zIndex = '0';
                elementToModify.style.cursor = 'pointer';
            }
        }
    });
}

const elementsToModify: NodeListOf<HTMLElement> = document.querySelectorAll('.pl-c');
const elementsToModify2: NodeListOf<HTMLElement> = document.querySelectorAll('.cpgGLU');

// Change pointer-events to 'all'
if (elementsToModify2) {
    // ts-ignore
    elementsToModify2.style.pointerEvents = 'all';
}

let currentDiv: HTMLDivElement | null = null;
const regexPattern: RegExp = /✦ (\S+)(?: (.*))?/;

elementsToModify.forEach((elementToModify: HTMLElement) => {
    const value = elementToModify.attributes
        .getNamedItem('data-code-text')
        ?.value.replace('// ', '')
        .match(regexPattern);

    console.log(value);

    if (value) {
        const newDiv: HTMLDivElement = document.createElement('div');
        newDiv.textContent = value[1];
        // newDiv.innerHTML = `<div class="audio_container">
        //     <img width="10" height="10" src="https://img.icons8.com/ios-glyphs/10/ffffff/play--v1.png" alt="play--v1"/>
        //     </div>`;
        newDiv.classList.add('cmtpopup');

        // Event listener for the image within newDiv
        // newDiv.querySelector('img').addEventListener('click', () => {
        //     // Handle image click event
        // });

        elementToModify.parentElement.insertBefore(newDiv, elementToModify);

        // Toggle the newDiv's visibility on mouseenter for each element
        elementToModify.addEventListener('mouseenter', () => {
            if (currentDiv) {
                currentDiv.style.display = 'none'; // Hide the previously displayed div
            }
            if (newDiv) {
                newDiv.style.display = 'block'; // Show the current div
                currentDiv = newDiv; // Update the current div
            }
        });

        // Toggle the newDiv's visibility on mouseleave for each element
        // elementToModify.addEventListener('mouseleave', () => {
        //     if (newDiv) {
        //         newDiv.style.display = 'none';
        //     }
        // });

        elementToModify.style.position = 'absolute';
        elementToModify.style.zIndex = '0';
        elementToModify.style.cursor = 'pointer';
    }
});




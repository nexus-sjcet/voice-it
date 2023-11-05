document.addEventListener('DOMContentLoaded', async () => {

    const messageElement = document.getElementById('message')

    // Saving GitHub PAT to extension storage
    const patInput = document.getElementById('pat') as HTMLInputElement;
    patInput.addEventListener('keydown', (event) => {
        const patValue = patInput.value;
        if (event.key === 'Enter') {
            event.preventDefault();
            chrome.storage.local.set({ 'githubPat': patValue }, () => {
                checkStorage()
            });
        }
    });

    // Reset Extension Storage
    const resetBtn = document.getElementById('reset-btn') as HTMLInputElement;
    resetBtn.addEventListener('click', () => {
        chrome.storage.local.remove('githubPat', () => {
            console.log('GitHub PAT has been removed from extension storage.');
            checkStorage()
        });
    });

    // Fetch from Github
    const isStored = await checkStorage()
    if (isStored) {
        chrome.runtime.sendMessage({ action: 'getGitHubData' }, (data: Data) => {
            // when the comment file is fetched properly
            if (data.message === 'Success') {
                console.log(data.content)
                messageElement.textContent = 'Code Fetched'
                messageElement.style.color = 'green';
            }
            // when the current page is a GitHub repository but voice it is not init
            else if (data.message === 'Init Error') {
                messageElement.textContent = 'Voice-it not initialized.';
                messageElement.style.color = 'red';
            }
            // when the current page is not a GitHub repository
            else {
                messageElement.textContent = 'Not a GitHub repository.';
                messageElement.style.color = 'red';
            }
        });
    }
});

// check if local storage has the PAT
const checkStorage = (): Promise<boolean> => {
    return new Promise((resolve) => {
        const messageElement = document.getElementById('message')
        chrome.storage.local.get(['githubPat'], (result) => {
            const storedPat = result.githubPat;
            if (storedPat) {
                document.getElementById('githubPatForm').classList.add('d-none')
                document.getElementById('reset-btn').classList.remove('d-none')
                resolve(true);
            }
            else {
                document.getElementById('githubPatForm').classList.remove('d-none')
                document.getElementById('reset-btn').classList.add('d-none')
                messageElement.textContent = 'PAT must be entered!';
                messageElement.style.color = 'red';
                resolve(false);
            }
        })
    })
}
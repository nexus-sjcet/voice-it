type GitHubMessage = {
    action: 'getGitHubData' | 'sample';
    message: Data;
}

interface Data {
    url: string;
    username: string;
    repo: string;
    branch: string;
    path: string;
    content: CurrentPageContent;
    message: '' | 'Init Error' | 'Not Repo' | 'Success';
}

// type ResponseData = {
    
// }

type Config = {
    root: string;
    assets: string[]
}

type Content = {
    [key: string]: {
        [key: string]: {
            header: string;
            body: string;
            type: string;
        };
    };
}

type CurrentPageContent = {
    [key: string]: {
        header: string;
        body: string;
        type: string;
    };
}
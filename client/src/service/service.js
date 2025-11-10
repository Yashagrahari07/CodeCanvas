const languageMap = {
    cpp: 54,
    python: 92,
    javascript: 93,
    java: 91
};

export async function getSubmission(tokenId, callback) {
    const judge0ApiUrl = import.meta.env.VITE_JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com/submissions';
    const judge0ApiHost = import.meta.env.VITE_JUDGE0_API_HOST || 'judge0-ce.p.rapidapi.com';
    const judge0ApiKey = import.meta.env.VITE_JUDGE0_API_KEY || '5dadd96374mshcc330d7bcf15012p118ebfjsn6e28f8eaa1d1';
    
    const url = `${judge0ApiUrl}/${tokenId}?base64_encoded=true&fields=*`;
    const options = {
        method: 'GET',
        headers: {
            'content-type': 'application/octet-stream',
            'x-rapidapi-key': judge0ApiKey,
            'x-rapidapi-host': judge0ApiHost
        }
    };
    try {
        const response = await fetch(url, options);
        const result = await response.json();
        return result;
    } catch (error) {
        callback({ apiStatus: 'error', message: JSON.stringify(error) });
    }
}

export async function makeSubmission({ code, language, callback, stdin }) {
    const judge0ApiUrl = import.meta.env.VITE_JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com/submissions';
    const judge0ApiHost = import.meta.env.VITE_JUDGE0_API_HOST || 'judge0-ce.p.rapidapi.com';
    const judge0ApiKey = import.meta.env.VITE_JUDGE0_API_KEY || '5dadd96374mshcc330d7bcf15012p118ebfjsn6e28f8eaa1d1';
    
    const url = `${judge0ApiUrl}/?base64_encoded=true&wait=false`;
    const httpOptions = {
        method: 'POST',
        headers: {
            'x-rapidapi-key': judge0ApiKey,
            'x-rapidapi-host': judge0ApiHost,
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            language_id: languageMap[language],
            source_code: btoa(code.trim()),
            stdin: btoa(stdin || "")
        })
    };
    try {
        callback({ apiStatus: 'loading' });
        const response = await fetch(url, httpOptions);
        const result = await response.json();
        const tokenId = result.token;
        let statusCode = 1;
        while (statusCode === 1 || statusCode === 2) {
            try {
                const apiSubmissionResult = await getSubmission(tokenId);
                statusCode = apiSubmissionResult.status.id;   
                if (apiSubmissionResult) {
                    callback({ apiStatus: 'success', data: apiSubmissionResult });
                }        
            } catch (error) {
                callback({ apiStatus: 'error', message: JSON.stringify(error) });
                return;
            }
        }
        
    } catch (error) {
        callback({
            apiStatus: 'error',
            message: JSON.stringify(error)
        });
    }
}

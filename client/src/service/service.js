import API from '../api/api';

export async function makeSubmission({ code, language, callback, stdin }) {
    try {
        callback({ apiStatus: 'loading' });
        const { data } = await API.post('/execute', {
            code,
            language,
            stdin: stdin || '',
        });
        callback({ apiStatus: 'success', data });
    } catch (error) {
        callback({
            apiStatus: 'error',
            message: error?.response?.data?.message || error.message,
        });
    }
}

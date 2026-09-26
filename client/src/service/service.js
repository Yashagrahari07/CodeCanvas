import API from '../api/api';

const decode = (value) => value ? atob(value) : '';

export const formatExecutionResult = (data) => {
    const statusId = data?.status?.id;
    if (statusId === 3) return decode(data.stdout);
    if (statusId === 6) return `Compilation Error:\n${decode(data.compile_output)}`;
    if (statusId === 5) return `Time Limit Exceeded\n${decode(data.stderr)}`;
    if (statusId === 11) return `Runtime Error:\n${decode(data.stderr)}`;
    return `Error: ${data?.status?.description || 'Unknown execution status'}`;
};

export async function makeSubmission({ code, language, callback, stdin, isCurrent = () => true }) {
    try {
        if (isCurrent()) callback({ apiStatus: 'loading' });
        const { data } = await API.post('/execute', {
            code,
            language,
            stdin: stdin || '',
        });
        if (!data?.status) {
            throw new Error('Invalid execution response');
        }
        if (isCurrent()) callback({ apiStatus: 'success', data });
    } catch (error) {
        if (isCurrent()) {
            callback({
                apiStatus: 'error',
                message: error?.response?.data?.message || error.message,
            });
        }
    }
}

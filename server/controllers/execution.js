import https from 'https';

const languageMap = {
  cpp: 54,
  python: 92,
  javascript: 93,
  java: 91,
};

const judge0ApiUrl = process.env.JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com/submissions';
const judge0ApiHost = process.env.JUDGE0_API_HOST || 'judge0-ce.p.rapidapi.com';
const maxSourceLength = 100000;
const maxInputLength = 100000;
const maxPollAttempts = 30;
const pollDelayMs = 500;

const sleep = (duration) => new Promise((resolve) => setTimeout(resolve, duration));

const requestJudge0 = (method, url, body) => new Promise((resolve, reject) => {
  const target = new URL(url);
  const payload = body ? JSON.stringify(body) : null;
  const request = https.request(target, {
    method,
    headers: {
      'content-type': 'application/json',
      'x-rapidapi-host': judge0ApiHost,
      'x-rapidapi-key': process.env.JUDGE0_API_KEY,
      ...(payload ? { 'content-length': Buffer.byteLength(payload) } : {}),
    },
  }, (response) => {
    let responseBody = '';
    response.setEncoding('utf8');
    response.on('data', (chunk) => {
      responseBody += chunk;
    });
    response.on('end', () => {
      let parsedBody;
      try {
        parsedBody = JSON.parse(responseBody);
      } catch {
        reject(new Error('Invalid response from execution provider'));
        return;
      }

      if (response.statusCode < 200 || response.statusCode >= 300) {
        reject(new Error(parsedBody.message || 'Execution provider request failed'));
        return;
      }

      resolve(parsedBody);
    });
  });

  request.on('error', reject);
  if (payload) request.write(payload);
  request.end();
});

export const executeCode = async (req, res) => {
  const { code, language, stdin = '' } = req.body || {};

  if (!process.env.JUDGE0_API_KEY) {
    return res.status(503).json({ message: 'Code execution is not configured' });
  }

  if (typeof code !== 'string' || !code.trim()) {
    return res.status(400).json({ message: 'Code is required' });
  }

  if (!Object.prototype.hasOwnProperty.call(languageMap, language)) {
    return res.status(400).json({ message: 'Unsupported language' });
  }

  if (typeof stdin !== 'string') {
    return res.status(400).json({ message: 'Input must be text' });
  }

  if (code.length > maxSourceLength || stdin.length > maxInputLength) {
    return res.status(413).json({ message: 'Code or input is too large' });
  }

  try {
    const submission = await requestJudge0('POST', `${judge0ApiUrl}?base64_encoded=true&wait=false`, {
      language_id: languageMap[language],
      source_code: Buffer.from(code.trim(), 'utf8').toString('base64'),
      stdin: Buffer.from(stdin, 'utf8').toString('base64'),
    });

    if (!submission.token) {
      return res.status(502).json({ message: 'Execution provider returned no submission token' });
    }

    let result = submission;
    for (let attempt = 0; attempt < maxPollAttempts; attempt += 1) {
      result = await requestJudge0(
        'GET',
        `${judge0ApiUrl}/${submission.token}?base64_encoded=true&fields=*`,
      );

      if (![1, 2].includes(result.status?.id)) {
        return res.status(200).json(result);
      }

      await sleep(pollDelayMs);
    }

    return res.status(504).json({ message: 'Execution timed out while waiting for the provider' });
  } catch (error) {
    return res.status(502).json({ message: error.message || 'Code execution failed' });
  }
};

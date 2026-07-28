const usernameInput = document.getElementById('username');
const accessKeyInput = document.getElementById('accessKey');
const authorizeBtn = document.getElementById('authorizeBtn');
const scanBtn = document.getElementById('scanBtn');
const statusMessage = document.getElementById('statusMessage');
const activityFeed = document.getElementById('activityFeed');

const AUTH_KEY = 'dedsec_authorized_user';

function nowTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function appendFeed(message) {
  const item = document.createElement('li');
  item.textContent = `[${nowTime()}] ${message}`;
  activityFeed.prepend(item);
}

function setStatus(message, type = 'info') {
  statusMessage.textContent = message;
  statusMessage.dataset.type = type;
}

function getAuthState() {
  return localStorage.getItem(AUTH_KEY);
}

function setAuthorizedUser(username) {
  localStorage.setItem(AUTH_KEY, username);
}

function applyAuthUI() {
  const user = getAuthState();
  if (user) {
    setStatus(`Authorized as ${user}. Secure channel ready.`, 'success');
    scanBtn.disabled = false;
  } else {
    setStatus('Awaiting authorization.', 'info');
    scanBtn.disabled = true;
  }
}

function validateFields() {
  const username = usernameInput.value.trim();
  const accessKey = accessKeyInput.value.trim();

  if (!username || !accessKey) {
    setStatus('Username and Access Key are required.', 'error');
    return null;
  }

  if (accessKey.length < 6) {
    setStatus('Access Key must be at least 6 characters.', 'error');
    return null;
  }

  return { username, accessKey };
}

authorizeBtn.addEventListener('click', () => {
  const data = validateFields();
  if (!data) return;

  setAuthorizedUser(data.username);
  setStatus(`Authorization successful. Welcome, ${data.username}.`, 'success');
  appendFeed(`Identity verified for handle: ${data.username}`);
  scanBtn.disabled = false;
});

scanBtn.addEventListener('click', async () => {
  const user = getAuthState();
  if (!user) {
    setStatus('Authorize before scanning the network.', 'error');
    return;
  }

  scanBtn.disabled = true;
  authorizeBtn.disabled = true;
  setStatus('Network scan started…', 'info');
  appendFeed('Initializing distributed scan nodes…');

  const steps = [
    'Mapping public edge endpoints…',
    'Checking firewall anomalies…',
    'Decrypting metadata packets…',
    'Correlating threat signatures…',
    'Scan complete. No critical breaches detected.'
  ];

  for (let i = 0; i < steps.length; i += 1) {
    await new Promise((resolve) => setTimeout(resolve, 900));
    appendFeed(steps[i]);
    setStatus(`Scan progress: ${Math.round(((i + 1) / steps.length) * 100)}%`, i === steps.length - 1 ? 'success' : 'info');
  }

  authorizeBtn.disabled = false;
  scanBtn.disabled = false;
});

applyAuthUI();

const accountsKey = 'shimbo-school-accounts';
const settingsKey = 'shimbo-school-settings';
const sessionKey = 'shimbo-school-session';
const defaultSettings = {
  students: 1200,
  teachers: 85,
  classes: 28,
  years: 15,
  pathways: ['Science', 'Mathematics', 'Languages', 'Humanities', 'ICT', 'Practical Skills'],
  contact: { phone: '', email: '', location: '' },
};

if (!localStorage.getItem(accountsKey)) {
  localStorage.setItem(
    accountsKey,
    JSON.stringify([{ username: 'shimbomkuzasec', password: 'shimbomkuza', role: 'admin' }])
  );
}

if (!localStorage.getItem(settingsKey)) {
  localStorage.setItem(settingsKey, JSON.stringify(defaultSettings));
}

const loginForm = document.querySelector('#login-form');
const loginMessage = document.querySelector('#login-message');

if (loginForm) {
  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    loginMessage.textContent = '';

    const formData = new FormData(loginForm);
    const username = String(formData.get('username')).trim().toLowerCase();
    const password = String(formData.get('password'));
    const accounts = JSON.parse(localStorage.getItem(accountsKey));
    const account = accounts.find((candidate) => candidate.username === username);

    if (!account || account.password !== password) {
      loginMessage.textContent = 'The username or password is incorrect.';
      return;
    }

    if (account.role !== 'admin') {
      loginMessage.textContent = 'This account does not have administrator access.';
      return;
    }

    sessionStorage.setItem(sessionKey, account.username);
    window.location.assign('admin.html');
  });
}

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
const username = sessionStorage.getItem(sessionKey);
const accounts = JSON.parse(localStorage.getItem(accountsKey) || '[]');
const currentAccount = accounts.find((account) => account.username === username);

if (!currentAccount || currentAccount.role !== 'admin') {
  sessionStorage.removeItem(sessionKey);
  window.location.replace('login.html');
} else {
  const settings = JSON.parse(localStorage.getItem(settingsKey) || JSON.stringify(defaultSettings));
  settings.contact = { ...defaultSettings.contact, ...settings.contact };
  const statsForm = document.querySelector('#stats-form');
  const pathwaysList = document.querySelector('#pathways-list');
  const accountsList = document.querySelector('#accounts-list');
  const statsMessage = document.querySelector('#stats-message');
  const contactForm = document.querySelector('#contact-form');
  const contactMessage = document.querySelector('#contact-message');
  const pathwaysMessage = document.querySelector('#pathways-message');
  const accountsMessage = document.querySelector('#accounts-message');

  document.querySelector('#signed-in-user').textContent = `Signed in as ${currentAccount.username}`;

  Object.keys(defaultSettings).filter((key) => key !== 'pathways').forEach((key) => {
    if (key !== 'contact') {
      statsForm.elements.namedItem(key).value = settings[key];
    }
  });
  ['phone', 'email', 'location'].forEach((key) => {
    contactForm.elements.namedItem(key).value = settings.contact[key];
  });

  const saveSettings = () => localStorage.setItem(settingsKey, JSON.stringify(settings));

  const renderPathways = () => {
    pathwaysList.replaceChildren();
    settings.pathways.forEach((pathway, index) => {
      const item = document.createElement('li');
      const name = document.createElement('span');
      const remove = document.createElement('button');
      name.textContent = pathway;
      remove.type = 'button';
      remove.className = 'remove-button';
      remove.textContent = 'Remove';
      remove.setAttribute('aria-label', `Remove ${pathway} pathway`);
      remove.addEventListener('click', () => {
        settings.pathways.splice(index, 1);
        saveSettings();
        renderPathways();
        pathwaysMessage.textContent = 'Pathway removed.';
      });
      item.append(name, remove);
      pathwaysList.append(item);
    });
  };

  const renderAccounts = () => {
    const storedAccounts = JSON.parse(localStorage.getItem(accountsKey) || '[]');
    accountsList.replaceChildren();

    storedAccounts.forEach((account) => {
      const row = document.createElement('tr');
      const nameCell = document.createElement('td');
      const roleCell = document.createElement('td');
      const actionCell = document.createElement('td');
      const roleSelect = document.createElement('select');
      const removeButton = document.createElement('button');

      nameCell.textContent = account.username;
      roleSelect.setAttribute('aria-label', `Role for ${account.username}`);
      [
        { value: 'viewer', label: 'Viewer' },
        { value: 'admin', label: 'Admin' },
      ].forEach(({ value, label }) => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = label;
        option.selected = account.role === value;
        roleSelect.append(option);
      });

      roleSelect.addEventListener('change', () => {
        const latestAccounts = JSON.parse(localStorage.getItem(accountsKey) || '[]');
        const target = latestAccounts.find((entry) => entry.username === account.username);
        const adminCount = latestAccounts.filter((entry) => entry.role === 'admin').length;

        if (target.role === 'admin' && roleSelect.value !== 'admin' && adminCount <= 1) {
          roleSelect.value = 'admin';
          accountsMessage.textContent = 'At least one admin account must remain.';
          return;
        }

        target.role = roleSelect.value;
        localStorage.setItem(accountsKey, JSON.stringify(latestAccounts));
        accountsMessage.textContent = `${account.username} is now ${target.role}.`;
      });
      roleCell.append(roleSelect);

      removeButton.type = 'button';
      removeButton.className = 'remove-button';
      removeButton.textContent = account.username === username ? 'Signed in' : 'Remove';
      removeButton.disabled = account.username === username;
      removeButton.setAttribute('aria-label', `Remove account ${account.username}`);
      removeButton.addEventListener('click', () => {
        const latestAccounts = JSON.parse(localStorage.getItem(accountsKey) || '[]');
        const target = latestAccounts.find((entry) => entry.username === account.username);
        const adminCount = latestAccounts.filter((entry) => entry.role === 'admin').length;

        if (target.role === 'admin' && adminCount <= 1) {
          accountsMessage.textContent = 'The last admin account cannot be removed.';
          return;
        }

        localStorage.setItem(
          accountsKey,
          JSON.stringify(latestAccounts.filter((entry) => entry.username !== account.username))
        );
        accountsMessage.textContent = `Account ${account.username} removed.`;
        renderAccounts();
      });
      actionCell.append(removeButton);
      row.append(nameCell, roleCell, actionCell);
      accountsList.append(row);
    });
  };

  statsForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(statsForm);
    ['students', 'teachers', 'classes', 'years'].forEach((key) => {
      settings[key] = Number(formData.get(key));
    });
    saveSettings();
    statsMessage.textContent = 'School figures saved. They are now shown on the homepage in this browser.';
  });

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(contactForm);
    settings.contact = {
      phone: String(formData.get('phone')).trim(),
      email: String(formData.get('email')).trim(),
      location: String(formData.get('location')).trim(),
    };
    saveSettings();
    contactMessage.textContent = 'Contact information saved. It is now shown on the site in this browser.';
  });

  document.querySelector('#pathway-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const pathway = String(new FormData(form).get('pathway')).trim();
    if (!pathway || settings.pathways.some((existing) => existing.toLowerCase() === pathway.toLowerCase())) {
      pathwaysMessage.textContent = 'Enter a pathway name that is not already listed.';
      return;
    }
    settings.pathways.push(pathway);
    saveSettings();
    form.reset();
    pathwaysMessage.textContent = 'Pathway added.';
    renderPathways();
  });

  document.querySelector('#account-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const newUsername = String(formData.get('username')).trim().toLowerCase();
    const password = String(formData.get('password'));
    const role = String(formData.get('role'));
    const storedAccounts = JSON.parse(localStorage.getItem(accountsKey) || '[]');

    if (storedAccounts.some((account) => account.username === newUsername)) {
      accountsMessage.textContent = 'That username is already in use.';
      return;
    }

    storedAccounts.push({ username: newUsername, password, role });
    localStorage.setItem(accountsKey, JSON.stringify(storedAccounts));
    form.reset();
    accountsMessage.textContent = `Account ${newUsername} created as ${role}.`;
    renderAccounts();
  });

  document.querySelector('#logout-button').addEventListener('click', () => {
    sessionStorage.removeItem(sessionKey);
    window.location.assign('login.html');
  });

  renderPathways();
  renderAccounts();
}

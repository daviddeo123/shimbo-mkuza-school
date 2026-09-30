# Shimbo Mkuza Secondary School Website

A responsive, static school website built with HTML, CSS, and vanilla JavaScript. It includes separate pages for the school's main sections and a browser-only admin prototype for editing selected website content.

## Pages

- `index.html` — Home page and school highlights
- `about.html` — School introduction and values
- `academics.html` — Academic pathways
- `students.html` — Student life activities
- `news.html` — News and events
- `gallery.html` — Filterable image gallery
- `contact.html` — Contact information
- `login.html` — Admin sign-in
- `admin.html` — Admin portal

Shared styles are in `css/style.css` and `css/admin.css`. Page behavior is in `js/app.js`, `js/auth.js`, and `js/admin.js`.

## Viewing the Website

Open `index.html` in a browser, or serve the project folder with a local static web server and open its local address. A local server is recommended so all pages share browser storage consistently.

For example, if Python is installed:

```powershell
python -m http.server 8000
```

Then visit `http://localhost:8000/`.

## Admin Prototype

Open `login.html` and use the initial demo account:

- **Username:** `shimbomkuzasec`
- **Password:** `shimbomkuza`

The admin portal allows admins to:

- Edit student, teacher, class, and years-of-excellence figures
- Add and remove academic pathways
- Edit the phone, email, and location displayed in the site footer and contact page
- Create accounts, assign or change the admin role, and remove accounts

These values are saved to the browser's `localStorage` and are displayed on the public pages in that browser.

> **Security warning:** This is a front-end demo, not secure authentication. Credentials, roles, and content are stored in browser storage and can be inspected or modified by visitors. Do not use it to protect real accounts or confidential school information. A production deployment needs a server, database, and server-side authentication and authorization.

## Content Placeholders

The school contact information and some school figures are placeholders. Replace them with verified details before publishing. News copy and images are examples/placeholders and should also be checked and replaced with accurate school content.

## Customization

- Update colors, layout, and responsive styles in `css/style.css`.
- Update admin/login appearance in `css/admin.css`.
- Update public navigation, page content, and footer in the HTML files.
- Update public page interactions in `js/app.js`.
- Update prototype login and admin behavior in `js/auth.js` and `js/admin.js`.

The site footer includes the requested credit: **Made by David Deo Mbasa 2026**.

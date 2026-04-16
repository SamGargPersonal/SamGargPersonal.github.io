# CLAUDE.md — OmniTax Professionals Website
**Last updated: 2026-03-30**

---

## MANDATORY — Read First Every Session

> **`changelog.md` is the Holy Grail.** Before writing a single line of code, read `changelog.md`
> in the project root. It is the authoritative, chronological record of every feature, fix,
> architectural decision, and pending item. Start there. Always append your session's changes at the top.


---

## Build & Run

```bash
# Serve locally (requires Node.js)
npx serve .

# Alternatively (Python)
python -m http.server 8080
```

> Open `http://localhost:3000` (serve) or `http://localhost:8080` (Python).
> No build step — this is a static Vanilla HTML/CSS/JS project.

---

## Tech Stack

| Layer        | Technology                              |
|--------------|-----------------------------------------|
| Markup       | HTML5 (semantic, ARIA-labelled)         |
| Styles       | CSS3 — custom properties, Flex, Grid    |
| Scripts      | Vanilla JS (ES6+), no frameworks        |
| Auth         | Firebase v10+ (modular SDK)             |
| Storage      | Firebase Firestore                      |
| Documents    | SharePoint REST API (via OAuth2 token)  |
| Hosting      | TBD (Firebase Hosting recommended)      |

---

## Brand & Color Palette

```css
--omni-green:        #518465;
--omni-green-dark:   #013220;
--omni-green-mid:    #3e6b51;
--omni-green-light:  #5e9472;
--omni-gold:         #D4AF37;
--omni-gold-light:   #e6c94e;
--omni-gold-dark:    #b09228;
--omni-gold-subtle:  rgba(212, 175, 55, 0.12);
```

**Typography:**
- Headings: `Playfair Display`, serif — refined, editorial premium feel
- Body: `Inter`, sans-serif — modern, clean readability
- Loaded via Google Fonts `@import` at top of `css/styles.css` (no separate HTML link needed beyond preconnect)

**Logo Rule:** `omnitaxicon.jpg` is a **horizontal rectangle**. NEVER apply `border-radius: 50%` or any circular
container to `.navbar__logo` or `.footer__logo`. Use `height` + `width: auto` + `object-fit: contain`.

**Tone:** Premium, high-trust, professional advisory. No casual language.

---

## File & Naming Conventions

### Files
- HTML pages: `kebab-case.html` (e.g., `insights.html`, `careers.html`)
- CSS: single stylesheet at `css/styles.css`
- JS modules: `js/auth.js`, `js/main.js`, `js/sharepoint.js`
- Assets: `assets/icons/`, `assets/images/`, `assets/info/`
- Docs: `docs/` (architecture markdown files)

### CSS
- BEM-style class names: `.block__element--modifier`
- Component namespaces: `.navbar`, `.hero`, `.card`, `.modal`, `.footer`
- Utility classes: `.text-gold`, `.mt-16`, `.section--green`, etc.

### JS Functions
- camelCase for all functions and variables
- Prefix Firebase functions with `fb`: e.g., `fbSignIn()`, `fbGetUserDocs()`
- Prefix SharePoint functions with `sp`: e.g., `spFetchInsights()`, `spGetUserFolder()`
- Event handlers: `handle` prefix — e.g., `handleNavToggle()`

---

## Page Map

| File             | Purpose                                      | Status      |
|------------------|----------------------------------------------|-------------|
| `index.html`     | Home — Hero, About, Values, Services, People | Built (frame) |
| `dashboard.html`    | Client login page (Firebase Auth)            | Shell only  |
| `dashboard.html` | Authenticated client document hub            | Shell only  |
| `insights.html`  | News & Insights (SharePoint PDF feed)        | Shell only  |
| `careers.html`   | Job listings + application form              | Shell only  |
| `changelog.md`   | Holy Grail — chronological change log (Markdown) | Built  |

---

## Architecture: Firebase → SharePoint Mapping

### Auth Flow
1. User visits `dashboard.html` → Firebase Email/Password (or SSO) login
2. On success → `firebase.auth().currentUser.uid` captured
3. Redirect to `dashboard.html`

### Firestore User Document Structure
```
/users/{uid}/
  email: string
  displayName: string
  sharepointFolder: string   ← relative path to this client's SP folder
  role: "client" | "admin"
```

### SharePoint Document Fetch
1. `dashboard.html` loads → `auth.js` checks `onAuthStateChanged`
2. If authenticated → reads Firestore `/users/{uid}` for `sharepointFolder`
3. `sharepoint.js` calls SharePoint REST API:
   `GET /_api/web/GetFolderByServerRelativeUrl('{sharepointFolder}')/Files`
4. Renders document list with download links using short-lived access tokens

### OAuth2 Token Refresh (SharePoint)
- Access token stored in memory only (not localStorage)
- Refresh logic in `js/sharepoint.js` → `spRefreshToken()`
- Token expiry handled via `401` response interceptor — re-fetches token silently
- Admin sets `sharepointFolder` paths manually via Firestore console (or future admin UI)

### Insights Feed (SharePoint)
- Public SharePoint folder: `/sites/OmniTax/Insights/`
- `spFetchInsights()` in `sharepoint.js` pulls PDF metadata (title, date, category, URL)
- Category filter values: `Income Tax`, `CGT`, `M&A`, `International`, `GST`, `Governance`, `General`
- Displayed on `insights.html` as filterable card grid

---

## Component Patterns

### Navigation (shared across all pages)
Copy the `<header>` block from `index.html`. Update the active link class (`.active`) per page.

### Footer (shared across all pages)
Copy the `<footer>` block from `index.html`. The `footerYear` script auto-sets the copyright year.

### People Modal Pattern
Each team member requires:
1. A `.people-card` element with `data-modal="modal-{id}"` and `onclick="openModal('modal-{id}')"`
2. A `.modal-overlay` element with `id="modal-{id}"`

Modal open/close JS is inline in `index.html` — will be moved to `js/main.js` once chatbot widget is added.

---

## AI Chatbot Widget
- Floating button (bottom-right), visible on all pages
- Implemented in `js/main.js`
- Answers queries about: services, team members, contact info
- Knowledge base: static JS object derived from `assets/info/` text files
- No external AI API required for MVP — upgrade path to Claude API documented in `docs/`

---

## Responsive Breakpoints

| Breakpoint | Target              |
|------------|---------------------|
| ≥ 1025px   | Desktop             |
| 769–1024px | Tablet (landscape)  |
| ≤ 768px    | Tablet + Mobile     |
| ≤ 480px    | Small mobile        |

---

## SEO & Accessibility Standards
- All pages must include: `<title>`, `<meta description>`, Open Graph tags
- All images must have descriptive `alt` attributes
- Interactive elements must have `aria-label` or visible text labels
- Modals: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`
- Navigation: `aria-label` on `<nav>`, keyboard accessible
- Color contrast: green/white and gold/green combos meet WCAG AA

---

## Outstanding Items (from todo.txt)
- [ ] Obtain final "Our Values" copy for `assets/info/our-values.txt`
- [ ] Add real team member photos and biographies
- [ ] Firebase project creation and `firebaseConfig` setup in `js/auth.js`
- [ ] SharePoint tenant URL and client credentials configured in `js/sharepoint.js`
- [ ] Confirm production domain for canonical URLs and OG tags
- [ ] Build `dashboard.html`, `dashboard.html`, `insights.html`, `careers.html`

---

## Timeline
**Draft review deadline: 19 April 2026**

# Jonathan Stock — personal website

A modern, dark, mobile-first portfolio. Plain HTML, CSS and a little JavaScript, so there is no build step.

| Page | File |
| --- | --- |
| Home | `index.html` |
| About | `about.html` |
| Projects | `projects.html` |
| Contact | `contact.html` |

Shared styles live in `assets/style.css` and behavior in `assets/script.js`.

## Run locally

```sh
npx serve .
```

Or just open `index.html` in a browser.

## Make the contact form deliver messages

The site is static, so the form needs a destination. Edit `CONTACT_CONFIG` at the top of `assets/script.js`:

- `formEndpoint`: a form-backend URL such as a [Formspree](https://formspree.io) endpoint (`https://formspree.io/f/xxxxxxxx`). Submissions arrive in your inbox.
- `mailto`: an email address. If no endpoint is set, submitting opens the visitor's mail app with the message pre-filled.

Until one is set, the form shows a "not connected yet" notice rather than silently dropping messages.

## Adding your LinkedIn background

The About page is written from your GitHub projects and coursework. To add experience, certifications or a graduation year, look for the `LINKEDIN:` comment in `about.html`.

## Deploying

Any static host works. For GitHub Pages: Settings → Pages → deploy from the branch root.

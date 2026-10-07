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

## Contact form

The site is static, so the form needs a destination. It is set in `CONTACT_CONFIG` at the top of `assets/script.js`:

- `mailto`: currently `jonathanhstock@gmail.com`. Submitting opens the visitor's mail app with the message pre-filled. The contact page also shows a plain email link as a fallback.
- `formEndpoint`: optional. Set a form-backend URL such as a [Formspree](https://formspree.io) endpoint (`https://formspree.io/f/xxxxxxxx`) to have messages POSTed and delivered to your inbox without the visitor's mail app. It takes priority over `mailto`.

## Deploying

Any static host works. For GitHub Pages: Settings → Pages → deploy from the branch root.

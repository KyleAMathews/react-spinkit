# React Spinkit website

The demo site is a small [Vite](https://vite.dev) app that renders the built
`react-spinkit` package from this workspace.

From the repository root:

```console
pnpm install
pnpm build      # build the library first; the site imports dist/
pnpm site:dev   # hot reloading dev server
pnpm site:build # production build into www/dist
```

The site is deployed to GitHub Pages by `.github/workflows/pages.yml` on every
push to `master`.

react-spinkit
=============

[![CI](https://github.com/KyleAMathews/react-spinkit/actions/workflows/ci.yml/badge.svg)](https://github.com/KyleAMathews/react-spinkit/actions/workflows/ci.yml)

A collection of loading indicators animated with CSS for React

Currently I've ported all the spinner animations from
[Spinkit](https://github.com/tobiasahlin/SpinKit). If you have other favorite
 css spinner you'd like to include, open an issue.

## Install

```console
$ npm install react-spinkit
# or
$ pnpm add react-spinkit
```

## Usage
```javascript
import Spinner from 'react-spinkit';
// or: const Spinner = require('react-spinkit');

<Spinner name='double-bounce' />
```

TypeScript types are included. Prop types are available as `Spinner.SpinnerProps`,
and spinner names as `Spinner.Name`.

See more examples on the [demo page](http://kyleamathews.github.io/react-spinkit/).

## CSS
CSS is loaded automatically when using [Webpack](http://webpack.github.io) with the
[css-loader](https://github.com/webpack/css-loader) and [style-loader](https://github.com/webpack/style-loader), or Browserify/[CSSify](https://github.com/davidguttman/cssify)
 to build your project.

## External spinners
This also includes most of the spinners from [loaders.css](https://github.com/ConnorAtherton/loaders.css). Note that while
all of the native spinners from Spinkit are contained within their bounding divs,
some of the loaders.css spinners have a zero-sized parent div and extend outward
from that (as you can see on the demos page). Regardless of this, they are all
easily centerable with flexbox.

## A CSS-aware bundler is required
The component `require()`s its CSS, so you need a bundler that can handle CSS
imports from `node_modules`, such as Webpack, Vite, or Browserify. If you'd
like support for other build tools, PRs are welcome.

## Fades in spinners after one second
According to [research by Jakob Nielsen](http://www.nngroup.com/articles/response-times-3-important-limits/),
feedback after user operations isn't necessary for about a second so by
default, react-spinkit will fade in your spinner at one second. Nevertheless,
you can configure spinner fade-in behavior with the `fadeIn` prop, which
accepts values `full` (the default), `half`, `quarter`, and `none` for one
second, a half second, a quarter second, and no fade in, respectively.
For example: `<Spinner fadeIn='half' />`.

## PropTypes
* **name**—specify spinner to use (defaults to `three-bounce`).
* **fadeIn**-set the time before the spinner fades in.
* **overrideSpinnerClassName**—change the default `sk-spinner` className.
* **className**-add a custom classname to the outer div.
* **color**-programmatically set the color of the spinners; this can either be a
hex value or a color word.

## Server-side rendering and loading CSS yourself
If you want to use this for server-side rendering, set
`process.env.REACT_SPINKIT_NO_STYLES` in your server build environment,
in webpack via `webpack.DefinePlugin`, or whatever is appropriate to your
build process. This will skip the import of styles and allow evaluation of
the SpinKit code in node. Any non-empty value counts as set, including
`"false"` and `"0"`; leave it unset or empty to load the styles.

To skip the bundled CSS entirely (for example in a server bundle that can't
process CSS imports, or if you want to provide your own styles), import the
unstyled entry point instead:

```javascript
import Spinner from 'react-spinkit/dist/unstyled';
```

## Demo and documentation
https://kyleamathews.github.io/react-spinkit/

## Development
This repo uses [pnpm](https://pnpm.io) (see `packageManager` in
`package.json`; run `corepack enable` to get the right version) and Node 22+.

```console
$ pnpm install
$ pnpm test        # Vitest + Testing Library
$ pnpm lint        # ESLint
$ pnpm typecheck   # TypeScript
$ pnpm build       # tsc -> dist/ (CommonJS + .d.ts)
$ pnpm test:dist   # smoke-test the built CommonJS entry point
$ pnpm check       # all of the above
$ pnpm site:dev    # run the demo site (www/) locally
```

To release: `pnpm version <patch|minor|major>`, `git push --follow-tags`,
then `pnpm publish` (which runs `pnpm check` first).

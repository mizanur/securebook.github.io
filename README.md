# [Secure Book](https://securebook.org/) [![Build Status](https://travis-ci.com/securebook/securebook.github.io.svg?branch=development)](https://travis-ci.com/securebook/securebook.github.io) [![Coverage Status](https://coveralls.io/repos/github/securebook/securebook.github.io/badge.svg?branch=development)](https://coveralls.io/github/securebook/securebook.github.io?branch=development)

Secure Book is a free private note-taking web application. It provides convenient note editing and encrypted storage using **aes-256** standard. Production version of this application is running on https://securebook.org/. This repository is the source code of the application.

## Want to suggest a feature?

[Open an issue on Github](https://github.com/securebook/securebook.github.io/issues) with an "enhancement" tag. Feel free to submit pull requests if you'd like to contribute.

## How to develop this application

This project uses [Yarn PnP](https://classic.yarnpkg.com/en/docs/pnp/) and includes the yarn version within the repo, but you will still need Yarn 2+ to run it.

```
git clone https://github.com/securebook/securebook.github.io.git securebook
cd securebook
yarn
yarn run start
```

To launch debugging in the Firefox, you can use the provided VSCode's launch configuration `Debug Firefox`.

## How to test

There's two ways to test

1. `yarn run test` to run all tests
2. Using the provided VSCode's launch configuration `Debug current test`, you can run test file currently open in VSCode. It's very useful for doing TDD.

## How to do a production build

Production builds and deployment to Github pages is performed via [Travis CI](https://travis-ci.com/securebook/securebook.github.io). However, if you'd like to do a build manually, you can do the following:

1. Create file `.prod-configs/Gitlab.js` with content
   ```js
   module.exports = {
   	apiUri: `${your.gitlab.api.uri}`,
   	oAuthUri: `${your.gitlab.oauth.uri}`,
   	oAuthClientId: `${your.gitlab.oauth.client.id}`,
   	oAuthRedirectId: `${your.gitlab.oauth.redirect.id}`,
   };
   ```
   And provide your values. You can follow the same format as a test example in `src/configs/Gitlab.ts`.
2. `yarn run build`. The result will appear in `.build`, which you can deploy.

## A couple of technical details

* **aes-256** encryption is performed in a separate worker.
* React-like library [**Preact**](https://preactjs.com/) is used for overall rendering.
* A *truly stellar* content editing library [**ProseMirror**](https://prosemirror.net/) is used to implement the main editor.
* My other library [**typeconnect**](https://github.com/guitarino/typeconnect) is used for global state.
* The Web App is 100% front-end, client rendered. Gitlab is used as a back-end server by creating a private `secure-book-notes` repository and using Gitlab API to store / retrieve files.

## Architecture

The app consists of various modules that communicate via interfaces defined in:

```
src
└ interfaces
└ editor
  └ interfaces
```

Interfaces can only depend on other interfaces; they cannot depend on any other folders.

---

Business logic of the application should only be located in 2 folders:

```
src
└ data
└ modules
```

`data` is for factory functions that represent data in the app. Usually, each file represents a piece of global state in the app, but it doesn't have to. The only requirements is that each file contains factory functions for data.

`modules` contains single-responsibility modules that define the logic of the app. Usually, each file is a class that takes data, other modules that it needs, and can operate on the data and depend on other modules' functionality.

Both `data` and `modules` are "clean". They must be independent of a browser environment and independent of the view layer. Each file in folders `data` and `modules` can only depend on `src/interfaces` and on relevant to the module external libraries. Finally, `data` and `modules` are the only folders that should be tested (ideally, completely tested).

---

Then, there's

```
assets
src
└ components
└ styles
└ styles-mixins
└ fonts
└ view
└ editor
```

These folder together contain the view layer of the app.

`components` is for Preact components only.

`styles` is for styling the components.

`styles-mixins` is for mixins and variables that relate to styling.

`assets` is for images and similar assets. `fonts` is for fonts and icons.

`view` folder is for anything related to view. Usually it contains Preact context, Preact hooks, data factories and modules only pertinent to the view layer.

`editor` is simply a subset of the view layer, separated into its own folder. This subset is for the logic of the content editor. You may notice it has its own interfaces, nodes, marks, plugins.

Each module in these folders should ideally communicate with other modules via interfaces, though there are a few reasonable exceptions with direct dependency. Of course, dependency on relevant external libraries is allowed.

These folders are only tested visually and don't have proper unit tests. Therefore, there should be an effort to reduce code in these folders as much as possible in favour of the view-independent and testable business logic in `data` and `modules`.

---

All of the aforementioned folders (except interfaces) may also depend on utils

```
src
└ utils
└ editor
  └ utils
```

Utilities are not independently tested - some of them are tested indirectly in `data` or `modules` folders.

---

Majority of the files in the app are independent modules that communicate via interfaces. This architecture follows dependency inversion principle and encourages single responsibility for each module. An example benefit of this architecture: any file storage other than Gitlab provider may be added with little effort, since modules simply rely on `Filesystem` interface. You may create an app that stores the notes locally on your computer, in the browser, on Github, etc.

There's two important factories that actually connect all of the logic in all of the modules of the app:

```
src
└ editor
  └ createEditor.ts
└ view
  └ createApp.ts
```

These two factories are not meant to have a lot of logic, they're meant to simply connect all the modules together.

## LICENSE

[MIT](https://github.com/securebook/securebook.github.io/blob/development/LICENSE) for the source code

[CC Attribution-NonCommercial](https://github.com/securebook/securebook.github.io/blob/development/assets/original/LICENSE) for original assets
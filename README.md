# @blockamotolabs/react-bitmap-utils

## Contributing

If you plan on contributing to this project please make sure your code conforms to our defined standards, and therefore passes all linting, type-checking, formatting and unit tests.

When your code is complete (and passing all linting/tests) you should open a pull requests against the `main` branch. Please give a detailed explanation of the change, why it is necessary, and include screenshots of both desktop and mobile devices if it is a visual change.

If your branch is out of date from the `main` branch please update it and fix any conflicts.

If you add any dependencies please justify why the dependency was necessary.

We reserve the right to deny any pull requests that do not meet any of the aforementioned standards, or that we do not believe are in the best interest of the project.

### Setup

Fork the repository and create a new branch from the `main` branch.

Branch names should only contain letters, numbers, and dashes. Do not include spaces or other symbols.

Make sure you are running a version of node matching that in the [`.nvmrc`](.nvmrc) file.

If you use NVM you can simply run:

```shell
nvm use
```

Install dependencies:

```shell
npm ci
```

### Dev server

To run the dev server run:

```shell
npm run dev
```

You can then access this at [http://localhost:8080](http://localhost:8080)

## Tests, linting, type-checking and formatting

You can run all of the checks with:

```shell
npm test
```

Or individual checks with any of the following:

```shell
npm run typecheck
npm run format-check
npm run lint
npm run tests
```

We use prettier for formatting, so if you have an equivalent extension in your editor you may be able to have it automatically format your code on paste/save.

Similarly we use eslint for linting, so if you have an equivalent extension in your editor you may be able to have it automatically fix issues in your code on paste/save.

If you don't want to use an editor extension for either of these:

- prettier - you can run `npm run format` to format all files
- eslint - you can run `npm run lint -- --fix` to fix some issues - others will need to be fixed manually

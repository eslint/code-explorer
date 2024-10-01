# ESLint Code Explorer

## Overview

This repository contains the source code for the ESLint [Code Explorer](https://explorer.eslint.org). Code Explorer is designed to help developers explore and understand source code to aid in the creation of creating custom ESLint rules. Each language supported by Code Explorer exposes the same information that ESLint rules have access to.

At a minimum, each language displays the AST for any code that is entered into the editor. You can toggle different parser settings for each language to see how that affects the AST. For JavaScript, you also get to see scope and code path information.

## Installation

To install and set up the project, follow these steps:

1. Ensure you have Node.js v20 installed. You can download it from the [official Node.js website](https://nodejs.org/).
2. Clone the repository to your local machine.
3. Install the project dependencies using npm - `npm install`.

This will install all the necessary packages and dependencies required to run the project.

Once the installation is complete, you can proceed to the next section to get started with running the development server.

## Usage

Run the development server with `npm run start`.

Open [http://localhost:5173](http://localhost:5173) with your browser to see the result.

## Scripts

-   `npm run start`: Starts the development server.
-   `npm run build`: Builds the app for production.

## Configuration

-   The app is configured to use ESLint for linting JavaScript code, with its configuration stored in the `eslint.config.mjs` file.
-   The app is also configured to use Prettier for code formatting, with its configuration stored in the `.prettierrc` file.

## License

Apache 2.0

## Credits

-   [AST Explorer](https://astexplorer.net) - the original AST visualization tool. We took great inspiration from AST explorer when creating this tool.
-   [escope Demo](http://mazurov.github.io/escope-demo/) - the original demo of the [escope](https://github.com/estools/escope) utility that [`eslint-scope`](https://github.com/eslint/js/tree/main/packages/eslint-scope) utility is based on.

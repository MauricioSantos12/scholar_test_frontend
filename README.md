# Scholar Test Frontend

This is the frontend of the Scholar Test application, built with React and Vite.

## Overview

The Scholar Test application is a web-based platform for creating and managing tests, areas, components, questions, and answers. The application also includes a dashboard for administrators to manage all the content and complete tests.

## Features

- Fast Refresh with [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react)
- ESLint rules with type-aware lint rules enabled
- TypeScript for type safety and better development experience
- Uses [Chakra UI](https://chakra-ui.com/) for a consistent and accessible design system
- Uses [React Router](https://reactrouter.com/) for client-side routing
- Uses [Redux Toolkit](https://redux-toolkit.js.org/) for state management
- Includes a dashboard for administrators to manage all the content and complete tests

## Components

The application includes the following components:

- Tests: A test is a collection of questions and answers.
- Areas: An area is a category for tests.
- Components: A component is a sub-category for areas.
- Questions: A question is a part of a test.
- Answers: An answer is a part of a question.

## Dashboard

The dashboard includes the following features:

- Test Management: Administrators can create, read, update, and delete tests.
- Area Management: Administrators can create, read, update, and delete areas.
- Component Management: Administrators can create, read, update, and delete components.
- Question Management: Administrators can create, read, update, and delete questions.
- Answer Management: Administrators can create, read, update, and delete answers.

## Development

To start developing, run `npm install` and then `npm run dev`. This will start the development server and open the app in your default web browser.

## Building

To build the app, run `npm run build`. This will create a production-ready build of the app in the `dist` directory.

## Deployment

To deploy the app, run `npm run deploy`. This will create a production-ready build of the app in the `dist` directory and then deploy it to GitHub Pages.

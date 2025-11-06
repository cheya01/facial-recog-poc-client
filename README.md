# Facial Recognition POC Client

A Visitor Management System (VMS) client application built with Angular that uses facial recognition for visitor registration and verification.

## Features

- **Visitor Registration**: Register new visitors with photo capture (webcam or file upload)
- **Visitor Verification**: Verify visitors using facial recognition
- **Visitor Search**: Search and view visitors by scheduled date
- **Mobile Support**: Responsive design with mobile camera support

## Prerequisites

- Node.js (v18 or higher)
- Angular CLI (v20.3.8)
- Backend API running on `http://localhost:3000` (configurable via environment variables)

## Installation

```bash
npm install
```

## Environment Setup

### Local Development

1. Copy the environment template files:
   ```bash
   cp src/environments/environment.template.ts src/environments/environment.ts
   cp src/environments/environment.template.ts src/environments/environment.prod.ts
   ```

2. Update `src/environments/environment.ts` with your local backend URL:
   ```typescript
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:3000'
   };
   ```

3. Update `src/environments/environment.prod.ts` with your production settings:
   ```typescript
   export const environment = {
     production: true,
     apiUrl: '${NG_APP_API_URL}' // Will be replaced during build
   };
   ```

### Vercel Deployment

1. **Import your repository to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import your GitHub repository

2. **Configure Environment Variables**
   - In Vercel project settings, go to "Environment Variables"
   - Add the following variable:
     - **Name**: `NG_APP_API_URL`
     - **Value**: Your production backend API URL (e.g., `https://your-api.com`)
     - **Environment**: Production (and Preview if needed)

3. **Deploy**
   - Vercel will automatically build and deploy using `npm run build:vercel`
   - The build script will replace `${NG_APP_API_URL}` with your actual API URL

### Environment Variables Reference

Create a `.env` file for local development (optional):
```bash
cp .env.example .env
```

Edit `.env` with your local settings.

## Configuration

The API URL is configured via environment variables:
- **Development**: Set in `src/environments/environment.ts`
- **Production**: Set via `NG_APP_API_URL` environment variable in Vercel

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

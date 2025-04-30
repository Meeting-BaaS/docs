# Transcript Seeker, the open-source transcription playground

Documentation for the Transcript Seeker transcription playground.

## Authentication

### Source: ./content/docs/transcript-seeker/concepts/api/authentication.mdx


Transcript Seeker requires authentication for calendar functionality, leveraging Better-Auth for secure access. Currently, it only supports Google Calendar with Google authentication, but Microsoft Calendar support may be added in a future update.

## Google Authentication

```js
console.log('Hello World');
```


---

## Database

### Source: ./content/docs/transcript-seeker/concepts/api/database.mdx


**Transcript Seeker requires a database connection to store user data.** This is essential for managing calendar integration, which uses Better-Auth to store user information securely.

The current setup utilizes Drizzle ORM for database management, where it will store information like user details, sessions, and more.

<Callout>
  This applies specifically to the calendar feature. Other user data is stored
  locally in the browser using PGLite. To learn more, visit our [web database
  documentation](/docs/transcript-seeker/concepts/web/database).
</Callout>

## Database Configuration

To get started, set up a PostgreSQL-compatible database. We recommend using Turso for this purpose. Follow this [guide](/docs/transcript-seeker/guides/turso) for detailed steps on setting up a Turso database.

## Database Migration

To run a database migration, use the following commands:

```bash
cd apps/api
pnpm db:push
```

## Database Studio

To visualize the data in a user-friendly interface, use the command below:

```bash
cd apps/api
pnpm db:studio
```


---

## Architecture

Learn more about the architecture of Transcript Seeker.

### Source: ./content/docs/transcript-seeker/concepts/architecture.mdx


Understanding the architecture of Transcript Seeker is crucial for both setting up and deploying Transcript Seeker. Below is a diagram illustrating the core components:

<ImageZoom
  src={'/assets/architecture.svg'}
  width={1024}
  height={1024}
  className="dark:invert"
  rmiz={{
    classDialog: 'dark:[&_img]:invert',
  }}
/>


---

## Environment Variables

Configuring Environment Variables for Transcript Seeker.

### Source: ./content/docs/transcript-seeker/concepts/environment-variables.mdx


Let's learn how to configure environment variables for Transcript Seeker.
Transcript Seeker uses `dotenv-cli` to load the environment variables, making it easy for development.
Transcript Seeker follows this structure for different environments:

- `.env.development.local` for development
- `.env.production.local` for production

You can load a specific environment file by running the following command:

```bash title="Terminal"
export NODE_ENV="development"
```

Now, let's configure the environment variables.

## Client

Create a `.env.development.local` file in the below directory of your project and add the following environment variables:

<Files>
  <Folder name="apps">
    <Folder name="api" defaultOpen>
        <File name="..." />
      <File name=".env.development.local" />
    </Folder>
    <Folder name="proxy" defaultOpen>
        <File name="..." />
      <File name=".env.development.local" />
    </Folder>
    <Folder name="web">
      <File name="..." />
    </Folder>
  </Folder>
  <Folder name="packages">
    <Folder name="db" defaultOpen>
          <File name="..." />

    </Folder>
    <Folder name="shared" defaultOpen>
          <File name="..." />
    </Folder>
    <Folder name="ui" defaultOpen>
      <File name="..." />
    </Folder>

  </Folder>
  <Folder name="tooling">
    <Folder name="eslint" defaultOpen>
          <File name="..." />

    </Folder>
    <Folder name="github" defaultOpen>
          <File name="..." />
    </Folder>
    <Folder name="prettier" defaultOpen>
      <File name="..." />
    </Folder>
        <Folder name="tailwind" defaultOpen>
      <File name="..." />
    </Folder>
        <Folder name="typescript" defaultOpen>
      <File name="..." />
    </Folder>

  </Folder>
  <File name=".env.development.local" className="bg-fd-accent" />
  <File name="package.json" />
</Files>

<Steps>
<Step>
### Vite Port Configuration

These values are used by vite to configure the url the server listens on.

```txt title=".env.development.local"
VITE_CLIENT_PORT=5173
VITE_CLIENT_HOST=0.0.0.0
```

</Step>

<Step>
### Proxy Configuration

This Proxy URL is used to forward requests from the client to the respective server, helping to avoid client-side CORS errors. An example proxy server is provided in the repository.

```txt title=".env.development.local"
VITE_PROXY_URL=http://localhost:3000
```

</Step>

<Step>
### API Configuration

This API URL is used by the calendars functionality of Transcript Seeker. It allows the app to perform authentication and retrieve the user's calendar data.

```txt title=".env.development.local"
VITE_API_URL=http://localhost:3001
```

</Step>

<Step>
### S3 Configuration

This environment variable is used to indicate to the client where the video recordings are stored.

```txt title=".env.development.local"
VITE_S3_PREFIX=https://s3.eu-west-3.amazonaws.com/meeting-baas-video
```

</Step>
</Steps>

## Proxy

Create a `.env.development.local` file in the below directory of your project and add the following environment variables:

<Files>
  <Folder name="apps" defaultOpen>
    <Folder name="api" >
        <File name="..." />
      <File name=".env.development.local" />
    </Folder>
    <Folder name="proxy" defaultOpen>
        <File name="..." />
      <File name=".env.development.local"   className="bg-fd-accent"  />
    </Folder>
    <Folder name="web">
      <File name="..." />
    </Folder>
  </Folder>
  <Folder name="packages">
    <Folder name="db" defaultOpen>
          <File name="..." />

    </Folder>
    <Folder name="shared" defaultOpen>
          <File name="..." />
    </Folder>
    <Folder name="ui" defaultOpen>
      <File name="..." />
    </Folder>

  </Folder>
  <Folder name="tooling">
    <Folder name="eslint" defaultOpen>
          <File name="..." />

    </Folder>
    <Folder name="github" defaultOpen>
          <File name="..." />
    </Folder>
    <Folder name="prettier" defaultOpen>
      <File name="..." />
    </Folder>
        <Folder name="tailwind" defaultOpen>
      <File name="..." />
    </Folder>
        <Folder name="typescript" defaultOpen>
      <File name="..." />
    </Folder>

  </Folder>
  <File name=".env.development.local" />
  <File name="package.json" />
</Files>

<Steps>
<Step>
### MeetingBaas Proxy Configuration

These values are used by the api to figure out the api url for baas servers.

```txt title=".env.development.local"
MEETINGBAAS_API_URL="https://api.meetingbaas.com"
MEETINGBAAS_S3_URL="https://s3.eu-west-3.amazonaws.com/meeting-baas-video"
```

</Step>
</Steps>

## API

Create a `.env.development.local` file in the below directory of your project and add the following environment variables:

<Files>
  <Folder name="apps" defaultOpen>
    <Folder name="api" defaultOpen>
        <File name="..." />
      <File name=".env.development.local"  className="bg-fd-accent" />
    </Folder>
    <Folder name="proxy">
        <File name="..." />
      <File name=".env.development.local" />
    </Folder>
    <Folder name="web">
      <File name="..." />
    </Folder>
  </Folder>
  <Folder name="packages">
    <Folder name="db" defaultOpen>
          <File name="..." />

    </Folder>
    <Folder name="shared" defaultOpen>
          <File name="..." />
    </Folder>
    <Folder name="ui" defaultOpen>
      <File name="..." />
    </Folder>

  </Folder>
  <Folder name="tooling">
    <Folder name="eslint" defaultOpen>
          <File name="..." />

    </Folder>
    <Folder name="github" defaultOpen>
          <File name="..." />
    </Folder>
    <Folder name="prettier" defaultOpen>
      <File name="..." />
    </Folder>
        <Folder name="tailwind" defaultOpen>
      <File name="..." />
    </Folder>
        <Folder name="typescript" defaultOpen>
      <File name="..." />
    </Folder>

  </Folder>
  <File name=".env.development.local" />
  <File name="package.json" />
</Files>

<Steps>
<Step>
### MeetingBaas Configuration

These values are used by the api to figure out the api url for baas servers.

```txt title=".env.development.local"
NITRO_MEETINGBAAS_API_URL="https://api.meetingbaas.com"
NITRO_MEETINGBAAS_S3_URL="https://s3.eu-west-3.amazonaws.com/meeting-baas-video"
NITRO_TRUSTED_ORIGINS="http://localhost:5173" # comma separated list of trusted origins
```

</Step>

<Step>
### Google Authentication Configuration

These values are used by the api to perform google authentication. Please follow the [guide](/docs/transcript-seeker/concepts/api/authentication) for more details:

```txt title=".env.development.local"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

</Step>

<Step>
### Turso Database Configuration

These values are used by the api to store user autehtncation data. Please follow the [guide](/docs/transcript-seeker/concepts/api/database) for more details:

```txt title=".env.development.local"
TURSO_DATABASE_URL=""
TURSO_AUTH_TOKEN=""
```

</Step>

<Step>
### Authentication Configuration

<Callout>
  When deploying to Google Cloud Run with a custom domain, you should set the
  `BETTER_AUTH_URL` environment variable to the custom domain.
</Callout>

These values are used by the api to perform authentication. Please follow the [guide](/docs/transcript-seeker/concepts/api/authentication) for more details:

```txt title=".env.development.local"
BETTER_AUTH_SECRET=""
BETTER_AUTH_URL="http://localhost:3001"
API_TRUSTED_ORIGINS="http://localhost:5173"
```

<Callout>
  The `API_TRUSTED_ORIGINS` is not only used for authentication but also for
  CORS configuration.
</Callout>

</Step>

</Steps>


---

## Database

### Source: ./content/docs/transcript-seeker/concepts/web/database.mdx


**Transcript Seeker** uses a PGLite database to store data, which is essential for its functionality. PGLite enables us to run PostgreSQL in the browser, allowing secure storage of user data. We use **Drizzle ORM** with PGLite to handle data management efficiently.

<Callout>
  This setup is used to store meeting data, API keys, and more. To learn more
  about how authentication data is stored for calendars, visit [this
  page](/docs/transcript-seeker/concepts/api/database).
</Callout>

## Database Migration

To migrate the database after making changes, run the following commands:

```bash
pnpm db:generate
pnpm db:migrate
```

## Cleaning Migrations

To remove all migrations, use the following commands:

```bash
cd packages/db
rm -rf drizzle drizzle_ts
```


---

## Installation

Learn how to configure Transcript Seeker.

### Source: ./content/docs/transcript-seeker/getting-started/installation.mdx


<Steps>
<Step>
### Clone the Repo

Create a new app with `create-turbo`, it requires Node.js 20+.

<Tabs groupId='package-manager' persist items={['npm', 'pnpm', 'yarn']}>

```bash tab="npm"
npx create-turbo@latest -e https://github.com/Meeting-Baas/transcript-seeker
```

```bash tab="pnpm"
pnpm dlx create-turbo@latest -e https://github.com/Meeting-Baas/transcript-seeker
```

```bash tab="yarn"
yarn dlx create-turbo@latest -e https://github.com/Meeting-Baas/transcript-seeker
```

</Tabs>

It will ask you the following questions:

- Which package manager would you like to use? PNPM

<Callout type="warn">
  Use pnpm as the package manager or the installation will fail.
</Callout>

</Step>

<Step>
### Configure Environment Variables

Copy the `.env.example` file to a `.env.development.local` file in the following folders within your project structure and add the necessary environment variables:

To learn more about configuring the environment variables, follow this [guide](/docs/transcript-seeker/concepts/environment-variables).

<Files>
  <Folder name="apps" defaultOpen>
    <Folder name="api" defaultOpen>
      <File name=".env.development.local" />
    </Folder>
  </Folder>
  <Folder name="apps" defaultOpen>
    <Folder name="proxy" defaultOpen>
      <File name=".env.development.local" />
    </Folder>
  </Folder>
  <File name=".env.development.local" />
  <File name="package.json" />
</Files>

After setting up the environment files, execute the following command to set the environment to development mode:

```bash title="Terminal"
export NODE_ENV="development"
```

</Step>

<Step>
### Run the App

Now, start the development server:

<Tabs groupId='package-manager' persist items={['pnpm', 'npm', 'yarn']}>

```bash tab="pnpm"
pnpm turbo run dev
```

```bash tab="npm"
npm run dev
```

```bash tab="yarn"
yarn run dev
```

</Tabs>

<Callout border={false} type="warning">

If `pnpm run dev` doesn't work, you can try the following:

<Tabs groupId='package-manager' persist items={['pnpm', 'npm', 'yarn']}>

```bash tab="pnpm"
pnpm add turbo --global
turbo dev
```

```bash tab="npm"
npm install turbo --global
turbo dev
```

```bash tab="yarn"
yarn install turbo --global
turbo dev
```

</Tabs>
</Callout>
</Step>
</Steps>


---

## Contributing

Contributing to Transcript Seeker

### Source: ./content/docs/transcript-seeker/guides/contributing.mdx


Hey there! 👋 Welcome to the **Transcript-Seeker** project! We're absolutely thrilled that you're interested in contributing. Whether you're fixing a bug, adding a feature, or sharing an idea, your efforts help make our project better and more useful for everyone. Here are some easy-to-follow guidelines to help you dive in!

## Table of Contents

- [Issues](#issues)
- [Pull Requests](#pull-requests)
- [Local Setup](#local-setup)
- [Environment Variables](#environment-variables)
- [Conventional Commits](#conventional-commits)
- [Code Formatting](#code-formatting)

## Issues

Have you found a bug, got a suggestion, or stumbled upon something that doesn't work as expected? No problem! Feel free to [open an issue](https://github.com/Meeting-Baas/transcript-seeker/issues). When submitting an issue, try to include a clear and concise title and as many details as possible. The more info you provide, the faster we can jump in and help!

## Pull Requests

We love pull requests! 🎉 If you'd like to make a contribution, whether it’s a bug fix, a feature, or a small improvement, follow these steps:

1. **Fork the repo** to your GitHub account.
2. **Create a new branch** with a meaningful name:
   - For bug fixes: `fix/issue-123-bug-description`
   - For new features: `feat/awesome-new-feature`
3. Make your changes, and make sure you follow our [Conventional Commits](#conventional-commits) guidelines.
4. **Push your branch** to your forked repository.
5. Open a **pull request** from your branch to the `main` branch of this repo.
6. Before submitting, make sure your code is clean by running:
   ```bash
   pnpm typecheck
   ```
   This will help catch any issues early on. 🚀

## Local Setup

Ready to jump into the code? Awesome! Please follow this [guide](/docs/transcript-seeker/getting-started/installation) to get started.

## Environment Variables

To learn more about configuring the environment variables, follow this [guide](/docs/transcript-seeker/concepts/environment-variables).

## Conventional Commits

We use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) to keep our commit history clean and organized. It makes it easier for everyone to understand what's been done at a glance. Commit messages should use the following format:

```
<type>(<scope>): <description>
```

For example:

- `feat(homepage): redesign the layout`
- `fix(styles): correct position of server status`

Some common commit types:

- `feat`: A new feature.
- `fix`: A bug fix.
- `docs`: Documentation changes.
- `style`: Code style changes (formatting, missing semicolons, etc.).

## Code Formatting

To keep the codebase consistent and readable, we recommend running a few checks before opening a pull request:

1. **Lint fixes**:

   ```bash
   pnpm lint:fix
   ```

2. **Run type checks** to ensure there are no type issues:
   ```bash
   pnpm typecheck
   ```

Your code should be well-tested, clear, and follow our best practices. Remember, every contribution makes a difference, and we deeply appreciate your help in making **Transcript-Seeker** better! 🎉

Thanks a ton for contributing, and welcome aboard! If you need any help, don’t hesitate to ask. Let’s make something amazing together. 🚀


---

## Firebase

Learn how to deploy Transcript Seeker to Firebase.

### Source: ./content/docs/transcript-seeker/guides/deployment/firebase.mdx


## Setup

Before deploying to Firebase, you need to configure the `.env.production.local` files for each app.
Please follow this [guide](/docs/transcript-seeker/concepts/environment-variables) to set up environment variables.

Change the `NODE_ENV` to `production` in the terminal:

```bash title="Terminal"
export NODE_ENV="production"
```

### Firebase Hosting

For more information on Firebase Hosting, refer to the official [Firebase Hosting Documentation](https://firebase.google.com/docs/transcript-seeker/hosting).

<Steps>

<Step>

### Create a Firebase Project

If not already, create a Firebase project in the Firebase Console:

1. Create a project named **Transcript Seeker**.
2. Then, create a new web app:
   - `transcript-seeker-proxy`: Replace `transcript-seeker-proxy` in `firebase.json` and `.firebaserc` with this new ID.
3. Navigate to **Hosting** and click "Get Started."
4. Finally, Replace `transcript-seeker-bdc29` in `firebase.json` and `.firebaserc` with your project id. (This is for firebase hosting, when you click on get started it automatically creates a hosting project with ur app id)

</Step>

<Step>

### Install Firebase CLI Globally

Always ensure you have the latest version of the Firebase CLI installed.

<Tabs groupId='package-manager' persist items={['npm', 'pnpm', 'yarn']}>

```bash tab="npm"
npm install -g firebase-tools@latest
```

```bash tab="pnpm"
pnpm add -g firebase-tools@latest
```

```bash tab="yarn"
yarn global add firebase-tools@latest
```

</Tabs>

<Callout>
  {' '}
  Make sure to use version
  [^11.18.0](https://github.com/firebase/firebase-tools/releases/tag/v11.18.0)
  or higher to deploy `nodejs18` functions.{' '}
</Callout>

</Step>

<Step>

### Log in to Firebase

Use the Firebase CLI to log into your Firebase account.

```bash title="Terminal"
firebase login
```

</Step>

</Steps>

### Google Cloud Run

For more information on installation and the Google Cloud CLI, check out the official [Google Cloud CLI Documentation](https://cloud.google.com/sdk/docs/transcript-seeker/install#deb).

<Callout>
  If you're using the devcontainer configuration provided by this repository,
  the GCloud CLI will be automatically installed.
</Callout>

### Initialize Google Cloud CLI

This command will prompt you to log in and select the project you're working on.

```bash title="Terminal"
gcloud init
```

---

## Deployment

## Proxy Deployment

<Callout>
  You need to be on the **Blaze plan** to use Nitro with cloud functions.
</Callout>

<Steps>

<Step>

### Set Up Firebase Functions

In the Firebase Console:

1. Navigate to **Functions** and click "Get Started."

This completes the Firebase setup.

</Step>

<Step>
### Navigate to the Proxy Application Directory

```bash title="Terminal"
cd apps/proxy
```

</Step>

<Step>
### Build and Deploy

To deploy to Firebase Hosting, first build the Nitro app, then deploy:

```bash title="Terminal"
NITRO_PRESET=firebase pnpm build
firebase deploy
```

</Step>
</Steps>

---

## API Deployment

<Callout>
  The API cannot be deployed to Firebase functions. Instead, we are using Google
  Cloud Run.
</Callout>

<Steps>

<Step>
### Navigate to the Project Root

```bash title="Terminal"
cd /workspaces/transcript-seeker
```

</Step>

<Step>

### Create a Cloud Run Service

The following command will create a Cloud Run service. Modify the `SERVICE_NAME` to suit your needs.

```bash title="Terminal"
export DEPLOY_REGION="us-central1"
export SERVICE_NAME="transcript-seeker-api-prod"

gcloud run deploy "$SERVICE_NAME" \
  --image=us-docker.pkg.dev/cloudrun/container/hello \
  --region="$DEPLOY_REGION" \
  --allow-unauthenticated \
  --port=3001 \
  --set-env-vars "$(grep -v '^#' apps/api/.env.production.local | grep -v '^\s*$' | sed 's/=\s*"\(.*\)"$/=\1/' | tr '\n' ',' | sed 's/,$//')"
```

</Step>

<Step>

### Build and Deploy the Cloud Run Service

The command below builds and deploys the Cloud Run service. Modify the `SERVICE_NAME` and `GITHUB_USERNAME` to suit your needs.

<Callout>
  The below command assumes you are using a git repository. If you are not, you
  can replace `COMMIT_SHA` with a unique identifier.
</Callout>

<Callout>
  If you have already deployed the frontend and are encountering a CORS error,
  it may be due to the API being built for production. Once the build is
  complete, the CORS error should be resolved.
</Callout>

```bash title="Terminal"
export COMMIT_SHA=$(git rev-parse --short HEAD)
export DEPLOY_REGION="us-central1"
export SERVICE_NAME="transcript-seeker-api-prod"
export GITHUB_USERNAME="your_github_username"

gcloud builds submit \
  --region="$DEPLOY_REGION" \
  --config=cloudbuild.yaml \
  --substitutions=_GITHUB_USERNAME="$GITHUB_USERNAME",_DEPLOY_REGION="$DEPLOY_REGION",_SERVICE_NAME="$SERVICE_NAME",COMMIT_SHA="$COMMIT_SHA"
```

</Step>

</Steps>

---

## Frontend Deployment

<Steps>

<Step>
### Navigate to the Frontend Application Directory

```bash title="Terminal"
cd apps/web
```

</Step>

<Step>
### Build and Deploy

To deploy the frontend to Firebase Hosting, build the project and deploy:

```bash title="Terminal"
pnpm build
firebase deploy
```

</Step>
</Steps>
---


---

## Deployment

This guide will help you deploy Transcript Seeker to different environments.

### Source: ./content/docs/transcript-seeker/guides/deployment/index.mdx


Transcript Seeker can be deployed using several services, depending on your requirements. The steps for deploying to Firebase, Vercel, and other environments are provided in their respective guides. Choose the guide that best suits your deployment needs.

### Deployment Options

<Cards>

<Card icon={<Flame className="text-purple-300" />} title='Firebase'     href="/docs/transcript-seeker/guides/deployment/firebase"
>

Learn how to configure and set up Transcript Seeker to deploy to firebase.

</Card>

<Card icon={<Triangle className="text-purple-300" />} title='Vercel'     href="/docs/transcript-seeker/guides/deployment/vercel"
>

Learn how to configure and set up Transcript Seeker to deploy to vercel.

</Card>

</Cards>


---

## Vercel

Learn how to deploy Transcript Seeker to Vercel.

### Source: ./content/docs/transcript-seeker/guides/deployment/vercel.mdx


This page is a **Work In Progress**.


---

## Turso

Learn how to create a turso database.

### Source: ./content/docs/transcript-seeker/guides/turso.mdx


    <div className="relative w-full h-none" style={{  paddingBottom: 'calc(55.443786982248525% + 41px)' }}>
      <iframe
        src="https://demo.arcade.software/qS6sJh2Y45to6tEogy8H?embed&embed_mobile=tab&embed_desktop=inline&show_copy_link=true"
        title="Creating A Turso Database"
        frameBorder="0"
        loading="lazy"
        allowFullScreen
        allow="clipboard-write"
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', colorScheme: 'light' }}
      />
    </div>

After creating the database, please push the schema onto the db:

```bash
cd apps/api
pnpm db:push
```


---

## Introduction

Get started with Transcript Seeker for Meeting BaaS

### Source: ./content/docs/transcript-seeker/index.mdx


<Callout type="info">
  We provide detailed documentation optimized for both human readers and AI assistants. For more information about our LLM integration, see
  [LLMs](../llms/available).
</Callout>

## Introduction

Transcript Seeker is an **open-source transcription playground** built for easy upload, transcription, and interaction with your recordings. It's a powerful, beginner-friendly tool that offers an accessible way to transcribe meetings, chat with transcripts, generate notes, and more. Powered by technologies like Vite.js, React, and Drizzle ORM, Transcript Seeker offers an intuitive interface and seamless integration with transcription APIs.

Transcript Seeker comes with different parts:

<Cards>

<Card icon={<Cpu className="text-purple-300" />} title='Transcript Seeker Core'>

The core of Transcript Seeker includes the main transcription, playback, and note-taking functionality. It makes use of transcription APIs like Gladia and AssemblyAI, ensuring a smooth transcription experience.

</Card>

<Card icon={<PanelsTopLeft className="text-blue-300" />} title='Meeting Bot Integration'>

Integration with Meeting BaaS allows you to transcribe popular meeting platforms Google Meet, Zoom, and Microsoft Teams. This feature makes recording and reviewing meetings easier than ever.

</Card>

<Card icon={<Database />} title='Browser Database with PGLite'>

PGLite is a lightweight Postgres implementation that powers local storage for Transcript Seeker. It ensures your data stays private and manageable directly in the browser.

</Card>

<Card icon={<Terminal />} title='Quick Setup via Turborepo'>

The setup process for Transcript Seeker uses **Turborepo** for efficient monorepo management, making it easy to run concurrent scripts and streamline development.

</Card>

</Cards>

## FAQ

Some common questions you may encounter.

<Accordions>
    <Accordion id='clean-workspace' title='How do I remove all node_modules and clean the workspace?'>
        To thoroughly clean the workspace, you need to remove all `node_modules` directories and clear any package caches. This helps eliminate any residual files or corrupted packages that may interfere with your app's functionality. Run the following commands:
        
        ```bash
        turbo clean
        pnpm clean:workspaces
        ```
        
        These commands will effectively clear the workspace and prepare it for a fresh setup.
    </Accordion>
<Accordion id='startup-issue' title="Transcript Seeker isn't starting. What should I do?">
    If `pnpm dev` is stuck and your application isn't starting, you may need to clean your workspace to remove any corrupted packages or residual files. Follow these steps:

    First, remove all `node_modules` directories and clear any package caches. This will ensure a clean setup:

    ```bash
    turbo clean
    pnpm clean:workspaces
    ```

    Next, reinstall the packages:

    ```bash
    pnpm install
    ```

    Finally, install the Turbo CLI globally and start the development server:

    ```bash
    pnpm install -g turbo
    turbo dev
    ```

</Accordion>

    <Accordion id='fix-monorepo-styling' title="I've configured the .env.development.local file, but my app still isn't running. What could be wrong?">
        Transcript Seeker utilizes `dotenv-cli` to load environment variables, simplifying the setup for different environments. Ensure that your `.env` files are correctly structured for the intended environment, as shown below:

        - `.env.development.local` for development builds
        - `.env.production.local` for production builds

        If your app is still not responding, make sure that the environment file is being loaded correctly. You can specify the environment by running this command:

        ```bash
        export NODE_ENV="development"
        ```

        Setting `NODE_ENV` ensures the app reads the correct configuration, aligning with the specified environment. This step is essential to avoid conflicts between development and production settings.
    </Accordion>

</Accordions>

## Learn More

<Cards>

<Card icon={<Download className="text-purple-300" />} title='Installation'     href="/docs/transcript-seeker/getting-started/installation"
>

Learn how to configure and set up Transcript Seeker.

</Card>

<Card icon={<Cloud className="text-purple-300" />} title='Deployment'     href="/docs/transcript-seeker/guides/deployment"
>

Learn how to deploy Transcript Seeker to different providers.

</Card>

</Cards>


---


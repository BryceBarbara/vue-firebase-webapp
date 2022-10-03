# Getting Started

This document will guide you through the process of setting up your project using this template.

## 1. Create a new project in Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/) and create a new project.

## 2. Clone the repo

TODO

## 3. Install dependencies

From the root of the project, run:

```bash
npm install -g firebase-tools # installs the firebase CLI
pnpm i # install dependencies
```

## 4. Update Firebase config

1. Open the `shared/firebase-details.json` file and update the following:
   * `projectId` - your Firebase project ID
   * `firebaseConfig` - The firebase config object. You can get this from the [Firebase console](https://console.firebase.google.com/) by clicking on the gear icon next to the project name and selecting **Project settings**. Then, click on the **General** tab and scroll down to the **Your apps** section.
   * `authProvider` - See [Authentication](./authentication.md#setting-up-authentication) for more details.
2. From the root of the project, execute the script that will update the Firebase config in the project:
  ```bash
  pnpm run populate-firebase
  ```

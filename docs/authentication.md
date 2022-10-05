# Authentication

TODO: Add a description for this document and what readers can expect to learn from it.

## Setting up authentication

1. Configure the values in `shared/firebase-details.json`:
   * `authProvider.type` - The type of authentication provider to use. Currently, only `OAuthProvider` and `EmailAuthProvider` are supported.
   * Based on the type of auth provider, more details are required:
     * `OAuthProvider`:
       * `authProvider.providerId` - The ID of the OAuth provider.
       * `authProvider.scopes` - Optional. A string array of scopes to request from the OAuth provider.
     * `EmailAuthProvider`:
       * No additional details are required.
2. From the root of the project, execute the script that will update the Firebase config in the project:
   ```bash
   pnpm run populate-firebase
   ```

## Per-route authentication control

```vue
<route lang="yaml">
meta:
  requiresAuth: false # indicates whether the route requires authentication
</route>
```

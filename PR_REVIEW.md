# PR Review

Review target: `origin/development...HEAD`

## Findings

### High: Do not cast missing `data` into a required auth payload

File: [src/features/auth/utils/auth.mapper.ts](src/features/auth/utils/auth.mapper.ts#L40)

`AuthResult.data` is required in [src/features/auth/types/auth.types.ts](src/features/auth/types/auth.types.ts#L53), but this cast makes `undefined` look like a valid `{ user, accessToken }` value. The mapper is shared by login, Google login, and OTP verification. The OTP hook checks for missing data, but this contract is unsafe for other consumers and can cause runtime failures when they dereference `response.data`.

Please model the response as a union/optional-data result and make each caller handle the no-data success case explicitly, or reject an invalid response instead of using `as unknown as` to bypass the type system.

### High: Do not create an authenticated placeholder user when `user` is absent

File: [src/features/auth/utils/auth.mapper.ts](src/features/auth/utils/auth.mapper.ts#L9-L13)

When `data` exists but `data.user` is missing, this fallback returns `{ email: "", role: "CUSTOMER" }`. Login and Google login only check that `response.data` exists before calling `setAuth`, so a malformed successful response can populate the auth store with an invalid user and a default customer role. A missing required user should result in an invalid-response/error path, not a partially authenticated user.

### Medium: Do not replace a missing access token with an empty token

File: [src/features/auth/utils/auth.mapper.ts](src/features/auth/utils/auth.mapper.ts#L38)

`data.access_token || ""` converts a malformed success response into a valid-looking auth result. Consumers then pass the empty string to `setAuth` and may navigate as if authentication succeeded. Preserve the required token contract and reject missing/empty tokens, or represent the response as an explicit no-token outcome that callers must handle.

## Scope note

The branch is named `feat/SCRUM-648-frontend-shared-components-layout-setup`, but the current diff against `origin/development` contains only the auth mapper and mapper test changes. No shared component or layout setup changes are present in this branch tip.

## Validation

- `pnpm exec jest --runInBand`: 57 suites passed, 205 tests passed.
- `pnpm exec tsc -b --pretty false`: passed.
- `pnpm lint`: passed.
- The focused mapper tests pass, but they currently assert the unsafe missing-data behavior rather than validating a typed error/union contract.
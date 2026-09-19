## What changes

<!-- One or two sentences on what this PR does and why. -->

Closes #

## How to test

<!-- Steps a reviewer can follow locally to see it working. -->

1.

## Checklist

<!-- Tick each item, or write N/A next to it with a short reason. -->

- [ ] I can explain every change in this PR during review, including any code an agent wrote
- [ ] Tests cover the logic I added or changed
- [ ] Migrations are backwards compatible: the code running in production still works after they apply
- [ ] I did not edit a migration that is already merged, and new `.sql` files come from `pnpm db:generate`
- [ ] No secrets, tokens or real credentials anywhere in the diff

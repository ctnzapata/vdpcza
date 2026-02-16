---
name: git-commit-style
description: Enforce Conventional Commits standard for all git commit messages. Examples: 'feat: add login', 'fix: resolve crash'.
---

# Git Commit Style Guide

This skill ensures that all git commit messages follow the [Conventional Commits](https://www.conventionalcommits.org/) specification. This is crucial for:
1.  Automating changelog generation.
2.  Making history readable.
3.  Determining semantic version bumps.

## Commit Message Format

Each commit message consists of a **header**, a **body** and a **footer**. The header has a special format that includes a **type**, a **scope** and a **subject**:

```
<type>(<scope>): <subject>

[optional body]

[optional footer(s)]
```

The header is mandatory and the scope of the header is optional.

## Allowed Types

*   **`feat`**: A new feature
*   **`fix`**: A bug fix
*   **`docs`**: Documentation only changes
*   **`style`**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
*   **`refactor`**: A code change that neither fixes a bug nor adds a feature
*   **`perf`**: A code change that improves performance
*   **`test`**: Adding missing tests or correcting existing tests
*   **`build`**: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
*   **`ci`**: Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)
*   **`chore`**: Other changes that don't modify src or test files
*   **`revert`**: Reverts a previous commit

## Rules

1.  **Subject**:
    *   Use the imperative, present tense: "change" not "changed" nor "changes".
    *   Don't capitalize the first letter.
    *   No dot (.) at the end.
2.  **Body**:
    *   Use the imperative, present tense.
    *   Include motivation for the change and contrast with previous behavior.
3.  **Footer**:
    *   Reference issues that this commit closes (e.g., `Closes #123`).
    *   Mention `BREAKING CHANGE: <description>` if applicable.

## Examples

GOOD:
```
feat(auth): add google login support
fix(dashboard): resolve crash on missing user data
style: format code with prettier
docs: updaete readme with installation steps
```

BAD:
```
Fixed the login bug
Added google auth
Update readme
```

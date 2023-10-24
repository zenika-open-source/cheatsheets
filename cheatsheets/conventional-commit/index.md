::: column

# What is it ?

A Conventional Commit is a standardized way of writing commit messages in version control systems like Git. It follows a specific format to make it easier to understand the purpose and scope of each commit. The Conventional Commit format is commonly used in projects that follow semantic versioning (semver) and use tools like Lerna to automate the release process.

Here's a cheatsheet to help you understand and use Conventional Commits:

# Commit format

```
<type>(<scope>): <message>
```

- `type`: Describes the purpose of the commit (e.g., feat, fix, chore, docs, style, refactor, perf, test).
- `scope` (optional): Specifies the module or component affected by the commit.
- `message`: A brief and clear description of the changes made in the commit.

# Types

- **feat**: A new feature or functionality added to the project.
- **fix**: A bug fix or correction to existing code.
- **chore**: Routine tasks, maintenance, or non-functional changes.
- **docs**: Documentation updates or additions.
- **style**: Code style, formatting, or whitespace changes (not affecting the code's behavior).
- **refactor**: Code refactoring without adding or changing functionality.
- **perf**: Performance improvements or optimizations.
- **test**: Adding or enhancing tests.
- **build**: Changes related to the build system or dependencies.
- **ci**: Updates to the continuous integration configuration or scripts.
- **revert**: Reverting a previous commit.
- **breaking**: Introduces breaking changes. Should be mentioned in the commit message.

:::

::: column

# Scopes

The scope is an optional field that specifies the module, component, or area of the codebase that the commit is affecting. It provides additional context about where the changes are being made, which can be helpful in larger projects with many components or modules:

- Is an optional part of the format
- Allowed Scopes depends on the specific project
- Don't use issue identifiers as scopes

# Breaking Changes Indicator

Breaking changes should be indicated by an ! before the : in the subject line.

```
feat(api)!: remove status endpoint
```

# Examples

```json
- feat(login): Add user authentication functionality

- fix(ui): Resolve button click not working

- docs(readme): Update project documentation

- style(css): Improve code formatting in stylesheets

- refactor(auth): Simplify user login logic

- perf(api): Optimize database query performance

- test(unit): Add unit tests for the user service

- build: Upgrade Node.js to version 14.0.0

- ci(travis): Update deployment script

- revert: Revert the last commit

- breaking(api): Modify API response format
```

:::

::: column

# Best practices

- Use imperative verbs for the <message> to describe what the commit does (e.g., "Add," "Fix," "Update").

- Keep commits focused on a single change or logical unit of work.

- Make your commit messages concise, clear, and meaningful.

- If a commit introduces breaking changes, mark it with a breaking prefix.

- Follow the Conventional Commit format consistently to automate versioning and release notes.

# Resources

- [Conventional Commit](https://www.conventionalcommits.org/en/v1.0.0/)
- [Automate your release with conventional commit and Lerna](https://dev.to/xcanchal/automatic-versioning-in-a-lerna-monorepo-using-github-actions-4hij)

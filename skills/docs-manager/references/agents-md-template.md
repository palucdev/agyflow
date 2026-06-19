# AGENTS.md Documentation Section Template

Add this section to the project's `AGENTS.md` file. Place it prominently near the top. Verify the INDEX.md path is correct and the file exists before adding.

```markdown
## Coding Standards & Conventions

Read @.agyflow/docs/INDEX.md before starting any task. It indexes the project's coding standards and conventions:

- Coding standards organized by domain (frontend, backend, testing, etc.)
- Project vision, tech stack, and architecture decisions

Follow standards in `.agyflow/docs/standards/` when writing code — they represent team decisions. If standards conflict with the task, ask the user.

### Standards Evolution

When you notice recurring patterns, fixes, or conventions during implementation that aren't yet captured in standards — suggest adding them. Examples:

- A bug fix reveals a pattern that should be standardized (e.g., "always validate X before Y")
- PR review feedback identifies a convention the team wants enforced
- The same type of fix is needed across multiple files
- A new library/pattern is adopted that should be documented

When this happens, briefly suggest the standard to the user. If approved, invoke `/agyflow:standards-update` with the identified pattern.

## agyflow Workflows

This project uses the agyflow plugin for structured development workflows. When any `/agyflow:*` skill is invoked, execute it via the Skill tool immediately — do not skip workflows for "straightforward" tasks. The user chose the workflow intentionally; complexity assessment is the workflow's job.
```

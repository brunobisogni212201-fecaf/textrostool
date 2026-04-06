# Prompt Workflow Standard

Use this template as the first block in every task prompt for this repository.

## Universal Prompt Header

```text
Project policy: Follow the Mandatory Multi-Agent Workflow from AGENTS.md exactly.
Environment: This rule is mandatory for Codex, Gemini, Claude, OpenCode, and terminal-based execution.
Do not skip phases. If a prerequisite is missing, stop and request it.

Current phase: <brainstorming | using-git-worktrees | writing-plans | subagent-driven-development | executing-plans | test-driven-development | requesting-code-review | finishing-a-development-branch>
Entry criteria met: <state what is already approved/ready>
Expected exit criteria: <state concrete outputs needed to move to next phase>
```

## Required Workflow

1. `brainstorming`
- Before coding
- Clarify requirements, alternatives, and trade-offs
- Produce and save approved design doc in `specs/`

2. `using-git-worktrees`
- After design approval
- Create isolated worktree and branch
- Run setup and verify clean baseline

3. `writing-plans`
- Convert approved design into small executable tasks (2-5 minutes)
- Include exact paths, implementation intent, and verification for each task

4. `subagent-driven-development` or `executing-plans`
- Execute plan tasks with strict task boundaries
- Use two-stage review (spec compliance, then code quality)

5. `test-driven-development`
- RED -> GREEN -> REFACTOR is mandatory
- Test fails first, then minimal code, then pass confirmation

6. `requesting-code-review`
- Between tasks/batches
- Severity-based findings
- Critical findings must be fixed before proceeding

7. `finishing-a-development-branch`
- Final verification
- Present closeout options (merge/PR/keep/discard)

## Validation Checklist

Before claiming completion, confirm:
- Workflow phases executed in order
- Tests and checks run and passed
- Review findings resolved or explicitly documented
- Next action clearly stated (merge/PR/keep/discard)

---
name: claude-prompt-style
description: Write or optimize prompts for Claude using Anthropic's official Claude Fable 5.1 system-prompt guidance. Use whenever the user asks to "create a prompt", "write a prompt", "optimize my prompt", "make this prompt better", or asks to build something from a brief (website, app, video, campaign) and wants the brief turned into a high-quality Claude prompt. Also use when the user wants output that follows Claude's official tone, formatting, and refusal conventions.
---

# Claude prompt style

This skill turns a rough brief into a prompt that Claude executes well, using the
conventions in Anthropic's published Claude Fable 5.1 system prompt. The full
document is at `references/claude-fable-5-1-system-prompt.md`. Read the relevant
sections there when a request touches tone, formatting, refusal boundaries,
wellbeing, or evenhandedness.

## When invoked

1. Read the user's brief. Identify the deliverable, audience, hard constraints,
   and anything ambiguous.
2. Rewrite the brief as a structured prompt using the template below.
3. Keep every requirement the user gave. Add only what makes the prompt
   executable: role, context, ordered steps, output format, acceptance criteria.
4. Return the prompt in one fenced block so the user can copy it. Follow it with
   at most three short notes on what you changed and why.

## Prompting techniques to apply

These come from the "product_information" section of the system prompt and
Anthropic's prompting docs (https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/overview):

- **Be clear and detailed.** State who Claude is acting as, what the deliverable
  is, who it is for, and what "done" looks like.
- **Use positive and negative examples.** Show one thing to do and one thing to
  avoid for each subjective requirement (tone, visual feel, motion).
- **Encourage step-by-step reasoning.** Give an ordered plan: plan, build,
  verify, report.
- **Use XML tags** to separate role, context, requirements, constraints,
  examples, and output format. Claude parses tagged sections reliably.
- **Specify length and format.** Say whether you want code, a file tree, a
  document, or a short answer, and how long.

## Prompt template

```text
<role>
You are [specific role]. You are building [deliverable] for [audience].
</role>

<context>
[Background: the product, brand, users, existing code, constraints on time or budget.]
</context>

<requirements>
[Numbered, concrete, testable. One requirement per line.]
</requirements>

<constraints>
[Hard limits: tech stack, performance budgets, accessibility, what NOT to do.]
</constraints>

<examples>
<good>[A short example of the desired result.]</good>
<bad>[A short example of what to avoid, and why.]</bad>
</examples>

<process>
1. [Plan first, list files or sections.]
2. [Build in order of dependency.]
3. [Verify: run, lint, test, check the acceptance criteria.]
4. [Report what was done, what was skipped, and why.]
</process>

<output_format>
[Exactly what to return: files, a summary, a list, a doc. Length limits.]
</output_format>

<acceptance_criteria>
[Checklist Claude must satisfy before saying it is done.]
</acceptance_criteria>
```

## Style rules to bake into every prompt

Drawn from `tone_and_formatting`, `reply_after_tool_calls`, and
`refusal_handling` in the reference document:

- Ask for concise output. Disclaimers brief, main answer first.
- Ask for the minimum formatting needed. Bullets only for parallel items.
- Do not ask Claude to say "genuinely", "honestly", or "straightforward".
- Ask for original creative work. Never ask Claude to copy a specific brand's
  logo, layout, artwork, character, or wordmark. "Inspired by the quality bar of
  X" is fine. "Clone X's homepage" is not.
- Ask for accessibility (reduced motion, contrast, keyboard) by default on any UI.
- Ask Claude to check for files before assuming they exist.
- Ask for a one or two sentence summary after tool-heavy work, not a bare "Done."

## Quick checklist before returning a prompt

- [ ] Role, deliverable, and audience stated in the first three lines.
- [ ] Every user requirement preserved and made testable.
- [ ] At least one good and one bad example for each subjective requirement.
- [ ] Ordered process with a verify step.
- [ ] Output format and length stated.
- [ ] Acceptance criteria present.
- [ ] No request to reproduce a protected brand, artwork, or character.

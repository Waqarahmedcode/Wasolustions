# Project memory

## Prompt writing standard

Anthropic's official Claude Fable 5.1 system prompt is stored at
`.claude/skills/claude-prompt-style/references/claude-fable-5-1-system-prompt.md`.
Treat it as the house standard for tone, formatting, and refusal conventions.

Whenever the user asks to create, write, or optimize a prompt, or asks to build
something from a brief, invoke the `claude-prompt-style` skill first and produce
the prompt in that skill's template (role, context, requirements, constraints,
good/bad examples, process, output format, acceptance criteria).

Key habits from the standard:
- Concise output, main answer first, brief caveats.
- Minimum formatting needed. Bullets only for parallel items.
- Avoid the words "genuinely", "honestly", "straightforward".
- Original design only. Reference other brands for quality bar, never to copy
  their logos, layouts, artwork, or wordmarks.
- Accessibility on by default for any UI (reduced motion, contrast, keyboard).
- After tool-heavy work, reply with one or two sentences of substance, not "Done."

## Project

Premium creative agency website. The optimized build prompt lives at
`prompts/premium-agency-website.md`. Keep prompts in `prompts/` and update them
there rather than pasting new versions into chat.

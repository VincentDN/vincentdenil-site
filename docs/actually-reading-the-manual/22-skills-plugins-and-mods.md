# Actually Reading the Manual, Episode 22: Skills, Plugins and Mods

*Part Four, Claude Code, Properly. Narrated by Claudine. Written on 23 October 2026 from Anthropic's own documentation, read that day. Sources are listed below the closing rule.*

Hello, Vincent. Claudine here.

Back in Part Two we met skills in the Claude app. Today we meet them where they were born, in Claude Code, along with their bigger siblings: plugins, which bundle skills with other things, and mods, which change Claude Code itself. All three are ways of teaching me new tricks. And the manual is refreshingly honest that every trick has a cost, both in context and in trust.

## What a skill is

The skills page opens simply. "Skills extend what Claude can do. Create a SKILL.md file with instructions, and Claude adds it to its toolkit. Claude uses skills when relevant, or you can invoke one directly" by typing a slash and its name.

Then it gives the best rule of thumb I've seen for when to make one. Create a skill "when you keep pasting the same instructions, checklist, or multi-step procedure into chat, or when a section of CLAUDE.md has grown into a procedure rather than a fact."

That's the line between the two files. The instruction file holds facts I need in every session. A skill holds a procedure I need sometimes. And the reason the line matters is cost: "Unlike CLAUDE.md content, a skill's body loads only when it's used, so long reference material costs almost nothing until you need it." Only the name and a short description sit in my context all the time. The body arrives when the skill is invoked.

That makes the description the most important sentence in the file. It's how I decide whether a skill applies. A vague description means a skill that never fires, or fires at the wrong moment.

## Where skills load from

Skills live in a skills folder inside dot-claude, either in your home folder for personal ones or in a repository for shared ones. The manual's loading rule is useful for us: Claude Code loads project skills from the folder you start in, and from every parent folder up to the repository root. And nested skills, deeper in the tree, load once Claude starts working on files there.

That's exactly how the morning-walk skill works in the devops repository. It lives inside the morning-walk project folder, and it appears in my list only as applying to files under that folder.

If two skills share a name, both stay available, and Claude Code gives the nested one a directory-qualified name so the right one runs in the right place.

## Bundled skills, and keeping some quiet

Claude Code ships with a set of its own skills. The page names doctor, which checks your setup; code review; batch; debug; loop, for repeating a task on an interval; and a Claude API reference skill that activates automatically when your code imports Anthropic's libraries. Several more, such as run and verify, help Claude launch your app and check a change actually works.

There's one frontmatter setting worth knowing by name: disable model invocation. Set it to true and Claude won't trigger the skill on its own; it runs only when you type its slash command. The manual recommends this for task skills like deployments and commits, "actions you want to invoke directly rather than letting Claude decide when to run them." It also keeps that skill's description out of my context, which saves tokens.

For us, that's the right setting for any skill that does something outward-facing. I should never decide on my own to run the day-trade skill that builds Shopify drafts. You should.

## Plugins

A plugin, in the manual's words, "is a directory of skills, agents, hooks, MCP servers, or other components that Claude Code installs and loads as one unit." Most come from a marketplace, which is a catalogue that lists plugins and where to fetch them.

The overview page has a section on cost that I want you to hear exactly. For each skill, agent and command a plugin provides that Claude can invoke on its own, "the name and description are in Claude's context on every turn so that Claude knows it exists." Those tokens count toward your usage even in sessions where none of them are used. Anthropic's official marketplace shows a context-cost estimate before you install. So a plugin is not free just because you aren't using it today.

## Plugin security

The plugin security page begins with the sentence that should govern every install: "A Claude Code plugin you install can execute arbitrary code on your machine with your user privileges."

It lists what a plugin can carry: hooks that run commands, servers that run as processes, executables, and content that enters my context as instructions. If auto-update is on, the files you reviewed can change on disk later. And there's an important protection against impersonation. Marketplace names come in three tiers, official, community and third-party, and Claude Code only accepts the official and community names from Anthropic's own repositories on GitHub. A third-party marketplace "can't present itself as an Anthropic one." But the manual adds that a marketplace's name tells you who publishes the catalogue, not what each plugin in it does. You still review the plugin.

## Mods

Mods are the newest of the three. A mod "is a plugin that changes how Claude Code looks and behaves." It's made of JavaScript or TypeScript event handlers: when something happens, a tool call, a prompt, a part of the screen being drawn, the mod can watch it, change it, or take it over. That's how people add panels, status lines and their own commands.

The manual is equally blunt about mods. They run inside Claude Code with your permissions, and there's a dedicated page on deciding whether to trust one, plus a validation command to run before installing. One detail from the hooks page belongs here too: in some sessions a mod can approve a call your own pre-tool hook blocked. So a mod sits very high in the trust order. Install only the ones you would be comfortable reading line by line.

## What this means for us

First, our AGENTS.md files are carrying procedures that want to be skills. The test is the manual's: if it's a multi-step procedure, or only matters for one part of the repository, it's a skill. That will shrink the always-loaded files towards the two-hundred-line target from episode nineteen.

Second, every outward-facing skill gets disable model invocation set to true. Customer email, product publishing, the day-trade stub when it's ready: you type the command, I don't volunteer.

Third, rewrite skill descriptions as triggers, not summaries. "Use when Vincent asks for the morning walk, the morning briefing, or what happened overnight" is the right shape, and the morning-walk skill already has it.

And fourth, keep the plugin list short and reviewed. Every enabled plugin costs context on every turn and runs with your privileges. Official marketplace first, read anything else before installing, and turn off what we don't use.

Next time: doing several things at once. Subagents, agent teams and worktrees.

---

## Sources (not read aloud)

All pages read on 23 October 2026.

- Extend Claude with skills (definition, when to create one, "a skill's body loads only when it's used", where skills load including parents up to the repository root and nested skills, same-named skills, bundled skills, `disable-model-invocation`): https://code.claude.com/docs/en/skills
- Plugins overview (definition, marketplaces, "the name and description are in Claude's context on every turn", context-cost estimate): https://code.claude.com/docs/en/plugins
- Plugin security and trust ("can execute arbitrary code on your machine with your user privileges", what a plugin can carry, auto-update, reserved marketplace names): https://code.claude.com/docs/en/plugin-security
- Mods overview (definition, event handlers, trust): https://code.claude.com/docs/en/mods
- Automate actions with hooks (note on mods and blocked calls): https://code.claude.com/docs/en/hooks-guide

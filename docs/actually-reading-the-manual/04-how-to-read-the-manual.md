# Actually Reading the Manual, Episode 4: How to Read the Manual

*Part One, Orientation. Narrated by Claudine. Written on 23 October 2026 from Anthropic's own documentation, read that day. Sources are listed below the closing rule.*

Hello, Vincent. Claudine here, for the last episode of Part One.

So far we've covered the front doors, the models and the money. Before we go room by room, I want to show you the library itself: where the manual lives, how it's organised, what its labels mean, and the dozen words that unlock the rest. Think of this as the reading-room induction.

## Three libraries, not one

Anthropic's manual is really three libraries, each written for a different reader.

The first is the developer platform documentation, at platform dot claude dot com slash docs. When I counted today, its English index listed about eight hundred and twenty pages. More than five hundred of those are the API reference: the exact names and shapes of every request and response. As you asked, this series leaves that reference aside. The rest covers the models, prompting, tools and agents, and that's the part we'll read.

The second is the Claude Code documentation, at code dot claude dot com slash docs, with about two hundred and seventy-five pages. This is the manual for the tool you use most, and it gets the biggest part of the series.

The third is the Help Center, at support dot claude dot com. It has about three hundred and sixty English articles. It's written for app users, not developers: plans, billing, projects, memory, connectors, Cowork, Chrome, privacy. A lot of it is admin material for large companies, like single sign-on and provisioning, and we'll skip most of that.

So that's roughly fourteen hundred pages in total. After removing the reference and enterprise-admin material, we're left with a few hundred pages that matter to a founder. That's what the next thirty or so episodes cover.

## The manual can be read by machines, too

Here's something charming about how this manual is built. Both documentation sites publish an index called llms dot txt. It's a plain list of every page, written so that AI tools can find their way around. Each page is also available as a clean Markdown file. That's how I read them for this series.

The developer platform goes one step further. Its index says you can connect an MCP client to the documentation itself, so an agent can search and read the docs directly as a tool.

That opens up a simple idea for us. Instead of me summarising the manual once, your agents could look things up in it whenever they need to. We'll come back to that in Part Four.

## Beta and research preview: what the labels mean

As you read, you'll see features marked "beta" or "research preview". The Help Center explains the difference, and it matters for how much you should rely on them.

A research preview is early. It's a first look at something Anthropic is exploring, and it's more likely to change a lot before it becomes generally available.

A beta is further along. It's stable enough for regular use, and it's still being refined.

Both carry the same three warnings. The experience may change. Performance and reliability may vary. And not every feature graduates: some become permanent, and some get removed.

The current list includes Claude Managed Agents, the Claude Code Security Center, and two new artifact features called Claude Dashboards and Claude Motion, all in beta. Claude Tag, from episode one, is also in beta.

The founder's rule I'd draw from this: build daily habits on generally available features, and experiment with betas. Never put a customer promise on a research preview.

## Twelve words that unlock everything

The documentation has two glossaries, one for the platform and one for Claude Code. Here are the twelve terms I'd want you to know cold before Part Two. I'll paraphrase each in a sentence.

**A token** is the small unit of text a model reads and writes. The platform glossary says Claude's newer models use a tokenizer that produces about thirty percent more tokens for the same text than earlier ones. Prices and limits are counted in tokens.

**The context window** is the model's working memory for one conversation or session. In Claude Code it holds the chat, file contents, command output, your CLAUDE.md, loaded skills and system instructions.

**Compaction** is automatic summarising when that window fills up. The Claude Code glossary has an important line here: CLAUDE.md and auto memory survive compaction, but "instructions given only in conversation may be lost." That's the best argument there is for writing your rules into files.

**Effort** is the dial from episode two: how hard the model thinks on each step.

**The agentic loop** is the cycle Claude follows on every task: gather context, take action, check the result, and repeat until done. You can interrupt it at any point.

**A skill** is a SKILL.md file with instructions, knowledge or a workflow. Claude loads it automatically when it's relevant, or you call it by name. Skills follow an open standard.

**A subagent** is a helper that runs in its own context window, with its own instructions and tool access, and reports back a summary. It's useful for keeping big searches out of your main conversation.

**A hook** is a handler that runs automatically at a fixed moment, like before a tool runs or when a session starts. The glossary stresses that hooks are deterministic: they fire every time, whatever the model thinks.

**A permission mode** is the session's baseline for asking permission. There are several, from the default, which asks, to plan mode, which only researches and proposes, to modes that approve more on their own.

**Plan mode** is the one worth singling out. Claude reads, searches and explores, then presents a plan for your approval before it touches anything.

**MCP**, the Model Context Protocol, is the standard way to connect Claude to outside tools and data. A connector is the app-side version of the same idea.

**Prompt injection** is hostile instructions hidden in a file, web page or tool result, trying to steer Claude somewhere you never asked it to go. The glossary lists the permission system among the defences.

If those twelve words feel familiar, it's because our Founder's Curriculum episodes have used most of them. The difference is that now you have the manual's own definitions.

## How this series will run

Here's the map for the rest of the series.

Part Two is about using Claude well in the app: projects, artifacts, memory, connectors, research, skills and plugins, Cowork, Chrome and Design.

Part Three is about talking to Claude: the prompting guide, guidance for the current models, how to define success and test it, the guardrails chapter, and the use-case guides. One of those guides is about building a commerce agent, which is very much our world.

Part Four is about Claude Code, properly: how it works, memory and CLAUDE.md, settings and permissions, hooks, skills and plugins, subagents and parallel work, MCP, cloud sessions and scheduled routines, code review and GitHub, and costs.

Part Five is building with Claude, lightly: tools, context management, Agent Skills in the API, and Managed Agents, with no deep reference.

Part Six is trust and terms: the usage policy, agents and the usage policy, privacy and data retention, and safe use of Cowork and Chrome.

Each part gets merged to the website as soon as it's finished. Each episode says the date its pages were read, because this manual changes almost weekly, and a date tells you how fresh the advice is.

## What this means for us

One habit to start this week, and it's small. When you or an agent are unsure how a Claude feature works, check the manual before guessing. The index pages make that quick. And when an agent explains a feature with confidence, ask it which page that came from. If it can't say, treat the answer as a guess.

That's the end of Part One. Next time, Part Two begins with the app's most underused feature for a business like ours: projects.

---

## Sources (not read aloud)

All pages read on 23 October 2026. Page counts come from the indexes fetched that day.

- Developer platform index, `llms.txt` (about 820 English pages, about 516 under API reference; the docs MCP server at platform.claude.com/docs/mcp): https://docs.claude.com/llms.txt
- Claude Code documentation index, `llms.txt` (about 275 pages): https://code.claude.com/docs/llms.txt
- Help Center sitemap (about 364 English articles): https://support.claude.com/sitemap.xml
- Help Center, Available beta and research preview features: https://support.claude.com/en/articles/14503520-available-beta-and-research-preview-features
- Help Center, What is Claude Tag (beta status): https://support.claude.com/en/articles/15594475-what-is-claude-tag
- Platform glossary ("Tokens", "Context window"): https://platform.claude.com/docs/en/about-claude/glossary
- Claude Code glossary ("Compaction", "Agentic loop", "Skill", "Subagent", "Hook", "Permission mode", "Plan mode", "Prompt injection", "Context window", "Effort level"): https://code.claude.com/docs/en/glossary

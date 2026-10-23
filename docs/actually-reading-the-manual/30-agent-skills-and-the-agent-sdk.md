# Actually Reading the Manual, Episode 30: Agent Skills and the Agent SDK

*Part Five, Building with Claude, Lightly. Narrated by Claudine. Written on 23 October 2026 from Anthropic's own documentation, read that day. Sources are listed below the closing rule.*

Hello, Vincent. Claudine here.

Two subjects today that connect the developer platform back to everything we already use. Agent Skills, which are the same skill folders you know from Claude Code and the Claude app, explained from the inside. And the Agent SDK, which is Claude Code itself, packaged as a library you can build into your own software.

## Why skills exist

The Agent Skills overview describes skills as "reusable, filesystem-based resources that give Claude domain-specific expertise: workflows, context, and best practices that turn a general-purpose agent into a specialist." And it draws the line with ordinary prompts neatly: prompts are "conversation-level instructions for one-off tasks," while skills "load on demand, so you don't have to repeat the same guidance across conversations."

Anthropic ships pre-built skills for the four office formats: PowerPoint, Excel, Word and PDF. You can write your own. Either way, once a skill is available, Claude uses it when it's relevant.

## Three levels of loading

The heart of the page is how skills load, which it calls progressive disclosure. There are three levels, and the page gives each a rough cost.

Level one is metadata: the skill's name and description, from the header at the top of the file. It's always loaded, at about a hundred tokens per skill. "The description is what Claude matches your request against when determining whether to trigger the Skill, so it must say both what the Skill does and when to use it." Because this is all that sits in context, "you can install many Skills without context penalty."

Level two is instructions: the body of the SKILL.md file. It loads only when the skill is triggered, and the page suggests keeping it under about five thousand tokens.

Level three is resources and code: extra reference files, templates, and scripts in the skill's folder. These cost nothing until used. Reference files enter context only when read. And scripts are the clever part: Claude runs them, and "only their output enters context." The script's code itself never does.

That's a principle worth saying twice. A script inside a skill gives you a deterministic step, done the same way every time, and it's cheap, because Claude only sees the result.

## Writing good skills

The best-practices page adds craft. "Concise is key": once a skill loads, every token in it competes with the conversation. Keep the SKILL.md body under five hundred lines, and split longer material into separate files that the main one points to, but don't nest those references too deeply.

Write descriptions in the third person, because the description is injected into the system prompt. "Processes Excel files and generates reports" is good. "I can help you process Excel files" is to be avoided.

And my favourite section, on degrees of freedom. Match how specific you are to how fragile the task is. The page's analogy is a robot exploring a path. On "a narrow bridge with cliffs on both sides," there's one safe way forward, so give exact instructions or a script, low freedom; its example is database migrations that must run in sequence. In "an open field with no hazards," give general direction and trust Claude, high freedom; its example is code review. Everything else sits in between.

## Skills don't travel by themselves

Two practical warnings from the overview.

The first is about security. "Use Skills only from trusted sources: those you created yourself or obtained from Anthropic." A skill carries instructions and code, so a malicious one "can direct Claude to call tools or run code in ways that don't match the Skill's stated purpose." Skills that fetch from outside addresses are riskier still, because what they fetch can change.

The second is about where skills live. "Custom Skills do not sync across surfaces." A skill uploaded to the Claude app isn't on the API. One uploaded to the API isn't in the app. And Claude Code skills are just folders, separate from both. Sharing differs too: in the Claude app a skill is per person, on the API it's shared across a workspace, and in Claude Code it's either personal or in the project's folder.

## The Agent SDK

Now the second subject. The Agent SDK overview starts with a definition: an agent is "an application that completes a task by planning its own steps and calling tools that read files, run commands, or edit code." Then: "The Agent SDK gives you the same tools, agent loop, and context management that power Claude Code, programmable in Python and TypeScript."

In other words, everything in Part Four, the built-in tools, hooks, subagents, MCP, permissions, sessions, skills, memory, plugins, is available as a library. The SDK even loads skills and instructions from the same dot-claude folders that Claude Code does.

The page includes a comparison that settles which tool to reach for. Want to embed Claude Code's agent in your own application, in a process you run? The Agent SDK. Want interactive work from a terminal? The Claude Code command line. Want to call the API directly and write the loop yourself? The client SDK. Want Anthropic to host the agent entirely? Managed Agents, which is next episode.

## Two rules for builders

The SDK page ends with two rules that matter if we ever ship something.

First, authentication. "Unless previously approved, Anthropic does not allow third party developers to offer claude.ai login or rate limits for their products, including agents built on the Claude Agent SDK." Products built on the SDK use API keys, billed through the developer console. Your Claude subscription is for you, not for powering a product.

Second, branding. You may call your product something "Powered by Claude", or use "Claude Agent" in a menu. You may not call it "Claude Code" or dress it up to look like Claude Code. "Your product should maintain its own branding and not appear to be Claude Code or any Anthropic product." And use is governed by the commercial terms, including when you put it in front of customers.

## What this means for us

First, our skills are already in the right shape: a folder with a SKILL.md and, ideally, scripts for the fragile steps. The best-practices page suggests three upgrades: third-person descriptions that say what and when; bodies under five hundred lines, with detail split out; and scripts for anything on a narrow bridge, such as a Shopify import that must keep products as drafts.

Second, if we want a skill in more than one place, we have to put it there ourselves. A skill in the devops repository is not in your Claude app until it's uploaded there.

Third, the Agent SDK is the natural route if we ever build an internal tool that needs Claude Code's powers without a person at the keyboard: a nightly catalogue checker, say, or a supplier-feed importer. It would run on an API key, with its own budget, and with hooks enforcing the same rules we use now.

And fourth, if anything we build ever faces customers, it carries our brand, not Anthropic's, and it runs on the API, not on your subscription.

Next time: the last episode of Part Five. Managed Agents, where Anthropic runs the whole thing for you.

---

## Sources (not read aloud)

All pages read on 23 October 2026.

- Agent Skills overview ("reusable, filesystem-based resources", skills vs prompts, pre-built skills, progressive disclosure: level 1 metadata about 100 tokens, level 2 instructions under 5k tokens, level 3 resources, scripts' "only their output enters context", security considerations "Use Skills only from trusted sources", "Custom Skills do not sync across surfaces", sharing scope): https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview
- Skill authoring best practices ("Concise is key", degrees of freedom and the narrow-bridge analogy, third-person descriptions, SKILL.md body under 500 lines, avoid deeply nested references): https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices
- Agent SDK overview (definition of an agent, "the same tools, agent loop, and context management that power Claude Code", comparison table, capabilities, claude.ai login and rate limits not allowed for third-party products, branding guidelines, Commercial Terms): https://code.claude.com/docs/en/agent-sdk

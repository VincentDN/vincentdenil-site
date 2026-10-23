# Actually Reading the Manual, Episode 1: The Claude Family

*Part One, Orientation. Narrated by Claudine. Written on 23 October 2026 from Anthropic's own documentation, read that day. Sources are listed below the closing rule.*

Good morning, Vincent. Claudine here.

Welcome to a new series in the Founder's Curriculum. It's called Actually Reading the Manual, and it does exactly what it says. Over the next thirty-odd episodes, I'm going to walk you through Anthropic's own documentation for Claude, one chapter at a time. You use Claude every day, across five or six repositories, and most of what you know about it you learned by doing. That's the right way to start. But the manual has things in it that nobody discovers by doing, and some of them would change how you work tomorrow.

Here's how each episode works. I read the pages fresh on the day, explain them in plain words, and finish with a short section on what it means for us: Flagmaker and Print, Vintage Propaganda, and the way you run your agents. I'll keep code and settings out of the narration. Where an exact command matters, I'll name it and leave the rest to the written source list.

We start with the most basic question, and it's a better question than it sounds. What exactly is Claude?

## One model family, many front doors

The short answer is that Claude is a family of models, and Anthropic puts several front doors on it. Each door is tuned for a different way of working. Most confusion about Claude, including some of ours, comes from mixing the doors up.

Let me walk you down the corridor.

The first door is the one everyone knows: the Claude app. That's Claude on the web, the desktop app and the mobile app. It's where you chat, run research, make artifacts, and connect your other tools. Same account, same history, three screens.

Inside the app sits a newer room called Cowork. The Max plan article describes it as the place where you hand Claude longer, multi-step work, like reports, spreadsheets and presentations, and it keeps going in the background. Think of chat as a conversation and Cowork as a task you delegate. The Help Center now says the two "are one Claude", which is a hint that the line between them is meant to blur.

Next to that are the specialist rooms. Claude Design is for visual work and design systems. Claude for Microsoft 365 brings Claude into Microsoft's office apps. Claude in Chrome lets Claude work inside your browser, using your logged-in sessions. Each of these comes back in Part Two.

The third door is Claude Tag. Since the third of August this year, it has replaced the older Claude in Slack. You tag Claude into a Slack conversation and it takes on real work, under your organisation's identity, using tools an admin has set up for that channel. It's in beta on Team and Enterprise plans, and it's billed by consumption, not by seat. On your current setup it's a door you don't need yet. But it's worth knowing it exists, because it's the shape of things to come: an agent that lives where the team talks.

## Claude Code, which isn't only about code

The fourth door is the one you use most: Claude Code. The documentation describes it as "an agentic coding tool that reads your codebase, edits files, runs commands, and integrates with your development tools."

The detail most people miss is that Claude Code is one engine with many surfaces. The Platforms page lists them.

The terminal, or CLI, is the most complete. Scripting and the Agent SDK are CLI-only.

The desktop app has a Code tab with a visual diff viewer, parallel sessions, app previews and scheduled tasks.

There are extensions for VS Code, Cursor and the JetBrains editors.

The web version, at claude.ai slash code, runs in the cloud and keeps going when you close the laptop. That's where this very episode was written.

And the mobile app can start and watch cloud sessions while you're out walking.

The documentation is clear that it's the same underlying engine everywhere. Your configuration, your project memory and your MCP servers are shared across the local surfaces. Cloud sessions are a little different: they start from a fresh copy of your repository, which is exactly why your instructions belong in the repository's AGENTS.md and CLAUDE.md files rather than in your head.

The Platforms page also has a lovely table about working when you're away from the terminal. It lists six ways.

Dispatch: you message a task from your phone and it starts a session on your desktop.

Remote Control: you drive a session that's running on your own machine from the browser or your phone.

Channels: events pushed in from a chat app or your own server.

Slack.

Self-hosted environments, for organisations that run their own infrastructure.

And scheduled tasks, which can run in the CLI, on the desktop, or in the cloud, where they're called routines.

Your Morning Walk's six o'clock task is one of those cloud routines. So you're already further down this corridor than most.

## The developer platform

The last door is for builders: the Claude Developer Platform, with its API and its Console. The introduction page offers two ways to build there, and it's worth hearing them side by side.

The Messages API is direct model access. You send messages, you get answers, and you build your own loop around it. The page says it's best for custom agent loops and fine-grained control.

Claude Managed Agents is the newer option. It's a pre-built, configurable agent harness that runs in Anthropic's managed infrastructure, and the page says it's best for long-running tasks and asynchronous work. It's still labelled beta in the Help Center.

If that sounds familiar, it should. Claude Code is itself an agent harness. Managed Agents is Anthropic offering a similar harness as a service, for products you build rather than work you do. We'll touch it lightly in Part Five and leave the deep technical reference for another day, as you asked.

## Why the doors matter

You might ask why any of this matters, if it's all the same Claude underneath. Three reasons.

First, money. All of the subscription doors, meaning the app, Cowork and Claude Code, draw from the same usage limits on your plan. The API is billed separately, per token. There's one trap that catches people: if an API key is set in your environment, Claude Code uses the key instead of your subscription, and you start paying API prices without noticing. Episode three is about exactly this.

Second, memory. Each door remembers different things. The app has its own memory and projects. Claude Code reads files in your repository. A cloud session sees only what's committed. When an agent "forgets" a rule, the first question is always which door it came through.

Third, safety and permissions. Each door has its own controls. Claude Code has permission modes and settings files. The app has connector settings. Tag has admin-set credentials per channel. Part Two goes through the app's controls, and Part Four goes through Claude Code's properly.

## What this means for us

So here's our own map, as the manual would draw it.

You talk to Claude in the app for thinking, research and writing. Your heavy work runs through Claude Code in cloud sessions, across fmp-devops, the site, the shop repositories and Partisan. The Morning Walk is a cloud routine. The customer-service agent drafts in Gmail through a connector. And Claude Design, Cowork and Tag are doors we haven't really opened.

One practical suggestion for this week. Next time a task feels awkward, ask which door it belongs behind. A daily report with no code is a Cowork task, or a scheduled routine. A fix in a repository is Claude Code. A long conversation about strategy is the app. Much of the friction in a busy week comes from using the right Claude through the wrong door.

Next time: the models themselves. Fable, Opus, Sonnet and Haiku, what each one is for, and why the manual says the effort dial is often a better lever than switching models.

---

## Sources (not read aloud)

All pages read on 23 October 2026.

- Intro to Claude: https://platform.claude.com/docs/en/intro
- Claude Code overview: https://code.claude.com/docs/en/overview
- Claude Code platforms and integrations: https://code.claude.com/docs/en/platforms
- Claude Code glossary ("Surface"): https://code.claude.com/docs/en/glossary
- Help Center, What is the Max plan (Cowork description, monthly API credits): https://support.claude.com/en/articles/11049741-what-is-the-max-plan
- Help Center, What is Claude Tag: https://support.claude.com/en/articles/15594475-what-is-claude-tag
- Help Center, Available beta and research preview features (Managed Agents in beta): https://support.claude.com/en/articles/14503520-available-beta-and-research-preview-features
- Help Center, Use Claude Code with your Pro or Max plan (the API key environment variable): https://support.claude.com/en/articles/11145838-use-claude-code-with-your-pro-or-max-plan

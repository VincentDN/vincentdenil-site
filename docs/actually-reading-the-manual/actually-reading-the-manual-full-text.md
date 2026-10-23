# The Founder's Curriculum: Actually Reading the Manual

*All published episodes in order, narrated by Claudine. Each episode keeps its own source list below its closing rule.*


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


# Actually Reading the Manual, Episode 2: The Models

*Part One, Orientation. Narrated by Claudine. Written on 23 October 2026 from Anthropic's own documentation, read that day. Sources are listed below the closing rule.*

Hello again, Vincent. Claudine here.

Last time we walked down the corridor of front doors. Today we look at what's behind all of them: the models. If you've ever stared at the model picker and wondered which name to choose, this is your episode.

## Four current models, one name per job

As of today, the documentation lists four current Claude models. Each has a one-line job description, and those lines are worth learning by heart, because they're the manual's own advice.

Claude Fable 5.1 is "for demanding reasoning and long-horizon agentic work". It's the most capable model open to all customers. It's also the slowest and the most expensive: ten dollars per million input tokens and fifty per million output tokens.

Claude Opus 5.5 is "for long-running agentic coding and knowledge work". It costs four dollars in and twenty out, at moderate speed.

Claude Sonnet 5.5 is "the best combination of speed and intelligence". It costs two dollars in and ten out, and it's fast.

Claude Haiku 5.5 is for "high-volume, latency-sensitive tasks such as classification, extraction, and routing". It's the fastest and cheapest, with prices starting at ten cents in and fifty cents out per million tokens.

All four share some generous basics. Each has a context window of one million tokens, which the overview says is roughly five hundred and fifty thousand English words on the current tokenizer. Each can write up to a hundred and twenty-eight thousand tokens in a single reply. And each has a reliable knowledge cutoff of June 2026.

There's also a fifth name you may see: Claude Mythos 5.1. The manual says it offers the same capabilities as Fable 5.1, but only to organisations verified through Anthropic's verification programmes, such as the Cyber Verification Programme. For a flag shop, it isn't a door we need.

## The manual's default: start with Opus

Here's the sentence that appears on almost every model page: "If you're unsure which model to use, start with Claude Opus 5.5 for most workloads." Fable 5.1 is for when your tests on Opus, even at higher effort, still fall short.

That's a change from the old folk wisdom of "use the biggest model you can afford". The manual is telling you that Opus is the sensible middle, and that Fable is a specialist tool you reach for with evidence.

The guide called Choosing the Right Model offers two ways to start.

Option one is efficiency-first. Begin with Haiku, test your use case thoroughly, and upgrade only where you find a real gap. The guide recommends it for prototypes, tight latency, cost-sensitive work and high-volume, straightforward tasks.

Option two is capability-first. Begin with Opus 5.5, tune your prompts for it, and then make things cheaper over time, by lowering effort or moving down a model. Only if Opus at its highest effort settings still falls short do you move up to Fable.

Then there's a selection matrix, which is worth hearing as a list.

For the highest available capability, start with Fable 5.1. The examples are agent sessions that run for hours, multistep deep research, and analysis carried through to a finished document, spreadsheet or deck.

For complex agentic coding and enterprise work, start with Opus 5.5. The examples are multihour autonomous coding agents, large refactors, vision-heavy work and computer use.

For everyday coding, agents and enterprise workloads where speed matters, start with Sonnet 5.5. The examples are code generation, data analysis, content creation and visual understanding.

For the lowest latency and price, start with Haiku 5.5. The examples are real-time applications, high-volume processing and subagent tasks.

## The dial you may be ignoring: effort

The most useful sentence in the whole chapter is easy to miss. The guide says: "Tuning effort is often a better lever than switching models."

Effort is a setting that tells the model how hard to think. The Claude Code glossary describes it as controlling adaptive reasoning, which lets the model decide whether, and how much, to think on each step. Higher effort means more thinking and deeper reasoning. Lower effort is faster and cheaper.

Each model has a default. Fable 5.1 and Sonnet 5.5 default to high. Opus 5.5 and Haiku 5.5 default to medium. The guide's advice is to start at the default and move up or down based on your tests.

So before you switch a stubborn task from Opus to Fable, try Opus at a higher effort. Before you move a routine job from Sonnet to Haiku, try Sonnet at a lower one. One dial, same model, very different bill.

## Names that don't change under your feet

A short technical note, because it matters for anything you automate. Every Claude model ID is what the manual calls a pinned snapshot. When you ask for `claude-opus-5-5`, you get the same model for the lifetime of that ID. It won't quietly change underneath you.

From the 4.6 generation onwards, the IDs are simple: the word claude, the family name, and the version number. Older models carried a date in the name. Each model also has a published retirement promise. The current four won't be retired sooner than September or October 2027, depending on the model. Older models are listed on a deprecations page with their own dates.

The practical lesson is to write the model you mean, and check the deprecations page once a quarter. A scheduled agent pinned to a retired model simply stops.

## When Claude quietly changes models

One more thing from the Help Center, because you'll see it one day and wonder what happened.

Opus 5 and Opus 5.5 run automatic safety checks on every request. That includes the content Claude reads, such as memory, connector results, web pages and files, not just your message. A narrow set of higher-risk requests then either falls back to a less capable model or gets blocked.

The categories are specific. Offensive cybersecurity work, like writing exploits or penetration testing, falls back to Opus 4.8. Dual-use biology questions on Opus 5.5 fall back to Opus 5. A small set of frontier AI-development tasks are also covered. Requests that try to extract the model's internal reasoning, which the article calls distillation, are blocked outright.

When a fallback happens, you see a notice, and the reply is labelled with the model that answered. Then the model picker stays on the fallback model for the rest of the conversation, until you switch back.

For us this is mostly a curiosity. But one case is real: a flag-history question that touches extremist movements won't trigger these classifiers, while a customer's email asking for help "hacking" a website might. If an agent suddenly feels a little less clever mid-conversation, check the model label.

## What this means for us

Here's how the manual's advice maps onto our work, in my judgement.

Haiku 5.5 is the natural model for the high-volume, simple jobs: matching flag ideas against the corpus, tagging, routing customer emails by type. These are exactly the tasks the manual calls classification, extraction and routing.

Sonnet 5.5 suits product descriptions, catalogue copy and quick data pulls.

Opus 5.5 is the default for agent sessions in the repositories, which is where most of our work happens, and for writing episodes like this one.

Fable 5.1 is for the rare jobs that genuinely need it: a long research brief, a multi-day project, or the moment Opus at high effort keeps missing.

And before you change models, try the effort dial.

Next time: the money. Usage limits, length limits, the five-hour window and the weekly cap, usage credits, and the one environment variable that can quietly move you from your subscription to the API meter.

---

## Sources (not read aloud)

All pages read on 23 October 2026.

- Models overview (comparison table, pricing, context, cutoffs, retirement dates): https://platform.claude.com/docs/en/models/overview
- Choosing the right model (two approaches, selection matrix, effort advice, Mythos 5.1): https://platform.claude.com/docs/en/about-claude/models/choosing-a-model
- Intro to Claude (the "start with Opus 5.5" recommendation): https://platform.claude.com/docs/en/intro
- Model IDs and versioning: https://platform.claude.com/docs/en/about-claude/models/model-ids-and-versions
- Model deprecations: https://platform.claude.com/docs/en/about-claude/model-deprecations
- Claude Code glossary ("Effort level"): https://code.claude.com/docs/en/glossary
- Help Center, Why Claude switched models in your conversation with Opus 5 or Opus 5.5: https://support.claude.com/en/articles/16049681-why-claude-switched-models-in-your-conversation-with-opus-5-or-opus-5-5


# Actually Reading the Manual, Episode 3: Plans, Limits and Money

*Part One, Orientation. Narrated by Claudine. Written on 23 October 2026 from Anthropic's own documentation, read that day. Sources are listed below the closing rule.*

Hello, Vincent. Claudine here.

Today's episode is about money and limits. It's not glamorous, but it's the chapter that saves you the most frustration. Every founder who works with agents eventually hits a wall mid-task and wonders what just happened. By the end of this walk, you'll know exactly which wall it was.

## Two kinds of limit, often confused

The Help Center article on limits starts with a distinction that clears up most of the confusion. There are two different kinds of limit, and they work in completely different ways.

Usage limits are about how much you can use Claude over time. The article calls them your "conversation budget". They decide how many messages you can send, or how long you can work in Claude Code, before you have to wait for a reset.

Length limits are about how much Claude can hold in a single conversation. That's the context window, which the article calls Claude's "working memory".

One is a budget over hours and days. The other is the size of the desk. Running out of one says nothing about the other.

## The budget: a five-hour window and a weekly cap

On the paid individual plans, Pro and Max, your usage budget has two clocks.

The first is a session limit that resets every five hours. The second is a weekly limit. Max plans also have a separate weekly limit just for the Fable models, which we'll come to.

Here's the part people don't expect. The article says that all your use of Claude, across the web app, Claude Code and the desktop app, counts against the same limit. There's one budget, not one per door. A heavy morning of agent sessions leaves less for the afternoon's chat, and the other way round.

What uses up the budget? The article names four things: how long and complex your conversations are, the features you use, which model you're talking to, and the effort level you've chosen. A long Fable conversation at high effort with several tools switched on is the most expensive thing you can do. A short Haiku question is the cheapest.

When a Claude Code session hits the five-hour limit partway through a reply, the Help Center says it may keep working briefly to finish the step in progress, rather than stopping mid-step. You'll see "Usage limit reached · wrapping up". That's not an error. It's a polite exit.

## The plans, briefly

The Max plan comes in two tiers. Max 5x is a hundred dollars a month, and Max 20x is two hundred, giving five or twenty times the Pro plan's usage. Both are monthly subscriptions only. Max also gives priority access to new models and features, and it includes monthly credits for the Claude API.

Those API credits are separate money, and the article is careful about it. Monthly API credits are for the Developer Platform. They don't pay for extra use of the Claude app, Claude Code or Cowork.

## Fable has its own rules

The most capable model, Fable, is treated differently depending on your plan, so it's worth getting this right.

On Max plans, and on premium seats of Team and Enterprise plans, Fable 5 and Fable 5.1 are a standard part of the plan. You can use up to half of your weekly usage on Fable models at no extra cost. After that, you either keep going on usage credits or switch to another model.

On Pro plans, and on standard seats, Fable isn't included in your plan's usage at all. You can still use it, but only by paying with usage credits from the first message.

In Claude Code, Fable 5.1 needs a recent version of the tool. The article gives the exact version number, and it's in the sources.

## Usage credits: the pay-as-you-go overflow

So what happens when you run out? That's what usage credits are for. They let you keep working after you hit your plan's limit, at standard API prices.

You switch them on in the app, under Settings, then Usage. You add a payment method, prepay a balance, and set a monthly spending cap. You can also turn on auto-reload, which tops up your balance when it drops below a threshold you choose. When your plan's limit runs out, your requests simply switch to credits and keep going. The notice changes to "Now using credits". Your normal limits still reset on schedule.

Two cautions. The credits are billed separately from your subscription, so they appear as extra charges. And if you subscribed through a mobile app store, you can only switch credits on through the web version of Claude.

## The trap: an API key in your environment

Now the one sentence in this chapter I'd underline twice. It's from the Help Center article on using Claude Code with Pro or Max:

"If you have an ANTHROPIC_API_KEY environment variable set on your system, Claude Code will use this API key for authentication instead of your Claude subscription", which means API usage charges instead of your plan.

In plain words: if an API key is lying around in your environment, from a script, a test or an old experiment, Claude Code quietly uses it and bills the API account, per token. Your subscription sits there unused. The Claude Code overview adds that Claude Code asks whether to use the key when it first finds one. So the danger is the moment you say yes without thinking.

The fix is simple. Know which keys are set on each machine and in each cloud environment. If you ever see API charges you didn't expect, check that first.

## The desk: context windows

Now the other limit, length. The context window is everything Claude can hold in mind at once in one conversation. On paid plans, the article says the newest models support up to a million tokens, and some others five hundred thousand or two hundred thousand. Part of that space is always reserved for Claude's reply.

When a conversation gets close to the limit, there's a safety net. If code execution is switched on, Claude automatically summarises earlier messages so the conversation can continue. You might see Claude "organizing its thoughts". Your full history is kept. But the article warns that longer conversations which trigger this summarising use more of your usage budget. The desk and the budget are separate, but a crowded desk is expensive to keep tidy.

The article ends with practical advice for both limits at once, which I'll give you as a list.

Use projects, because they load only the relevant parts of your files into the conversation.

Keep project instructions short, and save task-specific instructions for the chat itself.

Remove project files you no longer use.

Turn extended thinking off when a task doesn't need it.

Lower the effort level for routine tasks.

Turn off connected apps and web search when a conversation doesn't need them.

And start a fresh conversation when a long one gets heavy.

## Watching the meter in Claude Code

Claude Code has its own window into all of this: the `/usage` command. On a paid plan, it shows what's counting against your limits and offers recommendations. The newer versions even let you press "f" to have Claude Code apply some of its own suggestions. The costs page also notes that a session's dollar figure is calculated at API list price, which matters for API users. On a subscription, it's for information only.

For context, the same page gives a figure from enterprise deployments, where usage is billed through the API: an average of around thirteen dollars per developer per active day, and below thirty dollars a day for nine in ten users. That's a useful sense of scale for what heavy agent use costs at list prices.

## What this means for us

Three practical points for our setup.

First, one budget covers everything. The Morning Walk routine, the cloud sessions across the repositories and your own chats all draw from the same plan. If a heavy morning of agent work is followed by a big research question, run the research in a fresh conversation, at sensible effort, with tools you don't need switched off.

Second, Fable is a deliberate choice. On Max, it's included up to half your weekly budget. On anything less, it's a pay-as-you-go decision, so save it for the jobs we discussed last time.

Third, check the API keys. The Morning Walk, the smoke test and the catalogue scripts all touch APIs. Make sure no Anthropic API key sits in any environment where Claude Code runs, unless you deliberately want API billing there. It's a ten-minute check that can save a surprising invoice.

Next time: how to read the manual itself. Where the three libraries live, how to tell a beta from a research preview, and the dozen words that make the rest of the documentation easy.

---

## Sources (not read aloud)

All pages read on 23 October 2026.

- Help Center, How do usage and length limits work: https://support.claude.com/en/articles/11647753-how-do-usage-and-length-limits-work
- Help Center, What is the Max plan (tiers, prices, monthly only, API credits): https://support.claude.com/en/articles/11049741-what-is-the-max-plan
- Help Center, Use Claude Code with your Pro or Max plan (shared limits, "wrapping up", the API key warning): https://support.claude.com/en/articles/11145838-use-claude-code-with-your-pro-or-max-plan
- Help Center, Manage usage credits for paid Claude plans: https://support.claude.com/en/articles/12429409-manage-usage-credits-for-paid-claude-plans
- Help Center, Claude Fable models on your plan (the 50% rule, Pro and standard seats on credits, the Claude Code version requirements: 2.1.170 for Fable 5, 2.1.255 for Fable 5.1): https://support.claude.com/en/articles/15424964-claude-fable-models-on-your-plan
- Claude Code, Manage costs effectively (`/usage`, the "f" shortcut, the enterprise averages): https://code.claude.com/docs/en/costs
- Claude Code overview (Claude Code asks before using a found API key): https://code.claude.com/docs/en/overview


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

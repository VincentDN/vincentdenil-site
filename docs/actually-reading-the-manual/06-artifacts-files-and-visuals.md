# Actually Reading the Manual, Episode 6: Artifacts, Files and Visuals

*Part Two, Using Claude Well. Narrated by Claudine. Written on 23 October 2026 from Anthropic's own documentation, read that day. Sources are listed below the closing rule.*

Hello, Vincent. Claudine here.

Today is about the things Claude makes for you. There are three families, and the manual treats them quite differently. Artifacts are things you keep and share. Files are documents you download. And custom visuals are sketches that help you think in the moment. Knowing which is which saves a surprising amount of muddle.

## Artifacts: things you'd put in front of someone

The Help Center's definition is one of the best sentences in the whole manual. An artifact is "anything Claude makes for you that you'd put in front of someone: a design, a deck, a document, a dashboard, or a small interactive tool." It opens beside your conversation, and you can edit it, come back to it and share it.

Claude decides on its own when something should become an artifact. The article lists the criteria: it's significant and self-contained, typically more than fifteen lines; you're likely to edit, reuse or refer back to it; and it stands on its own without the conversation around it. You can also simply ask for one.

Since mid-September, artifacts have changed shape. Anything made in a chat before the sixteenth of September is now a "legacy artifact". Legacy artifacts still work, and you can still share them, but new ones are made a different way: from templates.

## The templates

There are five templates, and they're the clearest way to understand what artifacts are for now.

Docs are living documents you write with Claude, and with colleagues, in real time. They export to Word, PDF, Markdown and Google Docs.

Slides are presentations built from your notes or your chat. You can edit any slide directly, present without leaving Claude, and export to PowerPoint, PDF or Google Slides.

Design covers visuals, mock-ups, prototypes, one-pagers and landing pages, built with your design system. We'll come back to it in episode twelve.

Dashboards, in beta, are built from your data platforms or connected apps. Claude writes the queries, and the article notes that each chart shows its query and when it was last refreshed. That's a lovely detail for anyone who cares where numbers come from.

Motion, also in beta and only on Team and Enterprise plans, makes animated explainers that export as video.

Everything you make is saved to an Artifacts tab in the sidebar, so you can find it again from any conversation.

## Artifacts that remember and connect

Two newer abilities turn artifacts from documents into small tools.

First, artifacts can connect to the apps you've connected to Claude, like Asana, Google Calendar or Slack, and read from or write to them. The first time, Claude shows you which tools it will use and asks you to approve them. And there's an important rule: everyone connects their own apps, even when they're using someone else's shared artifact. Your artifact never borrows your Gmail for a stranger.

Second, artifacts can store data between sessions. Storage is either personal, where everyone keeps their own private entries, like a journal, or shared, where everyone sees the same data, like a leaderboard. With shared storage, Claude warns you first that your data will be visible to others.

One prerequisite catches people out. Artifacts need the setting called "Code execution and file creation" to be switched on, under Settings, then Capabilities.

## Sharing starts private

The sharing article is reassuringly plain: "Artifacts start private to you. Nothing is shared until you share it." On individual plans you can share with anyone who has the link, or invite specific people by email, which is in beta. And if you build on someone else's published artifact, the Help Center gives a sensible warning: only do it with artifacts from people you trust, and treat their code "the way you'd treat a file from an unknown sender."

Claude Code can make artifacts too. It can publish a session's output as a live page at a private address, which updates as the session continues. That's exactly how your Morning Walk arrived as a web page this week.

## Files: real documents you download

The second family is files. With code execution switched on, Claude can create Excel spreadsheets with working formulas, PowerPoint presentations, Word documents and PDFs, and you download them. It's on by default for Free, Pro and Max plans.

The interesting part of this article is about security, and it's worth hearing even on a personal plan. When Claude creates files, it works inside an isolated, sandboxed container. On individual plans, network access is switched on by default, so Claude can install software packages. The article explains the risk clearly: if network access is on, Claude could, through prompt injection, be tricked into sending data out of the sandbox. Switching network access off "eliminates this risk entirely", while keeping the file-making abilities.

Then comes a caveat that's easy to miss. If you have MCP connectors switched on, network communication remains possible through those connectors, whatever the network setting says. The sandbox setting covers the sandbox, and nothing else.

## Custom visuals: a whiteboard, not a file

The third family is the newest: custom visuals, in beta on the web and desktop. When a diagram, chart or small interactive element would explain something better than words, Claude builds one in the conversation. Ask how something works, and you might get a flowchart. Upload a spreadsheet, and you might get a chart you can explore.

The Help Center describes them as a "whiteboard sketch". They're ephemeral: they live inside Claude's reply and aren't saved separately. If you want to keep one, you can copy it as an image, download it, or save it as an artifact. The article gives the rule of thumb itself: artifacts are persistent and shareable from the start, while custom visuals help you think in the moment.

Two tips from the article. Opus performs best at visualisation, so pick a stronger model for complex visuals. And if you tell Claude your preferences once, for example "make all my visualisations pink", it remembers.

There are also built-in visual cards for weather, recipes and sports, and something called interactive inputs. That's when Claude asks you a structured question with buttons to click, like choosing a budget range, instead of making you type.

## What this means for us

Here's how the three families map onto our work.

Artifacts are where finished things for other people belong. The Morning Walk is already one. The Founder's Curriculum episodes could be Docs. A Dashboards artifact connected to the store is the natural home for the weekly funnel line from the operating-system episode. And because each chart shows its query and refresh time, it fits our rule that every number names its source.

Files are for things that leave Claude: a supplier price sheet in Excel, or a deck for a partner.

Custom visuals are for thinking: sketching a checkout funnel, or comparing two pricing ladders, before anything gets built.

And one setting to check this week. Code execution's network access is on by default for you. That's fine for everyday work. But if you ever ask Claude to process a file from outside, such as a customer's upload or a supplier's spreadsheet, remember that prompt injection is the risk the manual names, and that your connectors stay open whatever that switch says.

Next time: memory. What Claude remembers about you, where it keeps it, and the difference between an incognito chat and a chat with memory switched off.

---

## Sources (not read aloud)

All pages read on 23 October 2026.

- Help Center, What are artifacts and how do I use them (definition, criteria, legacy artifacts since 16 Sep 2026, templates, connecting apps, storage, Claude Code artifacts, the capability prerequisite): https://support.claude.com/en/articles/17153992-what-are-artifacts-and-how-do-i-use-them
- Help Center, Share artifacts ("Artifacts start private to you"): https://support.claude.com/en/articles/9547008-share-artifacts
- Help Center, Create and edit files with Claude (file types, defaults, sandbox, network egress and the MCP caveat): https://support.claude.com/en/articles/12111783-create-and-edit-files-with-claude
- Help Center, Visual and interactive content (weather, recipes, sports, interactive inputs): https://support.claude.com/en/articles/13641943-visual-and-interactive-content
- Help Center, Custom visuals in chat and Cowork ("whiteboard sketch", keeping a visual, tips): https://support.claude.com/en/articles/13979539-custom-visuals-in-chat-and-cowork

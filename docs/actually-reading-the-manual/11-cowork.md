# Actually Reading the Manual, Episode 11: Cowork

*Part Two, Using Claude Well. Narrated by Claudine. Written on 23 October 2026 from Anthropic's own documentation, read that day. Sources are listed below the closing rule.*

Hello, Vincent. Claudine here.

Today is Cowork, and it's a moving target. In the space of a few weeks it has moved into the cloud, picked up a browser, learned to use your computer, and started merging with ordinary chat. I'll walk you through what it is today, and then through the safety chapter, which I think is the most important page in Part Two.

## What Cowork is

The Help Center describes it in one sentence: Cowork "brings Claude Code's agentic capabilities to knowledge work beyond coding." It uses the same architecture that powers Claude Code, but with no terminal. Instead of answering one prompt at a time, Claude takes on a multi-step task and carries it out. You describe an outcome, step away, and come back to finished work: documents, organised files, research, spreadsheets with working formulas, presentations.

It's on all paid plans, on the desktop apps for Mac and Windows, on the web, on mobile, and in the Claude in Chrome side panel, with some variation by plan.

## Cowork is becoming just Claude

Here's the big change. Several articles now open with the same note: "Claude Cowork is now just Claude. Ask for what you need, and Claude decides whether that's a quick answer or a task."

The article called "Claude Cowork and chat are one Claude" explains it. In the new experience, chat and Cowork merge into a single conversation, so you no longer choose a mode before you start. A quick question still gets a quick answer, and a bigger request becomes a task. It's rolling out gradually, starting with Pro and Max plans. If your message box still shows separate "Chat" and "Cowork" options, you haven't got it yet.

## It runs in the cloud now

The second big change happened on the sixth of October. On Pro and Max plans, new Cowork tasks now run in the cloud, on Anthropic's servers, instead of on your computer. The setting to keep them only on your computer was removed. Tasks you'd already started locally can finish where they are.

Running in the cloud changes three things. Work continues when you close your laptop. Scheduled tasks run with no device switched on. And the same sessions and files appear on your desktop, the web and your phone.

Your folders stay on your computer, though. Claude reaches only the folders you've connected, through the desktop app, and only while it's open. When a task needs a file, it fetches a copy of just that file.

And if you want work to stay on your own machine, the article points you to Claude Code in the desktop app, which runs locally. There's even a command to carry a Cowork task over: you download the task data, open it in Claude Code, and run a command called port-task-data.

## What Cowork can reach

The "one Claude" article lists what a task can use.

Your connected apps, like Google Drive, Gmail or Slack, while the task runs.

Folders on your computer, through the desktop app.

A browser. Either one built into the desktop app, or your own Chrome through Claude in Chrome. The built-in browser is separate from yours and doesn't see your saved logins unless you import them, site by site. Anything you sign into there stays available to future Cowork sessions on that computer.

And, in beta on Pro and Max plans, computer use: Claude clicking, typing and navigating your desktop apps directly.

The computer-use article describes a sensible order. Claude tries the most precise tool first. If there's a connector, it uses that. If not, it uses a browser. Only if neither works does it fall back to your screen. Pulling messages through the Slack connector takes seconds; navigating Slack on screen takes much longer and fails more often. Claude also asks your permission before it touches each application. And while it works it takes screenshots, so anything visible on screen becomes part of the conversation.

## Scheduled tasks and projects

Two features make Cowork a daily tool.

Scheduled tasks run a saved prompt on a cadence: every weekday at eight, every Monday morning. The Help Center's list of common uses reads like our own: daily briefings from Slack, email or the calendar; weekly reports from Drive and spreadsheets; recurring research on topics or competitors; regular file clean-ups; and team status updates. Each run is its own session, and it runs remotely, even when your computer is asleep. In the new experience, you can just say, "every Monday at nine, summarise last week's messages", and Claude proposes the schedule for you to confirm.

Projects in Cowork group related tasks, each with its own instructions, scheduled tasks, context and memory, like the chat projects from episode five.

There's also an older feature called Dispatch, which lets you message a task from your phone to run on your desktop. The article notes it isn't available to new users any more, so I'll leave it there.

## The safety chapter

Now the page I'd ask you to read in full one day: "Use Claude Cowork safely". Its core idea is simple and powerful.

It divides Claude's tools into two kinds. Read tools let Claude see things, like reading your inbox or taking a screenshot. Write tools let Claude do things, like creating a calendar invite, deleting a file, running a command or clicking on the screen. Write tools carry more risk, and the article recommends human oversight when the stakes are high.

Then it explains prompt injection, with an example: you ask Claude to summarise your emails, and one email from an attacker contains hidden instructions. And it states the condition that makes such an attack work: "two things must be true at the same time". Claude can read information from outside your trusted sources, and Claude can take actions that could harm you. Remove either one, and the attack becomes much harder.

From that, the article's advice follows. Don't give access to folders with sensitive information, like financial documents. Be deliberate about which sites Claude works on, especially sites where you're signed in or that handle money. Extend internet access only to sites you trust. Watch for suspicious actions. Use only trusted connectors. And be especially careful with computer use, because it acts on your screen "without the permission checks that gate other Cowork tools."

Anthropic's own layers of protection are listed too: training Claude to refuse malicious instructions, running each cloud session in an isolated, temporary environment, and classifiers that scan untrusted content for injection attempts. But every page in this chapter ends the same way: the risk is reduced, not removed.

## What this means for us

The two-conditions rule is the clearest statement I've seen of why our customer-service set-up is shaped the way it is. The email agent reads content from outside, from strangers, so that half of the condition is always true. Our protection is to remove the other half: it drafts, and never sends, and a human approves. Now you have the manual's own reasoning for a rule you made on instinct.

Second, Cowork's scheduled tasks are a real alternative home for some of our routines. The Morning Walk runs today as a Claude Code cloud routine, because it reads the repositories. But a pure inbox digest, or a weekly competitor scan with no code, could be a Cowork scheduled task, with your connectors and plugins already there.

And third, computer use and the browsers. They're powerful for apps with no connector, like a supplier portal. But keep them away from anything with money in it, including the Shopify admin and payment dashboards. That's exactly what the manual advises.

Next time, the last episode of Part Two: Claude in Chrome, Claude Design, and Claude by voice.

---

## Sources (not read aloud)

All pages read on 23 October 2026.

- Help Center, Claude Cowork and chat are one Claude (the new experience, what Claude can reach): https://support.claude.com/en/articles/16761823-claude-cowork-and-chat-are-one-claude
- Help Center, Get started with Claude Cowork (definition, availability, key capabilities): https://support.claude.com/en/articles/13345190-get-started-with-claude-cowork
- Help Center, Use Claude Cowork on web, desktop, and mobile (cloud since 6 Oct 2026, local folders, port-task-data): https://support.claude.com/en/articles/15520349-use-claude-cowork-on-web-desktop-and-mobile
- Help Center, Schedule recurring tasks in Claude Cowork: https://support.claude.com/en/articles/13854387-schedule-recurring-tasks-in-claude-cowork
- Help Center, Organize your tasks with projects in Claude Cowork: https://support.claude.com/en/articles/14116274-organize-your-tasks-with-projects-in-claude-cowork
- Help Center, Assign tasks from anywhere in Claude Cowork (Dispatch, not available to new users): https://support.claude.com/en/articles/13947068-assign-tasks-from-anywhere-in-claude-cowork
- Help Center, Let Claude use your computer in Cowork (order of tools, permissions, screenshots, recommendations): https://support.claude.com/en/articles/14128542-let-claude-use-your-computer-in-cowork
- Help Center, Use the built-in browser in Claude Cowork: https://support.claude.com/en/articles/16607400-use-the-built-in-browser-in-claude-cowork
- Help Center, Use Claude Cowork safely (read and write tools, the two conditions for prompt injection, recommendations, safety measures): https://support.claude.com/en/articles/13364135-use-claude-cowork-safely

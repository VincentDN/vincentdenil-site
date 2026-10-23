# Actually Reading the Manual, Episode 24: MCP

*Part Four, Claude Code, Properly. Narrated by Claudine. Written on 23 October 2026 from Anthropic's own documentation, read that day. Sources are listed below the closing rule.*

Hello, Vincent. Claudine here.

In Part Two we met connectors in the Claude app: Gmail, Shopify, GitHub and the rest. Today we meet the plumbing behind them. MCP, the Model Context Protocol, is the open standard Claude uses to talk to outside tools. Every connector is an MCP server underneath. The Claude Code page on it is long, but most of it is reference. What you need fits in one walk.

## What it's for

The page opens with a list of things you can ask once servers are connected, and it reads like a wish list for any small business. Implement a feature described in an issue tracker and open a pull request. Check monitoring data. Query a database. Update an email template from new designs. "Create Gmail drafts inviting these 10 users to a feedback session." And react to outside events, because a server can also act as a channel that pushes messages into your session, so Claude can respond to a chat message or a webhook while you're away.

Notice that the Gmail example says drafts. Even Anthropic's own sample prompt stops short of sending.

## Three kinds of server, three scopes

Servers come in a few shapes. Remote servers live on the internet and you reach them by address; that's how most commercial connectors work. Local servers run as a program on your machine and talk through standard input and output. Claude Code has commands to add each kind, and even to paste in setup instructions written for a different app and convert them.

More important for us is where a server's configuration is stored, which the manual calls its scope. There are three.

Local scope: just you, just this project, stored in your home folder. This is the default when you add a server.

Project scope: everyone on this project, stored in a file called dot-mcp-dot-json at the repository root and committed to git.

User scope: just you, in every project.

So the default is the least shareable option. If you want a server to reach teammates, or cloud sessions, you have to ask for project scope deliberately.

## Your app connectors come along

A short section with a big effect. If you're logged into Claude Code with your Claude account, the connectors you've added in the Claude app "are automatically available in Claude Code." That's why, in a session like this one, I can see Gmail, Shopify, GitHub and the rest without anyone configuring them in the repository. They're attached to your account, not to the code.

## The good news about cost

For a long time the received wisdom was that every connected server stuffed its full tool list into the context window, so connecting ten servers made every request heavier. The manual now says otherwise, in a section called scaling with tool search. Tool search "keeps MCP context usage low by deferring tool definitions until Claude needs them. Only tool names and server instructions load at session start, so adding more MCP servers has minimal impact on your context window." It's on by default.

That doesn't mean servers are free. The cost page still recommends turning off servers you're not using, and makes a pointed observation: command-line tools like GitHub's are "still more context-efficient than MCP servers because they don't add any per-tool listing." But the old fear of connecting things is mostly out of date.

## Trust

The safety notes are short and sharp. The first comes before any instructions: "Verify you trust each server before connecting it. Servers that fetch external content can expose you to prompt injection risk." A server that reads emails, web pages or customer messages brings other people's words into my context, and some people write words designed to steer an assistant.

The second is about shared configuration. A cloned repository "can't approve its own servers." Project servers in the committed file wait for you to trust the folder and approve them. That stops a stranger's repository from quietly connecting you to their server.

The security page adds a caution that's easy to miss: reviewing the project file doesn't show you every server a session can load, because servers also come from other scopes, from your app connectors, and from plugins. So "what's in the repository" is not "what I can reach."

And there's one feature I want you to know by name. A server's author can mark a tool as requiring approval on every single call. Claude Code then shows the permission prompt every time, "even in acceptEdits, auto, and bypassPermissions" modes, with no "don't ask again" option, and allow rules don't skip it. The manual's intended use: "tools whose permission prompt is itself the point, such as a consent or access-grant step where auto-approval would mean no human ever agreed." We don't write the Gmail server, so we can't set that flag ourselves. But it's exactly the behaviour we want for sending email, and we can get the same effect from our side with an ask rule or a hook, as in the last two episodes.

## What this means for us

First, connectors live on your account, and that's both convenient and a responsibility. Anything I can reach in one session I can reach in every session you start. So the account's connector list deserves a periodic tidy: remove what we no longer use, and keep the powerful ones, like Shopify and Gmail, under rules that make outward actions ask.

Second, project-scoped servers are how a repository brings its own tools. If one of our repositories ever needs a specific server, say a local image tool for the poster work, it goes in the committed project file, so cloud sessions get it too.

Third, treat incoming content as untrusted. Customer emails, competitor pages, supplier messages: all of it arrives through MCP into my context. Our habit of drafting rather than sending is the safety net. Keep it.

And fourth, for GitHub specifically, the manual's preference for command-line tools is worth noting for your laptop sessions. In the cloud, the GitHub connector is how I work, and that's fine.

Next time: cloud sessions, scheduled tasks and remote work. Where I actually live, and what comes with me when I move in.

---

## Sources (not read aloud)

All pages read on 23 October 2026.

- Connect Claude Code to tools via MCP (what you can do, the Gmail drafts example, server types, installation scopes local/project/user and `.mcp.json`, "A cloned repository can't approve its own servers", "Verify you trust each server before connecting it", claude.ai connectors "automatically available in Claude Code", requiring approval for a specific tool with `requiresUserInteraction`, tool search "Only tool names and server instructions load at session start"): https://code.claude.com/docs/en/mcp
- Manage costs effectively (reduce MCP server overhead, CLI tools "more context-efficient than MCP servers"): https://code.claude.com/docs/en/costs
- Security (MCP security: reviewing `.mcp.json` doesn't show every server): https://code.claude.com/docs/en/security

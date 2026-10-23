# Actually Reading the Manual, Episode 8: Connectors

*Part Two, Using Claude Well. Narrated by Claudine. Written on 23 October 2026 from Anthropic's own documentation, read that day. Sources are listed below the closing rule.*

Hello, Vincent. Claudine here.

Today is about connectors: how Claude reaches your other tools. You already use several. The Shopify store, Gmail, GitHub, the image tools. This episode explains what's happening underneath, and points to one setting I think we should change.

## What a connector is

The Help Center's definition: connectors "let Claude access your apps and services, retrieve your data, and take actions within connected services."

The most important sentence comes straight after. Claude "inherits each person's permissions from the connected service." If you can't see a file or a channel in the source system, the connector can't reach it either. A connector is never a back door. It's you, at one remove.

The same connectors work across the Claude app, the desktop app, Claude Code and the API. You find them in the Connectors Directory, under Customize, then Connectors. Each one has a page saying what it can read, what it can write, and where it's available.

## Remote connectors and desktop extensions

There are two kinds of connection, and a short Help Center article explains when to use which.

A remote connector is for a cloud service you sign into: Slack, Notion, Linear, GitHub, a shop platform. It's the default choice, and it works everywhere you use Claude: web, mobile, Cowork, desktop and Claude Code.

A desktop extension is for something that runs on your own computer: local files, a database on your machine, a desktop application. It installs with one click, like a browser extension. But it only works in the desktop app and in Claude Code, never on the web or your phone.

The article sums it up in one line: if the tool is a cloud product, use a remote connector; if it's on your machine, use a desktop extension.

## Building your own: custom connectors

Underneath, connectors speak MCP, the Model Context Protocol. The Help Center describes it as "an open standard, created by Anthropic, for AI applications to connect to tools and data." That means you can add your own: a custom connector pointing at any remote MCP server, including one you build. Free accounts get one custom connector; paid plans can add more.

There's one technical detail here that I'd underline, because it surprises developers. When you add a custom connector, Claude connects to your server from Anthropic's cloud, not from your own computer. That's true on every surface, even in the desktop app and Cowork. So your server must be reachable over the public internet. A server behind a VPN, or one that only works on your home network, won't connect, even if your own browser can reach it.

The article also gives a plain warning: custom connectors can point at services Anthropic hasn't checked, and once connected, Claude can read from them and act in them. Only connect what you trust.

## Interactive connectors

Some connectors now go further than text. Interactive connectors show a live app inside the conversation. The Help Center's example is asking about project status and having your Asana board open right there, so you can tick off tasks while you keep talking to Claude. They appear either as small cards in the chat or in a full-screen view.

The current list includes Amplitude, Asana, Box, Canva, Clay, Figma, Hex and Slack, and they're marked with an "Interactive" badge in the directory. They switch on automatically when the connector is connected.

## The setting I'd change: tool access

Now the practical heart of this episode. Every connector you add takes up room in each conversation, because Claude has to be told what tools exist before it can use them. The Help Center puts it plainly: with many connectors, "the combined overhead can limit how much room is left for your actual work."

So there's a setting called tool access, with three modes, chosen per conversation from the plus menu.

Auto is the default. Claude decides which connectors to load based on what you're doing.

Always available loads every connector at the start of every conversation. It's best for fewer than ten connectors you use all the time.

On demand loads nothing until Claude searches for the right connector for your request. It's best for large libraries of ten or more, or when conversations are hitting length limits. The trade-off is an extra step before Claude uses a tool.

The article's table even suggests what to choose. Under ten connectors you use constantly: always available. Thirty or more tools: on demand or auto. Conversations running out of room: on demand.

## Claude suggests apps, but doesn't buy

Once an app is connected, you don't have to name it every time. Claude brings it in when it fits what you're asking. The article's examples are consumer ones, like a hiking app for a weekend walk, but the principle is general. Three promises stand out.

Before Claude books, buys or reserves anything, it checks with you first. "Claude doesn't transact on its own."

When two connected apps could both help, Claude shows both and lets you choose, rather than silently picking one.

And there are no paid placements: no sponsored rankings and no advertising in which app Claude suggests.

## Plugins carry connectors too

One last connection to make. Plugins, which are episode ten, can bundle connectors. A plugin that bundles a remote connector works everywhere. A plugin that bundles a local one works in Cowork and Claude Code, but not in chat.

## What this means for us

Three practical points.

First, tool access. Our cloud sessions often have a big image-generation connector attached, with a couple of hundred tools, alongside Shopify, Gmail and GitHub. That's exactly the "large library" case. In the app, set tool access to on demand for conversations that don't need the image tools. Claude Code has a similar mechanism, which we'll meet in Part Four.

Second, if we ever build our own connector, for example a small read-only server over the FMP order system, it has to be reachable on the public internet, with proper authentication, because Claude connects from Anthropic's cloud. Plan for that from day one rather than discovering it later.

Third, remember the permission rule. A connector does whatever your account can do. The Gmail connector can send email, because you can. That's why our rule against sending email lives in writing and, as Part Two of the curriculum argued, should also live in the tool settings. A connector inherits your power, so your rules have to travel with it.

Next time: web search, research and extended thinking. Three ways to make Claude dig deeper, and which one to pick.

---

## Sources (not read aloud)

All pages read on 23 October 2026.

- Help Center, Use connectors to extend Claude's capabilities (definition, inherited permissions, directory, availability across surfaces): https://support.claude.com/en/articles/11176164-use-connectors-to-extend-claude-s-capabilities
- Help Center, When to use desktop and web connectors (remote connectors versus desktop extensions, plugins): https://support.claude.com/en/articles/11725091-when-to-use-desktop-and-web-connectors
- Help Center, Get started with custom connectors using remote MCP (MCP definition, connections from Anthropic's cloud, public-internet requirement, Free limit of one): https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp
- Help Center, Getting started with local MCP servers on Claude Desktop (desktop extensions): https://support.claude.com/en/articles/10949351-getting-started-with-local-mcp-servers-on-claude-desktop
- Help Center, Use interactive connectors in Claude: https://support.claude.com/en/articles/13454812-use-interactive-connectors-in-claude
- Help Center, Manage Claude's tool access (the three modes and the recommendation table): https://support.claude.com/en/articles/13730515-manage-claude-s-tool-access
- Help Center, How Claude suggests connected apps (confirmation before purchases, no paid placements): https://support.claude.com/en/articles/14730684-how-claude-suggests-connected-apps

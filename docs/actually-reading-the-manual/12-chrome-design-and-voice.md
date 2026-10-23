# Actually Reading the Manual, Episode 12: Chrome, Design and Voice

*Part Two, Using Claude Well. Narrated by Claudine. Written on 23 October 2026 from Anthropic's own documentation, read that day. Sources are listed below the closing rule.*

Hello, Vincent. Claudine here, for the last episode of Part Two.

Today we visit three specialist rooms: Claude in Chrome, which works inside your browser; Claude Design, for visual work; and Claude by voice, which is how you're listening to me now, in a way. Each gets a short visit.

## Claude in Chrome

Claude in Chrome is a browser extension. The Help Center describes it as letting Claude "read, click, and navigate websites alongside you." It's on all paid plans. You can use it from a side panel in Chrome, which is in beta, or as a tool from Cowork and Claude Code.

The Claude Code link is worth hearing, because it's a workflow we already half-use. The article describes it as build, test and verify. You build with Claude Code, deploy to an address Claude can reach, then test in the real browser with the extension. Claude can read console errors, network requests and the page's structure directly. The article names design verification, comparing a Figma mock-up with what was actually built, as one of its best uses.

## Three permission modes

Chrome has three permission modes, and the names have recently changed, so it's worth getting them straight.

Manually approve, which used to be called "Ask before acting". Claude pauses before each action and you choose Allow or Deny.

Automatically approve. Claude keeps working, but checks each action for safety in the background, blocking anything it judges unsafe and pausing when it needs you. In the Cowork side panel, this is the default.

Skip all approvals, which used to be called "Act without asking". Claude doesn't pause, and nothing checks its actions automatically. The article says to use it only when you completely trust every action, connector, file and app involved.

Some actions always need your explicit go-ahead in any mode, like downloading a file or entering sensitive information. And some are blocked whatever you choose.

## The safety numbers

The Chrome safety article is unusually specific, so here are its own words. The biggest risk is prompt injection: instructions hidden in web content that trick Claude into actions you didn't intend. There are classifiers on both sides: one checks incoming content for injection attempts, and another checks every action before it runs. The article reports that its current set-up "reduces attack success rates to less than 0.08%" in Anthropic's internal testing. And then, as always: "the chances of an attack are still non-zero."

One more line is worth remembering. Claude takes screenshots of the tabs it works in, so whatever is visible in those tabs becomes part of the conversation, and Claude can't filter sensitive content out of what it sees.

## Claude Design

Now Claude Design. It lets you create designs, interactive prototypes, one-pagers and other visual work by chatting with Claude. The important change this autumn is that Design is now one of the artifact templates from episode six, rather than a separate product. You can use it in any chat, in Claude Code, and from the Artifacts tab.

The standalone site at claude.ai slash design keeps working until it closes on the fourteenth of December 2026, and is read-only after that. If you have anything there, especially a design system, the migration article says to move it now.

The way Design works is a conversation paired with a canvas. You describe what you want, and Claude generates a working design beside the conversation. Then you refine it by talking, editing directly on the canvas, or leaving comments.

## Design systems

The feature that makes Design useful for a brand is the design system. The Help Center describes it as capturing "your colors, typography, components, and layout patterns", so Claude applies them to every new design and deck. Claude builds it from what you give it: a codebase with your components, a slide deck or document that reflects your visual identity, or brand guideline files like logos, colour palettes and type specifications. On individual plans, design systems are in beta and on by default.

There are two ways in. From a chat, you ask Claude to build a design system from your uploaded files, decks, logos and fonts. That works best for brand systems. Or, from Claude Code, a command called design-sync reads your design tokens and components directly from code. That works best for product systems built in code. And in the other direction, a command called design lets Claude Code turn a finished design into real code.

## Claude by voice

Last, voice. Voice mode lets you have spoken conversations with Claude: you talk, and Claude talks back. It's in beta, on all plans, on mobile, desktop and the web, but the article says it's "built to work best from your phone." It can use web search and your connected tools during a voice conversation, and it counts towards your normal usage limits.

On the Mac desktop app there's also something called quick entry. You double-tap the Option key to open Claude from any app, share a screenshot or a window, and optionally press Caps Lock to dictate. The dictation shortcut is off by default, because it takes over your Caps Lock key.

## What this means for us

Three things.

First, Chrome and the smoke test. Our daily smoke test uses a scripted browser, which is the right tool for a fixed check that must give the same result every day. Claude in Chrome is the right tool for the opposite: an exploratory look at a new page, or checking that a built product page matches its design. Keep both, for different jobs.

Second, a design system for Flagmaker and Print is a small investment with a long tail. Upload the logo, the brand colours, the fonts and a few good product pages, and every future one-pager, supplier deck or campaign mock-up comes out on brand. If anything already lives on the standalone Design site, move it before the fourteenth of December.

Third, voice. You already listen to these episodes on your walk. Voice mode is the other half: on the way back, you can talk through what you heard, with search and your connectors available. It's a good way to turn a briefing into decisions before you reach your desk.

That's the end of Part Two. Next time, Part Three begins: how to talk to Claude, from the manual's own prompting guide.

---

## Sources (not read aloud)

All pages read on 23 October 2026.

- Help Center, Get started with Claude in Chrome (availability, the Claude Code build-test-verify workflow): https://support.claude.com/en/articles/12012173-get-started-with-claude-in-chrome
- Help Center, Use Claude in Chrome safely (prompt injection, classifiers, the "less than 0.08%" figure, screenshots): https://support.claude.com/en/articles/12902428-use-claude-in-chrome-safely
- Help Center, Claude in Chrome permissions guide (the three modes and their former names): https://support.claude.com/en/articles/12902446-claude-in-chrome-permissions-guide
- Help Center, Get started with Claude Design (a template, the canvas workflow, design-sync and design in Claude Code, the standalone site closing 14 Dec 2026): https://support.claude.com/en/articles/14604416-get-started-with-claude-design
- Help Center, Set up your design system in Claude Design: https://support.claude.com/en/articles/14604397-set-up-your-design-system-in-claude-design
- Help Center, Migrate from standalone Claude Design to Claude: https://support.claude.com/en/articles/17440474-migrate-from-standalone-claude-design-to-claude
- Help Center, Use voice mode: https://support.claude.com/en/articles/11101966-use-voice-mode
- Help Center, Use quick entry with Claude Desktop on Mac: https://support.claude.com/en/articles/12626668-use-quick-entry-with-claude-desktop-on-mac

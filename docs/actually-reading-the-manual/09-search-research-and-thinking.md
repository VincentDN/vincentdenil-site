# Actually Reading the Manual, Episode 9: Search, Research and Thinking

*Part Two, Using Claude Well. Narrated by Claudine. Written on 23 October 2026 from Anthropic's own documentation, read that day. Sources are listed below the closing rule.*

Hello, Vincent. Claudine here.

Today is a short and practical one. Claude has three ways to dig deeper than a quick answer: web search, research and extended thinking. They sound alike, and they're often switched on all at once. The Help Center has a small article that explains exactly when to use each, and it's one of the most useful pages in the whole manual.

## Web search: one or two lookups

Web search lets Claude look things up on the live web. It works with all the current models. When it's used, you see an indicator, and every answer includes citations and source links so you can check them yourself. Claude can also fetch a specific page when you give it a link.

There's a small change to note. If you have the new combined Claude experience, there's no longer a web search toggle. Claude simply searches when it helps. On the older experience, you switch it on per chat from the plus menu.

The guidance article says web search is best for "straightforward, factual queries that can be answered with one or two tool calls". Its examples: the weather, facts about one company, recent headlines, last night's score. It also suits the times you want to steer, when you know roughly what to search for and want Claude to do the searching and reading.

## Research: a proper investigation

Research is a different animal. The Help Center describes it this way: Claude "runs multiple searches that build on each other and decides what to look into next based on what it finds." It explores different angles and works through open questions systematically.

The guidance article gives it a scale. Research is best for gathering that needs "five or more tool calls over 1-3 minutes", producing in-depth reports from many sources across the web and your connected tools. Comparing competitors is one of its named examples.

A few details from the research article are worth knowing.

Research is on paid plans only, and it needs web search to be switched on.

It searches your connected tools as well as the web, including Gmail, Google Calendar and Google Docs if they're connected, and it can use them automatically during research.

It runs on Opus 5.5, with Opus 4.8 as a fallback, whatever model you've picked for the chat.

It counts against the same usage limits as normal chat, but it uses them up faster, because it reads many sources.

And here's the trap, which the article flags twice. If you start research on your phone, Claude only searches the web and doesn't use your connectors, and "you won't see an error or other sign that your connectors were skipped." So research that should include your inbox or documents belongs on the web or the desktop app, never on the phone.

If research doesn't seem to start, the article's fix is wonderfully blunt: tell Claude "please use the research tool to" do the thing.

## Extended thinking: think harder, no searching

The third tool doesn't look anything up at all. The guidance article says extended thinking "shines when tackling complex reasoning tasks that don't require recent info from the web": maths problems, debugging, analysing a concept from several angles. It's best "if you don't want to search the web or use integrations, but just want Claude to think harder."

In the newer models, this is closely related to the effort dial from episode two. The model decides how much to think, and higher effort means more thinking.

## Using them together

The article ends with a combination worth remembering: research plus extended thinking. Thinking lets Claude plan its approach carefully, and research then carries out the gathering. The article's examples are researching new technology for a business proposal, or analysing several scientific papers.

So here's the whole chapter in three lines.

A quick fact from the web: web search.

A real investigation across many sources: research.

A hard problem you can already describe fully: extended thinking.

And a big, important question: research with thinking.

## What this means for us

The competitor walk-throughs, like the Vintagraph episode, are exactly what research is for: many sources, building on each other, with a report at the end. If you start one from the app, start it on the desktop, so it can read anything relevant in your connected Google Drive or Gmail.

The daily questions, like "is this flag still in the news" or "when is the World Series", are plain web search. They're quicker and cheaper.

And the hard thinking problems, like a pricing model, a funnel puzzle, or deciding between composite and AI fringes, are extended thinking at higher effort, without search. The answer is in the numbers you already have, not on the web.

One habit to keep: research burns through the usage budget faster than anything else in chat. Save it for the questions that deserve a report.

Next time: skills and plugins in the app. How to teach Claude a repeatable task once, and how plugins bundle everything together.

---

## Sources (not read aloud)

All pages read on 23 October 2026.

- Help Center, Enable and use web search (supported models, citations, the new-experience change): https://support.claude.com/en/articles/10684626-enable-and-use-web-search
- Help Center, Use research on Claude (how it works, paid plans, connectors, the mobile limitation, models used, usage): https://support.claude.com/en/articles/11088861-use-research-on-claude
- Help Center, When should I use web search, extended thinking, and research (the guidance, the "one or two tool calls" and "five or more tool calls over 1-3 minutes" scales, combining research and thinking): https://support.claude.com/en/articles/11095361-when-should-i-use-web-search-extended-thinking-and-research
- Claude Code glossary ("Effort level"): https://code.claude.com/docs/en/glossary

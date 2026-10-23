# Actually Reading the Manual, Episode 29: Context, Caching and Compaction

*Part Five, Building with Claude, Lightly. Narrated by Claudine. Written on 23 October 2026 from Anthropic's own documentation, read that day. Sources are listed below the closing rule.*

Hello, Vincent. Claudine here.

Last time I promised this was where the money is saved. It is. Today's four pages, context windows, prompt caching, compaction and batch processing, are the difference between an assistant that costs pennies a day and one that quietly costs a fortune. You've already met the ideas inside Claude Code. Today we see them as dials you can turn yourself.

## The context window is working memory

The context-window page starts with a definition I like. The context window is "all the text a language model can reference when generating a response, including the response itself." It's not what the model learned in training. It's "a 'working memory' for the model."

And straight after, the important caveat: "more context isn't automatically better. As token count grows, accuracy and recall degrade." A bigger desk doesn't help if you can't find anything on it.

The page lists what counts against the window: the system prompt, every message including tool results, images and documents, your tool definitions, and the answer Claude writes, thinking included. Most current models have a million-token window, and that's the default, with no special switch. A single request can include up to six hundred images or PDF pages, though you may hit size limits first.

The basic behaviour is accumulation. Each turn, your message and Claude's reply are added, and "previous turns are preserved completely." Through the API, nothing is forgotten until you or a feature removes it. That's why long agent tasks need a strategy.

## Prompt caching

The first strategy saves money without changing anything Claude sees. Prompt caching lets the API reuse the beginning of a request that it has seen recently. If your system prompt, examples and product catalogue are the same every time, they're processed once, and later requests read them from cache.

The pricing is set out as simple multipliers. Writing to the cache costs a little more than normal input: one and a quarter times for the standard five-minute cache, twice for a one-hour cache. Reading from it costs a tenth of normal input. So anything you send more than once or twice comes out far cheaper. These multipliers also stack with other discounts, such as batching.

There are two ways to use it. Automatic caching is a single setting on your request: the system moves the cache point forward as the conversation grows, which is "best for multi-turn conversations." Or you place explicit cache markers on particular blocks for finer control.

Two details are worth carrying around. The cache lives five minutes by default, refreshed free each time it's used, and the clock runs from the start of a request, not the end, so a slow answer eats into the window. And the cache covers the whole prefix, in order: tools, then system prompt, then messages. Change something early, such as a tool description, and everything after it is a cache miss. The practical rule: put what never changes at the front, and what changes at the end.

## Compaction

The second strategy changes what Claude sees. Compaction "replaces the older turns of a conversation with a summary that Claude writes on the server, so you need no summarization code of your own." The context-window page calls it "the primary strategy for context management" in long conversations and agent work. Its reason is not only staying under the limit. It also "keeps the active context small, because response quality degrades as a conversation grows."

There are two flavours, both in beta. Compaction on demand: you ask for a summary when you choose and swap it in. And compaction at a token threshold: one setting on ordinary requests, and the API summarises automatically when input passes your trigger. The page recommends on-demand "wherever it is available," because it gives more control: it can keep recent turns word for word, run in the background so the conversation doesn't pause, and use your own summarising prompt "when the default summary drops something a later turn needs."

That last option is the API version of what we discussed in the Claude Code episodes: tell the summariser what matters, so it doesn't lose the rule from the first page.

## Context editing

A finer tool sits alongside. Context editing clears particular content from the history by rule rather than summarising it. Its two main strategies are clearing old tool results, "best for agentic workflows with heavy tool use where old tool results are no longer needed," and clearing old thinking blocks. The page's framing is that context is "a finite resource with diminishing returns, and irrelevant content degrades model focus." An agent that has read fifty product pages doesn't need all fifty still in front of it to write the summary.

## Batch processing

And the last money-saver, which isn't about context at all. The Message Batches API takes a large set of requests and processes them asynchronously, "with most batches finishing in less than 1 hour while reducing costs by 50%." Each request is handled independently; you check back and collect the results. The page lists the obvious uses: large volumes of data, evaluations, analyses, anything where nobody is waiting at the other end.

## What this means for us

First, structure every prompt we build with the stable part first. House style, brand rules, the category list, examples: all at the front, cached. The specific product or customer message at the end. That one habit can cut the input bill for repeated jobs to a fraction.

Second, anything without a waiting human goes in a batch. Description rewrites, tag clean-ups, translation passes, nightly catalogue checks. Half price, and it stacks with caching.

Third, for any long-running assistant we build, plan the context strategy from day one. Clear old tool results as a matter of course, and compact with a custom summary prompt that names what must survive: the customer's order number, the agreed refund, the rule about never promising delivery dates.

And fourth, remember the warning that more context isn't better. The temptation with a million-token window is to paste the whole catalogue in. The better pattern is a tool that looks up the five products that matter.

Next time: Agent Skills and the Agent SDK. The same skills you know from Claude Code, now on the API, and Claude Code itself as a library.

---

## Sources (not read aloud)

All pages read on 23 October 2026.

- Context windows ("working memory", "more context isn't automatically better", what counts, 1M-token default, 600 images or PDF pages, accumulation, compaction as "the primary strategy"): https://platform.claude.com/docs/en/build-with-claude/context-windows
- Prompt caching (automatic and explicit caching, 5-minute default lifetime and refresh, lifetime measured from request start, 1-hour option, multipliers 1.25x and 2x for writes and 0.1x for reads, stacking with batch, full-prefix order tools/system/messages): https://platform.claude.com/docs/en/build-with-claude/prompt-caching
- Compaction (definition, on demand vs at a token threshold, beta, keep recent turns, background, custom summarisation prompt): https://platform.claude.com/docs/en/build-with-claude/compaction
- Context editing (tool result clearing, thinking block clearing, "finite resource with diminishing returns"): https://platform.claude.com/docs/en/build-with-claude/context-editing
- Batch processing (Message Batches API, "most batches finishing in less than 1 hour while reducing costs by 50%"): https://platform.claude.com/docs/en/build-with-claude/batch-processing

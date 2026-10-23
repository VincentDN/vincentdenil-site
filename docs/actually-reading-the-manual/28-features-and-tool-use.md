# Actually Reading the Manual, Episode 28: Features and Tool Use

*Part Five, Building with Claude, Lightly. Narrated by Claudine. Written on 23 October 2026 from Anthropic's own documentation, read that day. Sources are listed below the closing rule.*

Hello, Vincent. Claudine here, and welcome to Part Five.

Until now we've been reading the manual for things Anthropic built: the app, the prompting guide, Claude Code. Part Five turns the telescope round. It's about building with Claude, which means putting Claude inside your own tools: a product-description generator wired into the shop, a support assistant on the site, a nightly job that checks the catalogue. You decided we'd keep this light, and we will. Four episodes, no code read aloud, just enough to know what's on the shelf and what it costs to take it down.

Today: the map of features, and the one idea everything else rests on, tool use.

## The five areas

The developer platform's features page organises everything into five areas, and the list is a good mental map.

Model capabilities: ways to control how Claude reasons and formats its answers. Tools: ways to let Claude take actions. Tool infrastructure: discovery and orchestration at scale. Context management: keeping long sessions efficient. And files and assets: managing the documents you give Claude.

The page's advice for newcomers is short: "If you're new, start with model capabilities and tools. Return to the other sections when you're ready to optimize cost, latency, or scale." That's our plan too.

## What's on the shelf

A quick walk along the model-capabilities shelf, picking out what matters to us.

Context windows of up to a million tokens, enough for a whole catalogue export or a long contract. Adaptive thinking, where Claude decides how much to think, controlled by an effort setting. Batch processing, where you send lots of requests to be handled when convenient, and the page states the saving plainly: "Batch API calls cost 50% less than standard API calls." Citations, so Claude can point at "the exact sentences and passages it uses," which makes answers checkable. PDF support. And structured outputs, which "guarantee schema conformance": when you need a product record with exactly these fields, not a paragraph that happens to contain them.

On the tools shelf there are two kinds. Server-side tools, run by Anthropic: web search, web fetch, code execution in a sandbox, and an advisor tool that pairs a fast model with a smarter one for guidance on long jobs. And client-side tools, run by you: bash, a text editor, computer use, browser use, and memory.

The infrastructure shelf has Agent Skills, which get their own episode; an MCP connector that lets a plain API call reach remote MCP servers; tool search, for scaling to thousands of tools; and programmatic tool calling, where Claude calls your tools from inside code, saving round trips. And the context shelf has compaction, context editing, prompt caching and token counting, which are next episode's subject.

Many of these come with a label: stable, beta, deprecated. Beta, the page says, means preview features that "may change significantly." Worth checking before we build anything that needs to last.

## The tool-use contract

Now the important idea. The tool-use page describes it as a contract. "You specify what operations are available and what shape their inputs and outputs take; Claude determines when and how to call them." And then the sentence that makes it safe to build with: "The model never runs anything on its own. It emits a structured request, your code (or Anthropic's servers) runs the operation, and the result flows back into the conversation."

So when people say an AI "did" something, through the API it really asked. Your code decides whether to do it.

## Where tools run

The page sorts tools into three buckets by where the code runs.

User-defined tools: you write the description, you run the code, you return the result. "The vast majority of tool-use traffic" is this kind. A tool that looks up an order, checks stock, or drafts a reply in the help desk would all be ours.

Anthropic-schema tools: Anthropic publishes the description but you run the code. These are memory, bash, text editor, computer and browser. Why use them rather than write your own? Because "these schemas are trained-in." Claude has practised on thousands of successful runs with exactly these tools, so it uses them more reliably.

Server-executed tools: web search, web fetch, code execution and tool search. Anthropic runs them; you switch them on and read the result.

## The loop

For tools you run, your application drives what the page calls the agentic loop, the same loop we met in Claude Code but now written by you. Send the request with the list of tools. Claude replies that it wants to use one. Your code runs it and sends back the result. Repeat until Claude says it's finished. Server tools run their own version of the loop inside Anthropic's infrastructure, with an iteration limit; if they hit it, the answer comes back paused, and you send it again to let Claude carry on.

## When to use tools, and when not

This section is pure good sense. Tools fit when the task needs something text alone can't provide. Actions with side effects: "Sending an email, writing a file, updating a record. The model can describe these actions, but only a tool can perform them." Fresh or external data, such as current prices or stock. Guaranteed-shape outputs. And calling into existing systems.

There's a lovely rule of thumb: "if you're writing a regex to extract a decision from model output, that decision should have been a tool call."

And tools don't fit when the model can answer from what it knows, when there are no side effects, or when the extra round trip would cost more than the work.

## Steering when Claude reaches for a tool

By default Claude decides each turn whether to call a tool or just answer. The page says that boundary is steerable with plain instructions in the system prompt, such as "Use the tools to investigate before responding", and that you can require a tool call outright with a setting. Adding strict mode to a tool makes Claude's calls always match the schema exactly.

And a warning worth repeating for anyone building a shop assistant. If the user hasn't supplied a required detail, Opus is "much more likely to recognize that a parameter is missing and ask for it." Sonnet "might also infer a reasonable value." In other words, it might guess. For an order lookup, a guessed order number is a bad answer delivered confidently.

## What this means for us

First, the contract is our safety model. Through the API, Claude only ever asks; our code acts. That means the guardrails we put in Claude Code, ask before sending, never publish without you, can be written straight into our own tools as code, not prompts. A send-email tool can simply not exist, and a draft-email tool can exist in its place.

Second, structured outputs and strict tools are made for catalogue work. Product titles, tags, descriptions and metafields with a fixed shape, validated before anything touches Shopify.

Third, the batch discount changes the economics of big catalogue jobs. Rewriting thousands of product descriptions doesn't need an instant answer. Sent as a batch, it costs half as much.

And fourth, for anything customer-facing that looks things up, require the missing details to be asked for, not guessed. That's one sentence in a system prompt and one required field in a tool.

Next time: context, caching and compaction, which is where the money is saved.

---

## Sources (not read aloud)

All pages read on 23 October 2026.

- Features overview (five areas, "If you're new, start with model capabilities and tools", feature tables, batch "cost 50% less", citations, structured outputs, server-side and client-side tools, tool infrastructure, context management, availability labels): https://platform.claude.com/docs/en/build-with-claude/overview
- How tool use works (the tool-use contract, "The model never runs anything on its own", three buckets, "these schemas are trained-in", the agentic loop, server-side loop and `pause_turn`, when to use tools and when not, the regex rule of thumb): https://platform.claude.com/docs/en/agents-and-tools/tool-use/how-tool-use-works
- Tool use with Claude (when Claude uses tools, steering with the system prompt, `tool_choice`, strict tool use, Opus vs Sonnet on missing parameters): https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview

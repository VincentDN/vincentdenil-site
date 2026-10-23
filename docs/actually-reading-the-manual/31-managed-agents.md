# Actually Reading the Manual, Episode 31: Managed Agents

*Part Five, Building with Claude, Lightly. Narrated by Claudine. Written on 23 October 2026 from Anthropic's own documentation, read that day. Sources are listed below the closing rule.*

Hello, Vincent. Claudine here, for the last episode of Part Five.

We've now seen three ways to build with Claude. Call the API and write the loop yourself. Use the Agent SDK and get Claude Code's loop as a library. Today's is the third: Managed Agents, where Anthropic runs the whole thing. You describe the agent, Anthropic hosts it, gives it a sandbox, keeps its history, and you talk to it from your own software. It's in beta, but it's the most direct route from "we have an idea for an assistant" to "it's running."

## What it is

The overview puts it in a two-column comparison. The Messages API is "direct model prompting access," best for "custom agent loops and fine-grained control." Managed Agents is a "pre-built, configurable agent harness that runs in managed infrastructure," best for "long-running tasks and asynchronous work."

And in a sentence: "Instead of building your own agent loop, tool execution, and runtime, you get a fully managed environment where Claude can read files, run commands, browse the web, and run code securely." The page adds that the harness has prompt caching and compaction built in, the two money-savers from episode twenty-nine, so you don't have to wire them up yourself.

## Four concepts

Managed Agents is built on four ideas, and they map neatly onto things we already know.

An agent: "the model, system prompt, tools, MCP servers, and skills." You create it once and refer to it by name.

An environment: where its sessions run. Either an Anthropic-managed cloud sandbox or a self-hosted sandbox on your own machines. Several sessions can share one environment, but "each session gets its own isolated sandbox (a fresh Linux container)." That's the same arrangement as the cloud sessions I live in.

A session: "a running agent instance within an environment, performing a specific task."

And events: the messages back and forth between your application and the agent: your turns, tool results, status updates. They stream back as they happen, and the full history is kept on Anthropic's servers so you can fetch it later. You can also send more messages while the agent is working, to steer it, or interrupt it.

## The toolset

The built-in tools will sound familiar after Part Four: bash, read, write, edit, glob and grep for files, plus web fetch and web search. You can switch individual tools off, and each one can carry a permission policy that decides whether its calls run without confirmation, require confirmation, or are judged one by one by the server. You can add your own tools too, which your application runs and answers, and MCP servers for outside services.

Two practical details. If a tool's output is very large, over about a hundred thousand characters, it's written to a file in the sandbox and Claude gets a preview with the path, rather than a flood in its context. And for MCP servers that need you to log in, credentials go in what the docs call a vault, where Anthropic stores the OAuth credentials and handles refreshing them. So, as with network secrets in our cloud sessions, the keys don't sit inside the agent's sandbox.

## When to use it

The page lists the workloads it's built for. Long-running execution, "tasks that run for minutes or hours with multiple tool calls." Cloud infrastructure, with sandboxes that already have packages and network access. Self-hosted execution, for compliance or data-residency needs. Minimal infrastructure, with no need to build your own loop or sandbox. Stateful sessions, with files and history that persist across interactions. And scheduled execution, recurring runs on a timetable.

## What it costs

The pricing page is short and clear. Managed Agents is billed on two things: tokens and session runtime. Tokens are billed at the normal model rates, with the usual caching discounts. Runtime is eight US cents per session-hour, measured to the millisecond, and it only counts while the session is actually running. Time spent idle, "waiting for your next message or a tool confirmation," doesn't count. You aren't separately charged for container hours.

One modifier that does not apply: the batch discount. "Sessions are stateful and interactive. There is no batch mode." So the half-price trick from episode twenty-nine belongs to the plain API.

And there's a feature I'd insist on: a session budget. You can give each session a hard ceiling on its cost at public list prices, and once the running total reaches it, the session "stops issuing new model requests." An agent that loops forever can't run up a bill past the number you set.

## The fine print

Two things worth knowing before building anything real.

First, it's beta. Every request needs a beta header, and "behaviors may be refined between releases." A couple of features, such as MCP tunnels, are in an even earlier research preview.

Second, data. Because it's stateful by design, storing "conversation history, sandbox state, and outputs server-side," Managed Agents "is not currently eligible for Zero Data Retention or HIPAA Business Associate Agreement coverage." You can delete sessions and files whenever you like through the API. For a shop handling customer names and addresses, that's a point to weigh: keep personal data in the session only where it's needed, and delete sessions when the job is done.

## What this means for us

First, Managed Agents is the obvious home for the assistants we keep sketching. A supplier-feed importer, a nightly catalogue auditor, a customer-service drafter that reads the inbox and writes drafts: each is a long-running, tool-using job that doesn't need a person watching, which is exactly the workload the page describes. We'd write the agent once, with its rules in the system prompt and its outward tools set to require confirmation.

Second, the session budget is the cost guardrail we've wanted. Give every session a ceiling and the worst case is known before it starts.

Third, keep using the plain API with batching for the big, dumb, bulk jobs. Rewriting five thousand descriptions doesn't need a sandbox or a session. It needs a batch at half price.

And fourth, we're not in a hurry. Everything in this part is something to reach for when a real need appears. For now, Claude Code in the cloud does most of what we'd want a managed agent to do, with you in the loop. When the day comes that a job should run without either of us, this is the page to come back to.

That's Part Five. The last part is short: Trust and Terms. The rules about what Claude may be used for, what happens to your data, and a closing reading list.

---

## Sources (not read aloud)

All pages read on 23 October 2026.

- Claude Managed Agents overview (Messages API vs Managed Agents, "pre-built, configurable agent harness", built-in caching and compaction, four concepts agent/environment/session/events, how it works, when to use it, supported tools, beta header, research-preview features, not eligible for ZDR or HIPAA BAA, deleting sessions and files): https://platform.claude.com/docs/en/managed-agents/overview
- Environments ("each session gets its own isolated sandbox (a fresh Linux container)"): https://platform.claude.com/docs/en/managed-agents/environments
- Tools (agent toolset, permission policies, custom tools, large outputs written to the sandbox): https://platform.claude.com/docs/en/managed-agents/tools
- Sessions (session budget as a hard ceiling on list cost, MCP authentication through vaults): https://platform.claude.com/docs/en/managed-agents/sessions
- Pricing, Claude Managed Agents section (tokens and session runtime, $0.08 per session-hour while running, batch discount not applicable): https://platform.claude.com/docs/en/about-claude/pricing

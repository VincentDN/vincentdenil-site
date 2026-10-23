# Actually Reading the Manual, Episode 17: The Use-Case Guides

*Part Three, Talking to Claude. Narrated by Claudine. Written on 23 October 2026 from Anthropic's own documentation, read that day. Sources are listed below the closing rule.*

Hello, Vincent. Claudine here, for the last episode of Part Three.

The developer documentation has a small shelf of production guides for common jobs. There are five: ticket routing, a customer support agent, content moderation, legal summarisation, and a commerce agent. Three of those describe things we do every week. Today I'll walk you through the commerce agent in detail, then the support and routing guides more briefly.

## Three ways to build

The shelf's overview page starts with a useful map of how much work you hand to Anthropic.

The Messages API gives you the most control: you write the agent loop and run your own tools.

The Claude Agent SDK sits in the middle: it gives you the agent loop and tool handling, in a process you run.

And Claude Managed Agents offloads the most: Anthropic hosts the loop, the tools and the runtime.

Keep that in mind, because the commerce guide comes in all three flavours.

## The commerce agent

The commerce guide describes "Claude for commerce", an open-source blueprint with two agents: a shopping agent that customers use inside your app, and a merchant agent for the people running the store. It comes with working versions on all three build paths, examples for retail, travel, telecom and entertainment, and a Claude Code plugin to scaffold the same design against your own systems. The guide is careful to say it's "a reference implementation to fork and adapt, not a supported product."

The design choices are the interesting part, so let me take them one agent at a time.

## The shopping agent

The shopping agent can search the catalogue, compare options and turn a described need into a shortlist and a recommendation. It can plan a coordinated set of items toward a goal, like a trip or an event, within a budget. It shows products, comparisons, order status and the cart as small interface components right in the conversation. It fills the cart and hands off to your checkout. It answers order, delivery and returns questions from your own systems. And it remembers what a customer asks it to remember.

Three safety rules in its design stand out.

"No method on that interface places an order or moves money." The agent fills a cart. A person checks out.

The agent states products, prices, availability and store terms only from tool results in the conversation. It never quotes a price from memory.

And the cart only accepts product IDs that a catalogue or order tool actually returned in that session. The agent can't invent a product into the cart.

The guide also describes the shape of the agent: one agent with five skills that load on demand, for search, purchase research, planning, customer care, and memory. Rules needed on most turns, like grounding and cart behaviour, live in the system prompt instead. That's exactly the split we discussed in Part Two of the curriculum: always-needed rules in the always-on file, the rest in skills.

## The merchant agent

The merchant agent is for the store's own people, and it reads like a job description for an operations assistant. It explains how the business is doing: why a metric moved and which segment drove it. It presents a daily digest of what needs attention, like low stock, slow movers and order exceptions. It improves listings and fixes catalogue data from material the operator supplies. It recommends price changes and promotions within the store's guardrails, with a preview of the margin. And it drafts marketing campaigns.

Its safety design is the part I'd frame and hang on the wall.

Every change the merchant agent proposes, whether a listing update, a price change, an inventory action, a promotion or a campaign, is a staged change with its own ID, shown to the operator as a preview card.

Guardrails, like the maximum price move, the deepest allowed promotion, the largest restock, the campaign budget and protected fields, are checked when the change is staged and again when it's applied.

The change applies only after a person approves it outside the conversation, with a button or a confirmation prompt.

And the guide says it in one blunt sentence: "An approval typed in chat approves nothing."

## The customer support guide

The support guide is a step-by-step tutorial for a support chatbot. Three of its ideas are worth carrying away.

First, write out an ideal conversation before you build anything, ideally in the actual words, so you know the tone, length and detail you want.

Second, break the conversation into separate tasks, like greeting, product information, staying on topic and generating a quote, so you can prompt and test each one.

Third, its guardrails list, which includes items I'd copy word for word: avoid contractual commitments, so the agent doesn't make promises or agreements it isn't authorised to make; cross-check answers against company policy; and strip out personal information unless it's explicitly needed.

It also suggests a model: Opus 5.5 for most support work, with Haiku for flows that need to be very fast or handle a lot of retrieval.

## Ticket routing and moderation

The ticket-routing guide is about classifying incoming tickets by intent, urgency and type. It recommends Haiku 5.5 for this job, at low effort, as the fastest and cheapest current model. Its key point is that routing is only as good as your list of categories: Claude's ability to route tickets "is directly proportional to how well-defined your system's categories are." Its example categories include order status, shipping, returns and exchanges, and order changes, which could have been copied from our inbox.

The content moderation guide covers using Claude to filter and moderate content. I haven't walked through it in detail today, but it belongs on our reading list, given our own moderation gate for flags.

## What this means for us

This episode is the bridge between the manual and our roadmap, so let me be specific.

First, our customer-service desk already follows the merchant agent's best rule in its own way. Drafts wait in Gmail for you, and nothing goes out on a word in chat. The guide's sentence, "an approval typed in chat approves nothing", is the formal version of our per-email permission rule. I'd add it to the customer-service instructions word for word.

Second, the merchant agent is a template for the operations work we discussed in the founder's operating system episode. Its daily digest of what needs attention is the approval inbox. Its staged changes with guardrails are exactly how the catalogue factories should work: price changes capped, protected fields locked, everything previewed, nothing applied without your go.

Third, the shopping agent's grounding rule is the cure for the most dangerous mistake a shop agent can make. Never state a price, stock level or delivery time from memory; only from the store's own data in that conversation. If we ever put an assistant in front of customers, on the site or through an AI shopping channel, that rule comes first.

And fourth, the blueprint ships with a Claude Code plugin that interviews you about your stack and scaffolds the agents. When the time comes to build an FMP shopping assistant, that's the place to start, not a blank page.

That's the end of Part Three. Part Four is the biggest part of the series: Claude Code, properly, starting with how it actually works.

---

## Sources (not read aloud)

All pages read on 23 October 2026.

- Guides to common use cases (the five guides, the three build paths): https://platform.claude.com/docs/en/about-claude/use-case-guides/overview
- Commerce agent (Claude for commerce blueprint, shopping agent and merchant agent capabilities and safety design, "An approval typed in chat approves nothing", the Claude Code plugin commands): https://platform.claude.com/docs/en/about-claude/use-case-guides/commerce-agents
- Customer support agent (ideal interaction, task breakdown, model choice, guardrails including contractual commitments and personal information): https://platform.claude.com/docs/en/about-claude/use-case-guides/customer-support-chat
- Ticket routing (categories, model choice): https://platform.claude.com/docs/en/about-claude/use-case-guides/ticket-routing
- Content moderation (listed, not walked through): https://platform.claude.com/docs/en/about-claude/use-case-guides/content-moderation

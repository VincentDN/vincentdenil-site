# Actually Reading the Manual, Episode 2: The Models

*Part One, Orientation. Narrated by Claudine. Written on 23 October 2026 from Anthropic's own documentation, read that day. Sources are listed below the closing rule.*

Hello again, Vincent. Claudine here.

Last time we walked down the corridor of front doors. Today we look at what's behind all of them: the models. If you've ever stared at the model picker and wondered which name to choose, this is your episode.

## Four current models, one name per job

As of today, the documentation lists four current Claude models. Each has a one-line job description, and those lines are worth learning by heart, because they're the manual's own advice.

Claude Fable 5.1 is "for demanding reasoning and long-horizon agentic work". It's the most capable model open to all customers. It's also the slowest and the most expensive: ten dollars per million input tokens and fifty per million output tokens.

Claude Opus 5.5 is "for long-running agentic coding and knowledge work". It costs four dollars in and twenty out, at moderate speed.

Claude Sonnet 5.5 is "the best combination of speed and intelligence". It costs two dollars in and ten out, and it's fast.

Claude Haiku 5.5 is for "high-volume, latency-sensitive tasks such as classification, extraction, and routing". It's the fastest and cheapest, with prices starting at ten cents in and fifty cents out per million tokens.

All four share some generous basics. Each has a context window of one million tokens, which the overview says is roughly five hundred and fifty thousand English words on the current tokenizer. Each can write up to a hundred and twenty-eight thousand tokens in a single reply. And each has a reliable knowledge cutoff of June 2026.

There's also a fifth name you may see: Claude Mythos 5.1. The manual says it offers the same capabilities as Fable 5.1, but only to organisations verified through Anthropic's verification programmes, such as the Cyber Verification Programme. For a flag shop, it isn't a door we need.

## The manual's default: start with Opus

Here's the sentence that appears on almost every model page: "If you're unsure which model to use, start with Claude Opus 5.5 for most workloads." Fable 5.1 is for when your tests on Opus, even at higher effort, still fall short.

That's a change from the old folk wisdom of "use the biggest model you can afford". The manual is telling you that Opus is the sensible middle, and that Fable is a specialist tool you reach for with evidence.

The guide called Choosing the Right Model offers two ways to start.

Option one is efficiency-first. Begin with Haiku, test your use case thoroughly, and upgrade only where you find a real gap. The guide recommends it for prototypes, tight latency, cost-sensitive work and high-volume, straightforward tasks.

Option two is capability-first. Begin with Opus 5.5, tune your prompts for it, and then make things cheaper over time, by lowering effort or moving down a model. Only if Opus at its highest effort settings still falls short do you move up to Fable.

Then there's a selection matrix, which is worth hearing as a list.

For the highest available capability, start with Fable 5.1. The examples are agent sessions that run for hours, multistep deep research, and analysis carried through to a finished document, spreadsheet or deck.

For complex agentic coding and enterprise work, start with Opus 5.5. The examples are multihour autonomous coding agents, large refactors, vision-heavy work and computer use.

For everyday coding, agents and enterprise workloads where speed matters, start with Sonnet 5.5. The examples are code generation, data analysis, content creation and visual understanding.

For the lowest latency and price, start with Haiku 5.5. The examples are real-time applications, high-volume processing and subagent tasks.

## The dial you may be ignoring: effort

The most useful sentence in the whole chapter is easy to miss. The guide says: "Tuning effort is often a better lever than switching models."

Effort is a setting that tells the model how hard to think. The Claude Code glossary describes it as controlling adaptive reasoning, which lets the model decide whether, and how much, to think on each step. Higher effort means more thinking and deeper reasoning. Lower effort is faster and cheaper.

Each model has a default. Fable 5.1 and Sonnet 5.5 default to high. Opus 5.5 and Haiku 5.5 default to medium. The guide's advice is to start at the default and move up or down based on your tests.

So before you switch a stubborn task from Opus to Fable, try Opus at a higher effort. Before you move a routine job from Sonnet to Haiku, try Sonnet at a lower one. One dial, same model, very different bill.

## Names that don't change under your feet

A short technical note, because it matters for anything you automate. Every Claude model ID is what the manual calls a pinned snapshot. When you ask for `claude-opus-5-5`, you get the same model for the lifetime of that ID. It won't quietly change underneath you.

From the 4.6 generation onwards, the IDs are simple: the word claude, the family name, and the version number. Older models carried a date in the name. Each model also has a published retirement promise. The current four won't be retired sooner than September or October 2027, depending on the model. Older models are listed on a deprecations page with their own dates.

The practical lesson is to write the model you mean, and check the deprecations page once a quarter. A scheduled agent pinned to a retired model simply stops.

## When Claude quietly changes models

One more thing from the Help Center, because you'll see it one day and wonder what happened.

Opus 5 and Opus 5.5 run automatic safety checks on every request. That includes the content Claude reads, such as memory, connector results, web pages and files, not just your message. A narrow set of higher-risk requests then either falls back to a less capable model or gets blocked.

The categories are specific. Offensive cybersecurity work, like writing exploits or penetration testing, falls back to Opus 4.8. Dual-use biology questions on Opus 5.5 fall back to Opus 5. A small set of frontier AI-development tasks are also covered. Requests that try to extract the model's internal reasoning, which the article calls distillation, are blocked outright.

When a fallback happens, you see a notice, and the reply is labelled with the model that answered. Then the model picker stays on the fallback model for the rest of the conversation, until you switch back.

For us this is mostly a curiosity. But one case is real: a flag-history question that touches extremist movements won't trigger these classifiers, while a customer's email asking for help "hacking" a website might. If an agent suddenly feels a little less clever mid-conversation, check the model label.

## What this means for us

Here's how the manual's advice maps onto our work, in my judgement.

Haiku 5.5 is the natural model for the high-volume, simple jobs: matching flag ideas against the corpus, tagging, routing customer emails by type. These are exactly the tasks the manual calls classification, extraction and routing.

Sonnet 5.5 suits product descriptions, catalogue copy and quick data pulls.

Opus 5.5 is the default for agent sessions in the repositories, which is where most of our work happens, and for writing episodes like this one.

Fable 5.1 is for the rare jobs that genuinely need it: a long research brief, a multi-day project, or the moment Opus at high effort keeps missing.

And before you change models, try the effort dial.

Next time: the money. Usage limits, length limits, the five-hour window and the weekly cap, usage credits, and the one environment variable that can quietly move you from your subscription to the API meter.

---

## Sources (not read aloud)

All pages read on 23 October 2026.

- Models overview (comparison table, pricing, context, cutoffs, retirement dates): https://platform.claude.com/docs/en/models/overview
- Choosing the right model (two approaches, selection matrix, effort advice, Mythos 5.1): https://platform.claude.com/docs/en/about-claude/models/choosing-a-model
- Intro to Claude (the "start with Opus 5.5" recommendation): https://platform.claude.com/docs/en/intro
- Model IDs and versioning: https://platform.claude.com/docs/en/about-claude/models/model-ids-and-versions
- Model deprecations: https://platform.claude.com/docs/en/about-claude/model-deprecations
- Claude Code glossary ("Effort level"): https://code.claude.com/docs/en/glossary
- Help Center, Why Claude switched models in your conversation with Opus 5 or Opus 5.5: https://support.claude.com/en/articles/16049681-why-claude-switched-models-in-your-conversation-with-opus-5-or-opus-5-5

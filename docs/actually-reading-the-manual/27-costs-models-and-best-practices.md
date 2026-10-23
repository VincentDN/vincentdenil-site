# Actually Reading the Manual, Episode 27: Costs, Models and Best Practices

*Part Four, Claude Code, Properly. Narrated by Claudine. Written on 23 October 2026 from Anthropic's own documentation, read that day. Sources are listed below the closing rule.*

Hello, Vincent. Claudine here, for the last episode of Part Four.

We've covered what Claude Code is, what it remembers, what it's allowed to do, and how it checks its work. Today is about the two things that decide whether all of that is worth it day to day: what it costs, and how to use it well. Three pages: model configuration, cost management, and best practices. The last one is the best page in the whole Claude Code manual, and I've saved it for the end on purpose.

## Choosing a model

Claude Code lets you pick a model by alias, so you don't have to remember version numbers. The current list: fable, for "your hardest and longest-running tasks"; opus, "for complex reasoning tasks"; sonnet, "for daily coding tasks"; and haiku, "for simple tasks." There's also best, which picks Fable where it's available to you and Opus otherwise. And opusplan, a neat hybrid that uses Opus while planning and then switches to Sonnet to carry out the plan.

The manual describes the Fable models as "the most capable models in Claude Code, suited to tasks larger than a single sitting." Depending on your plan, though, Fable usage can bill to usage credits rather than your plan's included limits, and the model picker says so on the Fable row. Worth checking before you reach for it by habit.

You can switch mid-session with the model command, set a default, or pin a specific version by its full name. And the manual has a short troubleshooting section on why a new session starts on a different model than you picked. Usually something with higher priority, such as a project setting or an environment variable, is overriding your choice.

## Effort, fallbacks and fast mode

Separately from the model, there's effort. Effort levels control how much the model thinks at each step. Lower is faster and cheaper for straightforward tasks; higher gives deeper reasoning for hard ones. The current models offer low, medium, high, extra high and max. One detail worth knowing: the newest Opus, Sonnet and Haiku start at medium by default, and max applies only to the current session unless you deliberately make it permanent.

The page also documents automatic fallback. The newest models run with safety classifiers that most often flag cybersecurity and biology content. When a request is flagged, Claude Code can re-run it on a designated earlier model and shows a notice when it does. If you ever see that notice during, say, a security review of the shop, that's what happened.

And then fast mode. It's "a high-speed configuration for Claude Opus, making the model up to 2.5x faster at a higher cost per token." It isn't a different model. The manual recommends it for interactive work where waiting hurts, like rapid iteration or live debugging, and recommends standard mode for long autonomous tasks, batch work and anything cost-sensitive. One trap: the first time you switch fast mode on in a conversation, you pay the full fast-mode price for the whole existing context.

## Where the tokens go

The cost page starts with the usage command, which shows your session's token use, a prompt-cache summary and, on subscription plans, a breakdown of what's eating your limits: skills, subagents, plugins, individual connected servers. It even recommends changes for anything behind ten per cent or more of recent usage.

Then it explains why usage climbs in a long session. The core reason is plain: Claude Code "sends your full conversation with every request." Caching makes re-reading cheaper, but a one-line question in a session that's been open all day still draws on the whole conversation. Your first message after a long break misses the cache and reprocesses everything. Scheduled tasks inside a session fire even when it's idle. Subagents and teammates send their own requests. And compaction itself "is itself a large request." When you want a fresh start rather than continuity, clearing the session costs nothing.

The page's advice for keeping costs down reads like a summary of this whole part. Clear between unrelated tasks. Choose the right model: Sonnet for most coding, Opus for hard architecture. Disable connected servers you're not using. Use hooks to pre-filter big outputs, so Claude sees fifty lines of errors, not ten thousand lines of log. Move specialised instructions out of CLAUDE.md and into skills, and keep CLAUDE.md under two hundred lines. Delegate verbose work to subagents, ideally on smaller models. Write specific prompts, because vague ones "trigger broad scanning." And plan before implementing, so you don't pay twice for the wrong direction.

## Best practices

Now the best page. It opens with this, and if you remember one sentence from Part Four, make it this one: "Give Claude a check it can run: tests, a build, a screenshot to compare. It's the difference between a session you watch and one you walk away from."

The reasoning follows. "Claude stops when the work looks done. Without a check it can run, 'looks done' is the only signal available, and you become the verification loop." Give it something that returns a pass or fail, and the loop closes on its own: do the work, run the check, read the result, try again.

It describes four ways to make that check bite, from light to heavy. In one prompt, by asking Claude to run the check and iterate. Across a session, with a goal condition that a separate evaluator re-checks after every turn. As a hard gate, with a stop hook that won't let the turn end until the check passes. And by a second opinion, a verification subagent that tries to refute the result, "so the agent doing the work isn't the one grading it." And it ends that section with a habit I'd like us both to keep: have Claude show evidence, not assert success. The test output, the command and what it returned, the screenshot.

The rest of the page is good advice in the same spirit. Explore first, then plan, then code. Give specific context. Let Claude interview you about a complicated task before it starts. Course-correct early.

And then a list of common failure patterns that I could have written from our own logs. The kitchen-sink session, where unrelated tasks pile up in one context; the fix is to clear between them. Correcting over and over; after two failed corrections, clear and write a better first prompt. The over-specified CLAUDE.md; prune ruthlessly. The trust-then-verify gap, a plausible implementation that misses edge cases; "If you can't verify it, don't ship it." And the infinite exploration, an unscoped investigation that reads hundreds of files; scope it narrowly or hand it to a subagent.

## What this means for us

First, every recurring job I do for you should have a check. The flag maker already has its smoke test: that's the model. The morning walk could check that every link resolves and every product named exists in the shop. Catalogue imports should check that every product stayed a draft. Episodes like this one get a build script that would fail loudly if a file went missing. Where there's a check, I can finish the work without you watching.

Second, sessions should be shorter and more focused. The kitchen-sink session is our most common pattern, and the cost page explains exactly why it's also our most expensive one. One session per job, cleared between jobs, with the durable lessons written into files.

Third, the model choice should be deliberate. Sonnet for routine edits and data work, Opus for writing and hard reasoning, Fable for the long multi-hour builds when it's worth the credits, and fast mode only when you're sitting there waiting.

And that, Vincent, is Part Four. If I had to boil ten episodes into one paragraph: instructions are advice, so keep them short and make sure they load. Permissions and hooks are the locks, so put the rules that touch the outside world there. Commit everything that matters, because that's all the cloud sees. And give every job a check, because a check is what turns supervision into delegation.

Part Five is lighter: building with Claude, for when we want Claude inside our own tools rather than the other way round.

---

## Sources (not read aloud)

All pages read on 23 October 2026.

- Model configuration (aliases fable, opus, sonnet, haiku, best, opusplan; Fable "the most capable models in Claude Code", usage credits; setting a model and troubleshooting; effort levels and defaults; automatic model fallback): https://code.claude.com/docs/en/model-config
- Speed up responses with fast mode ("up to 2.5x faster at a higher cost per token", not a different model, when to use it, first-enable cost): https://code.claude.com/docs/en/fast-mode
- Manage costs effectively (`/usage` and plan usage breakdown, "Why usage climbs in a long session", "sends your full conversation with every request", compaction "is itself a large request", reduce token usage): https://code.claude.com/docs/en/costs
- Best practices ("Give Claude a check it can run", "you become the verification loop", four ways to gate, "show evidence", explore then plan then code, common failure patterns): https://code.claude.com/docs/en/best-practices

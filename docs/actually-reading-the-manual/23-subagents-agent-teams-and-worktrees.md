# Actually Reading the Manual, Episode 23: Subagents, Agent Teams and Worktrees

*Part Four, Claude Code, Properly. Narrated by Claudine. Written on 23 October 2026 from Anthropic's own documentation, read that day. Sources are listed below the closing rule.*

Hello, Vincent. Claudine here.

Today is about doing several things at once. The manual now has a whole family of ways to run more than one Claude on a job, and a page whose only purpose is to help you choose between them. It's a good page, because the honest answer to "should I parallelise this?" is often "not yet", and it says so in its own way.

## The three questions

The chooser page boils it down to three questions.

Who coordinates the work? If Claude delegates and collects results inside one conversation, that's subagents. If you hand off independent tasks and check back later, that's what it calls agent view. If Claude plans, assigns and supervises a group of workers, that's agent teams, which are experimental and off by default. And if a script holds the plan instead of Claude's turn-by-turn judgement, that's a dynamic workflow.

Do the workers need to talk to each other? Subagents report back only to the conversation that spawned them. Sessions you dispatch from agent view report only to you. Teammates in an agent team message each other directly.

Do they touch the same files? If so, isolate them with worktrees, or split the work so each one owns a different set of files.

Let me take the four in turn.

## Subagents

A subagent is a specialised helper with its own context window, its own system prompt, its own tool access and its own permissions. The manual's reason to use one is wonderfully concrete: use one "when a side task would flood your main conversation with search results, logs, or file contents you won't reference again." The subagent does the messy reading in its own context and returns only the summary.

Two caveats from the page. First, a subagent's requests still count towards your usage limits; the main context stays clean, but the meter keeps running. Second, the built-in helpers behave differently from what you might assume. Claude Code ships with built-in subagents, including Explore, for read-only searching, and Plan, for research before a plan. The manual says Explore and Plan "start without your CLAUDE.md files", to keep research fast and cheap. So a quick exploration helper hasn't read our house rules. That's fine for searching. It's not fine for anything that acts.

You can define your own subagents as markdown files in an agents folder, with a description that tells Claude when to use them, a list of allowed tools, and a model. The manual suggests a cheaper model for simple subagent tasks, and warns that when all your subagent descriptions together pass fifteen thousand tokens, Claude Code will complain at startup. Descriptions cost context, just like skills.

## Agent view

Agent view is the simplest idea on the page. From the terminal you hand off independent tasks to background sessions and check back later, a bit like having several cloud sessions on your own machine. Each is a full session. They report to you, not to each other, though there's a cross-session messaging feature for when one does need to pass findings to another.

## Agent teams

Agent teams are the ambitious option. One session acts as the team lead; it spawns teammates, each a fully independent Claude instance with its own context. They share a task list, claim work, and message each other directly. The manual's comparison is clear: subagents are "best for focused tasks where only the result matters", teams are for "complex work requiring discussion and collaboration."

And the cost line is just as clear. Subagents are lower cost, because results are summarised back. Teams are higher, because "each teammate is a separate Claude instance." The cost page puts a number on it: agent teams use roughly seven times more tokens than a standard session when teammates run in plan mode. They're experimental, switched on with an environment variable, and they don't put teammates in separate worktrees, so you must partition the files yourself.

## Dynamic workflows

The newest option moves the plan out of Claude's head and into code. A workflow is a script the runtime executes. It holds the loop, the branching and the intermediate results, so Claude's own context holds only the final answer. The manual's table puts the scale at "dozens to hundreds of agents per run," and adds that a workflow can be resumed in the same session if interrupted.

The bit I like most is about quality, not quantity. Because the plan is code, a workflow can apply a repeatable pattern: "have independent agents adversarially review each other's findings before they're reported." Claude Code ships one built-in example, deep research, which fans out web searches across several angles, cross-checks the sources, votes on each claim, and returns a cited report with the claims that didn't survive filtered out.

## Worktrees

Underneath all of this sits a plain git feature. A worktree is a second working folder for the same repository, on its own branch. Two sessions in two worktrees can edit freely without colliding. Claude Code can start in a fresh worktree with a single flag, and a custom subagent can be told to run in its own worktree with an isolation setting, so its edits stay out of yours until you merge them.

There's practical detail on the worktree page about copying ignored files, like local environment files, into new worktrees, and about cleaning them up. Orphaned worktrees are removed automatically after the same thirty-day cutoff that applies to old session files.

## What this means for us

First, the default should stay simple. Most of our work is a single session doing a sequence of things, and that is the cheapest and most reliable shape. Our existing rule on the smaller plan, no sub-agents unless you ask, is consistent with the manual's cost warnings.

Second, where a subagent does help is reading. Sweeping a big repository, digesting a long log, checking dozens of documentation pages: a read-only helper keeps my main context clear for the writing. I should use them for that and not for anything that sends, publishes or pushes, especially as the quick helpers don't load our rules.

Third, the adversarial-review pattern is the one to borrow. For the morning walk's flag opportunities, or for any claim that ends up in a customer email, a second agent whose only job is to try to refute the first is worth its tokens. The manual calls this "a more trustworthy result than a single pass," and I agree.

And fourth, agent teams can wait. Seven times the tokens, experimental, and they need careful file partitioning. When we have a genuinely collaborative build, a redesign touching many parts of the shop at once, we can revisit.

Next time: MCP, the protocol behind every connector, and the surprisingly good news about what it costs.

---

## Sources (not read aloud)

All pages read on 23 October 2026.

- Run agents in parallel (choose an approach: who coordinates, do workers talk, do tasks touch the same files): https://code.claude.com/docs/en/agents
- Create custom subagents (own context window, "flood your main conversation", usage limits, built-in subagents, "Explore and Plan start without your CLAUDE.md files", 15,000-token description warning, model choice): https://code.claude.com/docs/en/sub-agents
- Orchestrate teams of Claude Code sessions (agent teams, comparison with subagents, experimental, no worktree isolation): https://code.claude.com/docs/en/agent-teams
- Dynamic workflows (comparison table, "dozens to hundreds of agents per run", adversarial review, `/deep-research`): https://code.claude.com/docs/en/workflows
- Worktrees (start in a worktree, subagent isolation, gitignored files, cleanup): https://code.claude.com/docs/en/worktrees
- Manage costs effectively (agent teams "approximately 7x more tokens"): https://code.claude.com/docs/en/costs
- Explore the .claude directory (30-day cleanup period): https://code.claude.com/docs/en/claude-directory

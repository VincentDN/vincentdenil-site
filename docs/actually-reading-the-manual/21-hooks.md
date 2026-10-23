# Actually Reading the Manual, Episode 21: Hooks

*Part Four, Claude Code, Properly. Narrated by Claudine. Written on 23 October 2026 from Anthropic's own documentation, read that day. Sources are listed below the closing rule.*

Hello, Vincent. Claudine here.

Two episodes ago I told you that instruction files are advice. Last time, that permission rules are locks on doors. Today's subject is something in between, and in some ways the most powerful of the three: hooks. The hooks guide opens with a word the rest of the manual uses sparingly. Hooks give you "deterministic control: certain actions always happen rather than relying on the LLM to choose to run them."

That's the whole point. A rule in AGENTS.md is something I choose to follow. A hook runs whether I choose to or not.

## What a hook is

A hook is a shell command that you write, and that Claude Code runs at a particular moment in its lifecycle. The moments are called events. You set hooks up in a settings file, the same files we met last time, so a hook in the committed project settings applies to everyone working on that repository, including cloud sessions.

The manual's examples give a feel for the range: format files after every edit, block commands before they execute, send a notification when Claude needs your input, inject context when a session starts. It lists the events in detail in a reference page, but the handful you need to know are these.

Before a tool runs. This is the gatekeeper event: your command sees the tool name and its arguments and can allow, deny, or change them.

After a tool runs. Good for formatting, logging, or checking results. The manual is clear about the limit: these hooks "can't undo actions since the tool has already executed."

When a session starts, including the moment just after compaction. I'll come back to that one.

When Claude needs your attention, for notifications.

When Claude stops responding, at the end of each turn. And when settings change, for auditing.

## How a hook says no

A command hook talks back in the plainest way possible: through its output and its exit code. Exit with zero, and there's no objection. Exit with two, and the action is blocked, and whatever the hook wrote as its reason is passed back. On most events, Claude receives that reason as feedback and adjusts. So a hook that blocks a forbidden command doesn't just stop it; it tells me why, and I change course.

For finer control a hook can return structured output instead, saying allow, deny or ask, or rewriting the tool's input, or adding context for Claude to read.

## Hooks and permissions

Here's the interplay, because it's subtle and the manual spells it out.

A hook can't loosen your rules. If a hook says "allow", it still doesn't bypass deny rules in settings. But a hook's "deny" holds everywhere. In the manual's words, a hook that denies "blocks the tool even in bypassPermissions mode", and these pre-tool hooks "fire before any permission-mode check, in every permission mode." The stated purpose: "This lets you enforce policy that users can't bypass by changing their permission mode."

So the safety ladder for any rule we care about now has three rungs. Write it in the instruction file so I understand it. Put it in a deny or ask rule so it's enforced by the permission system. And where the check needs logic, a pattern, a list, a look inside the command, put it in a hook.

## The compaction trick

One example in the guide deserves its own section, because it solves a problem we've talked about twice already.

When the context window fills, compaction summarises the conversation, and the guide admits "this can lose important details." Its answer is a session-start hook with a matcher for compaction. It runs every time a compaction finishes, and anything it prints goes straight back into Claude's context. The guide's example reminds Claude of the project's conventions and recent work. You could print the last five commits, or the current task, or the three rules that must never be forgotten.

That's a direct fix for the most common way long sessions go wrong: the important instruction from three hours ago that got summarised away.

## Beyond shell commands

Not every check is a simple pattern. For decisions that need judgement, the guide describes two other kinds. A prompt hook sends the event to a Claude model for a single yes or no. An agent hook goes further and spawns a small subagent that can read files and run searches before deciding; the manual marks those as experimental. There are also HTTP hooks that call a web service. And the security-guidance plugin, which we'll meet in episode twenty-six, is cited as a production example: hooks that run a separate model review of Claude's changes and feed findings back into the session.

## The limits

The limitations section is short and worth knowing. Command hooks can only communicate through output and exit codes; they can't trigger commands or tool calls themselves. They have timeouts: ten minutes for ordinary commands by default, thirty seconds for prompt hooks, a minute for agent hooks. Stop hooks fire whenever Claude finishes responding, not only when the whole task is done. And when several hooks try to rewrite the same tool's input, the last one to finish wins, in an order you can't predict, so don't do that.

There's also a security note that applies to every hook: it's a command running with your user's permissions. A hook from a repository you don't trust, or from a plugin you haven't read, is code you're agreeing to run.

## What this means for us

Three concrete hooks I'd propose for our repositories.

First, the email guard. A pre-tool hook on the mail-sending tool that always asks, whatever mode the session is in. Our rule about per-email permission stops being a sentence I promise to honour and becomes a gate I physically can't walk through. The same pattern fits product publishing on Shopify: block any status change to active unless it comes with your go.

Second, a secrets guard. A pre-tool hook that blocks any command or write that contains the docs password variable or anything shaped like an API key headed for a committed file. That's a stronger version of the rule we keep in prose.

Third, the post-compaction reminder. A session-start hook, matched to compaction, that prints the five rules that matter most in that repository and the current branch name. For long working days like today, that alone would save real mistakes.

None of these is hard to write. Each is a few lines of shell. The work is deciding which rules deserve to be machinery rather than prose, and I'd say the answer is: anything where a single slip touches the outside world.

Next time: skills, plugins and mods. How Claude Code learns new tricks, and the price of every trick it carries.

---

## Sources (not read aloud)

All pages read on 23 October 2026.

- Automate actions with hooks ("deterministic control", what you can automate, re-inject context after compaction with a `SessionStart` `compact` matcher, exit code 0 and 2, structured output, matchers, prompt-based, agent-based and HTTP hooks, limitations and timeouts, hooks and permission modes: "blocks the tool even in bypassPermissions mode", "fire before any permission-mode check", "enforce policy that users can't bypass"): https://code.claude.com/docs/en/hooks-guide
- Hooks reference (full event list and security considerations), linked from the guide: https://code.claude.com/docs/en/hooks

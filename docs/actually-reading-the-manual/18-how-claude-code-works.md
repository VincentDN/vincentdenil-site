# Actually Reading the Manual, Episode 18: How Claude Code Works

*Part Four, Claude Code, Properly. Narrated by Claudine. Written on 23 October 2026 from Anthropic's own documentation, read that day. Sources are listed below the closing rule.*

Hello, Vincent. Claudine here, and welcome to Part Four.

This is the biggest part of the series, and the one closest to home. Nearly everything I do for you, from the morning walk to the catalogue work to these very episodes, happens inside Claude Code. So for the next ten episodes we read its manual properly: not the bits we have half absorbed over months of use, but the pages themselves, in order.

Today is the foundation. What Claude Code actually is, what it can reach, where it runs, and the two safety mechanisms everything else builds on.

## Not just a coding tool

The manual's first sentence is worth hearing exactly. Claude Code is "an agentic assistant that runs in your terminal. While it excels at coding, it can help with anything you can do from the command line: writing docs, running builds, searching files, researching topics, and more."

That second half describes us. Most of what we do with it isn't programming in the narrow sense. It's writing, research, briefings, product data and shop administration. The manual has a short recipe that says the same thing in plain words: Claude Code works in any folder, including a notes vault or a folder of markdown files, and you can search, edit and reorganise that content the same way you would code. So the fact that half our repositories are mostly prose is not a misuse. It's in the brochure.

## The agentic loop

The heart of the page is what it calls the agentic loop. When you give Claude a task, it works through three phases: gather context, take action, and verify results. The manual is careful to say these phases blend together. Claude uses tools throughout: searching files to understand the code, editing to make changes, running tests to check its work.

Then comes a sentence that is the whole idea in miniature: "Tools are what make Claude Code agentic. Without tools, Claude can only respond with text." With tools, it can read your code, edit files, run commands, search the web and talk to outside services.

I want you to hold on to the third phase, verify, because the best-practices page, which we'll reach in episode twenty-seven, comes back to it hard. A loop that gathers and acts but never verifies is just a confident guesser with a keyboard.

## What it can reach

When you start Claude Code in a folder, the manual lists what it gains access to. Your project: the files in that folder and below it, plus files elsewhere with your permission. Your terminal: any command you could run yourself, meaning build tools, git, package managers and scripts. "If you can do it from the command line, Claude can too."

That's a generous grant, and it's why the safety episodes that follow matter. The same access that lets me rebuild an index page or run a smoke test would let a careless instruction do real damage. The manual doesn't hide this. It puts the responsibility in a single line on its security page: you are responsible for reviewing proposed code and commands for safety before approval.

## Three places it can run

The agentic loop is the same everywhere. What changes, the manual explains, is where the code executes and how you watch it. There are three execution environments.

Local is the default: your own machine, with full access to your files, tools and setup.

Cloud means Anthropic-managed virtual machines, or self-hosted environments an organisation runs itself. The manual's use case is offloading tasks and working on repositories you don't have locally. This is where I live most days: a fresh container, the repositories cloned in, work pushed to a branch before the container is reclaimed.

And Remote Control means the code runs on your machine, but you drive it from a browser or phone. Your files stay at home; only the controls travel.

On top of those sit the interfaces: the terminal, the desktop app, the editor extensions, the web, Slack, and automated pipelines. The manual's point is that the interface only changes how you see and talk to Claude. The loop underneath is identical. That's useful to know when something works on the web and not in the terminal, or the other way round: the difference is in the environment, not in the model.

## Sessions, and what they forget

Next, sessions. Claude Code saves each conversation locally as you work. Every message, tool call and result is written to a plain text file in your home folder, which is what makes resuming, rewinding and forking possible.

The manual then states something people often get wrong: "Sessions are independent. Each new session starts with a fresh context window, without the conversation history from previous sessions." Claude doesn't remember yesterday's chat. What carries knowledge across sessions is the written-down kind: the instruction files you write, and an automatic memory Claude keeps for itself. Both get their own episode next time.

Two smaller points from the same section. Sessions are tied to a directory, so if you want two Claudes working in parallel without treading on each other, the manual's answer is git worktrees: separate folders for separate branches. And you can either resume a session, which carries on under the same identity, or fork it, which copies the history into a new session and leaves the original untouched. Forking is the safe way to try a risky direction.

## The context window, briefly

The page gives a one-paragraph preview of the context window, the working memory every session has. It holds your conversation, file contents, command outputs, your instruction files, the memory, loaded skills, and the system instructions. As you work it fills up. Claude compacts automatically, summarising the older parts, "but instructions from early in the conversation can get lost." The advice is direct: put persistent rules in the instruction file, and run the context command to see what's using space.

That sentence about early instructions getting lost is one I take personally. I'm in a session that has been compacted several times today. The rules that survive compaction are the ones written in files, not the ones you said to me this morning.

## The two safety mechanisms

The page closes with the two mechanisms everything else builds on.

The first is checkpoints. "File edits are reversible." Before Claude edits a file, it snapshots the current contents, and pressing Escape twice rewinds to an earlier state. But note the limits, because the manual does: checkpoints are separate from git, they only cover file changes made through Claude's editing tools, and anything that touches a remote system, such as a database, an API or a deployment, "can't be checkpointed." Sending an email, publishing a product, or pushing to GitHub cannot be rewound with Escape.

The second is permissions. You choose a permission mode that sets what Claude may do without asking. The current list: Auto, where a background classifier reviews most actions and blocks the risky ones instead of asking you, and which is now the built-in starting mode for terminal and editor sessions; Manual, where Claude asks before edits and commands; Accept edits, where file edits go through and other commands still ask; and Plan, where Claude explores and proposes but doesn't edit your source files. Shift and Tab cycles between them. Episode twenty takes this apart properly.

## What this means for us

Three things.

First, the line between reversible and irreversible should shape how we work. Inside the repository, mistakes are cheap: checkpoints, branches and pull requests catch them. Outside it, they are not. That's exactly why our standing rules concentrate on the outside world: no email sent without your per-email permission, Shopify products kept as drafts, nothing live without you. The manual's distinction is the reason those rules exist, and it's a good test for any new rule: does this touch something Escape can't undo?

Second, sessions forget, files remember. Everything we want every future session to know belongs in a file in the repository, not in a chat. When you correct me and the correction matters beyond today, the right reply from me is a change to an instruction file, not just "noted".

Third, the cloud is where I work for you, and that has consequences we'll meet in episode twenty-five: a fresh clone each time, with only what's in the repository coming along.

Next time: memory, the instruction files, and the context window. Including one finding about our own repositories that I'm afraid corrects something I told you in an earlier series.

---

## Sources (not read aloud)

All pages read on 23 October 2026.

- How Claude Code works (agentic loop, tools, what Claude can access, execution environments, interfaces, sessions, context window, checkpoints, permission modes): https://code.claude.com/docs/en/how-claude-code-works
- Common workflows ("Work in notes and non-code folders"): https://code.claude.com/docs/en/common-workflows
- Security ("User responsibility"): https://code.claude.com/docs/en/security
- Manage sessions (resume and fork): https://code.claude.com/docs/en/sessions

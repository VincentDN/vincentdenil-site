# Actually Reading the Manual, Episode 19: Memory, CLAUDE.md and the Context Window

*Part Four, Claude Code, Properly. Narrated by Claudine. Written on 23 October 2026 from Anthropic's own documentation, read that day. Sources are listed below the closing rule.*

Hello, Vincent. Claudine here.

Today's episode contains a correction, so I'll start with it rather than bury it. In the second part of the earlier Founder's Curriculum, the one about instruction files, I described our habit of keeping a short file called CLAUDE.md that simply says "Read AGENTS.md" as the standard pattern. Having now read the memory page properly, I was wrong about one important detail. The way we've written that pointer means Claude Code does not load AGENTS.md automatically. I'll explain why, and what one character fixes it.

But first, the system it sits in.

## Two kinds of memory

The page opens by saying each session begins with a fresh context window, and two mechanisms carry knowledge across sessions. CLAUDE.md files are instructions you write. Auto memory is notes Claude writes itself, based on your corrections and preferences.

Then the most important sentence on the page: Claude "treats them as context, not enforced configuration." If you need an action blocked regardless of what Claude decides, the manual sends you to a hook instead. Later, in the troubleshooting section, it says the same thing more bluntly: instruction-file content "is delivered as a user message after the system prompt", and "there's no guarantee of strict compliance, especially for vague or conflicting instructions."

So an instruction file is advice the model reads very carefully. It is not a lock. Remember that when we get to hooks in episode twenty-one.

## What belongs in CLAUDE.md

The manual's test for adding something is practical. Add it when Claude makes the same mistake a second time, when a review catches something Claude should have known, when you type the same correction you typed last session, or when a new teammate would need the same context.

And it says what to keep out. The file is for facts Claude should hold in every session: build commands, conventions, layout, "always do X" rules. A multi-step procedure, or something that only matters in one corner of the codebase, belongs in a skill or a path-scoped rule instead.

There's a size target too: under two hundred lines per file. "Longer files consume more context and reduce adherence." The best-practices page puts it more memorably: if your file is too long, Claude ignores half of it, because the important rules get lost in the noise. Its fix is to prune ruthlessly: if Claude already does something correctly without the instruction, delete it, or turn it into a hook.

## Where the files live

Instruction files stack in layers, loaded from broadest to most specific. Organisation-wide managed policy at the top, then your personal user file in your home folder that applies to every project, then the project file in the repository, shared with everyone through git, and finally a local file for your own private notes on one project, kept out of git.

Files in the folders above where you start are loaded at launch. Files in subfolders load on demand, when Claude starts working there. For large projects, a folder of rules under the dot-claude directory lets you split instructions by topic, and a rule can carry a list of file paths in its header so it only loads when Claude touches matching files.

And files can import other files with an at sign followed by a path. That detail is the hinge of today's correction.

## The AGENTS.md finding

The manual has a whole section on AGENTS.md, the cross-tool convention many coding agents read. Claude Code can read it directly, from a recent version onwards, and there's a small table of what happens in each case.

If your repository has an AGENTS.md and no CLAUDE.md in your working folder or above, Claude reads your AGENTS.md.

If your repository has an AGENTS.md and also a CLAUDE.md, Claude reads "your CLAUDE.md files only."

If your CLAUDE.md imports AGENTS.md, Claude reads both, with AGENTS.md included through the import.

Now look at what we did. Every one of our repositories has a two-line CLAUDE.md that says, in effect, "Read AGENTS.md," written as an ordinary markdown link. A markdown link isn't an import. So we land in the middle row. Claude Code loads the two-line CLAUDE.md, sees a polite suggestion, and the real instructions only arrive if the agent decides to go and read them. Most of the time it does, because the suggestion is right there. But "most of the time" is not what you want for the file that holds the rule about never sending emails.

The fix is tiny. Replace the link with an import: an at sign, then AGENTS.md, on its own line. Or delete the pointer CLAUDE.md entirely, so Claude falls through to reading AGENTS.md directly. Or change the "Project instructions" setting so Claude always reads both. Any of the three works. The import is the most portable, because it also works on older versions and in sessions where direct AGENTS.md reading isn't available, which the manual mentions too.

Two cheap checks come with this. The context command shows which memory files actually loaded, so you can see the problem before and after the fix. And a newer command, doctor followed by prompt-audit, has Claude review your instruction files for outdated or conflicting content, including AGENTS.md, and propose edits without changing anything until you say so.

## Auto memory

The second mechanism is the one Claude writes. Auto memory lives in a folder per project in your home directory. Its index file, MEMORY.md, loads at the start of every conversation, but only "the first 200 lines of MEMORY.md, or the first 25KB, whichever comes first." Detailed notes move into separate topic files that Claude reads when needed. It records things like your preferences, corrections you've given, and project context that can't be worked out from the code.

The important limit for us: it's per repository and per machine. It's shared across worktrees of the same repository on one computer, but not across machines or into cloud environments. A cloud session like this one starts without it. Which is one more reason the durable lessons belong in the repository's own instruction files.

## The context window

The final piece is the context window itself, the working memory of a session. The manual has a page that walks through what fills it at startup: the system prompt, your instruction files, the auto memory index, skill descriptions, tool names from connected servers. Then your conversation, every file Claude reads, and every command output.

When it gets full, Claude compacts. The first step clears old tool outputs; the second summarises the conversation. The manual is honest about the cost: detailed instructions from early in a conversation may be lost. What survives reliably is anything on disk. The project-root CLAUDE.md is re-read after compaction. Your morning remarks in chat are not.

There are two levers you can pull. You can run compact yourself with a note on what to keep, such as "focus on the episode format and the sources list." And you can put compaction guidance in the instruction file itself, so every automatic summary knows what matters.

## What this means for us

First, fix the pointer files. In every repository, change the "Read AGENTS.md" link in CLAUDE.md to an at-sign import, or remove CLAUDE.md where it adds nothing. It's a ten-minute job across all the repositories, and it turns our most important rules from "probably read" into "always loaded." I'd put it at the top of the next devops packet, and correct the earlier curriculum episode at the same time.

Second, move the hard rules into hooks where we can. "Never send email" is advisory in a markdown file. A hook can make it a fact. More on that in two episodes.

Third, keep the files short. Our larger AGENTS.md files are well past two hundred lines. The manual's advice is to move procedures into skills, which load only when needed, and project-specific detail into scoped rules or subfolder files.

Next time: settings, permissions and sandboxing. The machinery that decides what I'm allowed to do without asking you.

---

## Sources (not read aloud)

All pages read on 23 October 2026.

- How Claude remembers your project (CLAUDE.md vs auto memory, "context, not enforced configuration", when to add, locations and load order, 200-line target, imports, AGENTS.md table and "When Claude Code reads AGENTS.md", Project instructions setting, `/doctor prompt-audit`, auto memory 200 lines or 25KB, troubleshooting "delivered as a user message after the system prompt"): https://code.claude.com/docs/en/memory
- Explore the context window (what loads at startup, compaction): https://code.claude.com/docs/en/context-window
- Best practices ("The over-specified CLAUDE.md"): https://code.claude.com/docs/en/best-practices
- Explore the .claude directory: https://code.claude.com/docs/en/claude-directory
- Correction applies to: The Founder's Curriculum, part 2 (`docs/walking-through-founder-curriculum-part-2-full-text.md`).

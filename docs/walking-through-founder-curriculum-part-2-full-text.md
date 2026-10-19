# Walking Through the Founder's Curriculum, Part Two: Understanding Agents

*A continuous audio essay. Researched and written on 19 October 2026. It reads two repositories side by side. The first is Matt Pocock's public skills repository, at its latest commit, dated 9 October 2026. The second is our own operations repository, fmp-devops, read at its latest commit on 19 October 2026, plus a few of our other repositories for comparison. Word counts and file counts come from those checkouts. Outside claims are tied to a named, dated source, and a source list closes the text. Where something is my own judgement, the text says so.*

*The brief: understand AGENTS.md and SKILL.md properly, compare how our repositories are organised with best practice, and use Matt Pocock's skills repository as the example of how a high-level agentic engineer works.*

## Part One: The Two Files, Explained

### Episode 1: Why a second part

Welcome back to the Founder's Curriculum.

Part one ended with a claim: the repository is the manager. Every agent starts with no memory, so whatever it knows about your business, it learns from the files it finds. That makes those files the most important management tool you have.

This episode opens the hood. Two kinds of file do most of the work: AGENTS.md and SKILL.md. They look alike. Both are plain Markdown, both are written for an agent, and both live in the repository. But they behave very differently, and most of the mistakes we're making come from mixing them up.

So here's the plan. First, what each file is and how an agent actually reads it. Then a long look at Matt Pocock's repository, which is one of the most carefully built examples in public. Then an honest tour of how we work now, in fmp-devops and the other repositories. Then a comparison: what we already do well, where we fall short, and a short list of changes.

### Episode 2: AGENTS.md, the always-on file

AGENTS.md is a plain Markdown file with project instructions for coding agents. It started at OpenAI in August 2025. On 9 December 2025, OpenAI announced it was giving the format to the Linux Foundation's new Agentic AI Foundation, alongside Anthropic's Model Context Protocol and Block's goose. OpenAI said then that more than 60,000 open-source projects and agent tools had adopted it, including Codex, Cursor, Gemini CLI and GitHub Copilot.

The key fact about AGENTS.md is when it's read: always. When an agent starts work in a repository, the instructions file goes into its context, the working memory it reasons with, and stays there for the whole session. Claude Code reads a file called CLAUDE.md in the same way. Our repositories follow the common pattern: CLAUDE.md contains one line telling Claude to read AGENTS.md, so every agent follows the same file.

Nested files narrow the scope. A repository can have an AGENTS.md at the root and another inside each project folder, and the agent reads the one nearest the work. fmp-devops does exactly this: a short root file and a longer file for each project.

Because it's always loaded, every line of AGENTS.md has a cost on every turn. It takes space in the agent's memory, and, just as important, it takes the agent's attention. A long file doesn't just cost tokens. It dilutes the lines that matter.

So the right content for AGENTS.md is short and universal. It holds what this place is, where things are, the few rules that are never optional, and pointers to everything else.

### Episode 3: SKILL.md, the on-demand file

A skill is a folder with a file called SKILL.md in it, plus any reference files and scripts it needs. The format is now open too: agentskills.io describes Agent Skills as "a lightweight, open format" for giving agents specialised knowledge and workflows. One secondary source dates Anthropic's release of it as an open standard to 18 December 2025, but I haven't confirmed that date against Anthropic's own announcement.

The difference from AGENTS.md is how a skill is loaded. agentskills.io describes it as progressive disclosure, in three stages.

Discovery: at startup, the agent loads only each skill's name and description, a few lines each.

Activation: when a task matches a description, the agent reads the full SKILL.md.

Execution: the agent follows the instructions and opens the bundled reference files or scripts only when a step needs them.

So a skill can be long without costing anything until it's needed. Only its description is always in memory. That makes the description the most important sentence in the whole skill. It's the trigger: it decides whether the agent ever reaches the rest.

One practical caution for us. Claude Code's documentation says it discovers skills in nested `.claude/skills` folders when you work with files in that subdirectory, and gives monorepos as the main use case. But there are user reports, mirrored from GitHub issues, that nested discovery doesn't always work as documented. Both of our fmp-devops skills live in nested folders. In this session, which opened at the repository root, neither appeared in my list of available skills. That doesn't prove they never load, but it's worth testing, because a skill that doesn't load is just a document nobody reads.

### Episode 4: Where each kind of instruction belongs

Put the two together and you get a simple sorting rule. It's the most useful idea in this episode.

AGENTS.md holds what every task needs: navigation, a few hard rules and pointers. Keep it short.

Skills hold what some tasks need: procedures and specialist knowledge, such as how to draft a customer email in your voice or how to write the morning briefing. Only the description is always loaded, and the rest arrives when the task arrives.

Docs hold reference for humans and agents alike: runbooks, wikis, specifications. Agents reach them through a pointer in AGENTS.md or a skill.

Automated checks hold the rules a machine can enforce: tests, linters, scripts that fail when something's wrong. Matt Pocock's retrospective skill is blunt about this. A mechanical rule, such as a banned pattern or a file-location rule, "gets a deterministic check, full stop". You don't write it in prose and hope.

Permissions hold the hard limits. If an agent must never do something, the safest place to say so is the tool configuration, which can refuse the action outright. Prose can only ask.

Every instruction you write belongs in exactly one of these five places. Most of what goes wrong in agent setups is an instruction in the wrong place: a mechanical rule written as prose, a procedure stuffed into the always-on file, or a hard limit in prose while the configuration quietly allows the opposite. We'll find all three in our own repositories.

## Part Two: How Matt Pocock Works

### Episode 5: A skills repository for real engineers

Matt Pocock is a well-known TypeScript educator. His repository is called "Skills For Real Engineers", and the README sets the tone in its first line: "My agent skills that I use every day to do real engineering - not vibe coding." The README says about 60,000 developers follow it through his newsletter. It installs as a Claude Code plugin, and the manifest in our checkout says version 1.3.1 with 27 skills.

The repository holds 38 SKILL.md files in five buckets. Engineering has 20, for daily code work. Productivity has 7, for non-code workflows. Misc has 4, which are kept but frozen. In-progress has 7, which are public betas, and deprecated is empty. Only engineering and productivity ship in the plugin.

The README frames the whole repository around four failure modes he sees with coding agents. It's worth hearing them in order, because they're our failure modes too.

One: the agent didn't do what I wanted. That's misalignment. The fix is a grilling session, where the agent interviews you before it builds anything.

Two: the agent is way too verbose. The fix is a shared language, a glossary of the project's own terms, so the agent says "materialisation cascade" instead of a paragraph.

Three: the code doesn't work. The fix is feedback loops: types, browser access and tests, with a red-green loop where the agent writes a failing test first and then makes it pass.

Four: we built a ball of mud. That's the speed problem from part one. Agents accelerate entropy, so the fix is caring about design every day, with a skill that surveys the codebase for improvements.

Each fix becomes a small skill. That's the whole method.

### Episode 6: Small skills that compose

The first thing you notice in the files is how small some skills are.

The `grill-me` skill is 22 words long. Its whole body is one instruction: "Call the Skill tool with "grilling"." The `grill-with-docs` skill is 35 words: call `grilling`, then call `domain-modeling`. The actual interview method lives once, in `grilling`, at about 320 words, and every skill that needs an interview calls it.

This is composition. The reusable discipline lives in one place, and the entry points are thin wrappers. Change how grilling works, and every flow that grills improves at once.

He also splits skills along one axis, which he calls invocation.

A user-invoked skill fires only when you type its name. It's marked `disable-model-invocation: true`, so its description isn't loaded into the agent's memory, and its context cost is zero. The price is that you have to remember it exists.

A model-invoked skill keeps a model-facing description, so the agent can reach for it on its own, and other skills can call it. The price is the description's line in memory on every turn.

His rule for choosing is short. Make a skill model-invoked only when the agent, or another skill, must reach it on its own. Otherwise make it user-invoked and pay nothing. And because user-invoked skills pile up in your head, he adds one router skill, `ask-matt`, whose job is to tell you which skill fits your situation.

There's also a discipline about how skills call each other. A step that needs another skill says, literally, "Call the Skill tool with" and the name, rather than linking across folders or mentioning a slash command and hoping. Naming the tool gets it fired more reliably.

### Episode 7: Writing for agents

The heart of the repository is a skill called `writing-for-agents`, about 1,800 words, with a companion file on skill mechanics. It's a style guide for every document an agent reads, AGENTS.md included. Here are its main ideas, in plain words.

Context pointers. A line in AGENTS.md that names a doc, or a skill's description, is a pointer. The pointer's wording decides when the agent reaches the material, and how reliably. If a must-have document is being missed, sharpen the pointer first, and only paste the material inline if that fails.

Two loads. Every document spends one of two budgets. Context load is the cost on the agent: anything always in memory spends tokens and attention every turn. Cognitive load is the cost on the human: remembering which documents exist and when to use them. Neither is free, so spend each where it matters.

The information hierarchy. A document has steps, the actions in order, and reference, the facts consulted on demand. Put the steps at the top. Push reference that only some cases need into separate files behind pointers. The test he gives is branching: inline what every case needs, and disclose what only some cases reach. A document too long, even when every line is true, suffers from sprawl, where attention thins across the excess.

Completion criteria. Every step should end on a condition the agent can check. "Every modified model accounted for" makes the agent do the work, while "produce a change list" lets it stop early.

Leading words. A single well-chosen word that the model already understands can carry a whole behaviour. For example, "tight" for a fast, reliable feedback loop, or "red" for a test that fails on the bug. Repeat the word, not the explanation.

Negation. Steering by prohibition backfires. "Don't think of an elephant" puts the elephant in the agent's head. State the behaviour you want instead, and keep "never" for hard guardrails you can't phrase positively, paired with the positive target.

Pruning. Keep each meaning in one place. Don't restate what the environment already tells the agent, such as the folder layout or a script's help text. Delete instructions that the model would follow anyway, which he calls no-ops. And watch out for sediment, the stale layers that build up "because adding feels safe and removing feels risky".

If you only read one file in his repository, read this one.

### Episode 8: A repository that governs itself

The last thing to notice is that the repository maintains itself with the same discipline it teaches.

There's a scope document with a two-part bar for any change. One: an observed failure, something that actually went wrong in a real session, where a hypothetical improvement doesn't count. Two: it fits the philosophy. Size is irrelevant, so a one-word fix and a rewrite face the same bar.

There's an out-of-scope folder. Each file records one rejected idea and why, so the same idea doesn't get argued twice. One says new skill proposals are closed: "if you can compose the behaviour from existing skills, it doesn't get a new skill."

There are architecture decision records, short notes that explain why a choice was made. One explains why only some skills include a setup pointer: it's needed where output would be wrong without the setup, and left out where output would just be less sharp.

There's a glossary with a section called "Flagged ambiguities", where conflicting terms are resolved, for example why "backlog" is no longer used.

There are changesets and a changelog, so every behaviour change is versioned and described.

Every promoted skill has a human-facing docs page with four fixed sections: what it does, when to reach for it, common questions, and "It's working if".

And there's a retrospective skill, `retro`, that reviews a session and suggests improvements to the agent's environment, most severe first. It works through navigation, automated checks, coding standards, AGENTS.md size, tool economy, no-ops and information access. It also states the principle that ties it together: AGENTS.md files "should be used incredibly sparingly, usually only for navigation pointers", and a repository with no automated guardrail "is itself a finding".

One more skill worth knowing is `pr`. A pull request description should show the smallest visual that makes the change clear, before-and-after evidence that it works, and a call on merge danger: is this a one-way or a two-way door, and what's the blast radius if it's wrong?

That's how a high-level agentic engineer works. The agent writes the code. The engineer designs the environment: small composable skills, a glossary, decision records, a bar for change, automated checks, and a weekly look back at what went wrong.

## Part Three: How We Work Now

### Episode 9: A tour of fmp-devops

Now our side. fmp-devops is Flagmaker & Print's operations repository. It isn't the shop's code. It's where the business's agent work lives. At the time of reading, it had 71 commits, most of them in the last few weeks.

The root AGENTS.md is 354 words. It says what the repository is, sets one standing rule (every product an agent creates or bulk-edits in Shopify gets a fixed set of tags, added with an operation that never removes existing tags), defines a standard project layout, and gives a table of projects, each linking to its own AGENTS.md. CLAUDE.md at the root says: read the root AGENTS.md, then the AGENTS.md of the project you're working in.

The standard layout is `inbound/` for everything coming in, `outbound/` for everything produced, plus `docs/` and `tools/` where needed. There are seven projects at the moment:

- CEP2026, the historical-flag catalogue expansion
- customer support
- a read-only email archive
- fringed flags
- truck flags
- the Morning Walk daily briefing
- printfile restoration

There's a human wiki in `docs/`, written for Vincent and anyone he hands a run to. It includes a CEP2026 runbook, a page on the API tools, a who-does-what table and three rules that apply everywhere. Nothing goes live without Vincent, so products upload as drafts. No credentials in the repository. Agents never send email without explicit permission for that specific email.

The project AGENTS.md files vary a lot in size: 128 words for fringed flags, 336 for the email archive, 561 for the Morning Walk, 705 for printfile restoration, about 1,100 for CEP2026, and 3,439 for customer support.

### Episode 10: Our skills

fmp-devops has two skills.

The first is `fmp-cs`, the customer-service skill, which drafts replies in Vincent's voice. Its SKILL.md is about 4,500 words. Beside it sit two reference files: a page of documentation links and product facts, about 1,050 words, and a file of example emails, about 3,200 words. Its description is a good model-facing trigger. It lists the ticket types it handles and names the wiki as its source of truth.

It's a rich skill. It has a voice section in five words ("warm, knowledgeable, direct, human, proactive"), a vocabulary list (flag, not banner; grommets, not eyelets; partner, not vendor), a list of banned phrases, rules for linking documentation, and a hard rule against sending email. Behind it is a training loop. Every time Vincent corrects a draft, the case is logged in the human wiki with timestamps, the rule is written down, and it's mirrored into AGENTS.md and the skill. There's even a script, `check_wiki_sync.py`, that fails if the agent files and the human wiki drift apart.

The second is `morning-walk`, about 1,060 words, which writes the daily founder briefing. It has a numbered run order, from repository digest and store queries through the calendar and attention signals to a catalogue check and writing. It also has a precise output format with word counts, and hard rules: read-only, privacy, moderation, facts only.

### Episode 11: Across the fleet

The other repositories show the same instincts, each with its own twist.

In vpp-woocommerce, the poster shop, AGENTS.md carries a standing rule that CLAUDE.md must always exist, stay free of instructions, and only point to AGENTS.md. It gives the reason: "We run a multi-agent workflow, so AGENTS.md is the single source of instructions for every agent."

The paused Medusa repository has a pause notice at the top of AGENTS.md. In one paragraph it tells every agent the project is paused, what's still allowed, and where the real work now lives. It's a perfect example of a navigation pointer doing its job.

The Partisan game project adds a state file that agents read after AGENTS.md. It also asks agents to log usage before and after each work packet, and to prefer one contact-sheet screenshot over many.

The personal website's AGENTS.md has precise rules for how pages are indexed and linked.

So the instincts are good everywhere: one instructions file, a pointer from CLAUDE.md, hard rules near the top, and a human-readable counterpart. The question is how far that gets us, compared with the best practice we've just walked through.

## Part Four: The Comparison

### Episode 12: What we already do well

Let's start with what's right, because a lot of it is.

Single source of truth. Every repository uses AGENTS.md as the one instructions file, with CLAUDE.md as a pointer. That's exactly the standard, and vpp-woocommerce even writes the rule down.

Navigation first. The root AGENTS.md in fmp-devops is mostly a map: a project table with pointers into each project's own rules. That's the "navigation pointers" use Matt Pocock recommends.

Hard rules with reasons and dates. Our hard rules quote the decision and when it was made: "Vincent, 13 Oct 2026: agents cannot send emails unless specific permission is given per email by a human operator." That's an architecture decision record in miniature. It tells a future agent not just what, but why and since when.

A shared language, in places. The `fmp-cs` vocabulary list is a glossary in all but name. It tells the agent which word to use and which to avoid, exactly the fix for Matt's second failure mode.

Progressive disclosure, in places. `fmp-cs` already pushes reference into side files: documentation links in one, example emails in another. That's the information hierarchy at work.

A real guardrail. The wiki sync check is a deterministic test that fails on drift. It's exactly what the retrospective skill asks for.

A learning loop. The customer-service training cases are a retrospective, run case by case: every correction becomes a rule. That's the heart of the discipline.

Safe defaults. Drafts, not sends. Shopify drafts, not live products. Read-only briefings. Products tagged so every agent change can be found again.

A human counterpart. The docs wiki and the VA wiki keep humans in the loop. Matt's repository has something similar: docs pages for every promoted skill.

So we aren't starting from zero. We're at the stage his repository describes as "the fix": we've found the failure modes on our own, and we've started fixing them by hand.

### Episode 13: Where we fall short

Now the gaps, ranked by how much they matter, at least in my judgement.

First, a rule in prose that the configuration contradicts. The customer-support hard rules say: "Do not archive, delete, label-away, star-away or otherwise resolve a thread instead of leaving it unread." The fmp-devops settings file pre-approves exactly one tool: the Gmail tool that moves a thread to the bin. So the prose forbids it, while the configuration lets an agent do it without even asking. This is the "hard limit in the wrong place" problem from Episode 4. The fix is in the configuration: remove that permission, and consider explicitly denying the send, reply and forward tools, so the hard rule is enforced by the tool and not just requested in prose.

Second, duplication. The no-send rule, the store-responsibility table and several of the lessons appear both in the customer-support AGENTS.md and in the `fmp-cs` skill, and again in the human wiki. The sync script exists precisely because there are three copies to keep aligned. Matt's rule is one meaning, one place. A better split, I'd suggest: the wiki stays the human source, the skill holds the procedure and voice, and AGENTS.md holds only the hard rules and a pointer to the skill.

Third, sprawl in the always-on file. At 3,439 words, the customer-support AGENTS.md is long, and it's always loaded for any work in that project. Much of it is the training-case log and lessons, which are reference that only some tickets need. Those belong in a reference file behind the skill, where the information hierarchy says they go. There's also visible sediment: the lessons list is numbered with strings of zeros, a sign the list has been edited in place many times. And the log names customers by first name with order numbers, in a file the skill itself says should hold no customer data.

Fourth, no automated checks beyond the sync script. fmp-devops has no CI workflow, no pre-commit hook and one test file. Several of our rules are mechanical and could be checked by a script instead of prose. No em dashes in customer emails. Every created product carries the agent tags. Printfiles are exactly 6300 by 3925 pixels. CLAUDE.md contains only the pointer. The retrospective skill would flag every one of these as a guardrail that doesn't exist yet.

Fifth, negation-heavy writing. The customer-service skill has a long "banned" list and many "never" lines. Some are true guardrails and should stay. But Matt's point about negation applies to voice rules: "Banned: ASAP, Dear Customer, kindly..." puts those words in front of the model on every draft. The positive version, the five voice words and the exemplar emails, does more of the steering.

Sixth, skills that may not load. As Episode 3 noted, both of our skills live in nested folders. That's a documented pattern, but it's reported to be unreliable, and in this session neither skill showed up from the repository root. An untested skill is a hope, not a tool.

Seventh, no glossary and no decision records outside customer support. CEP2026 has its own language: tiers, clusters, waves, drafts, printfiles, source statuses, IP review. It's spread across a runbook, an AGENTS.md and handoff notes. Decisions live in commit messages and dated quotes. A one-page GLOSSARY.md and a `docs/adr/` folder would make every new session faster and every decision easier to revisit.

Eighth, no process skills. Our two skills are domain skills: how to write like Vincent, and how to write the briefing. We have nothing for the engineering process itself: interviewing before building, turning a plan into tickets, test-first work, structured review, session handoffs, or retrospectives. Those are exactly the skills Matt has spent the most effort on.

### Episode 14: Where we're different, on purpose

It would be a mistake to copy his repository wholesale. Three differences are deliberate, and they're right for us.

His skills are for software engineering. Ours are mostly for running a business: customer service, catalogue operations, briefings. Our most valuable skills will always be the domain ones, because no one else can write them. The `fmp-cs` exemplars, Vincent's real emails with the lessons attached, are a moat no public skill can replace.

His repository is curated by one expert for a public audience. Ours serve a small team that includes virtual assistants and developers who never read AGENTS.md. So the human wiki matters more for us than docs pages matter for him. Keeping a human version is right. Keeping three copies isn't.

He uses an issue tracker and a triage state machine because many people file issues against his skills. We don't need that yet. An `inbound/` folder and a TODO file are the right weight for a one-founder operation. The part worth copying is the bar for change, not the tracker.

## Part Five: The Plan

### Episode 15: Install, or adapt?

Matt's README offers a one-line install for Claude Code: `claude plugin install mattpocock-skills@claude-plugins-official`. I'd install it, but use a handful of skills on purpose rather than all of them.

`grill-me`, before every new project or CEP wave. Ten minutes of being interviewed before the agent builds saves an afternoon of building the wrong thing.

`writing-for-agents`, whenever anyone edits an AGENTS.md or a skill. Ask the agent to call it first, then make the edit.

`handoff`, at the end of long sessions, so the next session starts from a document rather than from memory.

`retro`, once a week, on the week's longest or messiest session. Its output is the input for the next episode's loop.

`pr`, for every pull request description, so each one carries evidence and a merge-danger call.

`tdd` and `diagnosing-bugs`, for the Python tools: the intake checker, the downloaders and the restoration scripts.

Leave the issue-tracker skills for later.

### Episode 16: Ten changes, smallest first

Here's the concrete list for fmp-devops, ordered so each change is small and safe.

One. Fix the permission mismatch. Remove the pre-approved Gmail bin permission from the settings file, and add explicit denials for sending, replying and forwarding. This takes ten minutes and enforces our most important rule.

Two. Test skill loading. Start a session at the repository root and another inside each project folder, and check whether `fmp-cs` and `morning-walk` appear. If they don't load reliably, move them to the root `.claude/skills` folder with clear descriptions, or package them as a small private plugin.

Three. One meaning, one place. Remove the rules from the `fmp-cs` skill that duplicate AGENTS.md, and point to them instead. Keep the wiki as the human source.

Four. Slim the customer-support AGENTS.md. Move the training-case log and the long lessons list into a reference file inside the skill, behind a pointer. Remove customer names and order numbers from agent files, and keep them in the wiki only. Fix the numbering.

Five. Add the cheap checks. A small script, run before every commit, that checks for em dashes in drafted emails, the agent tags on created products, printfile dimensions, and CLAUDE.md files that are pointer-only. Then add a CI workflow that runs it with the sync check.

Six. Write a GLOSSARY.md. One page, with each term defined once and the words to avoid listed, starting with CEP2026's vocabulary.

Seven. Start `docs/adr/`. Turn the dated hard-rule quotes into short decision records: context, decision, consequences. Keep the quotes. Just give each one a home.

Eight. Rewrite the voice rules positively. Keep the true guardrails as "never" rules. Move the banned phrases behind the exemplars, and let the positive voice description lead.

Nine. Add a bar for change to the root AGENTS.md. A new rule needs an observed failure, from a real session. Hypothetical rules don't go in. Add an `out-of-scope.md` for ideas we've decided against.

Ten. Start the weekly retro loop, which the next episode describes.

### Episode 17: The weekly loop

Here's the habit that ties it all together. It takes about twenty minutes a week.

Pick the week's most frustrating agent session, the one where you corrected the agent most.

Run `retro` on it. It lists improvements to the environment, most severe first.

Pick one, and only one.

Decide where it belongs, using the five places from Episode 4. If it's a mechanical rule, make it a check. If it's a hard limit, put it in the permissions. If every task needs it, add it to AGENTS.md, briefly. If only some tasks need it, put it in a skill or a reference file. If it's a definition, add it to the glossary.

Make the change on a branch, with a pull request that says which session caused it. That's your observed failure.

Then delete one line somewhere that no longer earns its place. Pruning is half the discipline, and it's the half that always gets skipped.

Fifty-two weeks of that, and your agent environment will be as deliberate as Matt Pocock's. It just takes one honest change at a time.

### Episode 18: The short version

AGENTS.md is the always-on file. Keep it short: a map, a few hard rules and pointers.

SKILL.md is the on-demand file. Only its description is always loaded, so write that description as a sharp trigger, and push reference into side files.

Every instruction belongs in one place: AGENTS.md, a skill, a doc, an automated check, or a permission. Most problems are instructions in the wrong place.

Matt Pocock's repository shows the high-level version: small composable skills, writing that respects the agent's attention, a glossary, decision records, a bar for change, and weekly retrospectives.

We already have the right instincts. We have one instructions file, hard rules with reasons, a vocabulary list, a sync check and a training loop. The gaps are a permission that contradicts a hard rule, duplicated rules, an overlong always-on file, almost no automated checks, untested skill loading, and no process skills.

Fix the permission first, test the skills second, then run the weekly loop. That's the curriculum for the next quarter.

Thanks for listening.

---

## Sources, by date

Repository reads were made on 19 October 2026. "Via summary" means the claim was read in a secondary source that cites the original.

- August to 9 December 2025 — OpenAI, "Agentic AI Foundation": AGENTS.md contributed to the Linux Foundation's Agentic AI Foundation, and the adoption figures (https://openai.com/index/agentic-ai-foundation/).
- 18 December 2025 (via summary, unconfirmed) — Anthropic releases Agent Skills as an open standard, per Strapi, "What are agent skills and how to use them" (https://strapi.io/blog/what-are-agent-skills-and-how-to-use-them).
- Undated, read 19 October 2026 — agentskills.io: the format description and the three-stage progressive disclosure (https://agentskills.io/).
- Undated, read 19 October 2026 — Claude Code documentation, Skills: nested `.claude/skills` discovery (https://code.claude.com/docs/en/skills).
- Undated, read 19 October 2026 — reported nested-discovery problems, mirrored GitHub issues 58407 and 40640 (https://claudeissues.com/issue/58407-skills-in-subdirectory-claude-skills-not-discovered-in-monorepo, https://claudeissues.com/issue/40640-docs-automatic-discovery-from-nested-directories-for-skills-does-not-work-as-doc).
- 9 October 2026 (latest commit) — Matt Pocock, `mattpocock/skills` (https://github.com/mattpocock/skills): README, CLAUDE.md, SCOPE.md, GLOSSARY.md, CHANGELOG.md, `.agents/invocation.md`, `.agents/adr/0001`, `.out-of-scope/new-skills.md`, `.claude-plugin/plugin.json` (version 1.3.1, 27 skills), and the SKILL.md files for `grill-me`, `grill-with-docs`, `grilling`, `writing-for-agents` (with `SKILL-MECHANICS.md`), `retro`, `handoff`, `tdd` and `pr`. Skill counts and word counts are from our checkout.
- 19 October 2026 (latest commit) — Flagmaker-Print `fmp-devops` (private): the root AGENTS.md, CLAUDE.md and README, `docs/`, `.claude/settings.json`, the project AGENTS.md files, the `fmp-cs` and `morning-walk` skills, `tools/check_wiki_sync.py`, and the commit log.
- 19 October 2026 — our other repositories: `vpp-woocommerce` AGENTS.md (the CLAUDE.md standing rule), `vintage-propaganda-posters` AGENTS.md (the pause notice), `partisan-project` CLAUDE.md, `vincentdenil-site` AGENTS.md.
- 18 October 2026 — Walking Through the Founder's Curriculum, part one, vincentdenil.com/docs/.

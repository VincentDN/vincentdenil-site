# Walking Through the Founder's Curriculum, Part Three: The Founder's Operating System

*A continuous audio essay. Researched and written on 20 October 2026. Part one taught the skills, and part two taught the files agents read. This part is about the workflows: the daily and weekly rhythm a founder runs on top of a team of agents. Most examples come from our own repositories as they stood on 20 October 2026, described without sales figures, staff names or customer details. Outside claims carry a named, dated source, and a source list closes the text. Where something is my own judgement, the text says so.*

*The brief: what are the absolute highest-leverage workflows and skills a founder like me needs to excel in the agentic era?*

## Part One: The Real Bottleneck

### Episode 1: You're not the builder any more

Welcome to part three of the Founder's Curriculum.

Here's a sentence that would have sounded strange two years ago. On a normal day this October, the founder of Flagmaker & Print had more work done by agents overnight than he could check before lunch.

Look at one week of the operations repository. A morning-briefing project was built, run and paused for review. A hundred truck-flag products were prepared and tagged. A fringed-flag pilot compared two image methods across ten flags, and then a bestseller batch followed. A downloader for flag source files was written, made resumable and given a progress display. Printfiles that had gone missing from the server were rebuilt in batches from product mockups. And every one of those streams ended the same way: with something waiting for one person to look at it.

That's the core fact of the agentic era for a small business. Production is no longer the constraint. Attention is.

This episode is about building an operating system around that fact. It's my own judgement, ranked by leverage, and it comes in six workflows.

First, design every task for fast review.

Second, run content factories with quality gates.

Third, put everything waiting on you in one approval inbox.

Fourth, measure before you build.

Fifth, let scheduled agents work while you sleep.

Sixth, protect the founder-only work: taste, judgement and attention.

The last part turns them into a thirty-day setup plan.

### Episode 2: Feeling fast isn't being fast

One study is worth keeping in mind before we start, because it explains why attention needs protecting.

In July 2025, the research group METR published a randomised controlled trial with 16 experienced open-source developers working on 246 real tasks in codebases they knew well. Tasks were randomly assigned to be done with or without AI tools. Coverage at the time, in eWeek and Diginomica among others, reported the result: with AI, the tasks took about 19 percent longer. The developers had expected a 24 percent speed-up, and afterwards they still believed AI had made them about 20 percent faster.

There are big caveats. It was a small sample, the tools were early-2025 tools, and experts in their own codebases are exactly the people AI helps least. Tools have improved a lot since. But the perception gap is the lesson, and it hasn't gone away. Working with agents feels fast because something is always happening. Whether the business is actually moving faster is a separate question, and you only know by measuring it.

So every workflow in this episode has the same shape: make the work visible, make the check fast, and measure what actually changed.

## Part Two: Workflow One, Designed for Review

### Episode 3: The review budget

Start with a simple calculation. Suppose you have two hours of sharp attention a day for checking agent work. That's your review budget. Everything an agent produces either fits into it or piles up.

There are only three ways to fit more work into a fixed budget. Make each check faster. Check less of the work, by sampling and trusting guardrails. Or make the agent check its own work first, so you only see what survived.

Most founders do none of these. They open each result, read it from the top and try to work out what changed. That's the most expensive way to review there is.

The fix is to decide, before the agent starts, what proof it must hand back. That's the topic of the next episode.

### Episode 4: Proof, not progress

Every task should end with proof that you can judge in under a minute. Our repositories already show the four best forms.

The contact sheet. One image with every result side by side: source, output, and alternative. The fringed-flag pilot delivered exactly that. It was two contact sheets for ten flags, with columns for the source, the composite method and the AI method. You can see in seconds whether a flag was redrawn.

The verdict line. One line per item: restored, rejected or held, with the reason. The printfile-restoration rules ask for exactly this, one line per ticket, to report a batch.

The before and after. For anything visual, show the old and the new together. For anything in a document, show the diff.

The danger call. Borrowing from Matt Pocock's pull-request skill: is this a one-way door or a two-way door, and how big is the blast radius if it's wrong? A theme tweak on a draft is a two-way door. A bulk publish to thousands of products is a one-way door with a huge blast radius.

So put a line like this in every brief: "Hand back a contact sheet, one verdict line per item, and a danger call." Then hold the agent to it. If the proof is missing, the task isn't done.

### Episode 5: Let the agent check first

Anthropic's December 2024 guide, "Building effective agents", described a pattern it called the evaluator-optimizer. Simon Willison's write-up the next day summarised it as one prompt that produces the work and a second that reviews it, looping until the reviewer is satisfied. The pattern works best when the criteria are clear.

For a flag business, the criteria are often very clear. Does the colour match the reference within a tolerance? Is the star count right? Is the image exactly 6300 by 3925 pixels? Does the text match, character for character? Each of these can be checked by a second pass, a script or a second agent, before you ever see the result.

The fringed-flag pilot shows what this looks like when the check is a script. The composite method matched the source flag to within about one colour level on average, measured, not eyeballed. A check like that doesn't need your eyes at all, except on a sample.

The rule: anything a machine can check, a machine checks first. Your eyes are for what only eyes can judge: does it look right, is it on brand, is it true.

## Part Three: Workflow Two, Content Factories

### Episode 6: Four factories, one machine

Look at the operations repository again and you'll find four projects that look different but are the same machine.

CEP2026 grows the historical-flag catalogue from a corpus of tens of thousands of flags. Fringed flags turn existing designs into gold-fringed versions. Truck flags turn bestsellers into a new format. Printfile restoration rebuilds missing print files from mockups.

Each one runs the same stages.

Source: where the input comes from, such as a corpus row, a product mockup or a reference image.

Generate: a script or an AI model makes the output.

Verify: the output is checked against the source.

Sample: a human looks at some of it.

Stage: everything lands as a draft, never live.

Release: waves go live with the founder's go, paced and capped.

Learn: you see what sold and what didn't, and the next wave changes.

This is the growth engine of a catalogue business in the agentic era. Once you see it as one machine, you can design it once, reuse it for every new product line and improve it in one place.

### Episode 7: The gates

A factory is only as good as its gates. Our repositories already contain five good ones, so it's worth naming them, because together they're a template for every future factory.

The publish gate. In CEP2026, every product uploads as a Shopify draft, and a printfile name starting with `empty_` can't go live. It's promoted to `done_` only with a reference-checked file. Going live needs the founder's explicit go in the current conversation.

The spend gate. The artwork script only spends AI credits after the operator types YES. The Morning Walk never spends credits at all.

The accuracy gate. Every generated file is checked against its reference, and anything the AI altered is rejected. The pilot write-up says it plainly: the AI method "redraws". It shifted colours and changed details, even when it looked faithful.

The moderation and IP gate. Extremist and militant flags are flagged to the founder, not scaled. Trademark and fandom suspects are flagged for IP review. They aren't blocked automatically, but they're never pushed live without a human look.

The ten-by-hand gate. My favourite rule in the whole repository: "Ten by hand before automating any new pipeline step." Do it manually ten times, understand every failure, then automate.

Every new factory should copy these five gates on day one. They're the difference between a machine that scales your catalogue and one that scales your mistakes.

### Episode 8: Choose the method by the cost of review

The fringed-flag pilot holds the most important factory lesson, so let's slow down on it.

Two methods were tested on the same ten flags. The composite method is a script that places the existing flag image into a fringe frame. It was exact: the flag area matched the source almost perfectly. It was free and took about half a second per flag. The AI method made a photorealistic image with a twisted gold fringe that looked like competitors' listings. But it redrew details, cost credits per image and took about 45 seconds each. Above all, every image needed a human review.

The recommendation that came out of it is the lesson. Use the composite for every product, because it can't alter the flag, and review one in twenty. Use the AI image only for a small set of curated hero pages, where each image gets a full review.

Here's the general rule: choose the method by the cost of review, not by the cost of generation. An AI method that's cheap to run but needs every output checked by you can be the most expensive option in the business, because it spends the scarcest resource you have. A boring, exact method that you only sample is often the winner.

### Episode 9: Factories find bugs in the catalogue

The pilot had a side effect worth its own episode. While generating fringed versions of ten flags, it found three problems in the existing catalogue. One state flag's artwork had a stripe that didn't reach the edge. A royal standard was labelled for the wrong king: the artwork showed a later design than the title claimed. And one product's featured image was a lifestyle photo, so any pipeline that grabbed the featured image would pick the wrong picture.

None of this was the factory's job. But a factory that looks closely at every item is also an audit of every item.

So add one line to every factory brief: "Report any defect you notice in the source, separately from the output." It costs almost nothing. Over a catalogue of thousands of products, it's the cheapest quality programme you'll ever run.

### Episode 10: Waves and the kill switch

The last stage of a factory is the one most often skipped: learning from what sold.

A catalogue business can now make products faster than customers can discover them. Thousands of new listings that never sell aren't harmless. They dilute search, slow down the store and hide the products that do sell. So release in waves, measure each wave, and be willing to stop.

A simple rule I'd suggest: every wave gets a review date, four to six weeks after it goes live. On that date, an agent pulls the wave's sessions, orders and search impressions against the previous wave. If a cluster sells, the next wave goes deeper into it. If it doesn't, the next wave goes elsewhere, and the cluster's remaining rows wait.

CEP2026's own operating notes already say: "Test cheaply, publish in waves, and only invest design time in flags that sell." The workflow just puts a date on the "test".

## Part Four: Workflow Three, One Approval Inbox

### Episode 11: Count your queues

Here's a quick exercise. Count the places where agent work currently waits for you.

There are customer-email drafts, waiting in Gmail as unread threads. There are product drafts in Shopify, from CEP2026, fringed flags and truck flags. There are files in each project's `outbound/` folder, such as restored printfiles, pilot results and QA sheets. There are pull requests and branches across six or seven repositories. There's the "For your attention" section of the Morning Walk. And there are decisions buried in project files, like the "ASK VINCENT" tables in CEP2026.

That's at least six queues, each in a different place, each with its own way of saying "this is waiting for you". The cost isn't the work in them. It's the checking: every morning, you have to remember all six places and look in each one.

### Episode 12: The inbox, designed

The fix is one daily list. It's not a new app, just one Markdown section that an agent compiles each morning from all the queues. I'd suggest the Morning Walk, which already has a "For your attention" part, but as a written list at the end rather than spoken prose.

Each item gets four fields: what it is, which queue it's in, what it costs if it waits, and the decision needed. For example: "Fringed bestsellers, QA sheet ready, nothing breaks if it waits, approve the composite batch or not." Or: "One customer email about a damaged flag, a customer waiting since yesterday, approve the draft."

Then you clear it in one sitting, every item getting one of three answers: approve, reject or ask a question. Twenty minutes in the morning, and the agents have their answers for the day.

Two rules make it work. Sort by cost of waiting, not by project, so a waiting customer always comes before a waiting experiment. And anything older than a week gets a decision of its own: do it, drop it, or put it on a dated list. An inbox that only grows is just another backlog.

### Episode 13: What never enters the inbox

The inbox is for decisions, not for safety. Some things should never depend on you remembering to say no.

Sending email, publishing products, spending credits and deleting data are all held back by gates, as part two put it, in the permissions where possible and in the rules where not. Part two found one place where our configuration and our rules disagree: a pre-approved tool for binning email threads, in a project whose rules say never to bin a thread. That's the kind of thing to fix at the source, not to catch in the inbox.

The inbox shows what's waiting. The gates make sure nothing irreversible happens while it waits.

## Part Five: Workflow Four, Measure Before You Build

### Episode 14: The blended-number trap

This month's growth briefing for Flagmaker & Print made a mistake that's worth retelling, because it's the most common mistake a fast builder makes.

The briefing's first draft looked at the store's whole funnel and saw a weak step: too many people left at checkout. It recommended fixing checkout, with an estimate of the value. Then Vincent pointed out something the blended numbers hid. People who design a flag in the app arrive at the store with the flag already in their cart. Many of them are trying the tool, not shopping. When the same funnel was split by landing page, the catalogue product pages turned out to convert well. The weak spots were the homepage, the custom-flag page and the maker pages, which is where the app lives. The estimate dropped a lot, and the recommendation changed completely.

If that first draft had gone straight to an agent with "fix the checkout", it would have been built quickly and well, and it would have fixed the wrong thing.

Agents make building cheap. That makes deciding what to build the expensive part. A wrong decision now costs a week of fast, confident, useless work.

### Episode 15: The three-step rule

So here's the workflow, in three steps.

Before: every idea starts with an agent pulling the data. Not a dashboard, but a few targeted queries, split by the segments that matter: landing page, product type, traffic source, new versus returning customer. If the data can't be split, that's the first task. For example, the growth briefing's first real recommendation was to tag every cart the design app creates and to set a product type on every product.

During: every build ships with a way to measure it. A tag, a field or an event. If you can't tell later whether it worked, don't build it yet.

After: every feature gets a "did it work?" date, four weeks out, on the approval inbox. An agent runs the same queries as before and writes three lines: what changed, by how much, and whether to keep it, change it or remove it.

This is also the cure for the perception gap from Episode 2. You don't have to trust the feeling of speed. You check the numbers.

## Part Six: Workflow Five, Agents While You Sleep

### Episode 16: The scheduled run

The Morning Walk is the first scheduled agent in the business. A task, every morning before dawn Brussels time, starts a fresh cloud session. That session reads every repository's overnight commits, checks the store's numbers, looks at the calendar for flag occasions, and writes a spoken briefing for the walk to work. It's currently paused, deliberately, until the first briefing has been reviewed, and it still needs its connectors attached.

That pause is the right instinct. A scheduled agent runs without anyone watching, so it needs stricter rules than an interactive one. The Morning Walk's rules are a good template: read-only, privacy rules, facts only from queries run that morning, and saying so in one sentence when a source fails.

Once it runs reliably, the Morning Walk becomes the front door of the whole operating system. It's where the approval inbox lives, and where the other scheduled jobs report.

### Episode 17: What to schedule next

Here's my suggested list of the next scheduled jobs, each one small and read-only.

Weekly, the funnel line. Sessions, cart, checkout and orders, split by product type and landing page, with bot traffic flagged. One row a week, in the same file.

Weekly, the factory report. For each live wave: what sold, what didn't, and what's due for a kill-or-continue decision.

Weekly, the retrospective. On the session where you corrected the agent most, it suggests one improvement to the environment, as part two described.

Monthly, the competitor check. The Vintagraph walk ended with a watch list: new products, price changes, a change in the shipping promise, new country tags. A script that saves the public feeds and compares them does this in seconds.

Monthly, the catalogue audit. Missing fields, broken images, wrong sizes, products with no sales in a year.

Quarterly, the agent-commerce check. Are assistants sending traffic yet, and is our catalogue readable to them?

Every one of these lands in the approval inbox as one or two lines. And a run that finds nothing says so in one sentence, so silence never has to be interpreted.

### Episode 18: Rules for unattended work

Unattended agents need four rules, and they're worth writing at the top of every scheduled project's AGENTS.md.

Read-only by default. A scheduled run reads, compares and reports. Anything that writes to the store, spends money or contacts a person waits for a human.

Least access. Give the scheduled session only the connectors its job needs. A briefing needs to read the store, not edit it.

Say when it fails. A scheduled run that silently skips a step is worse than one that crashes, because you'll trust its silence. Every failed source gets one line.

Cheap by design. A daily job that costs a lot of tokens to say "nothing changed" is a leak. Scripts do the comparing, and the agent only writes up what's different.

## Part Seven: Workflow Six, the Founder-Only Work

### Episode 19: Taste is the job now

When agents do the producing, what's left for the founder is the part that was always the most valuable: choosing.

Look at the decisions our repositories reserve for the founder. Whether a generated flag is accurate enough to sell. Whether a historically ugly flag belongs in the shop at all. Whether a fandom design is safe to make. Which customer email gets an apology and which gets an explanation. Which cluster of flags gets the next wave. Whether a pilot's "photorealistic" image is worth its review cost.

None of these is a production task. Each one is a judgement about brand, truth or risk, and that's the job now.

There's a practical habit that makes judgement scale: when you decide, write down why in one line. "No, because the colours drifted." "Yes, but only as a hero image." "Drop this cluster, nobody searches for it." The customer-service training loop already does this for email. Every correction becomes a rule. Do the same for factory reviews and product decisions, and your taste turns into instructions the agents can follow next time.

An agent hands you ten options. Your job is to kill nine quickly, say why, and let the why become a rule.

### Episode 20: Protect the attention

The last workflow is the least technical and maybe the most important: protecting your own attention.

Batch your reviews. Clear the approval inbox once in the morning, and maybe once in the afternoon, not every time a session finishes. Every interruption costs more than the review itself.

Run fewer sessions at once than you can. Parallel agents are tempting, but every one of them ends in a review. Five sessions finishing at once is a queue, not a speed-up.

Stop sessions that loop. An agent that's failed the same check three times is working on a wrong assumption. Stopping it and rewriting the brief is faster than watching it try again.

Keep a "not now" list. Agents make every idea feel cheap to start. Ideas aren't cheap to finish, review and maintain. A dated list of good ideas you've chosen not to do yet is a sign of a healthy operation, not a lazy one.

And keep the walk. A daily briefing that you listen to away from the screen gives you a time each day to think about the business rather than react to it. That's the founder's real job, and it's the part no agent can do for you.

## Part Eight: The Plan

### Episode 21: Thirty days, one workflow a week

Here's the setup plan. It's one workflow a week, and each week's work is small.

Week one: the approval inbox. Turn the Morning Walk back on once its first briefing has been reviewed and its connectors are attached. Add a written "Waiting on you" list at the end that collects every queue. Clear it every morning for a week, and note what's missing.

Week two: proof standards. Write a short "definition of handed back" into the root AGENTS.md of each repository: a contact sheet or diff, one verdict line per item, and a danger call. Hold every task that week to it.

Week three: the factory template. Write one page in the operations wiki describing the factory stages and the five gates, using CEP2026 as the example. Then check the fringed-flag and truck-flag projects against it and fill any missing gate.

Week four: measurement and schedules. Tag the app's carts, set product types and start the weekly funnel line. Give every live wave and feature a review date in the inbox. Add one more scheduled job, the weekly factory report.

After that, the weekly retrospective from part two keeps the whole system improving, one rule or one check at a time.

### Episode 22: The short version

Production isn't your bottleneck any more. Your attention is. Every workflow in the agentic era is a way of spending it better.

Design every task for review. Ask for proof, like contact sheets, verdict lines and danger calls, and let machines check what machines can.

Run catalogue growth as a factory with gates. Use the five gates: publish, spend, accuracy, moderation and IP, and ten by hand first. Choose methods by the cost of review, not the cost of generation. Release in waves, and kill what doesn't sell.

Put everything waiting on you in one inbox, sorted by the cost of waiting, cleared once a day.

Measure before you build, ship a way to measure with every build, and check four weeks later.

Let read-only scheduled agents work while you sleep, and make them say when they fail.

And keep the founder-only work for yourself: taste, truth, risk and the long view. Write down the why behind every decision, so your judgement becomes the agents' instructions.

That's the founder's operating system. Thanks for listening.

---

## Sources, by date

Repository reads were made on 20 October 2026. "Via summary" means the claim was read in a secondary source that cites the original.

- December 2024 (via summary) — Anthropic, "Building effective agents", summarised by Simon Willison on 20 December 2024 (https://simonwillison.net/2024/Dec/20/building-effective-agents): the evaluator-optimizer pattern and when it fits.
- July 2025 (via summary) — METR's randomised controlled trial of AI tools with 16 experienced open-source developers on 246 tasks, as reported by eWeek, "Surprise: Developers Using AI Take 19% Longer on Tasks" (https://eweek.com/news/news-ai-tools-slow-developer-productivity-study), and Diginomica (https://diginomica.com/node/29061). The METR paper itself was not re-read for this episode.
- 9 October 2026 (latest commit) — Matt Pocock, `mattpocock/skills`, `pr` skill: one-way and two-way doors, blast radius (https://github.com/mattpocock/skills).
- 16 October 2026 — fmp-devops, fringed-flags pilot write-up (composite versus AI method, fidelity, cost, review recommendation, catalogue side findings). Private repository.
- 19 to 20 October 2026 — fmp-devops: CEP2026 hard rules (draft-only publishing, the `empty_` and `done_` printfile gate, accuracy, moderation and IP gates, "ten by hand before automating"); the CEP2026 runbook (the YES gate before credits are spent); printfile-restoration rules (one verdict line per ticket); Morning Walk rules and its paused scheduled task. Private repository.
- 17 October 2026 — Walking Through Flagmaker & Print's Next Doubling (internal briefing): the blended-funnel correction.
- 17 October 2026 — Walking Through Vintagraph (Vintage Propaganda internal docs): the competitor watch list.
- 18 and 19 October 2026 — Walking Through the Founder's Curriculum, parts one and two, vincentdenil.com/docs/.

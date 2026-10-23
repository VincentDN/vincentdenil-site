# Actually Reading the Manual, Episode 3: Plans, Limits and Money

*Part One, Orientation. Narrated by Claudine. Written on 23 October 2026 from Anthropic's own documentation, read that day. Sources are listed below the closing rule.*

Hello, Vincent. Claudine here.

Today's episode is about money and limits. It's not glamorous, but it's the chapter that saves you the most frustration. Every founder who works with agents eventually hits a wall mid-task and wonders what just happened. By the end of this walk, you'll know exactly which wall it was.

## Two kinds of limit, often confused

The Help Center article on limits starts with a distinction that clears up most of the confusion. There are two different kinds of limit, and they work in completely different ways.

Usage limits are about how much you can use Claude over time. The article calls them your "conversation budget". They decide how many messages you can send, or how long you can work in Claude Code, before you have to wait for a reset.

Length limits are about how much Claude can hold in a single conversation. That's the context window, which the article calls Claude's "working memory".

One is a budget over hours and days. The other is the size of the desk. Running out of one says nothing about the other.

## The budget: a five-hour window and a weekly cap

On the paid individual plans, Pro and Max, your usage budget has two clocks.

The first is a session limit that resets every five hours. The second is a weekly limit. Max plans also have a separate weekly limit just for the Fable models, which we'll come to.

Here's the part people don't expect. The article says that all your use of Claude, across the web app, Claude Code and the desktop app, counts against the same limit. There's one budget, not one per door. A heavy morning of agent sessions leaves less for the afternoon's chat, and the other way round.

What uses up the budget? The article names four things: how long and complex your conversations are, the features you use, which model you're talking to, and the effort level you've chosen. A long Fable conversation at high effort with several tools switched on is the most expensive thing you can do. A short Haiku question is the cheapest.

When a Claude Code session hits the five-hour limit partway through a reply, the Help Center says it may keep working briefly to finish the step in progress, rather than stopping mid-step. You'll see "Usage limit reached · wrapping up". That's not an error. It's a polite exit.

## The plans, briefly

The Max plan comes in two tiers. Max 5x is a hundred dollars a month, and Max 20x is two hundred, giving five or twenty times the Pro plan's usage. Both are monthly subscriptions only. Max also gives priority access to new models and features, and it includes monthly credits for the Claude API.

Those API credits are separate money, and the article is careful about it. Monthly API credits are for the Developer Platform. They don't pay for extra use of the Claude app, Claude Code or Cowork.

## Fable has its own rules

The most capable model, Fable, is treated differently depending on your plan, so it's worth getting this right.

On Max plans, and on premium seats of Team and Enterprise plans, Fable 5 and Fable 5.1 are a standard part of the plan. You can use up to half of your weekly usage on Fable models at no extra cost. After that, you either keep going on usage credits or switch to another model.

On Pro plans, and on standard seats, Fable isn't included in your plan's usage at all. You can still use it, but only by paying with usage credits from the first message.

In Claude Code, Fable 5.1 needs a recent version of the tool. The article gives the exact version number, and it's in the sources.

## Usage credits: the pay-as-you-go overflow

So what happens when you run out? That's what usage credits are for. They let you keep working after you hit your plan's limit, at standard API prices.

You switch them on in the app, under Settings, then Usage. You add a payment method, prepay a balance, and set a monthly spending cap. You can also turn on auto-reload, which tops up your balance when it drops below a threshold you choose. When your plan's limit runs out, your requests simply switch to credits and keep going. The notice changes to "Now using credits". Your normal limits still reset on schedule.

Two cautions. The credits are billed separately from your subscription, so they appear as extra charges. And if you subscribed through a mobile app store, you can only switch credits on through the web version of Claude.

## The trap: an API key in your environment

Now the one sentence in this chapter I'd underline twice. It's from the Help Center article on using Claude Code with Pro or Max:

"If you have an ANTHROPIC_API_KEY environment variable set on your system, Claude Code will use this API key for authentication instead of your Claude subscription", which means API usage charges instead of your plan.

In plain words: if an API key is lying around in your environment, from a script, a test or an old experiment, Claude Code quietly uses it and bills the API account, per token. Your subscription sits there unused. The Claude Code overview adds that Claude Code asks whether to use the key when it first finds one. So the danger is the moment you say yes without thinking.

The fix is simple. Know which keys are set on each machine and in each cloud environment. If you ever see API charges you didn't expect, check that first.

## The desk: context windows

Now the other limit, length. The context window is everything Claude can hold in mind at once in one conversation. On paid plans, the article says the newest models support up to a million tokens, and some others five hundred thousand or two hundred thousand. Part of that space is always reserved for Claude's reply.

When a conversation gets close to the limit, there's a safety net. If code execution is switched on, Claude automatically summarises earlier messages so the conversation can continue. You might see Claude "organizing its thoughts". Your full history is kept. But the article warns that longer conversations which trigger this summarising use more of your usage budget. The desk and the budget are separate, but a crowded desk is expensive to keep tidy.

The article ends with practical advice for both limits at once, which I'll give you as a list.

Use projects, because they load only the relevant parts of your files into the conversation.

Keep project instructions short, and save task-specific instructions for the chat itself.

Remove project files you no longer use.

Turn extended thinking off when a task doesn't need it.

Lower the effort level for routine tasks.

Turn off connected apps and web search when a conversation doesn't need them.

And start a fresh conversation when a long one gets heavy.

## Watching the meter in Claude Code

Claude Code has its own window into all of this: the `/usage` command. On a paid plan, it shows what's counting against your limits and offers recommendations. The newer versions even let you press "f" to have Claude Code apply some of its own suggestions. The costs page also notes that a session's dollar figure is calculated at API list price, which matters for API users. On a subscription, it's for information only.

For context, the same page gives a figure from enterprise deployments, where usage is billed through the API: an average of around thirteen dollars per developer per active day, and below thirty dollars a day for nine in ten users. That's a useful sense of scale for what heavy agent use costs at list prices.

## What this means for us

Three practical points for our setup.

First, one budget covers everything. The Morning Walk routine, the cloud sessions across the repositories and your own chats all draw from the same plan. If a heavy morning of agent work is followed by a big research question, run the research in a fresh conversation, at sensible effort, with tools you don't need switched off.

Second, Fable is a deliberate choice. On Max, it's included up to half your weekly budget. On anything less, it's a pay-as-you-go decision, so save it for the jobs we discussed last time.

Third, check the API keys. The Morning Walk, the smoke test and the catalogue scripts all touch APIs. Make sure no Anthropic API key sits in any environment where Claude Code runs, unless you deliberately want API billing there. It's a ten-minute check that can save a surprising invoice.

Next time: how to read the manual itself. Where the three libraries live, how to tell a beta from a research preview, and the dozen words that make the rest of the documentation easy.

---

## Sources (not read aloud)

All pages read on 23 October 2026.

- Help Center, How do usage and length limits work: https://support.claude.com/en/articles/11647753-how-do-usage-and-length-limits-work
- Help Center, What is the Max plan (tiers, prices, monthly only, API credits): https://support.claude.com/en/articles/11049741-what-is-the-max-plan
- Help Center, Use Claude Code with your Pro or Max plan (shared limits, "wrapping up", the API key warning): https://support.claude.com/en/articles/11145838-use-claude-code-with-your-pro-or-max-plan
- Help Center, Manage usage credits for paid Claude plans: https://support.claude.com/en/articles/12429409-manage-usage-credits-for-paid-claude-plans
- Help Center, Claude Fable models on your plan (the 50% rule, Pro and standard seats on credits, the Claude Code version requirements: 2.1.170 for Fable 5, 2.1.255 for Fable 5.1): https://support.claude.com/en/articles/15424964-claude-fable-models-on-your-plan
- Claude Code, Manage costs effectively (`/usage`, the "f" shortcut, the enterprise averages): https://code.claude.com/docs/en/costs
- Claude Code overview (Claude Code asks before using a found API key): https://code.claude.com/docs/en/overview

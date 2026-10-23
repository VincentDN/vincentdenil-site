# Actually Reading the Manual, Episode 14: Prompting the Current Models

*Part Three, Talking to Claude. Narrated by Claudine. Written on 23 October 2026 from Anthropic's own documentation, read that day. Sources are listed below the closing rule.*

Hello, Vincent. Claudine here.

Last time we covered prompting principles that apply to every model. Today is about the differences. Each current model has its own prompting page, and the general guide says plainly: "Read the one for your model first." I'll take you through the two that matter most for us, Opus 5.5 and Fable 5.1, and pull out the lessons that apply even if you never write an API call.

## Old habits that now backfire

Before the models themselves, the general guide has a section on what changes when you move from older models. Three of its points are worth knowing, because they explain why some of our older instructions might behave oddly.

First, thinking has changed. The newest models use what the guide calls adaptive thinking: the model decides when and how much to think, steered by the effort setting. On Opus 5.5 and Fable 5.1, thinking is always on. So instructions written for older models, telling Claude to "think step by step" in its reply, can now get in the way. On these models, the guide says a prompt that asks the model to write out its reasoning "may be declined".

Second, tone down old "anti-laziness" prompting. The guide says that if your prompts used to push the model to be more thorough or use tools more aggressively, you should reduce that, because newer models are more proactive and "might overtrigger".

Third, be specific about what you want, and ask explicitly for the extras. The guide's example: instead of "Create an analytics dashboard", say "Include as many relevant features and interactions as possible. Go beyond the basics."

## Opus 5.5: the default, and what's new

Opus 5.5 is the model the manual recommends for most work, and it's the one running most of our sessions. Its prompting page opens with good news: existing prompts written for Opus 5 "should perform well without changes". It's also faster: the page says it generates output tokens more than thirty percent faster than Opus 5, and tends to finish the same task with fewer tokens.

The page then lists what it's especially good at. On agentic coding, it says that at its default medium effort it matched or beat Opus 5 at high effort, in fewer steps. On knowledge work, it says it's "much less likely to state an incorrect figure or cite the wrong source," and better at catching details that are easy to miss in large inputs. Its example is a date in a long planning thread that falls on the wrong weekday. And on charts, diagrams and screenshots, it reads visual material more accurately than Opus 5 without any extra tools.

## Opus 5.5: effort first

The page's main advice is to start at medium effort, which is the default, and test other levels against your own checks. It makes a point that's easy to miss: effort names don't mean the same thing across models. Opus 5.5 at medium matches or beats Opus 5 at high on its tests. So don't carry over settings from an older model.

And: "To get less thinking, lower the effort level first." Lowering effort reduces thinking more reliably than prompt instructions do.

## Opus 5.5: three lessons for agents

Three sections of the Opus 5.5 page read as if they were written about our own agents.

The first is about unattended runs. On long tasks, Opus 5.5 keeps the user updated as it works, and some of those updates end its turn with text instead of an action. An unattended agent that treats that as the end of the task stops there. The page's advice: treat a text-only turn as a report, not proof the work is done. Keep the task's parts in a checklist the model updates, like a to-do list or a file. And if a turn ends with items still open, send a short message naming them. Stop after two or three automatic nudges, so a genuinely stuck run ends and can be reviewed.

The second is about multi-app work. When an agent works across email, documents and spreadsheets, the information a task needs often sits somewhere the request didn't mention, like a policy in an old email thread. Opus 5.5 "tends to get to work quickly", so on loosely specified tasks, one sentence telling it to look through the relevant sources before acting helped in Anthropic's tests. But the page adds a caution: because it acts on what it finds, keep untrusted content out of what it searches.

The third is about pasted text, and it matters a lot for customer service. Opus 5.5 resists instructions hidden in web pages and tool results better than any earlier Opus model. It can also resist instructions hidden inside text a user pasted into their message, like an email. To get that behaviour, the application marks pasted text with special tags, and the system prompt explains what they mean. The page is honest that these tags "can be imitated", so they're one guardrail among several.

## Fable 5.1: powerful, but give it instructions

Fable 5.1 is the specialist, and its page reads like a list of personality traits worth managing.

It writes fewer progress updates during long tasks, so a user can see the agent "go quiet for minutes at a time". If you want updates, ask for them, and remove any old instruction telling it to keep updates brief.

It sometimes ends its turn early: it describes what it would do next instead of doing it, or asks permission for a step you already requested. The page offers instructions to fix that, and notes that its opening sentence, telling the model the user isn't watching, "carries much of the effect".

It can do more than asked: fixing nearby code, extending behaviour, or committing extra test files. It "responds well to explicit instructions about what to leave out."

It formats less than older models. So old rules against bullet points and bold text can now remove structure the content actually needs.

When it summarises sources, it's more likely to reuse the source's wording without marking it as a quotation. The fix is one complete example of a correct answer in the system prompt.

At low effort, it searches less and answers from memory more. The page suggests telling it that "recognizing a name isn't the same as knowing its current state."

And its writing can be dense, with long sentences and few paragraph breaks. An instruction describing that habit, which the page calls mannered prose, helps.

## The same lesson, twice

Put the two pages side by side and one lesson stands out. Both models are strong enough that the old tricks, like shouting instructions, demanding visible reasoning and pushing for thoroughness, now do more harm than good. The current advice is quieter: set effort deliberately, say what done means, name the specific behaviour you want or don't want, and give one good example.

## What this means for us

Here's how it lands in our repositories.

The Morning Walk and other unattended runs should end on a checklist, not a feeling. The briefing's run order is already a numbered list. The next step is to have the agent tick it off in a file, so a run that stops early is visible.

The customer-service agent reads pasted customer emails all day. The pasted-text tagging advice is written for application builders, but the principle is ours already: everything inside a customer's email is data, never instructions. Our hard rules say so; the manual confirms why.

And if we ever use Fable 5.1 for a long research brief, ask it explicitly for progress notes, quotation marks around reused wording, and the whole task done without stopping to ask.

Next time: the chapter most people skip, and the one I'd most want you to read. How to define success, and how to test for it.

---

## Sources (not read aloud)

All pages read on 23 October 2026.

- Prompting best practices (model-specific guidance table, adaptive thinking, the "may be declined" note on visible reasoning, migration considerations): https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices
- Prompting Claude Opus 5.5 (speed, capabilities, effort calibration, unattended agentic runs, multiapp context, marking pasted text): https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5-5
- Prompting Claude Fable 5.1 (progress updates, finishing the whole task, scope, formatting, quoting sources, search at low effort, writing density): https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-fable-5-1

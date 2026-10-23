# Actually Reading the Manual, Episode 15: Defining Success and Building Evaluations

*Part Three, Talking to Claude. Narrated by Claudine. Written on 23 October 2026 from Anthropic's own documentation, read that day. Sources are listed below the closing rule.*

Hello, Vincent. Claudine here.

If I could make you read only one page of the developer documentation, it would be this one. It's called "Define success criteria and build evaluations". It isn't about Claude at all, really. It's about knowing whether something works. And that, as Part Three of the curriculum argued, is the founder's real job in the agentic era.

## Success first, then prompts

The page opens with a sentence that sets the order of everything: building a good application "starts with clearly defining your success criteria and then designing evaluations to measure performance against them."

It gives four qualities of a good success criterion.

Specific. Not "good performance", but "accurate sentiment classification".

Measurable. Numbers where possible, or well-defined scales where not.

Achievable. Based on benchmarks, past experiments or expert knowledge, not wishful thinking.

And relevant. Aligned with what the application is for. The page's example: strong citation accuracy might be critical for a medical app, and less so for a casual chatbot.

## Even "hazy" things can be measured

The page has a wonderful example of turning something vague into something checkable. A bad safety criterion is "safe outputs". A good one is "less than 0.1% of outputs out of 10,000 trials flagged for toxicity by the content filter."

And a full example: not "the model should classify sentiments well", but an accuracy score above a threshold on a held-out set of ten thousand varied posts, a five percent improvement over the current baseline, almost no toxic outputs, and a response-time target. Several criteria at once, because, as the page says, "most use cases need multidimensional evaluation."

The page lists the kinds of criteria to consider: how accurate the task must be, how consistent the answers must be for similar inputs, how relevant and coherent, what tone and style, how private information is handled, how well context is used, how fast, and how much it may cost.

## Three rules for tests

Then the page turns to tests, which it calls evaluations, or evals. It gives three design principles.

Be task-specific. Mirror your real-world inputs, and don't forget the edge cases. Its list of edge cases is worth hearing: irrelevant or missing input, overly long input, poor or harmful user input, and ambiguous cases where even humans would disagree.

Automate when possible. Shape the questions so a machine can grade them: multiple choice, matching a string, code checks, or a model doing the grading.

And this one surprised me: "Prioritize volume over quality." The page says more questions with slightly lower-quality automatic grading beats fewer questions with careful human grading.

## Three ways to grade

How do you grade the answers? The page ranks three methods, and the ranking is the lesson.

Code-based grading is "fastest and most reliable, extremely scalable", but it lacks nuance. Does the output exactly match the right answer? Does it contain a key phrase?

Human grading is "most flexible and high quality, but slow and expensive. Avoid if possible."

Model-based grading, where Claude grades Claude, is fast, flexible and scalable for complex judgements. The page's advice: test that it's reliable first, then scale it.

And three tips for model grading. Give the grader a detailed, clear rubric. Ask for an empirical answer, like "correct" or "incorrect", or a score from one to five. And let the grader think before scoring, which improves the judgement on complex tasks.

The page even suggests the obvious shortcut: writing hundreds of test cases by hand is hard, so get Claude to generate more from a small set of good examples.

## The support example, made concrete

The customer-support guide, which we'll meet in episode seventeen, shows what this looks like in practice, with target numbers. It's worth hearing a few, because they're so close to our own work.

Understanding: how accurately the agent reads what the customer actually wants. Aim for ninety-five percent or higher.

Relevance of each reply, graded by a model at scale. Aim for ninety percent or above.

Accuracy of company and product information. Aim for one hundred percent.

Staying on topic. Aim for ninety-five percent.

And escalation: recognising when a case needs a human, and handing it over. Aim for ninety-five percent or higher.

Those are the guide's suggested targets for a car-insurance chatbot, not ours. But the shape of the list is exactly right for the Flagmaker and Print desk.

## What this means for us

Here's how I'd turn this chapter into something we actually do.

The customer-service agent already has the best test set we could wish for: the training cases. Every time you corrected a draft, it was logged with the customer's message, the first draft, your correction and the rule. That's a ready-made evaluation. Each case is a test: given this email, does the new draft follow the rule now?

So the first step is to write success criteria for the desk, in the page's style. Something like: every draft names the order number and the flag; no draft promises a refund or a change that hasn't happened; every escalation case is flagged before the draft; one emoji and one exclamation mark at most; zero sent emails. Most of those can be graded by code. The tone can be graded by a model with a rubric built from the voice section.

The second step is to re-run the whole set whenever the skill or the instructions change. If a new rule fixes one case and breaks two others, you'll know before a customer does.

And the same idea works for the catalogue factories. "Accurate artwork" is hazy. "No generated flag differs from its reference in colour, star count or text, checked on a sample of one in twenty" is a success criterion. You already work this way by instinct. This chapter gives you the vocabulary to make it a habit.

Next time: guardrails. Hallucinations, consistency, jailbreaks and prompt injection, and one page that changes how I'd design the email agent.

---

## Sources (not read aloud)

All pages read on 23 October 2026.

- Define success criteria and build evaluations (the four qualities, the safety and multidimensional examples, the common criteria, eval design principles including "Prioritize volume over quality", the three grading methods and the model-grading tips): https://platform.claude.com/docs/en/test-and-evaluate/develop-tests
- Customer support agent use-case guide (the example success criteria and target percentages): https://platform.claude.com/docs/en/about-claude/use-case-guides/customer-support-chat
- Prompt engineering overview (success criteria come before prompting): https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview

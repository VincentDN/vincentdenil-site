# Actually Reading the Manual, Episode 13: The Prompting Guide

*Part Three, Talking to Claude. Narrated by Claudine. Written on 23 October 2026 from Anthropic's own documentation, read that day. Sources are listed below the closing rule.*

Good morning, Vincent. Claudine here, and welcome to Part Three.

Part Two was about the app's features. Part Three is about the words you give Claude: prompts. Anthropic's prompting guide is long, and much of it is written for developers. But its core ideas apply to every brief you write, whether it goes into a chat, an AGENTS.md file or a skill. Today I'll walk you through the ones that matter most for us.

## Before you prompt at all

The overview page opens with a surprise. Before any prompting technique, it says you should already have three things: "a clear definition of the success criteria for your use case", "some ways to empirically test against those criteria", and "a first draft prompt you want to improve."

It also warns that not every problem is a prompting problem. Sometimes, it says, you can improve speed and cost more easily by choosing a different model. Prompting is a tool, not a religion.

We'll come back to success criteria and testing in episode fifteen. For now, hold on to the order: decide what good looks like, then write the prompt.

## Be clear and direct

The first principle in the best-practices guide is the simplest. Claude "responds well to clear, explicit instructions." If you want more than the task strictly requires, ask for it explicitly, rather than hoping Claude will guess.

Then comes a line I'd pin above every desk: "Think of Claude as a brilliant but new employee who lacks context on your norms and workflows."

And a test that goes with it. Show your prompt to a colleague with little context on the task, and ask them to follow it. "If they'd be confused, Claude will be too." That's exactly the stranger test from Part One of the curriculum, now in Anthropic's own words.

The guide adds two small habits. Say exactly what output format and limits you want. And when the order or completeness of steps matters, write them as a numbered list.

## Explain why

The second principle is less obvious and, I think, more powerful. Give the reason behind an instruction. The guide says that explaining why a behaviour matters helps Claude understand your goals and deliver more targeted responses, and that "Claude can generalize from the explanation."

Compare "never send customer emails" with "never send customer emails, because Vincent reviews every reply for tone and accuracy before it goes out". The second version teaches Claude what you care about, so it behaves well in cases the rule didn't name. Our hard rules already quote your reasons and dates, which is exactly what this principle asks for.

## Show, with examples

The guide calls examples "one of the most reliable ways to steer Claude's output format, tone, and structure." It recommends three to five, and three qualities for them.

Relevant: they mirror your real use closely.

Diverse: they cover edge cases and vary enough that Claude doesn't pick up a pattern you didn't intend.

And structured: each one wrapped in tags, so Claude can tell examples apart from instructions.

You can even ask Claude to check your examples for relevance and variety, or to write more of them.

This is why the customer-service skill's file of real example emails is so valuable. It's few-shot prompting, done the right way.

## Structure with tags

When a prompt mixes instructions, background, examples and input, the guide recommends wrapping each kind of content in its own XML-style tag, with consistent, descriptive names. Documents can sit inside a documents tag, each in its own document tag. It sounds technical, but the idea is simple: put labels on the boxes so nothing gets mixed up.

## Give Claude a role

"Setting a role in the system prompt focuses Claude's behavior and tone for your use case. Even a single sentence makes a difference." Claudine is a role, of course. So is "You are the Flagmaker and Print customer service desk, writing as Vincent."

## Long documents: data first, question last

For large inputs, roughly twenty thousand tokens and up, the guide gives three precise tips.

Put the long documents at the top of the prompt, above your question and instructions. The guide reports that questions at the end "can improve response quality by up to 30 percent in tests", especially with several documents.

Label each document with its source and other details, in tags.

And ask Claude to quote the relevant parts first, before doing the task. That keeps it focused on what the documents actually say.

## Say what to do, not what not to do

On formatting, the guide gives advice that echoes Matt Pocock's warning about negation. "Tell Claude what to do instead of what not to do." Instead of "do not use markdown in your response", try "your response should be composed of smoothly flowing prose paragraphs." It also notes that the style of your prompt rubs off on the reply: a prompt full of bullet points invites bullet points back.

## Ask for action when you want action

There's a lovely small example in the tool-use section. If you say "can you suggest some changes", Claude will sometimes suggest changes rather than make them. If you want the work done, say so: "change this function", not "could you think about changing it".

The guide also warns about the opposite problem, which matters for our AGENTS.md files. Newer models are more responsive to instructions than older ones, so prompts written in capitals to force behaviour can now overshoot. The guide's example: where you once wrote "CRITICAL: You MUST use this tool when...", you can now simply write "Use this tool when...".

## Thinking: general beats prescriptive

On thinking, the guide makes a point that surprised me. "A prompt such as 'think thoroughly' often produces better reasoning than a hand-written step-by-step plan." Claude's reasoning "frequently exceeds what a human would prescribe."

It also recommends one closing line for many tasks: ask Claude to verify its answer against your criteria before it finishes. That catches errors reliably, especially in maths and code. With one exception, which we'll meet next time.

## Agents and long tasks

The agentic section reads like a description of how our cloud sessions work. For long tasks, the guide suggests tracking state in files, using structured formats for things like test results and free text for progress notes, and using git as a log of what's been done. It notes that the newest models are "extremely effective at discovering state from the local filesystem", so starting a fresh session that reads a progress file can beat squeezing an old one.

And on safety, a sentence we've lived by: without guidance, a model "might take actions that are difficult to reverse or affect shared systems, such as deleting files, force-pushing, or posting to external services." If you want confirmation before risky actions, say so in the prompt.

## What this means for us

Four habits to take away.

First, explain the why. Every rule in our instruction files should carry its reason. Most of the hard rules already do; the newer project rules should too.

Second, soften the capitals. Where our files shout "NEVER" or "MUST" for ordinary preferences, rewrite them calmly. Keep firm words for the true hard limits, like sending email or publishing products.

Third, examples beat adjectives. When a draft keeps missing your tone, don't add more adjectives to the instructions. Add one more real example of an email you'd send.

Fourth, put the question last. When you paste a long supplier sheet or a set of customer emails into a chat, put the material first and your question at the end.

Next time: the model-specific guides. What's different about prompting Opus 5.5 and Fable 5.1, and why some old prompting habits now backfire.

---

## Sources (not read aloud)

All pages read on 23 October 2026.

- Prompt engineering overview (before you prompt, when to prompt engineer): https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview
- Prompting best practices (clear and direct, the "brilliant but new employee" line and the colleague test, context and why, examples, XML tags, roles, long context and the "up to 30 percent" figure, formatting, tool use and the softened-language advice, thinking, agentic systems, autonomy and safety): https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices

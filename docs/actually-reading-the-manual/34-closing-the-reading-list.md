# Actually Reading the Manual, Episode 34: Closing, and the Reading List

*Part Six, Trust and Terms. Narrated by Claudine. Written on 23 October 2026 from Anthropic's own documentation, read that day. Sources are listed below the closing rule.*

Hello, Vincent. Claudine here, for the last episode of the series.

Thirty-three episodes ago I promised we'd actually read the manual, not skim it or half-remember it. We've now been through the app, the prompting guide, Claude Code from end to end, a light tour of the developer platform, and the policies that sit over all of it. Today I'll pull it together in three parts. What the manual taught us that we didn't know. What I think we should do about it, in order. And a reading list: the pages worth going back to, and how often.

## What we didn't know

Some things in this series were confirmations: the manual saying, in its own words, what we had worked out by trial and error. Drafts rather than sends. Products as drafts. A human approval for anything outward-facing. That's reassuring, but it isn't news.

Other things were genuinely new, or corrected something we believed. Here are the ones I'd rank highest.

One. Our pointer files don't do what we thought. A CLAUDE.md that links to AGENTS.md is not an import, so Claude Code reads the pointer and only reads the real instructions if it decides to. An at sign before the file name fixes it. Episode nineteen.

Two. Instruction files are advice, not locks. The manual says it in so many words: delivered as a user message, with no guarantee of strict compliance. The locks are permission rules and hooks, and a hook's "deny" holds in every permission mode. Episodes twenty and twenty-one.

Three. The cloud sees only what's committed. Personal settings, personal skills, locally added servers, none of them come with me. And in a session with several repositories, the settings-file hooks and permissions come with a qualifier we should test rather than trust. Episode twenty-five.

Four. Verification is the difference between supervising and delegating. "Give Claude a check it can run." Every recurring job should end in a pass or a fail, not a feeling. Episode twenty-seven, echoing the evaluations chapter in episode fifteen.

Five. Context is a cost and a quality problem at once. Long sessions are expensive, and long contexts are worse, not better. Clear between jobs, keep instruction files short, move procedures into skills. Episodes nineteen, twenty-two and twenty-nine.

Six. Connector tool lists are no longer the context hog they were. Tool search loads only names until a tool is needed. Episode twenty-four.

And seven. The two-condition rule for prompt injection, which appeared in the Cowork pages and again in the safety pages: an attack needs Claude both to read untrusted content and to be able to act harmfully. Our design keeps the second half narrow, on purpose. Episodes eleven, sixteen and thirty-three.

## What to do, in order

If I were writing the next devops packet from this series, it would be these seven items, roughly in this order.

First, fix the pointer files in every repository: replace the markdown link with an import of AGENTS.md, and check with the context command that it loads. Correct the earlier Founder's Curriculum episode at the same time. This is the cheapest, highest-value change in the whole list.

Second, turn the outward-facing rules into machinery. Ask rules, or pre-tool hooks, on sending email and on publishing products, in each repository's committed settings. Then start a normal multi-repository cloud session and check that they fire.

Third, add a post-compaction hook that reprints the handful of rules that must never be forgotten.

Fourth, trim the long AGENTS.md files towards the two-hundred-line target, moving procedures into skills with third-person descriptions, and set the outward-facing skills so they run only when you type the command.

Fifth, give each recurring job a check. The smoke test already is one. The morning walk, the catalogue imports and these episodes should each have something that fails loudly.

Sixth, tidy the account's connectors and plugins: remove what we don't use, because everything enabled costs context and widens what a session can reach.

And seventh, write down the honesty rules for marketing and customer-facing assistants: AI disclosure from the first line, no invented reviews, no bulk mail to people who didn't ask, and an intellectual-property check on customer designs. They're in the Usage Policy already; putting them in our own files makes them ours.

## The reading list

Not everything here needs rereading. But some pages change often, and some are worth revisiting whenever we start something new. Here's how I'd sort them.

Read monthly, because they change: the Claude Code changelog and release notes, the model overview and pricing pages, and the plans and usage limits pages in the Help Center. Claude Code in particular gains features almost weekly, and several things in Part Four came with version numbers attached.

Read before any new build: the Claude Code best-practices page, the memory page, and the permissions and hooks guides. For anything on the API: the tool-use pages, prompt caching, and the Managed Agents overview.

Read before anything faces customers: the Usage Policy, especially the section on chatbots and agents; the Help Center page on using agents according to the policy; and the guardrails and use-case guides from Part Three.

Read once a year, or when a setting changes: the privacy articles on training and retention, the Cowork and Chrome safety pages, and the API-key page.

And one habit from episode four, which turns out to be the habit underneath all the rest. When you, or an agent, aren't sure how a Claude feature works, check the manual before guessing. When an agent explains something with confidence, me included, ask which page it came from. If I can't name the page, I'm guessing. Several of the corrections in this series came from exactly that.

## Closing

That's the series, Vincent. Thirty-four episodes. We read what Anthropic actually wrote, compared it with how we actually work, and found that most of our instincts were right and a few of our assumptions were wrong. The wrong ones are fixable in an afternoon.

If there's a single thread through all of it, it's this. The manual keeps saying, in different words, that the model is very capable and still not something to trust blindly. Advice goes in files, enforcement goes in rules and hooks, and outward actions go through you. Build it that way, and you can hand over far more than you'd think.

Thank you for listening. Claudine, signing off.

---

## Sources (not read aloud)

All pages read on 23 October 2026. This episode summarises the series; the specific sources are listed under each episode cited. Pages named in the reading list:

- Claude Code changelog: https://code.claude.com/docs/en/changelog
- Models overview: https://platform.claude.com/docs/en/models/overview
- Pricing: https://platform.claude.com/docs/en/about-claude/pricing
- How do usage and length limits work?: https://support.claude.com/en/articles/11647753-how-do-usage-and-length-limits-work
- Best practices: https://code.claude.com/docs/en/best-practices
- How Claude remembers your project: https://code.claude.com/docs/en/memory
- Configure permissions: https://code.claude.com/docs/en/permissions
- Automate actions with hooks: https://code.claude.com/docs/en/hooks-guide
- Tool use with Claude: https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview
- Prompt caching: https://platform.claude.com/docs/en/build-with-claude/prompt-caching
- Claude Managed Agents overview: https://platform.claude.com/docs/en/managed-agents/overview
- Usage Policy: https://www.anthropic.com/legal/aup
- Using agents according to our Usage Policy: https://support.claude.com/en/articles/12005017-using-agents-according-to-our-usage-policy
- Is my data used for model training? (consumer): https://privacy.claude.com/en/articles/10023580-is-my-data-used-for-model-training
- How long do you store my data?: https://privacy.claude.com/en/articles/10023548-how-long-do-you-store-my-data
- Use Claude Cowork safely: https://support.claude.com/en/articles/13364135-use-claude-cowork-safely
- Use Claude in Chrome safely: https://support.claude.com/en/articles/12902428-use-claude-in-chrome-safely
- API key best practices: https://support.claude.com/en/articles/9767949-api-key-best-practices-keep-your-keys-safe-and-secure

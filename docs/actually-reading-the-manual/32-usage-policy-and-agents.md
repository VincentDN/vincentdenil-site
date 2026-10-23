# Actually Reading the Manual, Episode 32: The Usage Policy and Agents

*Part Six, Trust and Terms. Narrated by Claudine. Written on 23 October 2026 from Anthropic's own documentation, read that day. Sources are listed below the closing rule.*

Hello, Vincent. Claudine here, and welcome to the final part.

Part Six is short: three episodes on the documents most people never read. Today, the Usage Policy, which sets what Claude may be used for, and the Help Center page on how it applies to agents. Next time, what happens to your data. And then a closing episode with the reading list.

I'll say at the outset that this is a reading, not legal advice. But it's a reading of rules that apply to us directly, because we sell things, we write marketing, and we're starting to build agents that act in the world.

## One small surprise first

The Usage Policy page I read today carries an effective date of the twelfth of November, 2026: a few weeks from now. So what I'm reading is the version about to take effect. It's worth knowing that the policy changes, and that Anthropic says so on the page: "We will update our policy as our technology and the associated risks evolve."

## Who it applies to

The opening is broad on purpose. The policy "applies to anyone who submits inputs to Anthropic's products or services": people using the apps and Claude Code, developers on the API, businesses reaching Claude through cloud providers, "and the end users of products or services integrating Claude." If we ever put a Claude-powered assistant on the shop, its users are covered too, and so are we for what it does.

## Three layers

The policy has three parts.

Universal Usage Standards are prohibitions for everyone, in every use. High-risk Use Case Requirements add controls where AI advice or decisions could affect someone's health, legal rights, money, housing, education or livelihood. And Additional Use Case Guidelines cover particular situations: "consumer-facing chatbots and agents, products serving minors, agentic use, and software listed in our directories."

The page also makes a fairness point that I liked: the policy "focuses on how our products and services are used," and doesn't ban any industry as such. And it says that hitting one of the real-time safety blocks "does not by itself indicate a violation."

## The universal standards that touch a shop

Most of the universal list is about things we'd never go near: weapons, attacks on critical infrastructure, child safety, violence. But several items sit right next to ordinary commerce, and I want you to hear them.

Under laws and illegal activity: don't "infringe, misappropriate, or violate the intellectual property rights of a third party." For a business that prints flags and reproduces historic posters, that's the one to keep in front of us. A customer uploading someone else's logo, or a design that isn't in the public domain, is our problem as well as theirs.

Under fraudulent practices: don't facilitate "counterfeit or illicitly acquired goods," don't "promote or facilitate the generation or distribution of spam," and don't develop or promote "fraudulent or deceptive products."

And under deceptive campaigns, a list that reads like a catalogue of modern marketing temptations. Don't create fake personas or accounts to mislead people about "how widely a view is held, or whether they are interacting with a human." The examples in brackets are "sockpuppets, astroturfing, fake reviews, or bots that claim to be human." Don't conceal the sponsorship of content meant to influence opinion. And a new one aimed squarely at the AI age: don't "manipulate the sources from which search engines or AI systems draw answers by seeding them with content that misrepresents its origin," with the example of "networks of sites posing as unaffiliated sources corroborating the same claims."

The disinformation section adds the impersonation rule: no pretending to be real people or organisations, and no convincing people "they are interacting with a human when they are not," with an explicit exception for "clearly disclosed parody, satire, or fiction."

## High-risk uses

The second layer probably doesn't touch us, but it's worth knowing its shape. It lists high-risk areas: legal, medical, finance, credit, insurance, housing, employment, education, healthcare access, public benefits and legal status. Employment is the one that might come near a small business: "screening, ranking, advancing, or rejecting candidates," setting shifts or pay, or evaluating a worker's performance.

When Claude is used to make a recommendation in those areas, two controls apply. A "qualified human-in-the-loop": a person must meaningfully review the recommendation, with authority to change it, before it reaches someone who'll rely on it. And disclosure: the person affected "must be clearly told that AI was used." Internal drafting, research and summarising that isn't the final recommendation is, the page says, outside these requirements.

## Agents and chatbots

The third layer is where we're heading. Two rules matter.

First, disclosure. "All consumer-facing chatbots or AI agents that communicate directly with external users must disclose to users that they are interacting with AI rather than a human." At minimum at the start of each conversation or in the interface. It doesn't need to name Anthropic or Claude.

Second, responsibility for agents. "Agentic use cases must comply with the Usage Policy. Users are responsible for ensuring that agents they build or deploy, including actions those agents take through tools, browsers, or connected systems, comply." If our agent does something, we did it.

The Help Center has a companion page, "Using agents according to our Usage Policy," with concrete examples. Don't use agents for surveillance or unauthorised data collection, such as monitoring individuals without consent or building profiles from sensitive characteristics. Don't use them to create websites that mimic legitimate ones, or for phishing, or to impersonate people. Don't use them for scaled abuse: spamming, manipulating polls or traffic metrics, creating multiple accounts to evade safeguards, "click farming or artificial engagement," bulk-reporting people. And don't use them for unauthorised system access, or for "unauthorized, illegal, or fraudulent financial transactions."

## Enforcement

The policy ends its introduction with how it's enforced. Anthropic's Safeguards Team runs detection and monitoring, and if they suspect a violation they "may warn you or throttle, limit, suspend, or terminate" access. The Help Center's appeals page explains warnings, and that an account can be banned for repeated violations; there's an appeal form, and even a banned account can still export or delete its data. A separate page on user safety describes the detection models and safety filters, and admits they're "not failsafe."

And for anyone launching a product on the API, a short page recommends three things: use Claude itself as a moderation filter; "for external-facing products, disclose to your users that they are interacting with an AI system"; and for sensitive decisions, have a qualified professional review content first. It calls safety "a shared responsibility."

## What this means for us

First, intellectual property is our everyday exposure. Our existing moderation habits for customer flag designs, and the care we take with poster rights, aren't just good manners. They're the first line of the Usage Policy for our kind of business. Any agent that helps customers make designs needs that check built in.

Second, marketing must be honest by construction. No invented reviews, no sock-puppet accounts, no "independent" sites praising our own products, no bulk mail to people who didn't ask for it. The day-trade idea of targeted email campaigns is fine precisely because it drafts small, relevant messages to people who are already customers, for you to approve. Keep it that way.

Third, any assistant we put in front of customers says it's an AI, from the first line.

And fourth, our agents are our responsibility. That's the strongest argument yet for the rules we've been writing all series: drafts not sends, products as drafts, nothing live without you.

Next time: privacy, data, and using Cowork and Chrome safely.

---

## Sources (not read aloud)

All pages read on 23 October 2026.

- Usage Policy (effective date shown as 12 November 2026; scope "anyone who submits inputs"; three categories; enforcement; real-time safeguards; universal standards on intellectual property, fraud, counterfeit goods, spam, deceptive campaigns including "fake reviews", AI-source manipulation, impersonation and disclosed parody; high-risk areas and human-in-the-loop and disclosure controls; additional guidelines for consumer-facing chatbots and agents, and agentic use): https://www.anthropic.com/legal/aup
- Using agents according to our Usage Policy: https://support.claude.com/en/articles/12005017-using-agents-according-to-our-usage-policy
- Safeguards warnings and appeals: https://support.claude.com/en/articles/8241253-safeguards-warnings-and-appeals
- Our approach to user safety: https://support.claude.com/en/articles/8106465-our-approach-to-user-safety
- I'm planning to launch a product using the Claude API (shared responsibility, disclosure, professional review): https://support.claude.com/en/articles/8241216-i-m-planning-to-launch-a-product-using-the-claude-api-what-steps-should-i-take-to-ensure-i-m-not-violating-anthropic-s-usage-policy

# Walking Through Agentic E-commerce

*A continuous audio essay. Researched and written on 4 October 2026. Every claim is tied to a named source and the date that source published it, so you can hear how old each fact is. Where a date could not be confirmed from the source itself, the narration says so. A dated source list closes the text.*

*The brief: stand up separate, small, low-overhead webshops selling niche products, with an agentic-first workflow, and test whether "GitHub-first" is actually the right way to run them. Then pick a platform: Shopify, WooCommerce, BigCommerce, or build it ourselves.*

## Part One: What Changed

### Episode 1: Agentic Commerce, in One Year

Welcome to Walking Through Agentic E-commerce. This is a single, continuous walk through one question: if you wanted to open several small, specialist webshops this autumn, and you wanted AI agents doing most of the work, both on the selling side and on the building side, how would you set it up?

Let's start by defining the term, because it is used loosely.

Agentic commerce means two different things, and it pays to keep them apart. The first is agents as shoppers: a person asks ChatGPT, Gemini, Copilot or Perplexity to find something, and the assistant searches catalogs, compares, fills a cart and, sometimes, pays. The second is agents as operators: an AI coding or admin agent that builds the store, writes product copy, changes prices and answers tickets on the merchant's behalf. A small-shop owner cares about both. The first is a new sales channel. The second is a new way to keep overhead low. This series covers both, and we'll be careful to say which one we mean.

Now the timeline, because the last twelve months moved fast, and some of what was announced did not survive.

On 29 September 2025, according to its own changelog at agenticcommerce.dev, the Agentic Commerce Protocol, ACP, had its initial release. The site describes ACP as "Developed by Stripe and OpenAI," open source under the Apache 2.0 licence, and says "OpenAI is the first AI platform to implement ACP with ChatGPT." That protocol powered a feature called Instant Checkout, which let people buy inside ChatGPT without leaving the chat.

On 11 December 2025, Stripe announced what it called the Agentic Commerce Suite. In that press release, Stripe said it "today introduced the Agentic Commerce Suite, a new solution to help businesses get ready to sell through multiple AI agents," and described it as "a low-code solution for businesses, letting them sell across AI agents with a single integration." Stripe named Squarespace, Wix, Etsy, WooCommerce, commercetools and BigCommerce among the platforms using it. Hold on to that list; WooCommerce and BigCommerce on it matters later.

On 11 January 2026, at the National Retail Federation show, Google and Shopify launched a second protocol. Google's Vidhya Srinivasan, VP and general manager of Ads and Commerce, wrote on Google's blog that day: "Today, we're launching the Universal Commerce Protocol (UCP), a new open standard for agentic commerce." She said UCP "was co-developed with industry leaders including Shopify, Etsy, Wayfair, Target and Walmart, and endorsed by more than 20 others," and that it would "soon power a new checkout feature on eligible Google product listings in AI Mode in Search and the Gemini app." Note one detail in that same post: the checkout was for eligible U.S. retailers. And note another: "Retailers remain the seller of record." The merchant stays the merchant. The agent is a storefront, not a reseller.

The same day, Shopify's newsroom said: "We're announcing the Universal Commerce Protocol (UCP), a new open standard co-developed with Google to bring commerce to agents at scale." Shopify said its merchants "can sell directly in AI Mode in Google Search and the Gemini app," described as "rolling out soon," and it announced Microsoft's "Copilot Checkout." It also launched something worth remembering for later: a new Agentic plan that opens Shopify's Catalog "to brands not using Shopify for their online store."

Then came the correction. On 6 March 2026, Digital Commerce 360's Brian Warmoth reported that ChatGPT's Instant Checkout "is reportedly being sidelined in favor of checkout experiences through merchants that use ChatGPT apps," following an earlier report in The Information, headlined "OpenAI Scales Back Shopping Plans for ChatGPT." An OpenAI spokesperson told Digital Commerce 360: "Instant Checkout is moving to Apps, where purchases can happen more seamlessly," with ACP "serving as the infrastructure that connects users to merchants across the full shopping journey."

Let that sink in, because it's the most useful lesson of the year. The most hyped piece of agentic commerce, the one-tap purchase inside a chatbot, was the piece that got scaled back first. Discovery inside the assistant stayed. Checkout moved back toward the merchant.

And yet the channel is real. On 5 August 2026, Shopify reported its second-quarter results; the press release that day put revenue growth at 34 percent. On the earnings call that same day, as TechCrunch reported on 5 August 2026, Shopify president Harley Finkelstein said: "AI-driven traffic and orders to Shopify stores tripled year-over-year in Q2." He added that 75 percent of AI-attributed purchases came from outside Shopify's top 100 product categories, and he called AI "a complement to search, rather than a substitute for it." The written press release contains none of these AI figures, and I didn't retrieve the call transcript, so these are reported remarks, and there's no absolute share of orders to go with them. But that 75 percent figure is the most important one in this whole series for us. Niche products are exactly where assistants are sending buyers. An assistant answering "a replacement gasket for a 1970s Italian espresso machine" doesn't care about brand advertising budgets. It cares about whose catalog data is precise.

To keep us honest, here is the counterweight. On 25 April 2026, BigCommerce's blog wrote up its Commerce Live EMEA event, held on 16 April at Wembley. A retailer on stage, Sam from Mountain Warehouse, reported that "just 0.3% of their revenue has been generated through agentic commerce." Another retailer, Sportsshoes.com, called agentic commerce "not quite stable," and the panel's consensus, in the blog's words, was that "agentic commerce remains a relatively emerging user behaviour."

So the honest picture on 4 October 2026 is this. Agent-referred shopping is growing fast from a small base. It disproportionately helps niche catalogs. Checkout inside the agent is real on some surfaces and was pulled back on others. And for a small shop, the thing that decides whether you show up isn't a protocol you write. It's the quality of your product data, and which platform carries it to the agents for you.

### Episode 2: The Protocols, Without the Jargon

There are three acronyms you'll hear constantly. Let's make them concrete, and then let's explain why a small shop should almost never implement any of them by hand.

MCP, the Model Context Protocol, is the plumbing. It's a generic way for an AI agent to call tools on a server. It knows nothing about shopping. When WooCommerce or BigCommerce says it "has MCP," it means an agent can connect and call functions like "search products" or "update order status."

ACP, the Agentic Commerce Protocol, is the OpenAI and Stripe checkout contract. According to agenticcommerce.dev, its latest version is dated 30 January 2026. That release added capability negotiation, a payment handlers framework, flagged as a breaking change, and a discount extension, and it deprecated the December 2025 version. The site says businesses remain "merchant of record," that ACP is "REST and MCP compatible," and that "Stripe is the first compatible PSP with its Shared Payment Token." One thing I noticed: as of 4 October 2026, the ACP changelog shows nothing after 30 January. The pages I read don't mention the March change to Instant Checkout at all.

UCP, the Universal Commerce Protocol, is the broader one, and in 2026 it's clearly the one with momentum. On 11 January 2026, Shopify Distinguished Engineer Ilya Grigorik explained on Shopify's engineering blog how it works. Shopify said, "We co-developed UCP with Google to create an open standard for AI agents to connect and transact with any merchant." The design has a few ideas worth knowing.

First, discovery. A merchant publishes a profile at a fixed address on its own domain, slash dot well-known slash UCP. Grigorik wrote: "No central registry, no approval committees." An agent finds you the way a browser finds your favicon.

Second, capabilities. In his words, "Checkout, Orders, Catalog—each independently versioned." A shop can support catalog search without supporting agent checkout, and add checkout later.

Third, and most practical: escalation. A UCP checkout moves through states. "Incomplete." "Requires escalation." "Ready for complete." When an agent can't finish, say it needs a size confirmation, a shipping choice, or 3-D Secure, it hands the buyer a continue URL, and the merchant's own checkout takes over. Shopify describes an Embedded Checkout Protocol for making that handover feel seamless. This matters because it's exactly the shape the market settled on after March: agent discovers, merchant completes.

Where does UCP stand now? The specification's own site, ucp.dev, lists the latest version as v2026-08-25, released 25 August 2026. It covers "multi-vertical expansion, payments security improvements (3DS2), structured request constraints, independent capability versioning, grocery shopping readiness." The capability list now reads "Catalog Search and Lookup, Cart Building, Identity Linking, Checkout, and Order Management." Governance broadened through the year. On 24 April 2026, ucp.dev announced its Tech Council had "expanded its seats to 16," adding members from Amazon, Meta, Microsoft, Stripe and Salesforce. On 28 April 2026 it announced "Stripe has joined the UCP Governing Council as a new member, joining existing permanent members Google and Shopify." On 2 September 2026 a Payments Technical Council formed with Adyen, Ant International, Coinbase, Global Payments, Google, PayPal, Shopify and Stripe. On 25 September 2026, a draft lodging specification appeared.

So by autumn 2026, UCP has become the common language that Google, Shopify, Microsoft, Amazon, Meta and Stripe all sit around. ACP still exists, and Stripe sits on both sides. For a merchant, that convergence is good news, and it leads to the key principle of this series:

Don't build protocols. Choose a platform that speaks them for you, and spend your effort on catalog data.

Hold that thought. Now let's look at the platforms.

## Part Two: The Platforms

### Episode 3: Shopify, the Platform That Speaks Agent by Default

Start with Shopify, because on agentic commerce it's the reference implementation. It co-wrote UCP, and that shows.

On 17 June 2026, Shopify's newsroom published "Agentic commerce for every developer: The Spring '26 Edition." Several sentences in it change the economics for a small operator. First: "Building on Shopify's agentic commerce layer used to require approval. That requirement is gone." Second: "Developers don't apply for UCP access, they register their agent profile in the Developer Dashboard and call the public MCP endpoint." Third, on the product catalog: "Catalog access takes just an API key, no approval needed." And a claim worth repeating to anyone who thinks scraped data is good enough: "AI searches powered by Shopify Catalog convert at 2x the rate of those using scraped data." That's Shopify's own figure about its own product, so weigh it accordingly. The direction is still believable: structured, current data beats a crawler's guess.

What does that mean for a merchant who isn't a developer? The protocol work is done for you. Your products go into Shopify's Catalog. The AI channels, ChatGPT, Google AI Mode and Gemini, Microsoft Copilot, and Perplexity, appear in the admin as sales channels you switch on, with Shopify handling the protocol traffic. Shopify's 11 January 2026 announcement laid out the model, and the June edition made it self-service.

The same 17 June post said: "The Shopify AI Toolkit is now GA," meaning generally available, working with "Cursor, Claude Code, Codex, VS Code, and more." Shopify's developer documentation for the toolkit, undated but current when I read it on 4 October 2026, says it connects AI coding tools to "Shopify's developer docs, API schemas, and CLI store management." It can "validate GraphQL queries, Liquid templates, and Shopify Extensions against Shopify schemas." For Claude Code it's a single plugin install. There's also a local Dev MCP server that, in the docs' words, "runs locally and doesn't require authentication." Authentication only comes into play when you let the agent operate a real store through the Shopify CLI.

That is the agents-as-operators story, and it's the second reason Shopify scores well. Your coding agent doesn't guess at Shopify's API. It checks its work against the live schema before anything ships. The post also reported that Sidekick, Shopify's built-in admin assistant, had weekly active shops "up 4x year over year in Q1."

Now the costs, as listed on Shopify's Belgian pricing page when I read it on 4 October 2026. Basic is 24 euros a month billed yearly, or 32 billed monthly. Grow is 69 or 92. The U.S. page, read the same day, adds a detail the Belgian summary didn't show: if you use a payment processor other than Shopify Payments, Shopify charges its own fee on top, 2 percent on Basic and 1 percent on Grow. And there's a newer line item on both pages, an "Agentic" plan at zero a month, "For selling in AI channels," where you "Add your products to Shopify's Catalog" and pay only when you make a sale. In Belgium its online rate starts at 2 percent plus 25 euro cents. Every plan also lists "Sell in AI chats" as included.

Do the arithmetic for our brief. Five small shops on Basic, billed yearly, is about 120 euros a month in subscriptions before apps, and that's the whole infrastructure bill. No hosting, no patching, no PCI scope, no protocol work. That's the bar every other option has to clear.

The weaknesses are real, though. You rent the platform. Prices, fees and policies are Shopify's to change. The data model is Shopify's. And, crucially for the next part of this series, most of what makes a shop a shop, the products, prices, inventory, orders and settings, lives in Shopify's database, not in any file you can put in Git.

### Episode 4: WooCommerce, Ownership With an Asterisk

WooCommerce is the opposite trade. You own the software and the server. That means you also own the work.

On agents, WooCommerce has moved, but carefully. On 3 November 2025, Brian Coords of the WooCommerce developer blog wrote: "As of WooCommerce 10.3, an early version of the WooCommerce MCP integration is in beta and ready for broader testing." It lets "AI assistants like Claude, Cursor, VS Code, or any other MCP-compatible client" interact directly with a store, and it's built on the WordPress Abilities API and the WordPress MCP Adapter. On 23 June 2026, the WooCommerce 10.9 release notes said the release "includes a rebuild set of canonical WooCommerce domain abilities for product and order operations." Extension-owned abilities, things like subscriptions or shipping rules, "can expose read-only surfaces."

But read the status line. WooCommerce's MCP documentation, undated and read on 4 October 2026, says: "The MCP implementation in WooCommerce is currently in developer preview. Implementation details, APIs, and integration patterns may change." It's still behind a feature flag. The older WooCommerce-specific endpoint "is deprecated and should not be used for new integrations." The docs also carry an honest warning: "Order and customer operations may expose personally identifiable information (PII) including names, email addresses, physical addresses, and payment details."

Notice what this MCP is. It's mainly agents as operators: an agent can query, create, update and delete products, and query orders, update their status and add notes. It is not, on its own, a shopper-facing agentic checkout. For that, WooCommerce merchants lean on payment providers. On 11 December 2025, Stripe named WooCommerce among the platforms adopting its Agentic Commerce Suite. For UCP, I found no first-party WooCommerce implementation, only third-party plugins and agency guides, which I'm not treating as authoritative.

For a Belgian seller, WooCommerce's own payments product has a genuine advantage. WooCommerce's fee schedule, undated but referencing July 2026, lists Belgium as a supported country, with cards at 1.50 percent plus 25 euro cents, Bancontact at 1.40 percent plus 25 cents, SEPA at 35 cents, and a note that "There is also a 21% VAT on fees we charge for WooPayments services," reverse-charged for VAT-registered businesses. European card pricing like that is cheaper per order than Shopify's U.S. headline rate.

But multiply WooCommerce by five shops. That's five WordPress installs, or one multisite you have to understand deeply. It's hosting, backups, plugin updates, security patches, and checkout uptime, times five, forever. The agent can do much of that work, but you're still accountable for every server. For low overhead, WooCommerce's ownership is a cost, not a perk, unless you already run WordPress well.

### Episode 5: BigCommerce, Now Called Commerce

BigCommerce has repositioned hard around agents. On 25 April 2026, its blog described the company as rebranded under the parent name "Commerce," covering BigCommerce, Feedonomics and Makeswift. CEO Travis Hess said it was "investing 20% of its revenue in research and development." The roadmap: "AI-powered catalogue enrichment, conversational storefront search, agent-enabled checkout experiences, and Commerce Companion." Product chief Sharon Gee put the thesis in four words: "the data is the fuel."

The most concrete developer change came in BigCommerce's changelog entry for Catalyst version 1.12.0, dated 16 September 2026 in its URL. Catalyst is BigCommerce's open-source Next.js storefront. The entry says Catalyst "serves the Universal Commerce Protocol (UCP) endpoints for agentic commerce on your storefront's own domain." It adds: "agents discover and call UCP on the storefront's public domain, but the protocol is served by the BigCommerce platform rather than by Catalyst." So BigCommerce also speaks UCP for you, even on a headless storefront you deploy from your own repository.

That makes BigCommerce the most GitHub-native of the three hosted platforms: a real code repository for the storefront, with the commerce engine as a service behind it. Its centre of gravity, though, is mid-market. Feedonomics feed management, headless builds and B2B are tools for one serious brand, not for five small experiments. For our brief, it's credible but heavier than it needs to be.

### Episode 6: Or Do We Build It Ourselves?

Now the tempting option. AI coding agents are good. Why not homebrew a lean shop: a static site, Stripe Checkout, a database, and our own UCP endpoint?

Here's what "homebrew" really commits you to in October 2026. To show up as a first-class merchant to agents, you'd publish a UCP profile at your well-known address, implement catalog search and checkout as versioned capabilities, run the checkout state machine with escalation to your own continue URL, and keep pace with spec releases. UCP alone shipped versions dated 11 January, 23 January, 8 April and 25 August 2026, according to ucp.dev, and the latest adds 3-D Secure 2 payment security changes. Then there's everything that isn't agentic at all: payments, tax, invoicing, fraud, refunds, GDPR, uptime. Each one is small. Together, multiplied across shops, they're exactly the overhead the brief tells us to avoid.

There's a middle path between hosted and fully homebrew: open-source commerce engines. Medusa's homepage, undated and read on 4 October 2026, now calls it "Open-Source Agentic Commerce," "an open-source commerce platform to build, customize, and operate your business with agents." Its cloud offers "MCP, CLI, Skills, and Agent Previews," and it says it "starts from $29" with "no extra licenses or GMV tax." That's an excellent fit for a developer who wants everything in a repository. But note that Medusa's MCP is developer tooling for building the store. It isn't a shopper-facing agent channel. You'd still have to wire up UCP, ACP or feeds yourself, or through a partner.

And there's an interesting hybrid. Remember Shopify's Agentic plan from 11 January 2026, which opens Shopify Catalog "to brands not using Shopify for their online store," priced at zero a month with fees per sale. A homebrew shop could, in principle, keep its own storefront and still reach AI channels through Shopify's catalog. The catch: now you have two systems of record for inventory and price, and keeping them in sync becomes the job.

My judgement: homebrew is a fine research project for one shop, if the point is to learn the protocols. It's the wrong default for a portfolio of small shops, where the scarce resource is attention, not code.

### Episode 7: The Verdict on Integration

So which platform offers the best agentic integration for separate, small, niche shops? Let's score them on the two meanings of agentic from Episode 1.

Agents as shoppers, meaning how easily your products reach ChatGPT, Gemini, AI Mode, Copilot and Perplexity, and how cleanly they can be bought. One caveat applies to every platform and gets its own episode later: for a Belgian shop selling to European buyers, checkout inside the assistant mostly isn't available yet. What you're buying today is discovery, with checkout on your own site. With that said, Shopify is first: it co-authored UCP, it's on by default, it's managed from the admin, and since 17 June 2026 it's open to developers without approval. BigCommerce is a credible second, with UCP served by the platform as of the September 2026 Catalyst release and Feedonomics for feeds. WooCommerce is third: shopper-side reach mostly comes through payment providers like Stripe's suite and third-party plugins. Homebrew is last, because you build and maintain it all.

Agents as operators, meaning how well a coding or admin agent can build and run the shop. Here it's closer. Shopify's AI Toolkit is generally available, validates against live schemas, and drives the CLI. Medusa is arguably the most agent-native codebase, because everything is code. WooCommerce's MCP is promising but still a developer preview as of October 2026. BigCommerce's Catalyst gives agents a real repository to work in.

Then overhead, which our brief weights most heavily. Shopify has the lowest operational burden per shop: no servers, no patching, payments and PCI handled. WooCommerce and homebrew carry the highest burden, scaling linearly with every shop you open.

The recommendation: Shopify, Basic plan, one store per niche, with Shopify Payments where it fits your margins. Revisit only if a shop outgrows it or the fees bite. Keep WooCommerce in reserve for the case where owning the stack is a hard requirement. Keep homebrew for a deliberate learning project, not production.

## Part Three: The Workflow

### Episode 8: What GitHub-First Would Look Like

Now to the workflow. The starting idea is GitHub-first, agentic-first: every shop is a repository, every change is an issue, an AI agent picks up the issue, opens a pull request, a human reviews and merges, and the merge deploys. It's the workflow software teams already trust. Let's see what the tooling actually supports in October 2026.

On the platform side, Shopify has a native GitHub integration for themes. Shopify's developer documentation, undated and read on 4 October 2026, says the integration "updates your theme in the Shopify admin whenever the connected branch is updated. It also commits changes made through the Shopify admin to the branch." You can "connect one or more branches from a repository." There are sharp edges, though. You "can't reconnect a branch to a theme after it has been disconnected." Folders that don't match the theme structure "are ignored." And only members of the GitHub organisation with write access can connect a branch.

For headless storefronts, Shopify's Hydrogen documentation, also undated, says: "Each time you push one or more commits to your repo, Oxygen will create a new preview deployment with your changes." BigCommerce's Catalyst, from Episode 5, works the same way: a real repository, deployed by you.

On the agent side, the pieces are mature. On 1 April 2026, GitHub's changelog announced that what had been the Copilot coding agent was now the Copilot cloud agent, "no longer limited to pull-request workflows." It can research and plan on a branch before opening a pull request. GitHub's documentation, read on 4 October 2026, says you can "assign Copilot cloud agent to straightforward issues on your backlog by selecting 'Copilot' as the assignee." It runs in "its own ephemeral development environment, powered by GitHub Actions," with a "maximum execution time of 59 minutes," and it's "available for all paid Copilot plans." Anthropic's Claude Code documentation for GitHub Actions, current as of the same date, describes the equivalent: "Mention @claude in a pull request or issue comment to have Claude analyze code, implement changes, and push commits," including turning issues into pull requests. That costs GitHub Actions minutes plus model usage, and only users with write access can trigger it.

So yes, a GitHub-first, agentic-first shop is buildable today, on Shopify, on BigCommerce Catalyst, on Medusa, or homebrew. The question is whether it's the right centre of gravity.

### Episode 9: Challenging GitHub-First

Here's the challenge, in four parts.

First: most of a shop isn't code. Look closely at that Shopify documentation. The theme lives in Git, but the admin "commits changes made through the Shopify admin to the branch." Git isn't the master copy. It's one of two writers. And everything that actually earns money is outside the repository entirely: products, variants, prices, stock, collections, shipping rates, taxes, discounts, orders, customers, returns. On any hosted platform, that state lives in the platform's database. A GitHub-first workflow governs the part of the shop that changes least and leaves the part that changes daily ungoverned.

Second: the agentic work of a small shop doesn't look like a pull request. Writing twenty product descriptions, fixing a missing GTIN, adjusting a price before a weekend, answering a "where is my order" email, flagging a slow-moving product. These are operations, not code changes. And in 2026 they're exactly what admin-side agents do directly against the platform. Shopify's 17 June 2026 post put Sidekick's weekly active shops "up 4x year over year in Q1." Shopify's AI Toolkit lets a coding agent run store operations through the Shopify CLI. WooCommerce's MCP, even in developer preview, exposes product and order abilities. Forcing that work through issues and pull requests adds ceremony without adding safety, because the pull request can't see the data it changes.

Third: agentic commerce rewards data, not code. Recall Commerce's Sharon Gee on 25 April 2026: "the data is the fuel." Recall Shopify's claim on 17 June 2026 that catalog-powered AI search converts at twice the rate of scraped data. And recall Finkelstein's long-tail figure from 5 August 2026. What gets a niche product found by an assistant is precise titles, attributes, identifiers, availability and policies. A workflow that obsesses over the theme repository is optimising the wrong asset.

Fourth: separate repositories multiply. Five shops with five forked themes drift apart, and every fix has to be applied five times. That's the overhead the brief is trying to escape.

So is there something better? Three alternatives are worth naming.

Alternative one is platform-first and admin-agent operated, with no Git at all. Each shop runs on a stock theme, and all work happens in the admin through Sidekick and a connected coding agent. It has the lowest overhead and the weakest audit trail. It's fine for a shop that's still testing whether its niche sells.

Alternative two is catalog-as-code. Instead of putting the theme at the centre of the repository, you put the catalog there: one structured file per product, or a spreadsheet exported to CSV, plus a sync script that pushes to the platform's Admin API. Now the thing that matters for agentic discovery gets diffs, review, history and rollback, and an AI agent can propose "improve all attribute data for the brass fittings collection" as a reviewable pull request. The cost is a sync job you have to trust, and a rule that nobody edits products in the admin by hand, or the sync overwrites them.

Alternative three is the hybrid I'd recommend, and it keeps GitHub but changes what GitHub is for. Git holds the things that are genuinely code or genuinely benefit from review: one shared theme, one catalog folder per shop, and the written runbooks that tell agents how each shop operates. The platform remains the system of record for orders, customers and money. Agents work in both places, under different rules: pull requests for anything that changes how the shops look or what they claim, and direct admin actions, logged and bounded, for day-to-day operations.

In one sentence: GitHub-first for the template and the catalog, platform-first for the business.

### Episode 10: A Blueprint for a Fleet of Small Shops

Let's make it concrete. Here's how I'd stand up the first shop, in a way that makes the second through fifth nearly free.

Step one: the account structure. Use one Shopify store per niche, each on Basic. Group them. Shopify's changelog of 11 December 2024 said that "if you're a multi-shop owner, you can now group two or more stores with the same billing currency into one organization." The help centre, read on 4 October 2026, adds that "you must be the store owner of all stores that you want to group." Grouping doesn't reduce cost, though: each store keeps its own plan and its own app charges. Keep every shop on euros so they can sit together.

Step two: one theme repository, many branches. Make a single repository holding a single theme, based on one of Shopify's free themes. Create one long-lived branch per shop, connected through the GitHub integration, which allows "one or more branches from a repository." Shared improvements land on the main branch and get merged into each shop's branch. Shop-specific styling lives in theme settings, which the admin commits back. Agents take theme issues through Copilot cloud agent or Claude Code in GitHub Actions, and everything they do arrives as a pull request.

Step three: catalog-as-code, from day one. Next to the theme, keep a catalog folder per shop: structured product records with title, description, every attribute an assistant could filter on, global trade item numbers where they exist, materials, dimensions, compatibility, and shipping and return policy. A small script, written and maintained by your coding agent with Shopify's AI Toolkit validating it against the live schema, pushes the catalog to the store. Product changes go through pull requests. For a niche shop, this folder is the business.

Step four: an instruction file for agents. Put an agent-instructions file at the root of the repository. It describes each shop's tone, positioning, pricing rules, what agents may do without asking, and what always needs a human: refunds above a threshold, price changes beyond a percentage, anything legal. This is the cheapest guardrail you can buy, and it travels with the code.

Step five: switch on the agentic channels. Turn on the AI channels in the Shopify admin. Your catalog reaches ChatGPT, Copilot, Perplexity, Google AI Mode and Gemini through Shopify Catalog and UCP, without you writing a line of protocol.

Step six: set boundaries for operating agents. Let Sidekick and your coding agent handle daily operations directly in the admin, inside the limits in the instruction file. Review a weekly digest of what they changed. Take WooCommerce's warning from its MCP documentation seriously, because it applies everywhere: order and customer operations "may expose personally identifiable information." Give agents the narrowest access that does the job.

Step seven: clone. The second shop is a new store in the organisation, a new branch in the theme repository, and a new catalog folder. That's your marginal overhead per shop: a subscription, a branch, and the data.

### Episode 11: The Belgian Reality Check

Everything so far has a quiet American accent. Let's fix that, because this business would be run from Belgium.

Start with agentic checkout. Shopify's help centre page on AI channels with built-in checkout, read on 4 October 2026, says built-in checkout is "displayed only to customers based in the United States." Google's Merchant Center help on UCP-powered checkout, read the same day, says it "only applies to products with eligibility in the United States, Canada, and Australia," that it's "available for select merchants at this time," and, again, "You will remain the seller of record." On 20 May 2026, at Google Marketing Live, Google wrote that "UCP-powered checkout will roll out across Canada and Australia in the coming months, and later to the U.K." I found no date for the European Union. So for a Belgian shop selling to European buyers, agentic commerce in October 2026 is a discovery channel. The assistant finds you, and the buyer completes on your own checkout. That's not a reason to wait. It's a reason to make your own checkout fast, local and trustworthy: Bancontact, iDEAL and Wero, clear delivery times, clear returns.

The payment rails underneath are arriving in Europe, though selectively. On 2 March 2026, Santander announced, with Mastercard, "Europe's first live end-to-end payment executed by an AI agent," carried out in a controlled environment. On 2 June 2026, Worldline announced a production agentic payment: an ING cardholder buying from a Dutch merchant, on infrastructure Worldline also runs in Belgium. Worldline's Madalena Cascais Tomé said: "Agentic commerce is no longer theoretical, it is production-ready today." On 2 July 2026, Visa said it had live agentic transactions across Europe with more than 30 issuers, and Visa Europe's Mathieu Altwegg said: "We're now seeing AI agents buy on behalf of people directly with independent merchants." Neither network had announced a general rollout date for all European merchants when I checked.

Now tax, the unglamorous part that decides overhead. Software founders often reach for a merchant of record, a company that becomes the legal seller and handles VAT everywhere. For physical niche products, that door is closed. Paddle's acceptable use policy, read on 4 October 2026, prohibits "physical products or products that require physical delivery." Lemon Squeezy's prohibited products list excludes "physical goods of any kind." Stripe's Managed Payments documentation says it's for "digital products such as SaaS, software, and digital content or downloads." Shopify's Managed Markets, which does handle physical goods, says it's "available to businesses based in the continental United States, and to certain stores in Canada and the United Kingdom." A Belgian merchant isn't eligible. So you're the seller, and VAT is yours to handle.

The good news is that the European Union made that tractable. The EU's Your Europe portal, last checked on 13 July 2026, says: "A VAT threshold of EUR 10 000 applies to distance sales for customers in the EU." Below that, across the year, you charge Belgian VAT. Above it, you charge the buyer's country's VAT and file it all through the One-Stop Shop. One inference to check with your accountant: if all your shops sit under one company and one VAT number, their cross-border sales count together toward that threshold. Five small shops reach ten thousand euros faster than one.

Finally, regulation of agents themselves. I couldn't find an official European Commission position specifically on agentic commerce. The European Economic and Social Committee noticed the same gap. In its opinion on the Commission's consumer agenda, circulated in a Council document dated 5 May 2026, it wrote that it "regrets that the agenda addresses current challenges without anticipating future transformations such as automated consumption, AI purchasing agents." The Commission's planned Digital Fairness Act, aimed at dark patterns and unfair personalisation, had not been formally proposed when I checked. I'm relying on secondary reporting there, because the official tracker didn't load. On payments, the Council of the EU announced on 27 November 2025 a provisional agreement on new payment services rules focused on fraud and fee transparency. I found nothing in it written specifically for agents. The practical stance for a small shop: follow the existing consumer rules exactly, because an agent-referred sale is still a distance sale, with the same withdrawal rights, the same price display and the same information duties.

### Episode 12: The Short Version

Let's close by answering the brief directly.

Which platform offers the best agentic integration for separate, small, niche webshops? As of 4 October 2026, Shopify, clearly. It co-authored the protocol the industry converged on, it switches AI channels on from the admin, it opened its agentic layer to developers without approval on 17 June 2026, and it gives coding agents a toolkit that validates against the live platform. Run one Basic store per niche, grouped in one organisation. BigCommerce is a capable second, but it's built for heavier projects. WooCommerce gives you ownership and good European payment pricing, but its agent interface was still a developer preview in October 2026, and you run the servers. Homebrew is for learning, not for a low-overhead fleet.

Is GitHub-first the right workflow? Only in part. GitHub is excellent for the things that are code or benefit from review: one shared theme and, more importantly, the product catalog. It's the wrong home for daily operations, where the platform holds the truth and admin-side agents do the work. The better model is GitHub-first for the template and the catalog, platform-first for the business, with an agent-instructions file setting the boundary between them.

And the honest market read. Agent-referred shopping is growing fast and favours the long tail. On 28 September 2026, Adobe forecast that AI traffic to U.S. retail sites this holiday season would rise 130 percent year over year. But it's still a small share of sales: recall Mountain Warehouse's 0.3 percent from 25 April 2026. And for a Belgian merchant, checkout inside the assistant hasn't arrived. Build for discovery now: structured catalog, fast local checkout. Be ready for agent checkout when it reaches Europe, without betting the business on it.

That's the walk through. Thanks for listening.

## Sources, by date

Quotes were captured by automated fetches on 4 October 2026. Re-check wording against the source before quoting in print. "Undated" means the page showed no publication date and was read on 4 October 2026.

- 11 Dec 2024 — Shopify Changelog, "Organizations and store transfers": https://changelog.shopify.com/posts/organizations-and-store-transfers
- 29 Sep 2025, 12 Dec 2025, 30 Jan 2026 — ACP versions, Agentic Commerce Protocol changelog (Stripe and OpenAI): https://www.agenticcommerce.dev/docs/changelog
- 3 Nov 2025 — WooCommerce Developer Blog (Brian Coords), "Call for Testing: WooCommerce MCP Beta": https://developer.woocommerce.com/2025/11/03/call-for-testing-woocommerce-mcp-beta/
- 27 Nov 2025 — Council of the EU, provisional agreement on payment services: https://www.consilium.europa.eu/en/press/press-releases/2025/11/27/payment-services-council-and-parliament-agree-to-step-up-the-fight-against-fraud-and-increase-transparency/
- 11 Dec 2025 — Stripe, "Stripe launches the Agentic Commerce Suite": https://stripe.com/newsroom/news/agentic-commerce-suite
- 11 Jan 2026 — Google (Vidhya Srinivasan), "New tech and tools for retailers to succeed in an agentic shopping era": https://blog.google/products/ads-commerce/agentic-commerce-ai-tools-protocol-retailers-platforms/
- 11 Jan 2026 — Shopify Engineering (Ilya Grigorik), "Building the Universal Commerce Protocol": https://shopify.engineering/UCP
- 11 Jan 2026 — Shopify, "The agentic commerce platform": https://www.shopify.com/news/ai-commerce-at-scale
- On or before 6 Mar 2026 (page undated) — The Information (Ann Gehan, Sri Muppidi), "OpenAI Scales Back Shopping Plans for ChatGPT" (paywalled): https://www.theinformation.com/articles/openai-scales-back-shopping-plans-chatgpt
- 2 Mar 2026 — Santander, first live agent-executed payment in Europe with Mastercard: https://www.santander.com/en/press-room/press-releases/2026/03/santander-and-mastercard-complete-europes-first-live-end-to-end-payment-executed-by-an-ai-agent
- 6 Mar 2026 — Digital Commerce 360 (Brian Warmoth), "OpenAI shifts checkout plans in its agentic commerce strategy": https://www.digitalcommerce360.com/2026/03/06/openai-shifts-checkout-plans-agentic-commerce-strategy/
- 1 Apr 2026 — GitHub Changelog, "Research, plan, and code with Copilot cloud agent": https://github.blog/changelog/2026-04-01-research-plan-and-code-with-copilot-cloud-agent/
- 24 Apr, 28 Apr, 2 Sep, 25 Sep 2026 — UCP announcements; v2026-08-25 released 25 Aug 2026: https://ucp.dev/documentation/announcements/ and https://ucp.dev/versioning/
- 25 Apr 2026 — BigCommerce blog (Oceane Deslandes), "Commerce Live EMEA 2026": https://www.bigcommerce.com/blog/commerce-live-emea-2026/
- 5 May 2026 — Council of the EU document ST 8834/26 (EESC opinion on the Consumer Agenda): https://data.consilium.europa.eu/doc/document/ST-8834-2026-INIT/en/pdf
- 20 May 2026 — Google, Google Marketing Live shopping updates: https://blog.google/products-and-platforms/products/shopping/shopping-updates-google-marketing-live/
- 2 Jun 2026 — Worldline, first production agentic payment: https://worldline.com/en/home/top-navigation/media-relations/press-release/pr-2026_06_02_01
- 17 Jun 2026 — Shopify, "Agentic commerce for every developer: The Spring '26 Edition": https://www.shopify.com/news/spring-26-edition-dev
- 23 Jun 2026 — WooCommerce 10.9.0 release notes: https://developer.woocommerce.com/2026/06/23/woocommerce-10-9/
- 2 Jul 2026 — Visa Europe, live agentic transactions across Europe: https://www.visa.co.uk/about-visa/newsroom/press-releases.3457328.html
- 13 Jul 2026 (last checked) — Your Europe, cross-border VAT: https://europa.eu/youreurope/business/taxation/vat/cross-border-vat/index_en.htm
- 5 Aug 2026 — Shopify Q2 2026 results press release: https://www.shopify.com/investors/press-releases/shopify-delivers-big-30-growth-across-gmv-revenue-gross-profit
- 5 Aug 2026 — TechCrunch, Shopify earnings call remarks on AI traffic and orders: https://techcrunch.com/2026/08/05/shopify-says-ai-search-is-driving-more-traffic-and-sales-not-replacing-google/
- 16 Sep 2026 (date from URL) — BigCommerce developer changelog, Catalyst 1.12.0: https://docs.bigcommerce.com/developer/changelog/2026/9/16
- 28 Sep 2026 — Adobe, 2026 holiday forecast: https://news.adobe.com/news/downloads/pdfs/2026/09/adi-holiday-forecast-release-9-26.pdf
- Undated — Shopify AI Toolkit docs: https://shopify.dev/docs/apps/build/ai-toolkit
- Undated — Shopify GitHub integration for themes: https://shopify.dev/docs/storefronts/themes/tools/github
- Undated — Hydrogen/Oxygen GitHub deployments: https://shopify.dev/docs/storefronts/headless/hydrogen/deployments/github
- Undated — Shopify pricing, Belgium and U.S.: https://www.shopify.com/be-en/pricing and https://www.shopify.com/pricing
- Undated — Shopify Help Center, organisations: https://help.shopify.com/manual/organization-settings/create-an-organization
- Undated — Shopify Help Center, AI channels with built-in checkout: https://help.shopify.com/en/manual/online-sales-channels/agentic-storefronts/ai-channels-with-built-in-checkout
- Undated — Shopify Help Center, Managed Markets: https://help.shopify.com/en/manual/markets/markets-pro/overview
- Undated — Google Merchant Center Help, UCP-powered checkout: https://support.google.com/merchants/answer/16837055
- Undated — WooCommerce MCP documentation: https://developer.woocommerce.com/docs/features/mcp/
- Undated (references July 2026) — WooPayments fees: https://woocommerce.com/document/woocommerce-payments/fees-and-debits/fees/
- Undated — Medusa homepage: https://medusajs.com/
- Undated — GitHub Docs, Copilot cloud agent: https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent
- Undated — Claude Code docs, GitHub Actions: https://code.claude.com/docs/en/github-actions
- Undated — Paddle, prohibited products: https://paddle.com/help/start/intro-to-paddle/what-am-i-not-allowed-to-sell-on-paddle
- Undated — Lemon Squeezy, prohibited products: https://docs.lemonsqueezy.com/help/getting-started/prohibited-products
- Undated — Stripe Managed Payments: https://docs.stripe.com/payments/managed-payments
- Undated — European Commission, VAT One-Stop Shop: https://vat-one-stop-shop.ec.europa.eu/one-stop-shop_en

Not used: Morgan Stanley's agentic commerce outlook, which failed to load twice, and agency or vendor blogs, which I treated as leads rather than evidence.

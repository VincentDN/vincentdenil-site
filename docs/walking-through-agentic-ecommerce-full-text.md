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

And yet the channel is real. On 5 August 2026, Shopify reported its second-quarter results; the press release that day put revenue growth at 34 percent. On the earnings call that same day, as reported by Retail TouchPoints, Shopify president Harley Finkelstein said AI-driven traffic and AI-driven orders to Shopify stores had each tripled year over year, and that 75 percent of AI-attributed purchases came from outside Shopify's top 100 product categories. I could not retrieve a transcript, so treat the exact figures as secondary reporting. But if they hold, that last number is the most important one in this whole series for us. Niche products are exactly where assistants are sending buyers. An assistant answering "a replacement gasket for a 1970s Italian espresso machine" doesn't care about brand advertising budgets. It cares about whose catalog data is precise.

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

Now the costs, as of 4 October 2026, from Shopify's pricing page, which served U.S. dollar prices when I fetched it. Basic is 29 dollars a month billed yearly, or 39 billed monthly. Grow is 79 or 105. If you use a payment processor other than Shopify Payments, Shopify adds its own fee on top: 2 percent on Basic, 1 percent on Grow. And there's a newer line item, an "Agentic" plan at "$0/mo — For selling in AI channels," where you "Add your products to Shopify's Catalog" and "Only pay when you make a sale." Online card rates on that plan start at 2.9 percent plus 30 cents. The pricing page also lists "Sell in AI chats" as included on every plan. I didn't see euro pricing for Belgium, so check the local figures before budgeting.

Do the arithmetic for our brief. Five small shops on Basic, billed yearly, is around 145 dollars a month in subscriptions before apps, and that's the whole infrastructure bill. No hosting, no patching, no PCI scope, no protocol work. That's the bar every other option has to clear.

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

Agents as shoppers, meaning how easily your products reach ChatGPT, Gemini, AI Mode, Copilot and Perplexity, and how cleanly they can be bought. Shopify is first: it co-authored UCP, it's on by default, it's managed from the admin, and since 17 June 2026 it's open to developers without approval. BigCommerce is a credible second, with UCP served by the platform as of the September 2026 Catalyst release and Feedonomics for feeds. WooCommerce is third: shopper-side reach mostly comes through payment providers like Stripe's suite and third-party plugins. Homebrew is last, because you build and maintain it all.

Agents as operators, meaning how well a coding or admin agent can build and run the shop. Here it's closer. Shopify's AI Toolkit is generally available, validates against live schemas, and drives the CLI. Medusa is arguably the most agent-native codebase, because everything is code. WooCommerce's MCP is promising but still a developer preview as of October 2026. BigCommerce's Catalyst gives agents a real repository to work in.

Then overhead, which our brief weights most heavily. Shopify has the lowest operational burden per shop: no servers, no patching, payments and PCI handled. WooCommerce and homebrew carry the highest burden, scaling linearly with every shop you open.

The recommendation: Shopify, Basic plan, one store per niche, with Shopify Payments where it fits your margins. Revisit only if a shop outgrows it or the fees bite. Keep WooCommerce in reserve for the case where owning the stack is a hard requirement. Keep homebrew for a deliberate learning project, not production.

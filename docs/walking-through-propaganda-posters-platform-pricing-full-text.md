# Walking Through the Cost of a Vintage Propaganda Poster Shop

*A continuous audio essay. Researched and written on 8 October 2026. Platform prices and fees were checked against official pages on that date; most pricing pages do not give a publication date. Repository facts come from the current Vintage Propaganda source, not a live sales audit. The calculations, development allowances and recommendations are our own, with their assumptions stated. A reference sheet and dated source list close the script.*

*The brief: if we go ahead with Vintage Propaganda, what would Shopify, WooCommerce, Medusa, BigCommerce, Big Cartel and Etsy actually cost us? We already have a Medusa and Next.js project, a large poster catalog and a Printful integration plan. We need to compare the cost of finishing that work with the cost of changing platforms, before committing to launch.*

[Back to the documentation index](./)

## Part One: What We Would Be Paying For

### Episode 1: The Shop We Have, and the Shop We Still Have to Build

Welcome to Walking Through the Cost of a Vintage Propaganda Poster Shop.

The question today is practical. If we decide to go through with this project, how much does it cost to sell the posters, and which platform gives us the best chance of keeping the work manageable?

We have already walked through the market, and through the law of selling historical propaganda reproductions. This walk is about the bill. The monthly subscription is one part of it. Payment fees, printing, shipping, unfinished integration work and the time spent keeping orders moving are the other parts.

First, the project as it stands on 8 October. The source catalog contains 491 poster designs. Each has fifteen valid combinations of paper, frame and size. That makes 7,365 variants. The older README still describes twelve starter posters and four sizes; those figures no longer describe the current catalog.

There is also a request-only archive. Running the current library seed alongside the curated catalog could create roughly 5,462 product pages in total, including about 4,971 archive entries. That is a calculation from files and seed logic. We have not verified that those products exist in the live database. An archive page without a price is also different from a restored print ready for sale.

The existing project uses Medusa for commerce and Next.js for the storefront. Printful has been selected for fulfillment, but the integration document explicitly describes a plan. The order adapter, shipping calculations, tracking webhooks and print-file checks still need implementation. All 491 catalog descriptions remain marked as drafts, and the catalog has no print-file fields. The proposed rule that a poster cannot be bought until its print file passes inspection is not yet enforced by the product purchase component.

These are completion costs whichever platform we choose. A managed platform can provide a ready-made Printful connection, but it cannot approve a historical description or restore an image for us.

For this comparison, we use the Belgian merchant context stated in the existing legal episode and the site’s company details. That gives us Belgian payment schedules and euro storefront budgets. The starter’s Denmark region is not evidence of where the business is registered. Actual account eligibility and billing details still need checking when we open or configure the merchant accounts.

### Episode 2: Five Layers in the Bill

Let’s divide the cost into five layers.

First, the platform: a Shopify subscription, a Big Cartel subscription, or the infrastructure on which WooCommerce or Medusa runs.

Second, payments: the charge for accepting a card or local payment, plus any platform fee for using an outside processor. These usually follow the customer’s payment, not our margin. Shipping and tax collected at checkout can increase the fee base too.

Third, fulfillment: the print, frame, packing, shipping and applicable supplier taxes. Printful charges for making the order even when the integration itself is free.

Fourth, operations: domains, email, backups, monitoring, optional apps, refunds, accounting and support. Some services are included in a managed plan. Others need a separate budget.

Fifth, labor: finishing the store, moving the catalog if we change platforms, and maintaining it afterwards. An AI agent may reduce the hours. We still need someone responsible for the result, and we may pay for the agent’s tools and usage.

Keep these layers separate and the comparisons become useful. Put them into one unexplained monthly number and we can make almost any platform look cheap.

We also need to distinguish a monthly payment from an annual price divided by twelve. Shopify Basic at twenty-four euros a month means an annual subscription commitment of 288 euros. Big Cartel Diamond at twenty-four dollars a month means 288 dollars for the year. Neither is a month-to-month twenty-four-unit experiment.

All subscription comparisons below exclude introductory promotions. Vendor VAT and any recoverable input tax depend on the account and business status; the figures are not promised final invoices. Dollar prices stay in dollars. We have not converted them to euros at an unstated exchange rate.

## Part Two: The Platforms

### Episode 3: Shopify, Buying a Shorter Route to a Working Shop

Shopify’s Belgian price page, read on 8 October 2026, lists Basic at 32 euros billed monthly or twenty-four euros per month billed annually. Grow is 92 or 69. Advanced is 384 or 289. Basic’s standard online Shopify Payments rate is two percent plus twenty-five cents; Grow is 1.8 percent plus twenty-five cents; Advanced is 1.6 percent plus twenty-five cents. Bancontact is thirty-nine cents per transaction on all three. Hosting and SSL are included, and the plans support unlimited products. Those are Belgian euro prices, not converted American prices. [Shopify Belgium pricing](https://www.shopify.com/be/prijzen).

Basic is the sensible starting comparison for our shop. Our fifteen variants per design fit comfortably within Shopify’s current product limits. A larger plan is not required merely because 491 designs produce thousands of variants. We would still test the chosen theme and import process with the actual paper, frame and size matrix. [Shopify product variant API](https://shopify.dev/docs/api/admin-graphql/2026-04/mutations/productVariantsBulkCreate).

Printful’s Shopify integration is free to connect. Printing and delivery remain payable. The benefit is having an existing connection to evaluate rather than implementing the entire order handoff ourselves. We should test paid orders, cancellations, tracking and shipping before assuming the connection covers our preferred workflow. [Printful for Shopify](https://www.printful.com/integrations/shopify).

The existing Medusa backend would be replaced. Catalog history, source attribution and restoration status would need mapping into Shopify fields and metafields. A Shopify theme would also need our founder voice and archive presentation. Keeping the current Next.js frontend with Shopify behind it is another option, but that retains frontend hosting and API integration work. It needs its own estimate.

Domains and email hosting are separate from Shopify’s included hosting. Paid apps and a paid theme are optional costs we should itemize before installing them. [Shopify domain purchasing](https://help.shopify.com/en/manual/domains/add-a-domain/buying-domains).

Payments need particular care. With Shopify Payments alone there is no additional third-party transaction fee. Relevant outside-processor transactions can attract a further two percent on Basic, one percent on Grow and 0.6 percent on Advanced, on top of the processor’s fee. Exemptions include some configurations of PayPal and manual payments. Shopify also documents a 1.25 percent premium on Shopify Payments transactions in a particular arrangement using a direct third-party provider alongside it. Our base comparison assumes Shopify Payments alone; a mixed setup needs a fresh calculation. [Third-party transaction fees](https://help.shopify.com/en/manual/your-account/manage-billing/billing-charges/types-of-charges/third-party-charges/third-party-transaction-fees), [Shopify Payments costs](https://help.shopify.com/en/manual/payments/shopify-payments/onboarding/cost-of-shopify-payments).

My judgment is that Shopify Basic deserves a place in the pilot. The test is whether its catalog mapping and archive presentation work well enough to justify leaving the custom backend behind.

### Episode 4: WooCommerce, a Free License With a Running-Cost Budget

WooCommerce’s core software is free. Its official Stripe extension is free too, and WooCommerce does not add a platform percentage for using it. Hosting, extensions and maintenance are separate. Woo’s own pricing page gives broad hosting and extension ranges, rather than one all-in store subscription. [WooCommerce pricing](https://woocommerce.com/pricing/), [WooCommerce Stripe extension](https://woocommerce.com/products/stripe/).

For a Belgian direct Stripe account, the official standard EEA card rate is 1.5 percent plus twenty-five cents. Premium EEA cards are 2.8 percent plus twenty-five cents, UK cards 2.5 percent plus twenty-five cents, and other international cards 3.15 percent plus twenty-five cents. Currency conversion adds two percent where required. Bancontact is thirty-five cents. The standard payment service has no setup or monthly fee. These are processor rates; they do not pay for the store server. [Stripe Belgium pricing](https://stripe.com/en-be/pricing).

Printful has a WooCommerce integration. We would migrate the current commerce data into WordPress and WooCommerce, rebuild the presentation, then test that connection against our order and shipping needs. [Printful for WooCommerce](https://www.printful.com/integrations/woocommerce).

For the numerical comparison later, I will use a forty-five-euro monthly WooCommerce allowance: twenty-five for hosting, ten for backup and security services, and ten averaged across optional extensions. This is our planning assumption, not an offer from a host, and different service bundles can overlap. It excludes labor, the shared domain and email budget, printing and payment fees. Before purchase, replace it with a named hosting quote and a list of extensions we actually need.

The ownership is useful if we want substantial editorial material alongside the products. The maintenance is recurring: updates, plugin compatibility, backups and checkout checks. We could choose a managed host to take on more of that work, but its price and responsibilities need to be explicit.

WooCommerce is therefore attractive if WordPress fits the way we want to operate the shop. At low order volumes, the lower card rate alone is a small saving, and migration could cost more than it saves.

### Episode 5: Medusa, Pricing the Project We Already Have

Medusa is the most relevant comparison because it is already our project. We have catalog scripts, a custom storefront, historical context and archive behavior. Those assets reduce some future work if we stay. Past work does not remove the remaining integration tasks.

Medusa’s community software can be self-hosted without a platform license subscription; the current license identifies separately licensed Enterprise Edition material. Hosting and payment processing remain costs. [Medusa license](https://github.com/medusajs/medusa/blob/develop/LICENSE).

The official Medusa Cloud prices checked on 8 October are Develop from twenty-nine US dollars a month, Launch from ninety-nine, and Scale from 299. They have zero percent GMV platform fees. Cloud bills a monthly base plus usage; these are starting prices. Storefront hosting is included, so we should not automatically add another Next.js hosting subscription. [Medusa pricing](https://medusajs.com/pricing).

Develop lacks a custom storefront domain and automatic backups. Launch is the relevant entry comparison for our branded production shop: it adds those features and managed services. Launch includes two shared servers; Scale adds a worker. Launch’s published allowances include one thousand compute hours, forty gigabytes of transfer and ten gigabytes of object storage, with metered excess. [Medusa Cloud plans](https://docs.medusajs.com/cloud/pricing).

This matters for the Printful plan. Retrying an order, processing shipment events and reconciling failures need a reliable execution model. Medusa recommends separate server and worker instances for production. We should confirm whether our implementation fits Launch, requires Scale, or uses a separately hosted worker before treating ninety-nine dollars as the complete deployment bill. We have not established that every Printful implementation requires Scale. [Medusa deployment guidance](https://docs.medusajs.com/learn/deployment).

Self-hosting is another path. For comparison I use an eighty-euro monthly infrastructure allowance: forty for application, storefront and worker compute, twenty for the database and supporting services, ten for storage and backups, and ten for monitoring. This is an illustrative budget requiring vendor quotes and load checks. It does not include maintenance labor or promise equivalent service to Medusa Cloud. If we host the frontend separately, that belongs in the budget; Vercel’s free Hobby plan is restricted to personal, noncommercial use. [Vercel Hobby terms](https://vercel.com/docs/plans/hobby).

The implementation work is concrete. A paid order must reach Printful once, even when an event is retried. A rejected file must produce a visible failure. Tracking must reach the customer. A poster without an approved print file must stay unavailable for purchase. Someone must be able to reconcile our orders with Printful’s records.

Medusa earns its cost when the archive and restoration workflow are central to the business. It also gives us a larger operational responsibility. The next decision should come from a working pilot and a scoped estimate of what remains.

### Episode 6: BigCommerce, With Its Current Fee Rules

The earlier agentic-commerce essay discussed BigCommerce. Its old pricing assumptions need refreshing.

BigCommerce’s official 2026 update says Standard became Core, Plus became Growth, Pro became Scale and Enterprise became Performance from 1 June. The current dollar prices are Core at thirty-nine monthly or twenty-nine per month billed annually; Growth at 105 or seventy-nine; Scale at 399 or 299. [BigCommerce pricing](https://www.bigcommerce.com/pricing/), [2026 plan update](https://www.bigcommerce.com/dm/plan-pricing-updates-2026/).

The annual commitment for Core is 348 dollars. Its current trailing-twelve-month Inclusive GMV allowance is thirty thousand dollars, with an automatic move to Growth above the allowance. Growth’s threshold is one hundred thousand. The update defines Inclusive GMV as gross order value reduced by ten percent. These are dollar thresholds, so euro receipts cannot be substituted without resolving currency treatment. [BigCommerce 2026 plan update](https://www.bigcommerce.com/dm/plan-pricing-updates-2026/).

There is also an Open Payment Provider fee: two percent on Core, one percent on Growth and 0.6 percent on Scale for eligible open-provider Inclusive GMV. Embedded-provider orders have no such platform fee, but processing still costs money. Stripe appears on the embedded-provider list. We would confirm the Belgian account and configuration rather than reuse a US negotiated processing rate. [Embedded payment providers](https://www.bigcommerce.com/payments/embedded-payment-providers/).

Printful has an integration. A migration from Medusa would still need budgeting. Native product filtering appears on Scale and Performance in the current feature table, which matters if country, era and artist filters are a requirement. Our next step would be to test those features on the exact proposed plan. [Printful for BigCommerce](https://www.printful.com/integrations/bigcommerce), [BigCommerce plan comparison](https://www.bigcommerce.com/pricing/).

BigCommerce remains a credible hosted alternative. For this small launch, its sales thresholds and required feature tier make it a less straightforward budget than the initial Core subscription suggests.

### Episode 7: Big Cartel, and the Difference Between Designs and Variants

Big Cartel’s official plans give us a particularly concrete capacity comparison. Gold is free for five products. Platinum is fifteen US dollars monthly, or 144 a year, for fifty. Diamond is thirty monthly, or 288 a year, for five hundred. Big Cartel adds no transaction percentage of its own; the processor still charges. [Big Cartel plans](https://www.bigcartel.com/resources/help/article/unlock-premium-features), [Processing fees](https://www.bigcartel.com/resources/help/article/processing-fees-explained).

Our 491 curated designs require Diamond if we publish them all. Grouping the fifteen variants under each design uses 491 product slots, not 7,365. The official import guide allows up to 150 variants and three variant groups per product. Our fifteen combinations fit numerically. [Big Cartel import limits](https://www.bigcartel.com/resources/help/article/importing-products).

But 491 of five hundred is 98.2 percent of the allowance. We have nine slots left. If the request-only archive is also represented as thousands of products, it will not fit. We would have to keep that archive elsewhere or redesign its presentation. A ten-design pilot could instead fit Platinum and leave room to expand within that smaller catalog.

The Printful connection has a relevant limit: Big Cartel says Printful shipping rates do not automatically sync. We must maintain shipping profiles and test their coverage ourselves. That is work worth pricing for internationally shipped framed and unframed prints. [Big Cartel’s Printful setup](https://www.bigcartel.com/resources/help/article/set-up-and-use-printful-with-big-cartel).

Big Cartel is appealing for a tightly edited shop. Our curated catalog nearly fills its allowance, while the archive represented as products would exceed it. Adopting it would also be a decision to simplify the project.

### Episode 8: Etsy, Paying for a Sales Channel

Etsy belongs in the comparison because it can bring marketplace discovery. Its fees need comparing with the customer acquisition cost of our own shop as well as with storefront subscriptions.

Etsy charges twenty US cents to publish or renew a listing. Listings expire after four months; sold quantities can also trigger renewal charges. The standard shop has no required monthly subscription, but a location-dependent onboarding fee may appear during setup. One design with size and finish choices is not fifteen separate listing charges. [Etsy fee summary](https://help.etsy.com/hc/en-gb/articles/115014483627-What-are-the-Fees-and-Taxes-for-Selling-on-Etsy).

At one listing per design, publishing all 491 costs 98 dollars and twenty cents before applicable fee taxes. If every listing stayed active for a year and none sold, three listing periods would cost 294 dollars and sixty cents, averaging twenty-four dollars and fifty-five cents per month. Sales alter the renewal schedule, so that idle-catalog average should not simply be added to every sold-unit renewal as if the periods never overlap.

The transaction fee is 6.5 percent of the relevant sale amount, including shipping. Belgian Etsy Payments processing is four percent plus thirty cents on the payment total. For a simple fifty-euro receipt with equal fee bases, that is five euros and fifty-five cents before the dollar-denominated listing renewal and applicable seller-fee VAT. [Etsy Fees and Payments Policy](https://www.etsy.com/legal/fees/), [Etsy Payments country table](https://www.etsy.com/legal/etsy-payments/).

An Offsite Ads attributed order can add fifteen percent below ten thousand US dollars of sales in the prior 365 days, or twelve percent once the threshold is reached. Participation can be opted out below the threshold and remains mandatory after qualifying. A fifty-euro attributed order would add seven euros fifty at fifteen percent. Check the attribution rules before accepting a margin forecast. Listing in a different currency from the payment account can add a 2.5 percent conversion fee. [Etsy fees policy](https://www.etsy.com/legal/fees/).

There is a prior eligibility question. A newly printed reproduction is not itself a twenty-year-old vintage item. Etsy’s production-partner rules require the seller’s original design or permitted buyer customization, and disclosure of the partner. Its Creativity Standards explicitly exclude scans or collections of someone else’s work from the seller-designed category. We should resolve whether our restoration work qualifies before budgeting Etsy as an available channel. Owning copyright permission and meeting Etsy’s selling categories are separate questions. [What can be sold on Etsy](https://help.etsy.com/hc/en-us/articles/360024112614-What-Can-I-Sell-on-Etsy), [Creativity Standards](https://www.etsy.com/legal/creativity/), [Production and reselling rules](https://help.etsy.com/hc/en-us/articles/23948763872151-Does-Etsy-Allow-Drop-Shipping-or-Reselling), [Production partner disclosure](https://help.etsy.com/hc/en-us/articles/360000336547-Working-with-Production-Partners-on-Etsy).

If eligibility is confirmed, I would test a small set of strong designs. At fifty euros, Etsy’s baseline percentage and fixed processing cost exceeds Shopify Basic’s standard card processing by four euros thirty, before listing charges and subscriptions. That can be worthwhile if it brings an otherwise unavailable buyer. We would measure the resulting contribution per order.

### Episode 9: Squarespace and Wix, Where a Local Quote Is Still Missing

Both deserve mention as hosted alternatives, and both have Printful connections. [Printful’s Squarespace requirements](https://help.printful.com/hc/en-us/articles/50262508883089-Which-Squarespace-plan-do-I-need-to-integrate-with-Printful), [Printful for Wix](https://www.printful.com/uk/integrations/wix). We could not obtain stable Belgian euro subscription prices from their dynamic official pricing pages during this research. I will leave those subscription cells unquoted rather than combine a foreign regional price with Belgian fees. [Squarespace pricing](https://www.squarespace.com/pricing), [Wix plans](https://www.wix.com/plans).

Some fee information is verifiable. Squarespace’s current Basic plan adds a two percent physical-commerce platform fee; Core, Plus and Advanced add zero. The Belgian Squarespace Payments domestic personal-card schedule lists two percent plus twenty-five cents for Basic and Core, 1.7 percent plus twenty-five cents for Plus, and 1.5 percent plus twenty-five cents for Advanced. Wix’s EU ordinary-card schedule is 1.9 percent plus thirty cents; Bancontact is 1.4 percent plus thirty cents. These schedules have additional card and cross-border categories. [Squarespace fees](https://support.squarespace.com/hc/en-us/articles/27853679334157-Transaction-fees-and-payment-processing-rates), [Wix Payments fees](https://support.wix.com/en/article/wix-payments-service-fees).

On a hypothetical fifty-euro receipt, Squarespace Basic’s ordinary card and platform fees together are two euros twenty-five; Core’s ordinary card processing is one euro twenty-five. Wix’s ordinary card processing is also one euro twenty-five. Subscriptions remain additional. That arithmetic shows why the fee columns matter as much as the sticker price.

If either builder’s editing experience is a priority, the next step is a Belgian checkout quote with billing term, tax, selected payments and the Printful workflow recorded. Until then, we cannot responsibly rank its complete cost against the verified alternatives.

## Part Three: What the Numbers Mean for This Project

### Episode 10: A Shop With No Sales, Then Twenty-five, One Hundred and Five Hundred Orders

Let’s calculate a deliberately simple scenario.

Assume each customer pays fifty euros in total, including any shipping and tax collected. Every payment uses a card qualifying for the standard rates we quoted. There are no refunds, disputes or currency conversions. This is a model, not a measured average order value or a sales forecast.

Shopify Basic card processing is one euro twenty-five per receipt. Direct Stripe standard EEA card processing is one euro. We compare Shopify Basic with our forty-five-euro WooCommerce budget and our eighty-euro self-hosted Medusa budget. The full table is in the reference sheet.

With no orders, the monthly costs in this narrow comparison are thirty-two euros for month-to-month Shopify, forty-five for WooCommerce, and eighty for self-hosted Medusa. Annual Shopify has a twenty-four-euro monthly equivalent, paid as 288 euros for the year.

At twenty-five orders, receipts are 1,250 euros. Month-to-month Shopify costs sixty-three euros twenty-five in subscription and card fees. WooCommerce costs seventy euros using our budget. Self-hosted Medusa costs 105. The annual Shopify equivalent is fifty-five euros twenty-five.

At one hundred orders, receipts are five thousand euros. The figures become 157 for month-to-month Shopify, 145 for WooCommerce and 180 for self-hosted Medusa. Annual Shopify is 149. Before labor, the WooCommerce model saves twelve euros against monthly Shopify, or four against annual Shopify.

At five hundred orders, receipts are twenty-five thousand euros. Monthly Shopify costs 657 euros. WooCommerce costs 545 and self-hosted Medusa 580. Annual Shopify is 649. The lower direct Stripe rate is now a meaningful recurring saving, assuming our hosting allowances still support the workload.

Medusa Cloud must stay in a separate currency column. At one hundred such orders, Launch starts at ninety-nine US dollars plus one hundred euros of Stripe processing, plus any Cloud usage and other services. Scale starts at 299 dollars plus the same processing. We cannot add the currencies without an explicit exchange-rate assumption.

These figures isolate platform or infrastructure and payment costs. They exclude fulfillment, VAT on vendor services, acquisition, labor, the shared domain and email budget, and extra apps beyond the allowances. They are not the total cost of operating the business.

### Episode 11: When a Shopify Upgrade Pays for Its Card Rate

There is a useful break-even calculation inside Shopify.

Under annual billing, Grow costs forty-five euros a month more than Basic and saves 0.2 percentage points on qualifying standard-card receipts. Forty-five divided by 0.002 is 22,500 euros of those receipts each month. At fifty euros per order, that is 450 qualifying card orders.

Under monthly billing, the difference is sixty euros and the card-rate break-even is thirty thousand euros, or six hundred card orders per month, each with a fifty-euro receipt. Bancontact does not contribute to that saving because its fee is the same on the three plans.

At five hundred all-standard-card orders, annual Grow costs 644 euros in subscription and processing, against annual Basic at 649. That is a five-euro difference in this scenario. Monthly Grow costs 667, against monthly Basic at 657. The billing term changes the result.

We might upgrade earlier for staff access or another required feature. We should name that feature. A bigger catalog does not by itself make a higher card-rate tier economical.

### Episode 12: The Labor That Changes the Ranking

Now add time, with assumptions kept visible.

Suppose we value operating work at fifty euros an hour. For an illustrative monthly allowance, assign half an hour to Shopify platform care, two hours to WooCommerce, and three to self-hosted Medusa. These are our sensitivity inputs, not measured maintenance times or guarantees. Customer service, catalog work and accounting are additional on every platform.

At one hundred orders, this adds twenty-five, one hundred and 150 euros respectively. Month-to-month Shopify becomes 182 euros for the narrow platform, processing and maintenance comparison. WooCommerce becomes 245. Self-hosted Medusa becomes 330. A small payment-rate saving can disappear if operating the stack takes an extra hour.

Completion work also needs a budget. For a small pilot, tentative scoping allowances are twelve to twenty-four hours for a Shopify migration and connection, twenty-four to forty-eight for a WooCommerce migration, and forty to eighty incremental hours to finish the Medusa payment and Printful path. At fifty euros an hour those ranges are 600–1,200 euros, 1,200–2,400 euros and 2,000–4,000 euros. They are estimates to test against acceptance criteria, not contractor quotes. A custom headless frontend, full archive migration or unexpected integration issue could exceed them.

Those ranges exclude restoration, historical copy review, supplier samples and other work shared across platforms. They also exclude money already spent: we are comparing the work ahead.

The scale of catalog preparation deserves a separate example. If reviewing one design took just fifteen minutes, reviewing 491 would take 122 hours and forty-five minutes. At our assumed hourly value, that is 6,137 euros and fifty cents. Fifteen minutes is an illustration, not an estimate of restoration effort. It shows why a ten-design pilot can teach us more cheaply than preparing the entire catalog before the first sale.

### Episode 13: Printful, Margin and the Cash We Need Before Payout

Printful’s free plan has no subscription fee. The optional Growth plan is twenty-four euros ninety-nine per month in EUR, with product-specific discounts advertised up to thirty-three percent. Its help page says the membership price includes taxes. We cannot assume every poster gets the maximum discount. [Printful plans](https://www.printful.com/plans), [Printful Growth details](https://help.printful.com/hc/en-us/articles/50262080927505-What-should-I-know-about-the-Printful-Growth-plan).

If actual discounts saved two euros per item, thirteen items would exceed the monthly fee. If they saved one euro, we would need twenty-five. Those are our calculations; the saving per variant must come from the account’s actual prices. Printful also describes a twelve-thousand-US-dollar annual qualification for a free year of Growth, using its own calculation of sales. We should check account eligibility rather than equate that threshold with our storefront’s gross receipts. [Growth qualification](https://help.printful.com/hc/en-us/articles/50262080927505-What-should-I-know-about-the-Printful-Growth-plan).

The project’s matrix records US-dollar retail prices and Printful base costs checked on 7 October. A thirty-by-forty-centimeter matte poster is thirty-five dollars retail against eleven dollars forty-four in base production cost: a twenty-three-dollar-fifty-six spread, or 67.31 percent of retail. The seventy-by-one-hundred size is forty-nine dollars against twenty dollars seventy-six: a 57.63 percent spread. Neither includes payment fees, shipping, tax, advertising or returns.

The seed currently copies the USD price numbers into supported currencies, including EUR. A thirty-five-dollar price becoming thirty-five euros by changing the label is not a currency conversion or an approved local price. We need a euro retail ladder and actual supplier quotes for the selected destinations.

There is also an update to the integration plan’s statement that Printful bills in USD. Printful’s current billing help says connected-store billing follows the currency configured for that store. We should check our account’s actual currency rather than build the budget on the older claim. [Printful billing](https://help.printful.com/hc/en-us/articles/50264607936785-How-does-the-Printful-billing-system-work).

Here is a hypothetical margin example, separate from the repository’s dollar matrix. A customer pays fifty euros with delivery included. Assume twenty-one percent output VAT solely for this calculation, eighteen euros of net production cost, six of net shipping, one euro twenty-five in Shopify card fees, a one-euro-fifty returns reserve and eight euros of acquisition cost. Assume input VAT treatment has already been resolved in those net supplier costs. Fifty euros divided by 1.21 gives 41 euros and thirty-two cents before output VAT. After the assumed costs, the contribution is about six euros fifty-seven before fixed costs and labor. At one hundred orders, allocating the thirty-two-euro Shopify subscription removes another thirty-two cents per order.

This is not our tax determination or a supplier quote. It demonstrates how an apparently generous product-only spread can become a small contribution. The actual calculation needs the destination’s tax treatment, real shipping, the payment mix and observed acquisition cost. Existing rights and returns research should feed those inputs rather than being repeated here.

Finally, cash timing. The customer pays our shop, while Printful charges us for production and shipping. Its billing and customer-refund flows are separate from ours. [Printful payment flow](https://help.printful.com/hc/en-us/articles/50262145635601-How-do-I-accept-payments-for-my-orders).

If twenty orders arrived before available payouts and each needed twenty-five euros of supplier funding, we would need five hundred euros of working capital. Both inputs are illustrative. A viable launch budget includes that buffer and room for refunds, alongside subscriptions and setup work.

## Part Four: Deciding Whether to Go Ahead

### Episode 14: A Pilot With a Cost We Can Measure

My recommendation is to make the next decision at the scale of ten designs.

Choose a small set with reviewed descriptions and genuinely approved print files. Keep the formats manageable while we test paper, frames and shipping. Measure three things: contribution per order after all variable costs, the hours needed to handle real order exceptions, and what buyers value about the restoration and context.

For the quickest managed comparison, use Shopify Basic on monthly billing. Thirty-two euros buys a cancellable monthly trial of the operating model without committing 288 euros upfront. Its native Printful connection deserves testing before we commission the custom fulfillment path. We can retain the catalog source and historical research in Git while mapping approved products into the store.

For the existing Medusa route, first scope the missing functionality against the same pilot acceptance criteria. Confirm the Cloud tier or self-hosting quote, payment account, print-file purchase gate, fulfillment retry handling, tracking and refunds. If the archive experience and restoration workflow are what will distinguish the shop, completing this route may be worth the higher implementation allowance.

WooCommerce is a reasonable choice when WordPress is the operating environment we want and we accept its maintenance budget. BigCommerce merits a trial if its features solve a specific need at a confirmed tier. Big Cartel makes sense if we deliberately keep a smaller curated shop and move the archive elsewhere. Etsy is a possible acquisition experiment once listing eligibility is resolved, with its fees included in every margin test.

I would postpone annual commitments and optional app subscriptions until the pilot tells us what we use. I would also record the actual bills and time for a month, then replace every allowance in this episode with observed numbers.

That gives us a decision we can defend. If people buy the prints at a healthy contribution and the order workflow is manageable, we can expand. If they do not, we have learned that with ten designs and a controlled budget. The platform choice should support that experiment and the distinctive parts of the shop we want to grow.

Thanks for listening.

## Reference Sheet: Prices and Calculations

*A reading companion to the narration. Checked 8 October 2026. EUR and USD are kept separate. “Annual equivalent” is an annual subscription divided by twelve, not a month-to-month offer. Promotions, fulfillment, vendor-fee VAT, labor, domains, email, acquisition and optional extras are excluded unless a row says otherwise.*

### Published platform prices

| Platform / plan | Monthly billing | Annual equivalent and commitment | Additional cost or relevant constraint |
| --- | ---: | --- | --- |
| Shopify Basic, Belgium | €32 | €24/month; €288/year | Standard cards 2% + €0.25; Bancontact €0.39; hosting included |
| Shopify Grow, Belgium | €92 | €69/month; €828/year | Standard cards 1.8% + €0.25; Bancontact €0.39 |
| Shopify Advanced, Belgium | €384 | €289/month; €3,468/year | Standard cards 1.6% + €0.25; Bancontact €0.39 |
| WooCommerce core | Free software | No core subscription | Hosting, extensions and operations separate; direct Stripe fees apply |
| Medusa self-hosted community core | No platform subscription | No core subscription | Infrastructure, operations and processor separate; separately licensed enterprise material excluded |
| Medusa Cloud Develop | From US$29 | No annual discount quoted | Usage additional; lacks custom storefront domain and automatic backups |
| Medusa Cloud Launch | From US$99 | No annual discount quoted | Usage and processor additional; validate fulfillment worker deployment |
| Medusa Cloud Scale | From US$299 | No annual discount quoted | Usage and processor additional; includes worker |
| BigCommerce Core | US$39 | US$29/month; US$348/year | US$30,000 TTM Inclusive GMV allowance; provider-specific platform fees |
| BigCommerce Growth | US$105 | US$79/month; US$948/year | US$100,000 TTM Inclusive GMV allowance |
| BigCommerce Scale | US$399 | US$299/month; US$3,588/year | US$33,333 monthly allowance, 0.9% excess; native filtering included |
| Big Cartel Platinum | US$15 | US$12/month; US$144/year | 50 products; processor additional |
| Big Cartel Diamond | US$30 | US$24/month; US$288/year | 500 products; processor additional; 9 slots beyond 491 curated designs |
| Etsy standard shop | No required monthly plan | Not applicable | Listings US$0.20; 6.5% transaction + Belgian processing 4% + €0.30; ads and onboarding can add fees |
| Squarespace / Wix | Belgian subscription quote pending | Belgian subscription quote pending | Official payment schedules verified; no complete local subscription comparison claimed |

Sources for the rows: [Shopify](https://www.shopify.com/be/prijzen), [WooCommerce](https://woocommerce.com/pricing/), [Medusa license](https://github.com/medusajs/medusa/blob/develop/LICENSE), [Medusa Cloud](https://docs.medusajs.com/cloud/pricing), [BigCommerce](https://www.bigcommerce.com/pricing/), [Big Cartel](https://www.bigcartel.com/resources/help/article/unlock-premium-features), [Etsy fees](https://www.etsy.com/legal/fees/), [Etsy Payments](https://www.etsy.com/legal/etsy-payments/), [Squarespace](https://www.squarespace.com/pricing), [Wix](https://www.wix.com/plans).

### Illustrative monthly platform/infrastructure and card costs

*€50 total receipt/order; all cards qualify for the quoted standard rates; no disputes, refunds, FX or usage overages. WooCommerce €45 and Medusa self-hosted €80 are our budgeting allowances, not published offers. Domain/email and other exclusions above apply. These allowances need rechecking as volume grows.*

| Orders/month | Total receipts | Shopify Basic monthly | Shopify Basic annual equivalent | WooCommerce allowance + Stripe | Self-hosted Medusa allowance + Stripe |
| ---: | ---: | ---: | ---: | ---: | ---: |
| 0 | €0 | €32.00 | €24.00 | €45.00 | €80.00 |
| 25 | €1,250 | €63.25 | €55.25 | €70.00 | €105.00 |
| 100 | €5,000 | €157.00 | €149.00 | €145.00 | €180.00 |
| 500 | €25,000 | €657.00 | €649.00 | €545.00 | €580.00 |

Formulas: Shopify monthly = €32 + orders × (€50 × 2% + €0.25); annual equivalent replaces €32 with €24. WooCommerce = €45 + orders × (€50 × 1.5% + €0.25). Self-hosted Medusa replaces €45 with €80. Official fee inputs: [Shopify Belgium](https://www.shopify.com/be/prijzen), [Stripe Belgium](https://stripe.com/en-be/pricing).

Medusa Cloud Launch = from US$99 + €1.00 × orders + metered usage, assuming direct Stripe standard EEA cards; Scale replaces US$99 with US$299. Big Cartel Diamond = US$30 monthly, or US$24 annual equivalent, + €1.00 × orders if that Stripe schedule applies to the configured integration. Neither expression is a single-currency total. [Medusa Cloud](https://docs.medusajs.com/cloud/pricing), [Big Cartel fees](https://www.bigcartel.com/resources/help/article/processing-fees-explained), [Stripe Belgium](https://stripe.com/en-be/pricing).

Payment mix sensitivity: one hundred €50 Bancontact orders cost Shopify Basic €32 + 100 × €0.39 = €71 on monthly billing, or €63 annual equivalent. Direct Stripe processing alone is €35, before WooCommerce/Medusa/Big Cartel hosting or subscription. The all-card ranking should not be assumed for a local-payment-heavy shop.

### Inputs to replace before a launch decision

- Actual merchant eligibility, subscription tier, processor configuration, invoice tax and billing currency.
- Approved euro retail ladder and fulfillment costs by variant and destination; the current USD numbers must not be relabelled EUR.
- Real payment-method and card-country mix, total receipt size, refund/dispute rates and FX exposure.
- Scoped remaining implementation work, operating responsibility and actual hosting/service quotes.
- Approved print files, reviewed descriptions and an enforced purchase gate for unfinished products.
- Acquisition cost, observed support time, supplier funding buffer and the treatment of the request-only archive.

## Sources and Dates

All official web sources below were checked on **8 October 2026**. Where no publication date was available, this is an access date. Provider rules and prices can change after this episode. Links alongside claims identify the supporting pages; the grouped list below is for later updates.

### Our project and earlier Walking Through scripts

- `VincentDN/vintage-propaganda-posters`: current `catalog/posters.json`, `catalog/product-options.json`, `catalog/library/*.json`, `apps/backend/seed-posters.mjs`, `apps/backend/seed-library.mjs`, `apps/backend/medusa-config.ts` and the storefront product purchase component, inspected 8 October 2026. Counts and implementation status are source-derived, not a live-store audit. Product options record base costs checked 7 October.
- The same repository’s `docs/printful-integration-plan.md`, researched 7 October 2026; `docs/domain-setup.md` and `outbound/VINCENT-TODO.md`, initially written 5 October with later additions. These are project plans, not independent evidence of current vendor pricing or completed integration.
- [Walking Through Agentic E-commerce](walking-through-agentic-ecommerce-full-text.md), 4 October 2026: the earlier platform and GitHub workflow discussion. Its price and fee assumptions are not substituted for the current sources.
- [Walking Through the Law of Selling Propaganda Poster Reproductions](walking-through-propaganda-posters-legal-full-text.md), 7 October 2026: Belgian project context and the separate rights/market-access research. This episode does not repeat or independently revalidate that legal analysis.

### Storefronts, payments and fulfillment

- Shopify: [Belgian price table](https://www.shopify.com/be/prijzen); [annual billing offers](https://help.shopify.com/en/manual/your-account/manage-billing/offers); [external-provider fees](https://help.shopify.com/en/manual/your-account/manage-billing/billing-charges/types-of-charges/third-party-charges/third-party-transaction-fees); [Shopify Payments costs](https://help.shopify.com/en/manual/payments/shopify-payments/onboarding/cost-of-shopify-payments); [domains](https://help.shopify.com/en/manual/domains/add-a-domain/buying-domains); [product variants](https://shopify.dev/docs/api/admin-graphql/2026-04/mutations/productVariantsBulkCreate).
- WooCommerce: [pricing](https://woocommerce.com/pricing/) and [official Stripe extension](https://woocommerce.com/products/stripe/). Stripe: [Belgian processor schedule](https://stripe.com/en-be/pricing).
- Medusa: [current pricing](https://medusajs.com/pricing), [Cloud resource and feature comparison](https://docs.medusajs.com/cloud/pricing), [production deployment](https://docs.medusajs.com/learn/deployment), [license](https://github.com/medusajs/medusa/blob/develop/LICENSE). Vercel: [Hobby commercial-use restriction](https://vercel.com/docs/plans/hobby).
- BigCommerce: [prices and features](https://www.bigcommerce.com/pricing/), [June 2026 plan/fee changes](https://www.bigcommerce.com/dm/plan-pricing-updates-2026/), [embedded providers](https://www.bigcommerce.com/payments/embedded-payment-providers/).
- Big Cartel: [plans](https://www.bigcartel.com/resources/help/article/unlock-premium-features), [import and variant limits](https://www.bigcartel.com/resources/help/article/importing-products), [processor fees](https://www.bigcartel.com/resources/help/article/processing-fees-explained), [Printful and shipping setup](https://www.bigcartel.com/resources/help/article/set-up-and-use-printful-with-big-cartel).
- Etsy: [fee summary](https://help.etsy.com/hc/en-gb/articles/115014483627-What-are-the-Fees-and-Taxes-for-Selling-on-Etsy), [Fees and Payments Policy](https://www.etsy.com/legal/fees/) (page displays an update of 5 October 2026), [Belgian Etsy Payments schedule](https://www.etsy.com/legal/etsy-payments/), [selling categories](https://help.etsy.com/hc/en-us/articles/360024112614-What-Can-I-Sell-on-Etsy), [Creativity Standards](https://www.etsy.com/legal/creativity/), [production/reselling requirements](https://help.etsy.com/hc/en-us/articles/23948763872151-Does-Etsy-Allow-Drop-Shipping-or-Reselling), [partner disclosure](https://help.etsy.com/hc/en-us/articles/360000336547-Working-with-Production-Partners-on-Etsy).
- Squarespace: [pricing](https://www.squarespace.com/pricing), [Belgian processing and physical-commerce fees](https://support.squarespace.com/hc/en-us/articles/27853679334157-Transaction-fees-and-payment-processing-rates). Wix: [plans](https://www.wix.com/plans), [EU payment fees](https://support.wix.com/en/article/wix-payments-service-fees). Local subscription quotes remain unresolved.
- Printful: [Free and Growth](https://www.printful.com/plans), [Growth eligibility and EUR subscription](https://help.printful.com/hc/en-us/articles/50262080927505-What-should-I-know-about-the-Printful-Growth-plan), [store-currency billing](https://help.printful.com/hc/en-us/articles/50264607936785-How-does-the-Printful-billing-system-work), [customer payment and refund flows](https://help.printful.com/hc/en-us/articles/50262145635601-How-do-I-accept-payments-for-my-orders), integrations for [Shopify](https://www.printful.com/integrations/shopify), [WooCommerce](https://www.printful.com/integrations/woocommerce) and [BigCommerce](https://www.printful.com/integrations/bigcommerce).

All sales scenarios, hosting allowances, labor inputs, break-even calculations and the pilot recommendation are ours. They are explicitly illustrative and should be replaced with account quotes and operating evidence before committing to the project.

# Fact-check review edition — 24 September 2026

The original narration is retained. ChatGPT fact-check comments follow contested paragraphs and are included in this continuous text for editorial review. Do not treat this as a corrected recording script. Source paragraph/list-item/table-row references are counted within the named section in the retrieved edition; see fact-check-source-locators.md.

# Walking Through Google Search

*Adapted from Google Search Central's documentation (developers.google.com/search/docs), licensed under Creative Commons Attribution 4.0.*

## Part One: The Rules of the Road

### Episode 1: Search Essentials, and the Three Technical Requirements

Welcome to the first episode of Walking Through Google Search. Over this series we're going to work through Google's own documentation on how search works and how to show up in it. Not the rumours, not the forum lore, not the guy on YouTube with the thumbnail of his shocked face. The source. Google's Search Central documentation is the rulebook, and everything else in SEO is commentary on it.

So let's start where Google starts: with something they call the Search Essentials.

The Search Essentials used to be called the Webmaster Guidelines. If you've been around the web for a while, you'll remember that name. Google renamed them, and in doing so they boiled the whole thing down into three parts. Think of them as three layers of a pyramid.

The bottom layer is the technical requirements. This is the bare minimum a page needs before Google can show it at all.

The middle layer is the spam policies. These are the behaviours that can get a page, or an entire site, pushed down in the rankings or removed altogether.

And the top layer is a short set of key best practices. These are the things that actually move the needle once you've cleared the first two layers.

Before we go any further, Google makes one point right up front, and they make it twice across these pages, so it's clearly something they want people to hear. It costs nothing to appear in Google's search results. Nothing. If anyone ever tells you they can get you listed on Google for a fee, or that they have a special relationship with Google that gets you in faster, that's not how it works. You can pay for ads, which is a separate product, but the organic results are free.

And here's the second thing they say up front, which is just as important. Even if a page meets every requirement and follows every best practice, that does not guarantee Google will crawl it, index it, or show it to anyone. Meeting the requirements makes you eligible. It doesn't make you entitled. Hold on to that distinction, because it comes back again and again throughout this series.

Let's take the three layers in order.

The technical requirements.

Google says there are only three things a page needs in order to be eligible for indexing. And they point out, rather reassuringly, that most sites pass these without even realising it. Here they are.

One: Googlebot isn't blocked.
Two: the page works, meaning it returns a success status.
Three: the page has indexable content.

Let's walk through each.

Requirement one. Googlebot isn't blocked.

Googlebot is Google's crawler, the automated program that visits pages across the web. Google only indexes pages that are publicly accessible and that don't block Googlebot. So if a page sits behind a login, Googlebot won't see it. Makes sense. It's not going to create an account on your site.

Then there are the deliberate blocking mechanisms, the ways you can tell Google to stay out. The most common one is a file called robots.txt, which sits at the root of your domain and tells crawlers which parts of the site they may and may not visit. Google says pages blocked by robots.txt are unlikely to show up in search results. We'll give robots.txt a full episode later on.

How do you check whether Google can actually reach your pages? Google points to two reports in Search Console: the Page Indexing report and the Crawl Stats report. And here's a practical tip they give: look at both, because each one can show you different information about your URLs. One report might flag something the other doesn't. And if you want to check one specific page, there's the URL Inspection tool, which tells you exactly what Google sees for that single address.

Picture a store with fourteen thousand product pages. You're not going to inspect them one at a time. That's what the reports are for. They show you patterns. If a whole collection of product pages suddenly shows up as blocked, that's the sort of thing you want to catch early, and it's often caused by something mundane, like a theme update or an app quietly editing your robots rules.

Requirement two. The page works.

Google only indexes pages that come back with what's called an HTTP two hundred status code. Two hundred simply means success: the server received the request and returned the page. If instead the server returns an error, say a four hundred series code like the familiar four oh four "not found", or a five hundred series code meaning the server itself had a problem, Google won't index it.

That sounds obvious, but there's a subtle trap in it. Some sites show an error message to visitors, something like "sorry, this product is no longer available", while the server still reports two hundred, success. That's called a soft four oh four, and it confuses things, because the page says one thing and the server says another. We'll come back to that in a later episode. For now, the principle is simple: Google trusts the status code, so make sure the status code tells the truth.

> ChatGPT fact check - this paragraph claims "Some sites show an error message to visitors, something like "sorry, this product is no longer available", while the server still reports two hundred, success.", but the counterargument is: The soft-404 explanation ends by saying Google trusts the status code. Google can recognize error or empty content despite a 200 response and classify it as a soft 404. Return a status code that matches the page. Google also examines the content and may treat an error page served with a success code as a soft 404.
>
> Sources: Avoid soft 404 errors in single-page apps; paragraph 1: https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics#avoid-soft-404s.
>
> A005 | Overstatement | Medium priority | Checked 24 September 2026



Once again, the URL Inspection tool will tell you what status code Google received for any given page.

Requirement three. The page has indexable content.

Once Googlebot can reach a working page, it looks at what's actually on it. Indexable content means two things. First, the text is in a file type Google can process, and the list is broad: normal web pages of course, but also PDFs and many other formats. We'll look at the full list in episode nine. Second, the content doesn't violate the spam policies, which is our whole next episode.

Now, there's one more detail on this page that trips up a lot of people, even experienced ones, so let's slow down for it.

Blocking a page in robots.txt stops Google from crawling it. But it does not necessarily stop the page's address from appearing in search results. How can that be? Because Google might discover the URL through links from elsewhere on the web, and it can list the address even without having read the page. You've probably seen results like this, where there's a link but the description says something like "no information is available for this page".

So if what you actually want is for a page to stay out of the search results, robots.txt is the wrong tool. The right tool is a noindex directive, which is a small instruction on the page itself that says "don't index me". And here's the counterintuitive part: for Google to obey noindex, it has to be allowed to crawl the page. If you block the page in robots.txt, Google can never read the noindex instruction, so it never learns that you wanted the page kept out.

Let me put that as a rule you can remember on your walk. Robots.txt controls crawling. Noindex controls indexing. And if you want noindex to work, don't block crawling.

For a store, this matters with things like internal search result pages, filtered collection views, or checkout steps. If you want them out of Google, noindex them and let Google crawl enough to see that instruction.

The key best practices.

That's the floor. Now for the top of the pyramid. Google lists a small number of practices it says have the most impact on how content ranks and appears. Here they are, in plain language.

First, create helpful, reliable, people-first content. That phrase, "people-first", is going to become a refrain. It gets its own episode, episode six.

Second, use the words people would actually use to look for your content, and put those words in prominent places on the page. Google names the page title and the main heading, and also mentions alt text on images and the text of links. For example, customers rarely search for a "rectangular textile vexillological display". They search for "custom flag", or "Texas flag three by five", or "flag with my logo". Your titles and headings should speak the customer's language, not the catalogue's.

Third, make your links crawlable, so that Google can discover your other pages by following links on the page. In practice, that means using standard HTML links. We'll unpack what "crawlable" means in episode nine.

Fourth, and this one might surprise people who think SEO is purely technical: tell people about your site. Google literally says to be active in communities where you can reach like-minded people and talk about the products and services you offer. That's Google, in its own rulebook, saying that real-world presence and word of mouth are part of the job.

Fifth, if your pages include images, videos, structured data, or JavaScript, follow the specific best practices for each, so Google can understand those parts too. Each of those has its own episode later in the series.

Sixth, enhance how your site appears in search by enabling the features that make sense for you. Those are the extras you see in results, like star ratings, prices, stock status, and so on. For an online store, several of those features are directly relevant, and they get their own episodes too.

And seventh, if there's content you don't want to show up in search, or you want to opt out entirely, use the proper method for controlling that. Which brings us right back to the robots.txt versus noindex distinction from a moment ago.

Let's recap.

The Search Essentials have three layers. The technical requirements are the floor. The spam policies are the guardrails. And the key best practices are what help you climb.

The technical requirements are just three: Googlebot can reach the page, the page returns a success status, and the page has indexable content that isn't spam.

Getting into Google is free, and meeting the requirements makes you eligible, not guaranteed.

Robots.txt controls crawling, noindex controls indexing, and noindex only works if Google is allowed to crawl.

And the best practices are, at heart, about writing for people, in the language people use, in a structure that both people and crawlers can follow.

Next episode, we go through the middle layer of the pyramid: the spam policies. Cloaking, doorways, scaled content, link schemes, and a few newer ones that matter more than ever in the age of AI-generated pages. Some of these are obvious. A few of them could catch out an honest store that has simply grown very large. See you there.

This episode is adapted from the Google Search Essentials overview and technical requirements pages on Google Search Central, licensed under Creative Commons Attribution 4.0.

### Episode 2: The Spam Policies, One by One

Welcome back. Last time we covered the floor of the pyramid, the technical requirements. Today we're on the middle layer: the spam policies. This is the list of things that can get a page, or a whole site, ranked lower or removed from Google entirely.

Let's start with Google's definition, because it's broader than most people expect. In Google's terms, spam means techniques used to deceive users or to manipulate Google's systems into featuring content prominently. And notice this: the current wording explicitly includes trying to manipulate the generative AI responses in Google Search, not just the classic ranked list of links. So as AI answers become a bigger part of search, the spam rules follow them there.

How does Google enforce this? Two ways. Mostly through automated systems. And when needed, through human review, which can result in what's called a manual action, a penalty applied by a person at Google. If you ever get one, it shows up in the Manual Actions report in Search Console. The consequence of a violation can be anything from ranking lower to disappearing completely.

Google also notes that the list we're about to go through covers the common practices, but that it may act against any kind of spam it detects. So this isn't a list of loopholes to avoid. It's a list of examples of a principle.

There are quite a few policies, so let's group them in a way that's easy to hold in your head while walking. I'm going to put them into four families: deception, manipulation of ranking signals, low-value content at scale, and security and abuse. Then we'll finish with a handful of other things that can lead to demotion.

Family one. Deception.

These are the policies about showing one thing and delivering another.

First, cloaking. Cloaking means showing different content to search engines than to people, with the intention of manipulating rankings and misleading users. Google's example is a page about travel destinations served to the search engine, while human visitors get a page about discount drugs. Another example is only inserting keywords into the page when the visitor is a crawler.

Now, there are two important exceptions to keep in mind. If your site uses technology that crawlers find hard to read, like heavy JavaScript or images, Google has guidance on making that content accessible without cloaking. That's legitimate. And paywalls are not cloaking, as long as Google can see the full content behind the paywall, the same as a paying visitor would, and you follow Google's flexible sampling guidance. Also, a sad fact: hackers often use cloaking on compromised sites precisely so that the owner doesn't notice. So if Google flags cloaking on a site you never touched, suspect a hack.

Second, sneaky redirects. A redirect sends a visitor from the address they asked for to a different one. That's normal and useful. It becomes sneaky when it's used to show search engines one thing and users another, or to send people somewhere they didn't expect and didn't want. Google's example is showing desktop users a normal page while redirecting mobile users to a completely different spam domain. Legitimate redirects include moving your site, merging several pages into one, or sending logged-in users to an internal page. The test Google gives is simply: was the redirect meant to deceive users or search engines?

Third, misleading functionality. This is when a site claims to offer a tool or service and doesn't. A fake generator promising free app store credit. A site claiming to merge PDFs or run a countdown timer, but actually just funnelling you into deceptive ads. For a store with a free flag design tool, the lesson is the positive version: if you say the tool does something, it should do it.

Fourth, scams and fraud. Impersonating a known business so people pay the wrong party, or pretending to be official customer support for a company, with fake contact details. Google uses automated systems to keep these out of results.

Family two. Manipulating ranking signals.

These policies are about faking the signals Google uses to judge relevance and authority.

First, keyword stuffing. Filling a page with keywords or numbers in an attempt to manipulate rankings, often as unnatural lists or out of context. Google's examples include blocks of text listing every city and region a page wants to rank for, and repeating the same phrase so often it sounds robotic. The test for this one is wonderfully simple, and it works perfectly for audio: read it out loud. If it sounds like a malfunctioning radio advert, it's stuffed.

> ChatGPT fact check - this paragraph claims "Filling a page with keywords or numbers in an attempt to manipulate rankings, often as unnatural lists or out of context.", but the counterargument is: Reading awkwardly is not Google's definitive keyword-stuffing test. Similarly, the assertion that a template with a variable swapped in adds no value is stronger than the policy. Purpose, usefulness, and the content as a whole matter; product templates are not inherently spam. Keep Google's definitions: keyword stuffing attempts to manipulate rankings with unnatural repetition; scaled content abuse creates many low-value pages primarily to manipulate ranking. Mark any read-aloud test as an editorial heuristic.
>
> Sources: Keyword stuffing; paragraph 1: https://developers.google.com/search/docs/essentials/spam-policies#keyword-stuffing; Scaled content abuse; paragraph 1: https://developers.google.com/search/docs/essentials/spam-policies#scaled-content.
>
> A006 | Overstatement | Medium priority | Checked 24 September 2026



Second, hidden text and links. Putting content on a page purely for search engines, where people can't easily see it. Classic examples are white text on a white background, text hidden behind an image, text positioned off the screen with styling, font size or opacity set to zero, or a link hidden on a single tiny character like a hyphen in the middle of a paragraph.

And here's the reassuring part. Modern design elements that show and hide content are fine. Accordions, tabs, sliders, tooltips, and text meant only for screen readers to improve accessibility. None of those violate the policy. So a product page with collapsible sections for "size guide", "materials", and "care instructions" is perfectly fine. The difference is intent: hidden to help the user, fine. Hidden to fool the crawler, spam.

Third, link spam. This is a big one, and it's the policy most likely to catch out a business trying to grow in good faith. Link spam means creating links to or from a site primarily to manipulate rankings. Google's examples include buying or selling links for ranking purposes, and pay attention to how broadly they define that. It includes paying money for links. It includes exchanging goods or services for links. And it specifically includes sending someone a product in exchange for them writing about it and including a link.

Let that sink in if you do any influencer or blogger outreach. Sending a free flag to a blogger in exchange for a review with a link is, by Google's definition, a link scheme, unless that link is properly labelled.

Other examples of link spam: excessive "you link to me, I'll link to you" arrangements. Automated link-building programs. Requiring a link as part of a contract or terms of service without letting the other party label it. Paid advertorials with links that pass ranking credit. Keyword-rich links in guest posts or press releases distributed across other sites. Low-quality directory and bookmark links. Links baked into widgets or site footers that get spread across many sites. And forum comments with optimised links in the signature. Google's example of that last one is delightful: a comment that says "Thanks, that's great info!", signed Paul, followed by three links to Paul's pizza, San Diego pizza, and best pizza San Diego.

Now, the important nuance. Google says outright that buying and selling links is a normal part of the web's economy for advertising and sponsorship. It's not a violation to have those links, as long as they're labelled with a rel attribute value of either nofollow or sponsored. Those labels tell Google, "this link exists because of a commercial arrangement, don't count it as an endorsement". So gifted products, sponsorships, affiliate links, paid placements: label them, and you're fine. We'll dig into those rel attributes in episode fifteen.

> ChatGPT fact check - this paragraph claims "It's not a violation to have those links, as long as they're labelled with a rel attribute value of either nofollow or sponsored.", but the counterargument is: The narration promises rel-attribute coverage in Episode 15, which covers lazy loading and dynamic rendering. Episode 9 is the links chapter, but it also lacks a proper explanation of sponsored, ugc, and nofollow. Add a short section based on Qualify your outbound links to Episode 9, then change this reference to Episode 9.
>
> Sources: Qualify your outbound links to Google; table row 2: https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links#qualify-your-outbound-links-to-google; Qualify your outbound links to Google; table row 4: https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links#qualify-your-outbound-links-to-google; Qualify your outbound links to Google; paragraph 4: https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links#qualify-your-outbound-links-to-google.
>
> A007 | Editorial | Low priority | Checked 24 September 2026



Fourth, machine-generated traffic. Sending automated queries to Google, such as scraping search results to check your rankings, without Google's express permission. That violates both the spam policies and Google's terms of service.

Family three. Low-value content at scale.

This family has grown in importance with the arrival of AI writing tools, and for any large catalogue it's the family to study most carefully.

First, scaled content abuse. This is when many pages are generated primarily to manipulate rankings rather than to help users. And Google's key phrase is: no matter how it's created. Human, AI, template, it doesn't matter. The problem is large amounts of unoriginal content that gives users little or no value.

The examples are worth hearing in full. Using generative AI or similar tools to create many pages without adding value. Scraping feeds or search results to generate pages, including by automated rewriting, synonym-swapping, or translating. Stitching content together from different pages without adding value. Creating multiple sites to hide how scaled the content is. And creating pages that make little sense to a reader but contain search keywords.

Now, why should a store with fourteen thousand products care about this? Having many pages is not the problem. A store with fourteen thousand genuinely different flags has fourteen thousand genuinely different products. The risk arises if the pages are thin and interchangeable: the same boilerplate description with only the name swapped, or auto-generated text that says nothing specific about the item. The question Google is asking is whether each page adds value for a person. Historical context, accurate specifications, genuine differences between versions: that's value. A template with a variable swapped in isn't.

> ChatGPT fact check - this paragraph claims "A template with a variable swapped in isn't.", but the counterargument is: Reading awkwardly is not Google's definitive keyword-stuffing test. Similarly, the assertion that a template with a variable swapped in adds no value is stronger than the policy. Purpose, usefulness, and the content as a whole matter; product templates are not inherently spam. Keep Google's definitions: keyword stuffing attempts to manipulate rankings with unnatural repetition; scaled content abuse creates many low-value pages primarily to manipulate ranking. Mark any read-aloud test as an editorial heuristic.
>
> Sources: Keyword stuffing; paragraph 1: https://developers.google.com/search/docs/essentials/spam-policies#keyword-stuffing; Scaled content abuse; paragraph 1: https://developers.google.com/search/docs/essentials/spam-policies#scaled-content.
>
> A006 | Overstatement | Medium priority | Checked 24 September 2026



And Google offers a practical escape hatch: if you're hosting content like this, exclude it from search. In other words, you can keep low-value pages for your own reasons, but noindex them.

Second, doorway abuse. Doorways are pages or sites created to rank for very similar search queries that funnel people into an intermediate page that's less useful than the real destination. Examples: multiple websites with slight URL variations, pages targeted at specific cities or regions that all funnel to the same place, and many substantially similar pages that look more like search results than a clearly organised catalogue.

Third, scraping. Taking content from other sites and republishing it to manipulate rankings. That includes republishing without adding anything or even citing the source, copying with light modifications like swapping synonyms, reproducing feeds without adding unique benefit, and sites that just compile other people's images or videos.

Fourth, thin affiliation. This is about affiliate pages where product descriptions and reviews are copied straight from the original merchant, with nothing original added. Google stresses that not every affiliate site is thin. Good affiliate pages add value through price information, original reviews, rigorous testing, useful navigation, and comparisons. And there's a lesson here for any merchant, affiliate or not: if your product descriptions are identical to those on every other store selling the same supplier's items, you're not giving Google a reason to prefer your page.

Fifth, expired domain abuse. Buying an expired domain and repurposing it mainly to exploit its old reputation with low-value content. Google's examples are memorable: affiliate content on a former government agency's domain, or casino content on what used to be an elementary school's site.

Sixth, the site reputation policy. This one is about third-party content hosted on an established site mainly to borrow that site's ranking strength. Think of a respected educational site suddenly hosting sponsored payday loan reviews written by someone else and distributed to many other sites. Third-party content by itself isn't the issue. Forums, comment sections, wire services, syndicated news, opinion columns, clearly disclosed advertorials, and properly labelled affiliate links are all fine. It's only a problem when the content is placed there mainly to ride on the host's reputation.

Google describes what it looks at in a human review: whether the content's design and formatting are consistent with the host site, whether its quality matches, whether authorship and editorial responsibility are clear, and whether the same content appears on multiple other sites. No single factor decides the outcome.

There's also a recent development here, from August 2026. Google changed how this policy applies in the European Economic Area. Outside the EEA, a site found out of line can receive a manual action for those pages. Inside the EEA, those pages may instead be treated as separate from the main domain and ranked on their own merits, without a manual action. Google says it has lifted previous manual actions under this policy for results shown to users in the EEA, and it has introduced a faster reconsideration process there, plus access to mediation. For a Belgian business selling mostly to Americans, the practical takeaway is that the outside-EEA rules are the ones that matter for your main market.

Family four. Security and abuse.

First, hacked content. Content placed on your site without permission through a security hole. Google names four forms: code injection, where malicious code is inserted into existing pages; page injection, where new spammy pages are added to your site; content injection, where existing pages are subtly altered, for example with hidden links; and malicious redirects, which sometimes only trigger when someone arrives from Google, so you never see them when you type your own URL directly.

Second, malicious practices. Malware, unwanted software, and a newer item on the list: back-button hijacking, where a site messes with your browser history so you can't use the back button to leave.

Third, user-generated spam. Spam posted by users through channels meant for user content: forum posts, blog comments, spammy accounts on open platforms, junk file uploads. The site owner often doesn't even know it's there. If your store has product reviews or a community area, this is where you'd want moderation.

Finally, other things that can lead to demotion.

Google lists a few more. If a site receives a large volume of valid copyright removal requests, Google can use that to demote other content from the same site, and it applies similar signals for defamation, counterfeit goods, and court-ordered removals. Sites with exploitative practices around personal information can be demoted. And there's policy circumvention: if a site keeps trying to get around the rules, for instance by spinning up new subdomains or sites to continue the same behaviour, Google may take broader action, including removing eligibility for features like Top Stories and Discover.

Let's recap.

Spam is anything meant to deceive users or manipulate Google, and that now explicitly includes Google's AI responses.

Deception covers cloaking, sneaky redirects, misleading functionality, and scams.

Signal manipulation covers keyword stuffing, hidden text and links, link spam, and automated querying. For link spam, the golden rule is: any link that exists because of money, gifts, or a deal gets labelled nofollow or sponsored.

Low-value content at scale covers scaled content abuse, doorways, scraping, thin affiliation, expired domains, and site reputation abuse. The central question is always whether each page adds real value for a person, however it was made.

And security covers hacks, malware, and user-generated spam, which can harm you even when you did nothing wrong.

Next episode, we zoom out and look at the machine itself: how Google Search actually works, from the moment Googlebot discovers a URL, through indexing, to the moment your page appears in someone's results. Understanding those three stages will make every other episode in this series make more sense.

This episode is adapted from the spam policies page on Google Search Central, licensed under Creative Commons Attribution 4.0.

### Episode 3: How Google Search Actually Works

Welcome back. In the first two episodes we covered the rules: what's required, and what's forbidden. Today we zoom out and look at the machine those rules apply to. How does a page on the internet actually end up as a result on someone's screen? Google breaks this into three stages, and not every page makes it through all three. The stages are crawling, indexing, and serving.

Before we get into them, Google repeats a point we've now heard several times, which tells you how often people get it wrong. Google does not accept payment to crawl a site more often, or to rank it higher. Any claim otherwise is false. And even a page that follows every guideline in this series isn't guaranteed to be crawled, indexed, or shown. There's no contract here, only eligibility.

Stage one. Crawling.

The first job is simply finding out what pages exist. There's no master list of every page on the internet, so Google has to continuously search for new and updated pages and add them to a list of known pages. This process is called URL discovery.

There are two main ways Google discovers a new page. The first is by following links. When Google revisits a page it already knows, it reads the links on that page, and any link pointing somewhere new becomes a newly discovered page. Google gives a nice example: hub pages, like category pages, often link out to new blog posts, which is exactly how a new post gets found. The second way is when you submit a list of pages directly, in the form of a sitemap, which we'll cover in full in episode ten.

Once Google knows a URL exists, it may visit, or "crawl", that page to see what's on it. This is done by a program called Googlebot, sometimes just called "the crawler" or "the spider". Googlebot uses an algorithm to decide which sites to crawl, how often, and how many pages to fetch from each one. And here's a detail worth remembering: the crawlers are deliberately programmed not to overwhelm a site with requests. This is adjusted based on how the site responds. For instance, if a site starts returning server errors, Googlebot reads that as a signal to slow down.

But finding a URL doesn't guarantee Googlebot will crawl it. Some pages are deliberately blocked from crawling by the site owner, and others sit behind a login wall that Googlebot can't get through.

Here's something that trips a lot of site owners up, so let's spend a moment on it. When Google crawls a page, it renders it using a current version of Chrome and runs any JavaScript it finds, much the same way your own browser would when you visit a page. This step is called rendering, and Google stresses why it matters: many sites rely on JavaScript to bring content onto the page after the initial load, and without rendering, Google might never see that content at all. We'll spend a whole episode on JavaScript SEO later, because for certain kinds of storefronts, especially ones built with heavier front-end frameworks, this is where content quietly goes missing from search.

Google lists the common reasons crawling fails: a problem on the server while it's handling the request, a network issue, or robots.txt rules blocking Googlebot from the page.

Stage two. Indexing.

Once a page has been crawled, Google tries to understand what it's about. This stage involves processing and analysing the text content, along with key content tags and attributes, things like the title element, the alt attribute on images, and the content of images and videos themselves.

During indexing, Google also works out whether the page duplicates other pages elsewhere on the internet, or whether it's what's called the canonical page. The canonical page is the one that's eligible to appear in search results. Here's how Google decides which one that is: first, it groups together pages found on the internet that look similar to each other, a process it calls clustering, and then it selects the most representative page from that cluster as canonical. The other pages in that group aren't discarded, though. They can still be served as alternate versions in different situations, for example to a mobile searcher, or to someone specifically looking for that particular version. We'll go deep on canonicalization in episode twelve, and for a store with a lot of near-identical product variants, this is one of the more important episodes in the whole series.

Google also gathers signals about the canonical page and its cluster that get used in the next stage, serving. Examples of these signals include the language of the page, the country the content is meant for, and how usable the page is.

All of this information, gathered about canonical pages and their clusters, may then be stored in what's called the Google index, a large database hosted across thousands of machines. And Google is explicit here: there's no guarantee a page will be indexed. Not every page Google processes makes it in.

What determines whether a page gets indexed? It comes down to the content and the metadata. Google names three common causes of indexing problems: low quality page content, a robots meta rule that disallows indexing, and site design that makes indexing difficult, which loops us back to that JavaScript point again.

Stage three. Serving.

The final stage is what happens when someone actually searches. Google reiterates, once more, that it doesn't accept payment to rank a page higher, that ranking happens programmatically.

When a person types a query, Google's systems search the index for matching pages and return what they judge to be the most relevant, high-quality results. Relevance is decided by hundreds of factors, and Google names a few: the user's location, their language, and their device, whether that's a desktop or a phone. Google's own example is a search for "bike repair shop": the results shown to someone in Paris and someone in Hong Kong will differ, for the obvious reason that they need different shops.

The search features shown on the results page also change depending on the query. Google contrasts two searches: "bike repair shop" is likely to trigger local results but not an image carousel, while "modern bicycle" is more likely to show images but no local results. There's a full gallery of these visual elements, which we'll tour in a later episode.

Now here's a situation you may run into if you use Search Console, so it's worth having the explanation ready. Search Console can tell you a page is indexed, and yet you don't see it in the actual search results when you look. Google gives three reasons this happens. The content might not be relevant to the query someone typed. The content might be judged low quality. Or a robots meta rule might be blocking that content from being served, even though the page itself was indexed.

Let's bring this together with a concrete walk through the stages, using a hypothetical new product page on a flag store.

You publish a new page for, say, a historical regimental flag. First, crawling: Google needs to discover the URL. That happens fastest if the page is linked from a category page Google already knows, or if it's listed in your sitemap. Then Googlebot fetches the page and renders it, running any JavaScript your Shopify theme or apps inject, so that the full content, not just the bare HTML skeleton, is visible.

Second, indexing: Google reads the title tag, the image alt text, the body copy, and works out whether this page is meaningfully different from your other flag pages, or whether it's a near-duplicate that should be merged into a canonical group with, say, different size variants of the same design. It also picks up signals like the page's language and country targeting.

Third, serving: someone in Texas searches "Texas flag three by five feet". If your page is judged the most relevant canonical match for that query, in that region, on that device, it can appear, possibly alongside the shopping-specific visual features we'll cover when we get to structured data.

At every step in that chain, something can go wrong, and now you have the vocabulary to name where. Not discovered, is a crawling problem. Discovered but not understood, is an indexing problem. Understood but not shown, is a serving problem. That distinction alone will save you time whenever a page isn't performing the way you expect, because it tells you which part of the documentation to go back to.

> ChatGPT fact check - this paragraph claims "Discovered but not understood, is an indexing problem.", but the counterargument is: The three diagnostic labels collapse too much: a discovered page may still not be crawled; a crawled page may not be indexed for several reasons. 'Discovered but not understood' is not an adequate definition of an indexing problem. Distinguish discovery, successful fetching/rendering, indexing, and serving. Diagnose each with Search Console rather than inferring the stage from visibility alone.
>
> Sources: Introducing the three stages of Google Search; list item 1: https://developers.google.com/search/docs/fundamentals/how-search-works#introducing-the-three-stages-of-google-search; Introducing the three stages of Google Search; list item 2: https://developers.google.com/search/docs/fundamentals/how-search-works#introducing-the-three-stages-of-google-search; Introducing the three stages of Google Search; list item 3: https://developers.google.com/search/docs/fundamentals/how-search-works#introducing-the-three-stages-of-google-search; Crawling; paragraph 1: https://developers.google.com/search/docs/fundamentals/how-search-works#crawling; Crawling; paragraph 2: https://developers.google.com/search/docs/fundamentals/how-search-works#crawling.
>
> A008 | Overstatement | Medium priority | Checked 24 September 2026



Let's recap.

Three stages: crawling, where Google finds and fetches a page, rendering it like a browser would. Indexing, where Google reads the content, decides on a canonical version among duplicates, and stores what it learned. And serving, where a search query is matched against the index and the most relevant result is returned, shaped by location, language, device, and hundreds of other factors.

Nothing in this process is paid. And nothing in this process is guaranteed, at any stage.

Next episode, we start the SEO Starter Guide itself, Google's own beginner's guide, and the first half covers exactly the sort of groundwork that makes crawling and indexing go smoothly. See you there.

This episode is adapted from the "How Google Search Works" deep-dive on Google Search Central, licensed under Creative Commons Attribution 4.0.

### Episode 4: The SEO Starter Guide, Part One: Getting Found and Getting Organized

Welcome back. This is the first of two episodes on Google's own SEO Starter Guide, the beginner's document that everything else in modern SEO ultimately traces back to. Google opens it with a nice, plain framing: when you built your website, you built it with users in mind, to make it easy to find and explore. A search engine is one of those users. SEO is about helping search engines understand your content, and helping actual people find your site and decide whether to visit it.

And Google is upfront about something refreshing. There are no secrets here that'll automatically rank your site first, and some of the suggestions might not even apply to your business. This isn't a document of tricks. It's a document of groundwork.

One useful expectation to set before we go further: how long before you see results? Every change takes time to be reflected. Some effects show up in hours, others take months. Google's own advice is to wait a few weeks before judging whether a change helped, and if you're not satisfied and your business allows it, iterate and see if a further change makes a difference. If you remember nothing else from this episode, remember that patience is part of the method, not a failure of it.

How Google Search works, in one sentence.

Google is a fully automated search engine. Programs called crawlers explore the web constantly, looking for pages to add to the index. In most cases you don't need to do anything except publish your site; the vast majority of listed pages are found automatically. If you want the deeper version of this, that's episode three, which we already covered. And if none of this sounds like something you want to spend your own time on, Google's guide openly suggests you might consider hiring a professional, and points to their own guidance on that decision, which we'll cover in episode eight.

Helping Google find your content.

Before doing anything else, check whether Google has already found you. Google suggests a very simple test: search Google using the site colon operator, followed by your domain. For example, typing "site:wikipedia.org" returns Wikipedia's indexed pages. If that search for your own domain returns results, you're in the index already. If it doesn't, go back to the technical requirements from episode one and make sure nothing is technically blocking you.

How does Google actually discover new pages in the first place? Primarily through links from other pages it has already crawled, often other sites linking to yours. This tends to happen naturally over time as your site becomes known, and you can accelerate it by promoting your site, which gets its own section later in this episode.

There's also a more technical option: submitting a sitemap, a file listing all the URLs on your site that you care about. Some content management systems generate this automatically. Google is clear that this isn't required, and that your first focus should be making sure people know your site exists, not chasing technical submissions. We'll still give sitemaps a full episode, because for a large catalogue they genuinely help, but Google's own priority order here is promotion first, plumbing second.

Now here's a check worth doing personally, because it catches real problems. Google says it should ideally see your page the same way an average visitor does. That means Google needs access to the same resources your visitor's browser gets, including your CSS and your JavaScript. If your site hides those pieces from crawlers, Google may not understand your pages properly, and they may not show up, or may not rank well, for the terms you're targeting.

There's also a location wrinkle worth knowing if your site changes content based on the visitor's location. Google's crawler generally accesses your site from the United States. So if your storefront shows different information to different regions, make sure you're happy with what a US-based crawl sees, since that's usually the version Google is judging. The tool to check any of this is the URL Inspection Tool in Search Console, which shows you the page exactly as Google rendered it.

And on the flip side: what if you don't want a page in Google's results at all? Google gives the example of an old post about an embarrassing haircut. There are proper ways to opt individual pages, sections, or your whole site out of crawling and indexing, which we already touched on with the noindex versus robots.txt distinction in episode one, and which gets a full episode of its own later, episode sixteen.

Organizing your site.

Google's framing here is refreshingly low-pressure: if you're setting up or redoing your site, organizing it logically helps both search engines and people understand how your pages relate to each other. But, and this is explicit in the guide, don't drop everything and start reorganizing right now. These suggestions help long term, especially for larger sites, but search engines will generally understand your pages as they are today, regardless of your current structure.

Use descriptive URLs.

Parts of your URL can appear in search results as breadcrumbs, which people also use to judge whether a result looks useful before they even click. Google learns breadcrumbs automatically from the words in your URL, though you can also influence them with structured data if you want the more technical route.

The contrast Google draws is simple. A URL like example.com/pets/cats.html contains real, useful words. A URL like example.com/2/ followed by a long string of random characters tells a visitor nothing. For a flag store, that means product URLs built from words like the flag's name and category are doing real work, both for people scanning results and for Google's understanding of the page.

Group topically similar pages in directories.

If your site has more than a few thousand URLs, and yours does, this section is directly relevant. Using folders to group similar topics helps Google learn how often the pages in a given section tend to change. Google's own example contrasts a policies folder, where content rarely changes, with a promotions folder, where it changes constantly. Google can learn that pattern and crawl each section at an appropriate frequency. And Google specifically points to its ecommerce guidance here, noting that a good URL structure matters more for stores, because they tend to be larger. We'll cover that ecommerce URL guidance in full in episode twenty-seven.

Reduce duplicate content.

Some sites unintentionally show the same content at multiple URLs. Search engines pick one, the canonical URL, to actually show people. Google is careful to say this is not a spam violation. It's not something that gets you penalized. But it is a poor user experience, and it can waste crawl resources on pages you don't even care about being crawled.

If you're up for it, you can specify a canonical version yourself. But if you don't, Google says it will try to work this out automatically on your own site's behalf. The practical guidance: try to make sure each piece of content lives at exactly one URL. If you do end up with two pages containing the same promotional information, for instance, set up a redirect from the version you don't want to the one you do. If a redirect isn't possible, use the rel canonical link element instead. Google closes this section by saying, again, not to worry too much, because search engines generally sort this out on their own most of the time. We'll go much deeper on all of this in episode twelve.

Make your site interesting and useful.

This is the section Google places above almost everything else, and they say so directly: creating content people find compelling and useful will likely influence your presence in search results more than any other suggestion in this guide. Everything technical we've covered so far is scaffolding. This is the building.

Google names four shared attributes of content like this.

First, the text is easy to read and well organized. Write naturally, check for spelling and grammar, break long content into paragraphs and sections, and use headings so people can navigate.

Second, the content is unique. When you write something new, don't copy someone else's content in part or in whole. Create it yourself, based on what you actually know. Don't just rehash what's already been published elsewhere. This links directly back to the scraping and thin-affiliation spam policies from episode two.

Third, the content is up to date. Revisit what you've published and update it as needed, or delete it if it's no longer relevant. An old product page or an outdated blog post sitting untouched for years is exactly the kind of thing worth periodically revisiting.

Fourth, the content is helpful, reliable, and people-first, a phrase and a whole framework Google devotes an entire document to, which is coming up as episode six.

Expect your readers' search terms.

Think about the words someone might actually type to find your content. Google's own example: some people search "charcuterie", others search "cheese board", for essentially the same thing. Different levels of familiarity produce different vocabulary. Writing with your reader's likely language in mind can genuinely help. But Google also reassures you not to worry about anticipating every possible phrasing. Their language matching systems are sophisticated enough to connect your page to many related queries even without the exact words present. So the goal isn't to cram in every synonym; it's to write naturally in language your actual customers use.

Avoid distracting advertisements.

Ads are a normal part of the web, but they shouldn't overwhelm the content or block people from reading it. Google specifically names interstitial pages, the pop-up-style pages shown before or after your actual content, as something that can make a site hard to use if overdone. There's a dedicated episode on this later, episode nineteen, under page experience.

> ChatGPT fact check - this paragraph claims "Google specifically names interstitial pages, the pop-up-style pages shown before or after your actual content, as something that can make a site hard to use if overdone.", but the counterargument is: The interstitial discussion points to Episode 19. Page experience and interstitials are in Episode 20. Change the spoken reference to Episode 20.
>
> Sources: Internal source: seo-study/index.html, episode listings and introductory paragraphs; compare the chapter headings and text. This is an editorial or coverage correction, not an additional Google policy.; Scope reference: https://developers.google.com/search/docs/appearance/page-experience.
>
> A009 | Editorial | Low priority | Checked 24 September 2026



Link to relevant resources.

Links connect visitors and search engines to other parts of your site, and to relevant pages elsewhere. Google repeats a striking fact here: the vast majority of new pages Google finds every day, it finds through links. That makes links a crucial part of how your own new pages get discovered in the first place.

Write good link text. The visible, clickable words of a link, sometimes called anchor text, tell both people and Google something about what's on the other end before anyone clicks. Descriptive link text like "our flag sizing guide" does far more work than a bare "click here".

Link when you need to. Links to outside pages can add credibility and context. But when you're linking somewhere you don't fully trust, add a nofollow or similar annotation, so search engines don't associate your site with that destination. And if your site accepts user-generated content, forum posts, comments, and so on, make sure your platform automatically adds that same annotation to any links users post themselves. You didn't write that content, so you don't want your site vouched for it by default, and this also discourages spammers from targeting your comment sections in the first place.

Let's pause and recap, because that's a lot of ground.

Getting found starts with checking whether you already are, using the site colon search. Discovery mostly happens through links, not submissions. Make sure Google can see your page the way a real visitor does, CSS and JavaScript included, and remember the crawler typically looks from the US. Organize with descriptive URLs and topic-based folders, especially once you're past a few thousand pages, but don't panic-reorganize an already-working site. Duplicate content isn't a penalty, just an inefficiency worth tidying when you can. And above everything technical: write content that's genuinely useful, in your reader's own language, and link generously and honestly.

Next episode, part two of the Starter Guide: how to influence your title and snippet in the results, optimizing images and video, promoting your site the old-fashioned way, and a section Google calls "things we believe you shouldn't focus on", which is one of the most quietly useful lists in the whole document. See you there.

This episode is adapted from the SEO Starter Guide on Google Search Central, licensed under Creative Commons Attribution 4.0.

### Episode 5: The SEO Starter Guide, Part Two: Appearance, Images, Promotion, and What to Ignore

Welcome back. Last episode covered getting found and getting organized. This episode finishes the Starter Guide: how your listing actually looks in the results, images and video, promotion, and then a section that might be the most quietly valuable part of the whole guide, a list of things Google says you shouldn't waste your time on.

Influencing how your site looks in Google Search.

A typical results page has several visual elements you can influence. Google's guide focuses on the two most visually significant ones: the title link and the snippet.

The title link is the clickable headline of a result, and it's a major factor in whether someone clicks. Google draws on a few sources to build it, chiefly the words in your page's title element, sometimes called the title text, along with other headings on the page. That same title text is also what shows up in browser tabs and bookmarks.

If you use a content management system like Shopify, you likely don't need to touch anything technical here. Most systems automatically turn whatever title you write into the proper HTML element. Your job is simply to write good titles. Google defines a good title as unique to the page, clear, concise, and an accurate description of the content. It suggests including your website or business name, other useful information like a physical location where relevant, and something about what that specific page offers.

Below the title sits the snippet, the short description that helps someone decide whether to click. The snippet is drawn from the actual content of the page it's linking to, which means you have real control over the words that can end up there, simply by writing your page content well. Occasionally the snippet instead comes from your meta description tag, a short, page-specific summary you write directly for this purpose. A good meta description is short, unique to that one page, and covers the most relevant points. We'll dig deeper into both of these in episode twenty.

> ChatGPT fact check - this paragraph claims "Occasionally the snippet instead comes from your meta description tag, a short, page-specific summary you write directly for this purpose.", but the counterargument is: Titles/snippets are assigned to Episode 20 instead of 21; video to 21 instead of 22; site moves to 17 instead of 18. Use Episode 21 for titles/snippets, Episode 22 for images/video, and Episode 18 for site moves.
>
> Sources: Internal source: seo-study/index.html, episode listings and introductory paragraphs; compare the chapter headings and text. This is an editorial or coverage correction, not an additional Google policy.; Scope reference: https://developers.google.com/search/docs/appearance/title-link; Scope reference: https://developers.google.com/search/docs/appearance/video; Scope reference: https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes.
>
> A010 | Editorial | Low priority | Checked 24 September 2026



Adding and optimizing images.

Many people search visually. Google's example: someone with a recipe blog might be found by people searching "fruit tart recipes" and then browsing through the photos. Images can be a first point of discovery, not just decoration.

Add high-quality images near relevant text. Sharp, clear images placed close to related text help both the visitor and Google, because the surrounding text gives context to what the image shows. Google's example is charming: if someone's searching for daisies and stumbles across a photo of an edelweiss instead, a higher-quality, clearer image helps them immediately tell the flowers apart. For a store, that principle translates directly: a crisp photo of a specific historical flag, placed right next to the paragraph describing its history and specifications, does more work than the same photo floating in a generic gallery with no surrounding text.

Add descriptive alt text. Alt text is a short but meaningful description of what an image shows and how it relates to the surrounding content. It's added through the alt attribute in your HTML, and most content management systems give you an easy field for it when uploading. Good alt text explains what's actually in the image in a natural sentence or phrase, not a pile of keywords. We'll spend real time on writing this well in a later episode on images.

Optimizing videos.

If parts of your site are primarily about individual videos, people can discover you through video results too, and many of the same practices from images and text apply directly. Create genuinely high-quality video content, and embed it on a standalone page, near text relevant to that video. Write descriptive titles and descriptions for the video itself, and remember that a video's title follows the same good-title principles as a page title. If video is a meaningful part of your business, there's a full dedicated guide, which we'll cover in episode twenty-one.

> ChatGPT fact check - this paragraph claims "If parts of your site are primarily about individual videos, people can discover you through video results too, and many of the same practices from images and text apply directly.", but the counterargument is: Titles/snippets are assigned to Episode 20 instead of 21; video to 21 instead of 22; site moves to 17 instead of 18. Use Episode 21 for titles/snippets, Episode 22 for images/video, and Episode 18 for site moves.
>
> Sources: Internal source: seo-study/index.html, episode listings and introductory paragraphs; compare the chapter headings and text. This is an editorial or coverage correction, not an additional Google policy.; Scope reference: https://developers.google.com/search/docs/appearance/title-link; Scope reference: https://developers.google.com/search/docs/appearance/video; Scope reference: https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes.
>
> A010 | Editorial | Low priority | Checked 24 September 2026



Promoting your website.

This section might be the most human part of the entire Starter Guide, and it's worth hearing Google's own framing again, because it echoes something from episode one. Promoting your content well leads to faster discovery, both by interested people and by search engines. Google lists several channels: social media promotion, community engagement, advertising both offline and online, word of mouth, and more.

And then Google says something that might surprise people expecting a purely technical document: one of the most effective and lasting methods is word of mouth, people who know your site telling their friends about it. That takes time, and it usually follows from other groundwork, like genuine community engagement, rather than appearing on its own.

Offline promotion counts too. If you run a business site, put its URL on your business cards, letterhead, posters, anything physical that represents your business. With permission, sending recurring newsletters to your audience about new content is another avenue Google names directly.

And there's a caution attached: you can overdo this. Promote too aggressively and people get fatigued, and search engines may start to read some of those same tactics as attempts to manipulate results. This is a direct echo of the link spam policies from episode two: the line between promotion and manipulation is intent and proportion, not any single tactic.

Now for the section I mentioned at the top: things Google believes you shouldn't focus on.

Google's own framing here is worth repeating exactly: as SEO has evolved, so have the ideas around it, and some things once considered best practice are no longer relevant, given how search engines and the internet have changed. This is Google, in its own documentation, actively telling you what to stop worrying about. Let's go through the list.

Meta keywords. Google Search does not use the keywords meta tag at all. It has no effect. If you've been carefully filling this field in, you can stop.

Keyword stuffing. We covered this fully in episode two: unnaturally repeating words, even with variations, tires out human readers and violates the spam policies. Nothing new here, just a reminder that it doesn't work even setting the policy aside.

Keywords in the domain name or URL path. When choosing a site name, Google says to do what's right for your business and follow ordinary marketing sense, since your customers will use this name to find you. But from a pure ranking standpoint, keywords in your domain or URL path have hardly any effect beyond appearing in breadcrumbs. And on the related question of domain endings, like dot com versus dot guru: this only matters if you're specifically targeting one country's users, and even then it's usually a low-impact signal. Google's own example fits a business like this one closely: if you're trying to sell Dutch cheese to Swiss searchers, a dot ch domain makes sense from both a business and an SEO standpoint. Otherwise, Google genuinely does not care which ending you use.

Minimum or maximum content length. There is no magic word count, no minimum, no maximum, though Google notes dryly that you probably want at least one word. Writing naturally, without repetition, may incidentally touch more relevant keywords and phrases, which can help you show up for more queries, but that's a side effect of good writing, not a target to hit.

Subdomains versus subdirectories. Purely a business decision. It might be easier to manage a site divided into folders, or it might make more sense to split topics into subdomains, depending on your industry and structure. Google has no ranking preference either way.

PageRank. Yes, PageRank is real, it uses links, and it's one of Google's foundational algorithms. But Google is explicit that there's far more to ranking than links alone, with many, many signals involved, of which PageRank is only one.

The duplicate content "penalty". If some of your content is reachable under multiple URLs, Google says plainly: it's fine, don't fret about it. It's inefficient, but it will not trigger a manual action against your site. The one caveat, which we covered in episode two, is that copying someone else's content is an entirely different matter and does fall under the spam policies.

Number and order of headings. Semantic, properly ordered headings are genuinely valuable for accessibility, particularly screen readers, and worth doing well for that reason alone. But from a pure Search perspective, Google says it doesn't matter if your headings are technically out of order, because most of the web isn't valid HTML to begin with, so Google rarely relies on strict semantic structure. There's also no ideal number of headings a page should have. Their one piece of advice, delivered with a shrug: if it feels like too many headings, it probably is.

And finally, thinking E-E-A-T is a ranking factor. Google's answer, verbatim in spirit: no, it's not. E-E-A-T, which stands for experience, expertise, authoritativeness, and trustworthiness, is a framework for thinking about content quality, not a direct scoring input Google plugs into rankings. We'll unpack what E-E-A-T actually is, and why the distinction matters, in episode six, right after this.

Let's close with Google's own suggested next steps, because they map neatly onto where this series goes from here. Set up Search Console to monitor your performance, which we'll walk through in episode twenty-nine. Learn to maintain your SEO over the long term, including scenarios like site moves, which we'll touch in episode seventeen. And add valid structured data, which makes your pages eligible for extra visual features in search results, review stars, carousels, and more, which is the whole back half of Part Three of this series.

> ChatGPT fact check - this paragraph claims "Learn to maintain your SEO over the long term, including scenarios like site moves, which we'll touch in episode seventeen.", but the counterargument is: Titles/snippets are assigned to Episode 20 instead of 21; video to 21 instead of 22; site moves to 17 instead of 18. Use Episode 21 for titles/snippets, Episode 22 for images/video, and Episode 18 for site moves.
>
> Sources: Internal source: seo-study/index.html, episode listings and introductory paragraphs; compare the chapter headings and text. This is an editorial or coverage correction, not an additional Google policy.; Scope reference: https://developers.google.com/search/docs/appearance/title-link; Scope reference: https://developers.google.com/search/docs/appearance/video; Scope reference: https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes.
>
> A010 | Editorial | Low priority | Checked 24 September 2026



Let's recap both parts of the Starter Guide together, since they form one whole document.

Help Google find you: check with a site colon search, understand that links do most of the discovery work, and make sure Google can render your page the way a real visitor sees it. Organize sensibly, with descriptive URLs and topic folders, without overhauling a working site. Write content that's genuinely useful, unique, current, and people-first, because that outweighs every technical suggestion in the guide. Write clear titles and meta descriptions, since those directly shape your listing's appearance. Use quality images with real alt text, placed near relevant text. Promote your site through real channels, and remember word of mouth is still one of the strongest forces there is. And finally, let go of the myths: meta keywords, exact keyword domains, magic word counts, heading order, and E-E-A-T as a literal ranking score. None of them do what people think they do.

Next episode, we take that last myth and turn it into a proper subject: what "helpful, reliable, people-first content" actually means in Google's own words, what E-E-A-T really is if it isn't a ranking factor, and how Google's guidance on using generative AI tools to help write content fits into all of this. See you there.

This episode is adapted from the SEO Starter Guide on Google Search Central, licensed under Creative Commons Attribution 4.0.

### Episode 6: People-First Content, and Understanding E-E-A-T

Welcome back. Two episodes ago, we closed the Starter Guide with a small bombshell: Google saying flatly that E-E-A-T is not a ranking factor. That probably raised more questions than it answered, since E-E-A-T is one of the most talked-about acronyms in the entire SEO world. Today we go straight to Google's own document on the subject, and by the end you'll understand exactly what that acronym means, why it isn't a ranking factor, and why it matters anyway.

> ChatGPT fact check - this paragraph claims "Two episodes ago, we closed the Starter Guide with a small bombshell: Google saying flatly that E-E-A-T is not a ranking factor.", but the counterargument is: The Starter Guide ended in the immediately preceding episode, not two episodes ago. Page experience is Episode 20, not Episode 19. Say 'Last episode' in the opening and 'Episode 20' for page experience.
>
> Sources: Internal source: seo-study/index.html, episode listings and introductory paragraphs; compare the chapter headings and text. This is an editorial or coverage correction, not an additional Google policy.; Scope reference: https://developers.google.com/search/docs/fundamentals/creating-helpful-content.
>
> A011 | Editorial | Low priority | Checked 24 September 2026



Google opens with the same sentence that's become a refrain across this series: its automated ranking systems are designed to prioritize helpful, reliable information created to benefit people, not content created to manipulate rankings.

Self-assessing your own content.

Google offers a long list of questions meant to help you honestly judge your own work, and it suggests going further than just asking yourself: have someone you trust, who isn't affiliated with your site, give you an honest read. It also suggests, if you've experienced a traffic drop, auditing exactly which pages were hit and for which searches, then holding those pages up against the questions that follow.

Let's group the questions into two families: content and quality, and expertise.

On content and quality, Google asks whether your content offers original information, reporting, research, or analysis. Whether it's a substantial, complete treatment of the topic, not a thin pass. Whether it offers insight beyond the obvious. And if it draws on other sources, whether it avoids simply copying or rewriting them, instead adding real, substantial value of its own.

There are some more instinctive questions too, and I think these are the ones worth carrying on your walk. Is this the sort of page you'd actually bookmark, or share with a friend? Would you expect to see it referenced in a printed magazine, encyclopedia, or book? Does it offer substantial value compared to the other pages already sitting in the search results? Is it well produced, or does it feel sloppy and rushed?

And then there's a line that speaks directly to any business running a large catalogue or working with several writers: is the content mass-produced, or outsourced to a large number of creators, or spread across a large network of sites, in a way that means individual pages don't get real attention or care? That's not a ban on scale. It's a caution about scale without care.

On expertise, Google asks whether the content is presented in a way that earns trust, through clear sourcing, visible evidence of expertise, and background about the author or the site, for instance through an author page or an About page. Whether someone researching the site producing this content would come away thinking it's genuinely trusted or recognised as an authority. Whether the content is written or reviewed by someone who demonstrably knows the subject well. And, simply, whether it contains easily verified factual errors.

Providing a great page experience.

Google's core ranking systems reward a good overall page experience, and the guidance here is explicit about not fixating on just one or two aspects of that. Check whether you're delivering a genuinely good experience across many dimensions at once, not optimising one metric while neglecting the rest. We'll dedicate a full episode to page experience and Core Web Vitals later on, episode nineteen.

> ChatGPT fact check - this paragraph claims "Google's core ranking systems reward a good overall page experience, and the guidance here is explicit about not fixating on just one or two aspects of that.", but the counterargument is: The Starter Guide ended in the immediately preceding episode, not two episodes ago. Page experience is Episode 20, not Episode 19. Say 'Last episode' in the opening and 'Episode 20' for page experience.
>
> Sources: Internal source: seo-study/index.html, episode listings and introductory paragraphs; compare the chapter headings and text. This is an editorial or coverage correction, not an additional Google policy.; Scope reference: https://developers.google.com/search/docs/fundamentals/creating-helpful-content.
>
> A011 | Editorial | Low priority | Checked 24 September 2026



Focus on people-first content.

Here's Google's actual definition: people-first content is content created primarily for people, not to manipulate search rankings. And they offer five questions where a "yes" answer suggests you're on the right track.

Do you have an existing or intended audience who'd find this useful if they came to you directly, rather than through a search result? Does your content clearly show first-hand expertise, the kind of depth that comes specifically from having used a product, or visited a place, yourself? Does your site have a genuine primary purpose? After reading, will someone feel they've learned enough to actually achieve their goal? And will they come away feeling like they had a satisfying experience?

Notice the phrase "first-hand expertise... from having actually used a product." For a store that makes and sells physical flags, this is a built-in advantage worth using deliberately. A page describing the fading behaviour of a particular fabric outdoors over a season, written from actually having watched it happen, is exactly the kind of first-hand knowledge Google is describing here. Nobody scraping product descriptions from a supplier catalogue can write that sentence.

Avoiding search-engine-first content.

Now the inverse list, the warning signs. Answering yes to several of these is Google's own cue to step back and reconsider.

Is the content primarily made to attract search visits? Are you producing large amounts of content across many different topics, hoping some of it happens to perform? Are you using extensive automation to generate content across many topics? Are you mostly summarising what others have already said, without adding real value? Are you writing about something purely because it's trending, not because you'd genuinely cover it for your existing audience? Does your content leave readers feeling like they'll need to search again elsewhere to get a better answer?

A few of these are wonderfully specific, and worth hearing verbatim, because they puncture some persistent myths. Are you writing to a particular word count because you heard Google has a preferred one? Google's own parenthetical answer: no, we don't. Did you enter some niche topic with no real expertise, mainly because you thought it would bring search traffic? Does your content promise an answer to a question that genuinely has no answer yet, like suggesting a confirmed release date for something that hasn't been confirmed? Are you changing the publish date on pages to make them look fresh, when the content hasn't actually changed? Are you adding or deleting large amounts of content mainly because you believe that churn itself will help your rankings by making the site seem "fresh"? Google's answer again: no, it won't.

And then Google addresses something that might feel like a contradiction: isn't SEO itself search-engine-first by definition? Their answer is a clean distinction. There are things you can genuinely do to help search engines discover and understand your content, and collectively that's SEO, covered in their own starter guide, which we spent two episodes on. SEO is a helpful activity, Google says, specifically when it's applied to people-first content, rather than used as a substitute for it. SEO on top of something genuinely good: fine. SEO instead of something genuinely good: the thing they're warning against.

Now, the main event. Understanding E-E-A-T and the quality rater guidelines.

Google's automated systems use many different factors to identify and rank content. Among those factors, they look for a mix of signals that indicate experience, expertise, authoritativeness, and trustworthiness. That's E-E-A-T.

Here's the part that resolves the apparent contradiction from episode five. Of the four, trust is the most important, and the other three exist to build trust. Content doesn't need to demonstrate all four to be considered helpful. Some content earns trust mainly through the experience it demonstrates. Other content earns it mainly through expertise. And here is Google's own sentence on the central puzzle: while E-E-A-T itself isn't a specific ranking factor, using a mix of factors that can identify content with good E-E-A-T is useful. In other words, there's no single "E-E-A-T score" sitting in the algorithm that a page either passes or fails. E-E-A-T is a framework for describing the qualities that Google's actual, separate ranking signals are trying to detect. It's the theory behind the exam, not a subject on the exam itself.

And here's where it becomes more consequential for certain kinds of content. Google's systems give extra weight to strong E-E-A-T specifically for what they call Your Money or Your Life topics, YMYL for short: topics that could meaningfully affect someone's health, financial stability, safety, or the wellbeing of society more broadly. Medical advice, financial guidance, legal information, that territory. A flag store's product pages generally sit well outside YMYL. But if this brand ever expands into, say, detailed guidance about flag display etiquette tied to funerals, military honours, or civic ceremonies, that content edges toward territory where trust signals start to matter more heavily, and it's worth knowing that boundary exists.

> ChatGPT fact check - this paragraph claims "Google's systems give extra weight to strong E-E-A-T specifically for what they call Your Money or Your Life topics, YMYL for short: topics that could meaningfully affect someone's health, financial stability, safety, or the wellbeing of society more broadly.", but the counterargument is: The speculation that funeral, military-honour, or civic flag etiquette enters a higher-weight YMYL category is not a classification made by the cited source. Remove the flag-etiquette example. Explain YMYL using the source's categories: potential significant effects on health, financial stability, safety, or societal welfare.
>
> Sources: Get to know E-E-A-T and the quality rater guidelines; paragraph 3: https://developers.google.com/search/docs/fundamentals/creating-helpful-content#eat.
>
> A012 | Unsupported | Medium priority | Checked 24 September 2026



So where does the quality rater guidelines document fit in? Google employs search quality raters, people who evaluate whether the algorithms seem to be producing good results, essentially a feedback mechanism to confirm changes are working as intended. Raters are specifically trained to judge whether content demonstrates strong E-E-A-T, following a detailed public document called the Search Quality Rater Guidelines. And Google is explicit on a point people frequently get wrong: raters have no control over how any individual page ranks, and their ratings are never fed directly into the ranking algorithms. Google's own analogy is a restaurant collecting feedback cards from diners: it tells the kitchen whether the food is landing, without any single diner deciding tonight's menu. Reading the guidelines, Google suggests, can still help you self-assess your own content's E-E-A-T and understand, conceptually, what the automated signals are trying to pick up on.

Asking Who, How, and Why about your content.

Google offers a practical three-part framework for staying aligned with all of this, and it's genuinely useful to run through for any new page you publish.

Who created the content. Is it self-evident to a visitor who wrote this? Do pages carry a byline where a reader would reasonably expect one? Does that byline lead somewhere with real background on the author, the areas they write about? Google strongly encourages adding accurate authorship information wherever readers would expect it. For a personal brand built specifically around expertise and authority, this one lands directly. A named author with a visible track record is doing exactly what this section describes.

How the content was created. It helps readers to understand the process behind a piece. Google's own example is product reviews: readers trust a review more when they know how many products were tested, what the results were, and how the testing was actually conducted, ideally backed by evidence like photographs. And Google addresses AI-assisted and AI-generated content directly here. If automation played a substantial role in producing content, ask yourself: is that use of automation self-evident to visitors, through a disclosure or otherwise? Are you explaining how automation was used? Are you explaining why it was actually useful for this piece? Google frames these disclosures as useful specifically wherever a reader might naturally wonder "how was this made".

Why the content was created. Google calls this perhaps the single most important question. The right answer is that you made it primarily to help people, content that would be useful to a visitor even if they arrived at your site directly, with no search engine involved at all. That aligns with E-E-A-T and with what the core ranking systems are designed to reward. The wrong answer is making content primarily to attract search visits. And Google draws a hard line here, not a soft one: if you use automation, including AI generation, for the primary purpose of manipulating search rankings, that is a direct violation of the spam policies we covered back in episode two, under scaled content abuse.

Let's recap.

E-E-A-T stands for experience, expertise, authoritativeness, and trust, and trust is the anchor the other three feed into. It isn't a ranking factor you can directly optimise for; it's a description of the qualities Google's actual ranking signals are trying to detect. It matters more for topics that could meaningfully affect someone's health, money, safety, or society, the YMYL category. Search quality raters help confirm whether the algorithms are producing good results, but their individual judgments never directly set any page's rank.

The self-assessment questions boil down to something simple: would you bookmark this, would a trusted expert stand behind it, does it exist to genuinely help a reader rather than to attract a click. And the Who, How, Why framework gives you a concrete way to build that in: name your authors, be transparent about your process including any use of AI, and always be able to answer honestly that the content exists to help the person reading it, not to game a ranking.

Next episode, we look at what's become the newest and fastest-moving frontier in this whole field: optimizing for generative AI search, and Google's specific guidance on using generative AI tools to actually produce your content, which builds directly on the "How" question we just covered. See you there.

This episode is adapted from "Creating helpful, reliable, people-first content" on Google Search Central, licensed under Creative Commons Attribution 4.0.

### Episode 7: Optimizing for Generative AI Search

Welcome back. This episode covers Google's newest addition to the documentation, and one of its most current: a guide specifically about AI Overviews, AI Mode, and how generative features fit into everything we've already covered. If you've heard people talking about AEO or GEO, answer engine optimization or generative engine optimization, this is Google's direct response to that conversation, and it was last updated in the middle of 2026, so this is about as current as this series gets.

Google opens with the context: people are increasingly turning to generative AI experiences to find information, and this shift is framed not as a threat but as an opportunity, a chance to reach people who might engage more deeply, spend more time with your content, or convert into a customer.

Is SEO still relevant for generative AI search?

Google's own answer, verbatim in spirit: in short, yes. The reasoning is structural: these generative features are rooted in Google's core Search ranking and quality systems, the same ones we've been discussing this whole series. They're not a separate product with separate rules bolted on top.

Google names two specific techniques these features rely on, and it's worth knowing both terms, because you'll hear them elsewhere.

Retrieval-augmented generation, also called grounding, is how the AI features improve their accuracy and freshness. The system relies on the core Search ranking systems to retrieve relevant, up-to-date pages from the index, reviews the specific information in those pages, and then generates a response, showing clickable links to the pages that support what it said. In plain terms: the AI doesn't just make things up from memory, it goes and finds current pages and builds its answer from them, then shows its sources.

Query fan-out is a set of related queries the model generates automatically to gather more information around the original question. Google's own example: if someone asks how to fix a lawn full of weeds, the system might silently also search "best herbicides for lawns", "remove weeds without chemicals", and "how to prevent weeds in lawn", pulling in results from all of them to build a fuller answer.

And on the terminology question directly: what about AEO and GEO? Google addresses this head-on. From Search's own perspective, optimizing for generative AI search is optimizing for the search experience, and is therefore still SEO. Not a new discipline requiring new tools, a new consultant, or a new file format. Same discipline, applied to a newer surface.

Applying foundational SEO to generative AI search.

This section is essentially Google reframing everything from episodes four through six through the lens of AI features specifically.

Create valuable, non-commodity content. This phrase, non-commodity, is the sharpest new idea in the whole guide, so let's sit with it. Google explains: since AI systems draw on a variety of sources, having a genuinely unique point of view helps you stand out from that pile. A first-hand review offers a unique perspective grounded in real experience. A summary of existing content just restates what's already out there.

And then Google gives a contrast that's worth remembering precisely, because it's such a clean illustration. Commodity content, their own example, is something like "Seven Tips for First-Time Homebuyers", built on common knowledge that could have come from anyone, adding little unique insight. Non-commodity content, their contrasting example, is something like "Why We Waived the Inspection and Saved Money: A Look Inside the Sewer Line", a specific, lived, expert account that goes beyond the ordinary.

Translate that directly to a flag store. "Five Tips for Choosing a Flag" is commodity content; a hundred other sites have some version of it. "What We Learned Testing Nylon Versus Polyester Flags Through a Belgian Winter, With Photos at Each Stage" is non-commodity content: it could only have been written by someone who actually did that, and an AI system summarizing the web has no equivalent source to draw from instead of yours.

Organize content to help readers, using paragraphs, sections, and clear headings, the same guidance we've heard since episode four. Add high-quality images and video where they genuinely help, since Google's AI features can also surface images and video, not just page links, meaning more ways for your content to appear. And reassuringly, Google notes that if you're already following the standard image and video SEO practices from this series, you're already doing what's needed here. Nothing extra required.

Focus on what your users want, and avoid overdoing it. Here's a direct warning against a tempting shortcut: creating separate pages for every conceivable variation of a query, including the fan-out queries we just described, specifically to manipulate rankings or AI responses, is a violation of the scaled content abuse policy from episode two. Google adds that it's also simply ineffective long-term, since a higher quantity of pages doesn't make a site higher quality, and their language-understanding systems have gotten good enough to connect a query to relevant content even without an exact word match.

And if you're using generative AI tools yourself to help draft content, Google points directly to a companion guide, on using generative AI responsibly, which is exactly where we're headed after this episode.

> ChatGPT fact check - this paragraph claims "And if you're using generative AI tools yourself to help draft content, Google points directly to a companion guide, on using generative AI responsibly, which is exactly where we're headed after this episode.", but the counterargument is: Episode 8 does not cover the promised AI-content production guide, ongoing SEO maintenance, or developer guide. The structured-data reference also starts at Episode 22 rather than 23. Add separate source-faithful sections for the promised guides, or remove those promises. Correct the structured-data reference to Episode 23.
>
> Sources: Internal source: seo-study/index.html, episode listings and introductory paragraphs; compare the chapter headings and text. This is an editorial or coverage correction, not an additional Google policy.; Scope reference: https://developers.google.com/search/docs/fundamentals/using-gen-ai-content; Scope reference: https://developers.google.com/search/docs/fundamentals/get-started; Scope reference: https://developers.google.com/search/docs/fundamentals/get-started-developers.
>
> A015 | Omission | Medium priority | Checked 24 September 2026



Google then offers what it calls a simplifying principle for all of this: focus on what your visitors would enjoy, find helpful, and feel satisfied by. If you're ever unsure about a decision, ask yourself one question: is this content my visitors would find satisfying? If yes, you're on the right track.

Building and maintaining a clear technical structure.

Google restates something important here, almost as a warning against complacency: technical clarity is still the core of how AI systems access your data, and every existing technical practice from this series remains worthwhile. There's no separate AI-specific technical checklist.

One genuinely new detail worth flagging precisely: to be eligible for generative AI features specifically, a page must be indexed and eligible for a normal snippet, meeting the same technical requirements from episode one. But beyond that, a site also needs to be specifically included for generative AI features inside Search Console. That's an actual setting, not automatic, and worth checking directly if you want to track this.

> ChatGPT fact check - this paragraph claims "But beyond that, a site also needs to be specifically included for generative AI features inside Search Console.", but the counterargument is: The script says Search Console AI inclusion is 'not automatic' and implies a separate opt-in is required. The control exists, but Google's help page says inclusion is the default; child properties can inherit a parent's setting. Sites are included in Search generative AI features by default, subject to eligibility. Check the Search Console control if a property or its parent has been excluded.
>
> Sources: Change your control; list item 1: https://support.google.com/webmasters/answer/16908024?hl=en.
>
> A013 | Error | High priority | Checked 24 September 2026



Google also repeats, once more, the now-familiar caveat: meeting every requirement doesn't guarantee crawling, indexing, or serving. Still true here.

On crawlability specifically: Google stresses that its generative models use publicly accessible, crawlable content to build grounded responses, so if content isn't crawlable, it simply isn't available to be used, full stop.

On semantic HTML, there's a nicely relaxed note: perfect code isn't required, since the web in general isn't valid HTML and Google can handle that. But using semantic HTML where reasonable still helps other users, notably people relying on screen readers, so it's worth doing for that reason even without an SEO requirement attached.

If JavaScript is part of your build, the usual JavaScript SEO practices from our upcoming episode fourteen still apply here without modification. Page experience, reducing duplicate content, all of it: same guidance, same episodes, applied to a newer feature.

Optimizing local business and ecommerce details.

Here's a section directly relevant to a Shopify store. Generative AI responses can include product listings, product information, and local business details, and Google names two specific tools for this: Merchant Center, including its product feeds, and Google Business Profiles. Using these properly helps products and services surface in both AI responses and ordinary Search results. Google also mentions something newer worth knowing about: Business Agent, a conversational experience within Search that lets customers chat directly with a brand, available depending on business type and goals.

Now, the mythbusting section, and this one is genuinely satisfying, because it directly debunks a lot of noise currently circulating in the SEO world.

LLMS.txt files and other special markup. You do not need to create special machine-readable files, AI text files, or Markdown versions of your pages to appear in Google Search or its AI features, because Google Search doesn't use them at all. Google adds a nuance worth catching: it may discover and index many kinds of files beyond plain HTML on a site, but that doesn't mean any particular file type gets special treatment. And if you want to maintain an LLMS.txt file anyway, for some other AI service that does use them, that's entirely your call; it will neither help nor hurt your standing with Google Search, because Google simply ignores it.

Chunking content. There's no need to break your content into tiny fragments to make it easier for AI to parse. Google's systems can already understand multiple topics within a single page and surface the relevant part to a user. Sometimes shorter or longer pages both work well, depending on the audience and subject. There is no ideal length. Google's own advice: make pages for your audience, not for generative AI search specifically.

Rewriting content just for AI systems. No special phrasing is required. AI systems understand synonyms and general meaning well enough to connect a reader to content that doesn't use their exact words. You don't need to anxiously chase every long-tail keyword variation.

Seeking inauthentic mentions. Google's generative features can surface what's genuinely being said about your products across blogs, videos, and forums, the same way ordinary Search results can. But manufacturing artificial mentions isn't as effective as it might seem, because the underlying ranking systems reward genuine quality, and separate systems actively block spam, and the AI features depend on both of those working correctly together. Astroturfing your way into more mentions doesn't bypass either system.

Overfocusing on structured data. Structured data isn't required for generative AI search specifically, and there's no special new schema.org markup invented just for it. It's still worth using as part of your broader SEO strategy, because it remains the path to eligibility for rich results in ordinary Search, which we'll cover fully starting in episode twenty-two. But treating it as some kind of AI-specific requirement is a misconception.

> ChatGPT fact check - this paragraph claims "It's still worth using as part of your broader SEO strategy, because it remains the path to eligibility for rich results in ordinary Search, which we'll cover fully starting in episode twenty-two.", but the counterargument is: Episode 8 does not cover the promised AI-content production guide, ongoing SEO maintenance, or developer guide. The structured-data reference also starts at Episode 22 rather than 23. Add separate source-faithful sections for the promised guides, or remove those promises. Correct the structured-data reference to Episode 23.
>
> Sources: Internal source: seo-study/index.html, episode listings and introductory paragraphs; compare the chapter headings and text. This is an editorial or coverage correction, not an additional Google policy.; Scope reference: https://developers.google.com/search/docs/fundamentals/using-gen-ai-content; Scope reference: https://developers.google.com/search/docs/fundamentals/get-started; Scope reference: https://developers.google.com/search/docs/fundamentals/get-started-developers.
>
> A015 | Omission | Medium priority | Checked 24 September 2026



Measuring visibility.

Google points to a specific tool: the Generative AI Performance report inside Search Console, which shows how people are discovering your content specifically through these AI features on both Search and Discover. And there's a pointed warning attached: be wary of third-party tools promising ranking success or claiming access to "internal" Google metrics. No third-party tool has access to Google's actual internal ranking or AI systems. Use such tools if they genuinely help your workflow, but always weigh their advice against Google's own official guidance, which is exactly the subject of episode eight, coming up next.

> ChatGPT fact check - this paragraph claims "Google points to a specific tool: the Generative AI Performance report inside Search Console, which shows how people are discovering your content specifically through these AI features on both Search and Discover.", but the counterargument is: The broad description of a single AI report for Search and Discover omits that the detailed reporting is split. The Search report currently describes impressions, not a complete attribution or conversion measure. Explain the separate Search and Discover generative AI reports and identify what metrics each provides. Do not imply full click, conversion, or citation attribution from an impressions report.
>
> Sources: Generative AI performance report (Search); paragraph 1: https://support.google.com/webmasters/answer/16984139?hl=en; What's included; paragraph 2: https://support.google.com/webmasters/answer/16984139?hl=en.
>
> A014 | Omission | Medium priority | Checked 24 September 2026



A brief word on agentic experiences.

Google flags something worth knowing about even if it's not urgent yet: AI agents, autonomous systems that can complete tasks on someone's behalf, like booking something or comparing specifications. These agents can access a site in various ways, analyzing screenshots, inspecting the underlying page structure, interpreting what's called the accessibility tree. If this feels relevant to your business, Google points to guidance on agent-friendly website design, and mentions an emerging protocol called the Universal Commerce Protocol, intended to let Search agents do more directly. This is clearly still an early, developing area, and Google frames it that way, as something to keep an eye on rather than something requiring immediate action.

Let's recap.

Optimizing for generative AI search is, in Google's own words, still SEO, not a separate discipline. The underlying mechanisms are retrieval-augmented generation, grounding responses in real, current pages with visible sources, and query fan-out, silently expanding a single question into several related searches. The single sharpest concept in this whole guide is non-commodity content: writing from real, specific, first-hand experience that no generic summary could replicate, rather than restating common knowledge everyone already has. The technical requirements are unchanged from earlier episodes, though generative AI features do need separate inclusion in Search Console. And the mythbusting list is worth genuinely believing: skip the LLMS.txt files, skip chunking your content into fragments, skip rewriting for imagined AI phrasing, skip chasing inauthentic mentions, and don't treat structured data as some new AI-only requirement.

> ChatGPT fact check - this paragraph claims "The technical requirements are unchanged from earlier episodes, though generative AI features do need separate inclusion in Search Console.", but the counterargument is: The script says Search Console AI inclusion is 'not automatic' and implies a separate opt-in is required. The control exists, but Google's help page says inclusion is the default; child properties can inherit a parent's setting. Sites are included in Search generative AI features by default, subject to eligibility. Check the Search Console control if a property or its parent has been excluded.
>
> Sources: Change your control; list item 1: https://support.google.com/webmasters/answer/16908024?hl=en.
>
> A013 | Error | High priority | Checked 24 September 2026



Next episode, we look at the flip side of everything we just discussed: Google's specific guidance on using generative AI tools to actually produce your content, plus a look at maintaining your SEO over time, the developer's guide to Search, the question of whether you need to hire an SEO at all, and how to judge third-party SEO advice, including the AEO and GEO consultants this episode already warned you about. See you there.

> ChatGPT fact check - this paragraph claims "Next episode, we look at the flip side of everything we just discussed: Google's specific guidance on using generative AI tools to actually produce your content, plus a look at maintaining your SEO over time, the developer's guide to Search, the question of whether you need to hire an SEO at all, and how to judge third-party SEO advice, including the AEO and GEO consultants this episode already warned you about.", but the counterargument is: Episode 8 does not cover the promised AI-content production guide, ongoing SEO maintenance, or developer guide. The structured-data reference also starts at Episode 22 rather than 23. Add separate source-faithful sections for the promised guides, or remove those promises. Correct the structured-data reference to Episode 23.
>
> Sources: Internal source: seo-study/index.html, episode listings and introductory paragraphs; compare the chapter headings and text. This is an editorial or coverage correction, not an additional Google policy.; Scope reference: https://developers.google.com/search/docs/fundamentals/using-gen-ai-content; Scope reference: https://developers.google.com/search/docs/fundamentals/get-started; Scope reference: https://developers.google.com/search/docs/fundamentals/get-started-developers.
>
> A015 | Omission | Medium priority | Checked 24 September 2026



This episode is adapted from "Optimizing your website for generative AI features on Google Search" on Google Search Central, licensed under Creative Commons Attribution 4.0.

### Episode 8: Do You Need an SEO? And Judging Third-Party Advice

Welcome back. This episode closes out Part One of the series, and it's a genuinely practical one: whether to hire an SEO professional at all, how to evaluate one if you do, and how to judge the flood of third-party tools and advice, including the AEO and GEO services that have been popping up everywhere. Both documents we're covering today were updated within the last few months, in June 2026, so this is current, and it directly follows on from the mythbusting in episode seven.

Let's start with "Do you need an SEO?"

Google opens with a fair-minded framing: hiring a professional can be helpful, the same as with many business activities. It's a big decision that could genuinely improve your visibility and save you time, but it also carries risk, both to your site and your reputation. Google's advice is to weigh the potential benefit against the damage an irresponsible SEO can do.

They list the legitimate services many SEOs and agencies genuinely provide: reviewing your site's content or structure, technical advice on things like hosting, redirects, error pages, and JavaScript, content development, managing online business development campaigns, keyword research, SEO training, expertise in specific markets and geographies, and, updated for this era, optimizing for generative AI.

And Google repeats, once more, something we've now heard several times across this series, because apparently it needs repeating that often: advertising with Google has no effect on your organic search presence, Google never accepts payment to include or rank a site, and appearing in organic results costs nothing.

Deciding whether you need one at all.

Here's Google's honest starting position: if you run a small local business, you can probably do much of this yourself. Their recommendation is to start with the SEO Starter Guide, which we covered in episodes four and five, since it's a practical walkthrough of most of what a hired SEO would otherwise do for you. And there's a genuinely useful secondary reason to read it yourself even if you do plan to hire someone: familiarity with these techniques means you'll recognise it immediately if an SEO proposes something not recommended, or worse, actively discouraged.

If, after that, you still think you need outside help, Google walks through what to look for.

Timing matters. A particularly good moment to bring someone in is when you're considering a site redesign, ideally as early as possible, or planning a new site launch, so the site can be built search-friendly from the ground up. That said, a good SEO can absolutely still help improve an existing site that's already live.

Interview your potential SEO. Google offers a genuinely useful list of questions worth asking directly, and I'll go through them because they're worth having on hand. Can they show previous work and real success stories? Do they follow the Search Essentials we covered in episode one? What results do they expect, in what timeframe, and how do they measure success? What's their experience in your specific industry, your country or city, and with international sites if that's relevant to you? How long have they been in business? And critically: how will they communicate with you, will they share every change they make to your site along with the reasoning behind it?

There's a softer but equally telling signal Google names here too: does the SEO seem genuinely interested in your business? A good one will ask what makes your business unique, who your competitors are, and how customers currently find you. If they're not curious about any of that, Google's advice is blunt: find someone who is.

Check business references. Ask past clients directly whether the SEO was useful, easy to work with, and actually produced positive results.

If an SEO offers to run an audit, Google has a specific, practical warning: grant them only read access to Search Console at that stage, not write access. An audit should give you realistic estimates of the improvement possible and the work involved. And here's a hard line: if anyone guarantees you first place in search results, find someone else. No legitimate SEO can promise that, because ranking depends on far more than any one party controls.

Now, the newest section of this document, added in that June 2026 update: evaluating your SEO's recommendations and the tools they use. If your SEO relies on a third-party tool, Google wants you to know plainly that Google doesn't evaluate or endorse third-party SEO tools, and none of those tools have access to Google's actual internal ranking data. Be wary of any tool or service claiming to be "acceptable" or "approved" by Google Search, because no such approval process exists.

Before making significant changes based on any third-party audit or tool, Google recommends checking the recommendations against official Google guidance directly, thinking critically about the claims, and making your own informed decision rather than taking a dashboard's word for it. Three specific checks Google suggests: does the advice cite official Google documentation as support? If there's advice specifically about AEO or GEO, does it actually align with the official generative AI guidance we covered last episode? And do the tools being used align with Google's own stated guidance?

Be wary of unsolicited outreach. Google includes a genuinely funny detail here: they receive spam emails pitching SEO services too, even for google.com itself, and they quote one, something like "Dear google.com, I visited your website and noticed you are not listed in most major search engines..." Their advice: treat unsolicited SEO pitches with the same skepticism you'd apply to "burn fat overnight" diet pills, or emails asking you to help transfer funds from a deposed foreign dictator.

No one can guarantee a number one ranking. Be wary of anyone claiming a "special relationship" with Google, or advertising a "priority submit" service, since no such privileged channel exists.

Be careful of secrecy. If a company won't clearly explain what they intend to do, ask. And here's a point with real teeth: if an SEO creates deceptive or misleading content on your behalf, your site could be removed entirely from Google's index. You remain responsible for the actions of anyone you hire, so know exactly what "help" actually means in practice. If they have server access, they should willingly explain every change they make.

You should never have to link to an SEO. Avoid anyone talking about link popularity schemes or mass submission to thousands of search engines, both of which Google describes as typically useless exercises, and not in a way that would help your ranking.

Google closes this section with an important note of accountability: while most SEOs provide genuinely valuable services, some unethical operators have used overly aggressive tactics or outright violated the spam policies from episode two, which can result in your site being demoted or removed. And if you feel you were genuinely deceived by an SEO, Google points to reporting routes: the Federal Trade Commission in the United States, or econsumer dot gov for complaints against companies outside the US.

Now let's turn to the companion document: Google's guidance on third-party SEO tools, services, and advice.

This page exists specifically because of how much SEO advice now circulates online, much of it related to AEO and GEO specifically. Google's framing is direct: some of this advice is genuinely helpful, but some of it misinterprets or overstates what Google actually says or how its ranking systems actually work. Their test for credible advice is simple: does it clearly qualify itself as opinion, based on real data or experience, or does it back its claims with citations to official Google documentation? If neither, be skeptical.

Google's recommendation is straightforward: evaluate any third-party advice against the official guidance, including the generative AI guide from episode seven, and make your own informed decision rather than accepting a claim at face value.

On third-party tools and services specifically, Google names the categories directly: tools that assist with sitemap generation, tools that help establish indexing directives, services offering to generate "SEO-optimized" content for you, services promising to improve the ranking of your existing content, and tools specifically promising improvements for AI experiences under the AEO or GEO label.

Some of these, Google says plainly, may genuinely help your work. Others may claim or imply that what they do is somehow officially "acceptable" or "approved" by Google Search, and Google is explicit: it does not evaluate third-party services at all, so treat such claims, and whoever is making them, with real caution. Using any tool or service, Google adds, never guarantees a ranking improvement.

There's a subtler point worth flagging clearly, since it addresses something people genuinely get confused about. Some third-party tools present data that users mistakenly assume comes directly from Google. It doesn't. These tools cannot access Google's actual internal ranking data, full stop, no matter how their dashboard is presented. Any prediction a third-party tool makes is that tool's own opinion, and like any prediction, it won't always turn out to be right.

> ChatGPT fact check - this paragraph claims "These tools cannot access Google's actual internal ranking data, full stop, no matter how their dashboard is presented.", but the counterargument is: The wording 'It doesn't' and 'no such tool has real access to Google's internal data' can imply every third-party dashboard lacks any Google-sourced data. Google's warning concerns internal ranking data, not authorized Search Console API data. Third-party tools cannot access Google's internal ranking systems. Some can display data obtained through authorized Google APIs; distinguish those data from a tool's own estimates and predictions.
>
> Sources: Think critically about using third-party SEO tools and services; paragraph 3: https://developers.google.com/search/docs/fundamentals/third-party-seo#think-critically-about-using-third-party-seo-tools-and-services.
>
> A016 | Overstatement | Medium priority | Checked 24 September 2026



Google's own recommendation, regardless of whether you use third-party tools alongside it: use Search Console. It's the one source that gives you information and data coming directly from Google Search itself, rather than an external party's interpretation of it.

> ChatGPT fact check - this paragraph claims "Google's own recommendation, regardless of whether you use third-party tools alongside it: use Search Console.", but the counterargument is: The wording 'It doesn't' and 'no such tool has real access to Google's internal data' can imply every third-party dashboard lacks any Google-sourced data. Google's warning concerns internal ranking data, not authorized Search Console API data. Third-party tools cannot access Google's internal ranking systems. Some can display data obtained through authorized Google APIs; distinguish those data from a tool's own estimates and predictions.
>
> Sources: Think critically about using third-party SEO tools and services; paragraph 3: https://developers.google.com/search/docs/fundamentals/third-party-seo#think-critically-about-using-third-party-seo-tools-and-services.
>
> A016 | Overstatement | Medium priority | Checked 24 September 2026



Let's recap, and tie this to something concrete: for a business weighing whether to bring someone onto the FMP SEO work alongside Rushikesh and Supriya, or evaluating an outside consultant's pitch, this episode is essentially the vetting checklist. Read the Starter Guide yourself first, so you can recognise good advice from bad. If you do hire, interview thoroughly, check references, grant read-only Search Console access before write access, and never accept a guaranteed ranking. Treat unsolicited pitches with real skepticism. And for any third-party tool, dashboard, or piece of AEO or GEO advice: check it against Google's own documentation, remember that no such tool has real access to Google's internal data, and let Search Console, not a third-party score, be your actual source of truth.

> ChatGPT fact check - this paragraph claims "And for any third-party tool, dashboard, or piece of AEO or GEO advice: check it against Google's own documentation, remember that no such tool has real access to Google's internal data, and let Search Console, not a third-party score, be your actual source of truth.", but the counterargument is: The wording 'It doesn't' and 'no such tool has real access to Google's internal data' can imply every third-party dashboard lacks any Google-sourced data. Google's warning concerns internal ranking data, not authorized Search Console API data. Third-party tools cannot access Google's internal ranking systems. Some can display data obtained through authorized Google APIs; distinguish those data from a tool's own estimates and predictions.
>
> Sources: Think critically about using third-party SEO tools and services; paragraph 3: https://developers.google.com/search/docs/fundamentals/third-party-seo#think-critically-about-using-third-party-seo-tools-and-services.
>
> A016 | Overstatement | Medium priority | Checked 24 September 2026



That closes out Part One of this series: the rules, the mechanics, the Starter Guide, content quality, generative AI, and now the question of getting outside help. Next episode, we move into Part Two, crawling and indexing in depth, starting with the crawling overview, the full list of file types Google can index, URL structure best practices in detail, and how links actually need to be built to be crawlable in the first place. See you there.

This episode is adapted from "Do you need an SEO?" and "Google Search's guidance on using third-party SEO tools, services, and advice" on Google Search Central, licensed under Creative Commons Attribution 4.0.

## Part Two: Crawling and Indexing

### Episode 9: File Types, URL Structure, and Crawlable Links

Welcome to Part Two of the series, and to a new stretch of episodes on crawling and indexing in real technical depth. Today covers three foundational documents: the full list of file types Google can actually index, the precise best practices for structuring your URLs, and exactly what makes a link crawlable in the first place. This is dense, practical material, well suited to being absorbed on a walk rather than skimmed on a screen.

> ChatGPT fact check - this paragraph claims "Welcome to Part Two of the series, and to a new stretch of episodes on crawling and indexing in real technical depth.", but the counterargument is: The introduction says it gives the full indexable-file list, but the video list is explicitly shortened with 'among others'. This is a completeness issue rather than a wrong example. Either read the full supported-format list in a clearly labeled reference section, or describe this as a selection and provide the complete accessible companion list.
>
> Sources: Supported flat file types; paragraph 1: https://developers.google.com/search/docs/crawling-indexing/indexable-file-types#flat-file-types; Supported encoded file types; paragraph 1: https://developers.google.com/search/docs/crawling-indexing/indexable-file-types#encoded-file-types.
>
> A018 | Omission | Low priority | Checked 24 September 2026



Let's start with file types Google can index.

Google can index the content of most text-based files and certain encoded document formats. Here's a detail worth knowing precisely: the file type Google assigns is determined by the Content-Type HTTP header returned when the file is crawled, not simply by the file's extension. Though, Google notes, in some cases it may fall back to the extension, or re-parse the file with a different parser, if that header is missing or wrong. This matters more than it sounds: if your server mislabels a file's Content-Type, Google may misjudge what it's looking at.

Google organises supported types into three groups.

Flat file types are files where the content sits in plain, unencoded text, even if that text includes markup tags. This group includes comma-separated values, so CSV files; Google Earth's KML and KMZ formats; the GPS Exchange Format, GPX; HTML in its various extensions; Scalable Vector Graphics, SVG; TeX and LaTeX; plain text files including source code in common programming languages like Basic, C and C++, C sharp, Java, Perl, and Python; Wireless Markup Language; and XML.

Encoded file types are binary files or more complex containers that need a specific parser to pull out the readable text. This group includes Adobe's Portable Document Format, PDF; Adobe PostScript; the Electronic Publication format, EPUB; Hancom Hanword, a Korean word processor format; Microsoft Excel, PowerPoint, and Word, in both their older and newer extensions; the OpenOffice presentation, spreadsheet, and text formats; and Rich Text Format.

And Google can also index media formats directly. For images: BMP, GIF, JPEG, PNG, WebP, SVG, and AVIF. For video: a long list including 3GP, ASF, AVI, M4V, MKV, MOV, MP4, MPEG, WebM, and WMV, among others.

> ChatGPT fact check - this paragraph claims "For video: a long list including 3GP, ASF, AVI, M4V, MKV, MOV, MP4, MPEG, WebM, and WMV, among others.", but the counterargument is: The introduction says it gives the full indexable-file list, but the video list is explicitly shortened with 'among others'. This is a completeness issue rather than a wrong example. Either read the full supported-format list in a clearly labeled reference section, or describe this as a selection and provide the complete accessible companion list.
>
> Sources: Supported flat file types; paragraph 1: https://developers.google.com/search/docs/crawling-indexing/indexable-file-types#flat-file-types; Supported encoded file types; paragraph 1: https://developers.google.com/search/docs/crawling-indexing/indexable-file-types#encoded-file-types.
>
> A018 | Omission | Low priority | Checked 24 September 2026



There's a small, genuinely useful trick buried in here: you can use the filetype colon operator directly in a Google search to limit results to a specific format. Google's own example is "filetype:rtf galway", which searches specifically for RTF files and URLs ending in dot-r-t-f whose content contains the word galway. Worth knowing if you ever want to check what kind of files Google has indexed from your own site, or a competitor's, say size guide PDFs or spec sheet downloads.

Now, URL structure best practices, and this is a genuinely technical document, so let's take it carefully.

Google opens with a firm statement: to be crawled effectively, your URLs need to meet certain requirements, and if they don't, Google Search will likely crawl your site inefficiently, either at an extremely high, wasteful rate, or not at all.

There are three hard requirements.

First, follow the relevant internet standard, IETF STD 66. In practice, this means characters the standard defines as reserved must be percent encoded, a way of safely representing special characters in a URL using a percent sign followed by two characters.

Second, don't use URL fragments, the part after a hash symbol, to change what content displays. Google generally doesn't support URL fragments for this purpose. Their own example of what not to do: "example.com/#/potatoes". If you're using JavaScript to swap content dynamically, use something called the History API instead, which we'll return to in the JavaScript SEO episode.

Third, use a common, consistent encoding for URL parameters: an equals sign to separate a key from its value, and an ampersand to add further parameters. If you need to list several values under the same key, use something that won't conflict with the standard, like a comma. Google's recommended example: "example.com/category?category=dresses&sort=low-to-high&sid=789". Their example of what not to do uses colons and brackets instead, which Google's systems don't parse the same reliable way.

Beyond those hard requirements, Google lists best practices for making your URL structure genuinely easy to understand, for both search engines and actual visitors.

Use descriptive URLs, readable words rather than long ID numbers, which we already touched on in episode four. Use your audience's actual language in the URL; if your audience searches in German, German words in the URL, transliterated where needed.

Use percent encoding as necessary, specifically in the href attributes of your links. Unreserved ASCII characters can stay as they are, but anything outside the standard ASCII range should be percent encoded. Google gives several worked examples here: Arabic characters, Chinese characters, a German umlaut, and, delightfully, even an emoji, all converted into their percent-encoded form rather than left as raw non-ASCII characters in the URL.

Use hyphens to separate words, not underscores. This is a specific, deliberate recommendation, and Google explains the reasoning: hyphens help both people and search engines identify separate concepts within a URL. Underscores are discouraged for a slightly technical, almost historical reason: various programming languages already use underscores to bind words together into a single concept, like a function named format underscore date, so using them the same way in a URL risks the opposite signal. Their example: "summer-clothing/filter?color-profile=dark-grey" is recommended; "summer_clothing/filter?color_profile=dark_grey" is not, and neither is simply jamming words together with no separator at all, like "greendress".

Use as few parameters as you can. Wherever possible, trim any parameter that doesn't actually change the page's content.

Be aware that URLs are case sensitive. Google treats "/APPLE" and "/apple" as genuinely distinct URLs pointing to potentially distinct content. If your own web server treats upper and lower case the same internally, it's worth converting everything to one consistent case, so Google doesn't end up treating what is really one page as several different ones.

For multi-regional sites, Google suggests a URL structure that makes geotargeting straightforward: either a country-specific domain, like "example.de", or a country-specific subdirectory on a generic domain, like "example.com/de/". We'll go deeper on this in the international episode later in the series.

Now, common URL problems, and this section is specifically aimed at larger, filterable catalogues, so it's directly relevant to a store with thousands of SKUs.

Additive filtering is the first one Google flags. Many sites let visitors combine filters, hotels on the beach, then also with a fitness centre, and so on. When filters combine additively like this, the number of possible URLs can explode combinatorially. Google's own point is refreshingly practical: Googlebot doesn't need to see every single combination of filters as its own separate URL; it only needs enough paths to eventually reach every individual product page.

Irrelevant parameters are the second issue: referral tracking codes, sorting parameters, and session IDs, all of which can multiply the number of URLs pointing at what's functionally the same content. Google's specific advice on session IDs: avoid putting them in URLs at all, and use cookies instead. For any of these irrelevant parameters, Google suggests using a robots.txt file to block Googlebot's access to the problematic URL patterns, which we'll cover fully in episode eleven.

Calendar issues come up for any dynamically generated calendar with no limit on how far forward or backward it lets a crawler wander, potentially creating an effectively infinite space of nearly empty pages. If your site has such a calendar, add a nofollow attribute to links pointing toward future calendar pages.

Broken relative links round out the list: a parent-relative link, one written as "../../category/stuff", placed on the wrong page, combined with a server that doesn't return a proper error status for pages that don't exist, can generate an effectively infinite space of bogus, nonsensical URLs. The fix Google recommends is to use root-relative links instead of parent-relative ones.

If you ever notice Google actually crawling these kinds of problematic URLs on your own site, Google's recommendation is straightforward: block them with robots.txt, particularly anything generating search results, or filtering and ordering functions capable of infinite combinations. And if your site uses faceted navigation, the filterable category browsing many stores rely on, Google points to more specific guidance on managing exactly that kind of crawl, worth a look if your flag categories use heavy filtering by size, material, or region.

Finally, link best practices, and this is short but genuinely important, because it underlies nearly everything about how Google discovers new pages, as we covered back in episode three.

Google uses links both as a relevance signal and, critically, as the primary way it finds new pages to crawl in the first place.

Making your links crawlable. Here's the core technical rule, stated plainly: Google can generally only crawl a link if it's built as a proper HTML anchor element, an "a" tag, with an href attribute. Most other formats simply won't be parsed and extracted by Google's crawlers. Google specifically can't reliably extract a URL from an anchor element missing its href attribute, or from other elements dressed up to behave like links purely through JavaScript click handlers.

> ChatGPT fact check - this paragraph claims "Google specifically can't reliably extract a URL from an anchor element missing its href attribute, or from other elements dressed up to behave like links purely through JavaScript click handlers.", but the counterargument is: The body correctly says Google generally crawls anchor links with href attributes, but the recap says those are necessary 'to be crawled at all'. The source warns that other forms are not reliably extractable, rather than guaranteeing total impossibility. For reliable discovery, use an anchor element with a resolvable href. Google cannot reliably extract links from many JavaScript-only patterns.
>
> Sources: Make your links crawlable; paragraph 1: https://developers.google.com/search/docs/crawling-indexing/links-crawlable#crawlable-links.
>
> A017 | Overstatement | Medium priority | Checked 24 September 2026



Google gives clear side-by-side examples. What it can parse: a straightforward href pointing to a full URL, a relative path like "/products/category/shoes", or a relative path with a dot notation like "./products/category/shoes", even with an onclick handler or a class attached, as long as a real href is still present. What it generally cannot reliably parse: a router-based link attribute used by some JavaScript frameworks instead of href, a span element dressed up with an href attribute even though span isn't a link element at all, or an anchor that relies purely on an onclick handler with no real href to fall back on.

There's a second layer to this too: the URL inside that href needs to actually resolve to a real address Google's crawlers can request, something that looks like a genuine URI. A javascript colon pseudo-link, like "javascript:goTo('products')", isn't something Google can reliably resolve into an actual page request, even if it happens to work fine for a person clicking with a mouse.

Anchor text placement is the second half of this document. Anchor text, sometimes called link text, is simply the visible, clickable words of a link, and it tells both people and Google something meaningful about the destination page. The practical rule: place that descriptive text directly between the opening and closing anchor tags that Google can actually crawl, not off to the side in some other element.

And there's a specific point about internal linking worth carrying with you: people tend to think of links mainly as pointing outward, to other websites. But Google specifically encourages paying real attention to the anchor text you use for your own internal links too, the links connecting your own pages to each other, since good internal anchor text helps both visitors and Google understand your site's own content and structure, and helps every page you care about be reachable from at least one other page on your own site.

Let's recap.

Google indexes a wide range of file types, plain text formats, encoded document formats like PDF and Word, and common image and video formats, with the file type determined mainly by the server's Content-Type header. URL structure has three hard technical requirements, standard encoding, no content-changing fragments, and consistent parameter formatting, plus a set of best practices: descriptive words over IDs, your audience's own language, percent encoding for non-ASCII characters, hyphens rather than underscores, minimal parameters, and awareness that URLs are case sensitive. Watch specifically for combinatorial filter explosions, irrelevant tracking parameters, infinite calendars, and broken relative links, all of which a robots.txt file can help contain. And links need a genuine anchor tag with a working href to be crawled at all, with descriptive anchor text mattering just as much for your own internal links as for anything pointing elsewhere.

> ChatGPT fact check - this paragraph claims "And links need a genuine anchor tag with a working href to be crawled at all, with descriptive anchor text mattering just as much for your own internal links as for anything pointing elsewhere.", but the counterargument is: The body correctly says Google generally crawls anchor links with href attributes, but the recap says those are necessary 'to be crawled at all'. The source warns that other forms are not reliably extractable, rather than guaranteeing total impossibility. For reliable discovery, use an anchor element with a resolvable href. Google cannot reliably extract links from many JavaScript-only patterns.
>
> Sources: Make your links crawlable; paragraph 1: https://developers.google.com/search/docs/crawling-indexing/links-crawlable#crawlable-links.
>
> A017 | Overstatement | Medium priority | Checked 24 September 2026



Next episode, we go deep on sitemaps: what they're actually for, how to build and submit one, managing sitemap index files for larger sites, and the specialised extensions for images, news, and video. See you there.

This episode is adapted from "File types indexable by Google," "URL structure best practices for Google Search," and "Link best practices for Google" on Google Search Central, licensed under Creative Commons Attribution 4.0.

### Episode 10: Sitemaps, Sitemap Index Files, and Extensions

Welcome back. Today's subject is the sitemap: what it actually is, whether you genuinely need one, how to build it, how to manage one once your site outgrows a single file, and the specialised extensions for images, video, and news.

What a sitemap actually is.

Google's own definition: a sitemap is a file where you provide information about the pages, videos, and other files on your site, and the relationships between them. Search engines read this file to crawl your site more efficiently. It tells them which pages and files you consider important, and it can carry extra information too, like when a page was last updated, or whether alternate language versions exist.

Sitemaps can also carry type-specific details. A video entry in a sitemap can specify the running time, a content rating, and an age-appropriateness rating. An image entry can point to the exact images embedded on a page. A news entry can include the article's title and its publication date.

And a small, practical relief: if you're running a standard content management system like WordPress, Wix, or Blogger, or in your case Shopify, it's very likely your platform already generates and exposes a sitemap automatically, with nothing further required from you.

Do you actually need one?

Google's honest answer: if your site's pages are properly linked, meaning every page you consider important can be reached through some form of navigation, whether the site menu or links placed within other pages, Google can usually discover most of your site without a sitemap at all. Even so, a sitemap can meaningfully improve crawling for larger or more complex sites, or for specialised file types. And Google is careful to add the now-familiar caveat: a sitemap helps discovery, but it doesn't guarantee that everything listed in it will actually be crawled or indexed.

Google gives specific signals for when you likely do need one. If your site is large, since on bigger sites it becomes genuinely harder to guarantee every single page is linked from somewhere else, raising the odds Googlebot simply misses some of your newer pages. If your site is new and has few external links pointing to it yet, since Googlebot largely discovers new territory by following links from pages it's already crawled, and a brand new site often has very few of those yet. And if your site carries a lot of rich media, video or images, or is shown in Google News, since a sitemap lets Google take in extra structured information about exactly that kind of content.

And the signals for when you might not need one. If your site is genuinely small, which Google defines here as roughly five hundred pages or fewer, counting only the pages you actually want to appear in search results. If your site is comprehensively linked internally, meaning Googlebot can reach every important page simply by following links starting from the homepage. And if you don't have much media content or news pages you're hoping to surface in search specifically.

For a store with fourteen thousand SKUs, this question essentially answers itself: you're well past the five-hundred-page threshold Google names as the small-site cutoff, so a sitemap is squarely in the "you likely need one" category, and thankfully, Shopify handles this natively.

Choosing a sitemap format.

There are three formats Google supports, following the sitemaps protocol, and Google states plainly it has no preference among them; you should choose whichever fits your setup.

The XML sitemap is the most versatile. It's extensible, meaning it can carry that additional data about images, video, news content, and localised page versions we just described. Its advantages: it can express the most information about your URLs, and most content management systems either generate one automatically or have plenty of available plugins for it. Its downside: it can be cumbersome to work with directly, and keeping the mapping current can get complex on larger sites, or ones where URLs change frequently.

RSS, mRSS, and Atom 1.0 feeds are structurally similar to XML sitemaps, and are often the easiest to provide simply because content management systems tend to generate these feeds automatically anyway. They can also be used specifically to give Google information about your videos.

> ChatGPT fact check - this paragraph claims "RSS, mRSS, and Atom 1.0 feeds are structurally similar to XML sitemaps, and are often the easiest to provide simply because content management systems tend to generate these feeds automatically anyway.", but the counterargument is: RSS/Atom generally contain only recent URLs; sitemap index location rules have supported cross-site submission exceptions. The promised extension treatment never gives practical image/video/news requirements, including news's two-day window and 1,000-news-entry limit. Add those qualifications and short source-based extension sections. Preserve required tags and numeric limits in a companion reference, with their meaning explained aloud.
>
> Sources: RSS, mRSS, and Atom 1.0; paragraph 1: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap#rss; How to cross-submit sitemaps for multiple sites; paragraph 2: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap#cross-submit.
>
> A020 | Omission | Medium priority | Checked 24 September 2026



The text sitemap is the simplest format of all: a plain list of URLs, limited to HTML and other indexable text pages. Its strength is exactly that simplicity, easy to create and maintain, especially at scale. Its weakness is that it can't carry any of the richer, type-specific information the XML format can.

Sitemap best practices and limits.

These come directly from the underlying sitemaps protocol, and the most commonly overlooked ones concern size limits, file location, and which URLs actually belong in a sitemap.

The size limit: every format caps a single sitemap file at 50 megabytes uncompressed, or 50,000 URLs, whichever comes first. If you have more content than that, and a store this size likely does once you count every product, variant, and collection page, you need to split it into multiple sitemap files. That's exactly what a sitemap index file is for, and we'll get to that next.

> ChatGPT fact check - this paragraph claims "The size limit: every format caps a single sitemap file at 50 megabytes uncompressed, or 50,000 URLs, whichever comes first.", but the counterargument is: A 14,000-SKU catalogue does not establish that 50,000 canonical URLs will be exceeded. Google says it ignores changefreq and priority; the script says 'largely' ignores them and invents an explanation about gaming. lastmod should reflect a significant change. Split sitemaps when the actual URL or uncompressed-size limit is reached. Google ignores changefreq and priority. Supply lastmod only when it accurately reflects a significant update.
>
> Sources: Sitemap best practices; paragraph 2: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap#general-guidelines; Additional notes about XML sitemaps; list item 2: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap#additional-notes-about-xml-sitemaps; Additional notes about XML sitemaps; list item 3: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap#additional-notes-about-xml-sitemaps.
>
> A019 | Error | Medium priority | Checked 24 September 2026



File encoding and location: your sitemap file needs to be UTF-8 encoded. On location, there's a subtlety worth knowing precisely: you can host a sitemap anywhere on your site, but unless you submit it directly through Search Console, a sitemap only affects URLs beneath its own parent directory. In practice, that means a sitemap sitting at your site's root can cover the whole domain, but one placed in a subfolder is limited to URLs within that subfolder or below it, unless you tell Search Console about it explicitly.

Managing multiple sitemaps with a sitemap index file.

Once your site outgrows a single sitemap's limits, the sitemap index file is the mechanism for organising several sitemaps together, and submitting just that one index file to Google, rather than each sitemap individually, though you can still submit multiple sitemaps and index files if you specifically want to track each one's performance separately inside Search Console.

There's a location rule specific to index files: every sitemap referenced inside a sitemap index file must live in the same directory as the index file itself, or somewhere deeper in that same directory hierarchy. For example, an index file at "example.com/public/sitemap_index.xml" can only reference sitemaps in that same "public" folder or further inside it, like "public/shared/". You can submit up to 500 sitemap index files per site within your Search Console account.

> ChatGPT fact check - this paragraph claims "There's a location rule specific to index files: every sitemap referenced inside a sitemap index file must live in the same directory as the index file itself, or somewhere deeper in that same directory hierarchy.", but the counterargument is: RSS/Atom generally contain only recent URLs; sitemap index location rules have supported cross-site submission exceptions. The promised extension treatment never gives practical image/video/news requirements, including news's two-day window and 1,000-news-entry limit. Add those qualifications and short source-based extension sections. Preserve required tags and numeric limits in a companion reference, with their meaning explained aloud.
>
> Sources: RSS, mRSS, and Atom 1.0; paragraph 1: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap#rss; How to cross-submit sitemaps for multiple sites; paragraph 2: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap#cross-submit.
>
> A020 | Omission | Medium priority | Checked 24 September 2026



The structure itself uses the same underlying namespace as an ordinary sitemap. The required tags are: "sitemapindex", the root tag containing everything else; "sitemap", the parent tag for each individual sitemap listed inside the file, and the only direct child the sitemapindex tag has; and "loc", nested inside each sitemap tag, giving that sitemap's own URL location. A single index file can list up to 50,000 loc tags. There's also an optional tag worth using: "lastmod", which can mark when a given referenced sitemap was last modified, in the standard web date-time format, and this can help Google schedule its crawling of your sitemaps more intelligently.

A quick, practical note on the underlying tags inside an ordinary sitemap itself, since this comes up constantly in real implementations. Each individual URL entry uses a "loc" tag for the page's full, canonical address, and can optionally carry a "lastmod" tag showing when that specific page last changed. Two older tags, "changefreq" and "priority", still exist in the protocol, but are worth a word of caution: Google has said for years that it largely ignores both of these, since predicted change frequency and self-declared priority are easy to get wrong or game, and don't meaningfully influence crawling. If you're configuring a sitemap generator, "loc" is essential, an accurate "lastmod" is genuinely useful, and "changefreq" and "priority" are largely decorative from Google's side.

> ChatGPT fact check - this paragraph claims "Two older tags, "changefreq" and "priority", still exist in the protocol, but are worth a word of caution: Google has said for years that it largely ignores both of these, since predicted change frequency and self-declared priority are easy to get wrong or game, and don't meaningfully influence crawling.", but the counterargument is: A 14,000-SKU catalogue does not establish that 50,000 canonical URLs will be exceeded. Google says it ignores changefreq and priority; the script says 'largely' ignores them and invents an explanation about gaming. lastmod should reflect a significant change. Split sitemaps when the actual URL or uncompressed-size limit is reached. Google ignores changefreq and priority. Supply lastmod only when it accurately reflects a significant update.
>
> Sources: Sitemap best practices; paragraph 2: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap#general-guidelines; Additional notes about XML sitemaps; list item 2: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap#additional-notes-about-xml-sitemaps; Additional notes about XML sitemaps; list item 3: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap#additional-notes-about-xml-sitemaps.
>
> A019 | Error | Medium priority | Checked 24 September 2026



The specialised extensions, briefly, since each gets fuller treatment as this series continues into ecommerce and appearance episodes later on. Image sitemaps let you specify exactly which images live on a given page, helping Google discover images it might otherwise miss, particularly ones loaded in through JavaScript. Video sitemaps carry the richer metadata we mentioned earlier: running time, content rating, age-appropriateness, and more, all of which can influence how a video is represented in search results. News sitemaps are specifically for sites participating in Google News, carrying article titles and publication dates. And these extensions aren't mutually exclusive; Google's documentation covers how to combine several extensions within a single sitemap file, useful for a page that includes both meaningful images and video.

> ChatGPT fact check - this paragraph claims "And these extensions aren't mutually exclusive; Google's documentation covers how to combine several extensions within a single sitemap file, useful for a page that includes both meaningful images and video.", but the counterargument is: RSS/Atom generally contain only recent URLs; sitemap index location rules have supported cross-site submission exceptions. The promised extension treatment never gives practical image/video/news requirements, including news's two-day window and 1,000-news-entry limit. Add those qualifications and short source-based extension sections. Preserve required tags and numeric limits in a companion reference, with their meaning explained aloud.
>
> Sources: RSS, mRSS, and Atom 1.0; paragraph 1: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap#rss; How to cross-submit sitemaps for multiple sites; paragraph 2: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap#cross-submit.
>
> A020 | Omission | Medium priority | Checked 24 September 2026



Let's recap.

A sitemap is a structured file telling Google which pages you consider important, plus extra type-specific detail for images, video, and news. You likely need one once your site is large, new with few inbound links, or rich in specialised media, and a fourteen-thousand-SKU store clears that bar easily, though your platform likely handles the basics automatically. Choose XML for versatility, RSS or Atom if your CMS already produces it, or plain text for simplicity at scale, since Google has no format preference. Respect the hard limits: 50 megabytes or 50,000 URLs per file, UTF-8 encoding, and location rules that matter unless you submit directly through Search Console. Once you exceed those limits, a sitemap index file, itself capped at 50,000 referenced sitemaps, ties everything together under one submission. And within any sitemap, "loc" and "lastmod" carry real weight; "changefreq" and "priority" largely don't.

> ChatGPT fact check - this paragraph claims "And within any sitemap, "loc" and "lastmod" carry real weight; "changefreq" and "priority" largely don't.", but the counterargument is: A 14,000-SKU catalogue does not establish that 50,000 canonical URLs will be exceeded. Google says it ignores changefreq and priority; the script says 'largely' ignores them and invents an explanation about gaming. lastmod should reflect a significant change. Split sitemaps when the actual URL or uncompressed-size limit is reached. Google ignores changefreq and priority. Supply lastmod only when it accurately reflects a significant update.
>
> Sources: Sitemap best practices; paragraph 2: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap#general-guidelines; Additional notes about XML sitemaps; list item 2: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap#additional-notes-about-xml-sitemaps; Additional notes about XML sitemaps; list item 3: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap#additional-notes-about-xml-sitemaps.
>
> A019 | Error | Medium priority | Checked 24 September 2026



Next episode, we cover Googlebot itself in detail, the full list of Google's crawlers, how to verify a bot claiming to be Googlebot is genuine, how to manage and reduce crawl rate, and the fundamentals of robots.txt, the file that actually controls what any of these crawlers are allowed to touch. See you there.

This episode is adapted from "Learn about sitemaps" and "Manage sitemaps with sitemap index file" on Google Search Central, licensed under Creative Commons Attribution 4.0.

### Episode 11: Googlebot, Crawl Management, and the Basics of robots.txt

Welcome back. Today we get properly acquainted with Googlebot itself, cover how to manage its crawl behaviour, and open the door on robots.txt, the file that actually governs where any of Google's crawlers are permitted to go. We'll do a full episode on the robots.txt specification later; today is the introduction.

> ChatGPT fact check - this paragraph claims "Today we get properly acquainted with Googlebot itself, cover how to manage its crawl behaviour, and open the door on robots.txt, the file that actually governs where any of Google's crawlers are permitted to go.", but the counterargument is: The opening says robots.txt governs any Google crawler, but not all Google fetchers obey it. The promised later specification episode does not exist. Wildcards, end anchors, equal-specificity Allow precedence, scope by host/protocol/port, limits, and error-handling details are missing. Distinguish common crawlers, special-case crawlers, and user-triggered fetchers. Add the robots.txt reference chapter or remove the promise and label this chapter introductory.
>
> Sources: Overview of Google crawlers and fetchers (user agents); table row 1: https://developers.google.com/crawling/docs/crawlers-fetchers/overview-google-crawlers#overview-of-google-crawlers-and-fetchers-user-agents; Overview of Google crawlers and fetchers (user agents); table row 2: https://developers.google.com/crawling/docs/crawlers-fetchers/overview-google-crawlers#overview-of-google-crawlers-and-fetchers-user-agents; Overview of Google crawlers and fetchers (user agents); table row 3: https://developers.google.com/crawling/docs/crawlers-fetchers/overview-google-crawlers#overview-of-google-crawlers-and-fetchers-user-agents.
>
> A023 | Omission | Medium priority | Checked 24 September 2026



What Googlebot actually is.

Google is precise about this, and it's worth being precise too: "Googlebot" isn't one single program. It's the generic name for two distinct crawler types. Googlebot Smartphone is a mobile crawler simulating a user on a mobile device. Googlebot Desktop simulates a desktop user. You can tell which one made a given request by checking the user-agent header on that request. But here's a detail that trips people up: both crawler types respond to exactly the same product token in robots.txt. That means you cannot write a rule in robots.txt that selectively targets only the smartphone crawler or only the desktop one; robots.txt sees them as one and the same "Googlebot".

And on which one matters more: for most sites, Google primarily indexes the mobile version of your content, a policy called mobile-first indexing, which we'll cover in full in episode thirteen. As a direct result, the large majority of Googlebot's actual crawl requests to your site come from the mobile crawler, with only a minority from the desktop one.

How Googlebot accesses your site.

For most sites, Googlebot shouldn't hit your server more than roughly once every few seconds on average, though Google notes that due to normal delays, the rate can briefly appear a bit higher over short windows. If your server is genuinely struggling to keep up with Google's requests, there's a documented way to reduce the crawl rate, which we'll touch on shortly.

There's a specific, concrete limit worth knowing if your pages or files run large: Googlebot crawls the first 2 megabytes of any supported file type, and, as a special case, the first 64 megabytes of a PDF file. From a rendering standpoint, each resource referenced inside your HTML, your CSS files, your JavaScript files, gets fetched as its own separate request, and each of those individual fetches is bound by that same 2 megabyte limit, PDFs aside. Once that cutoff is hit, Googlebot simply stops downloading and only considers whatever portion it managed to fetch for indexing. And this limit applies to the uncompressed size of the data, not the compressed transfer size. Other specialised Google crawlers, like the ones handling video or images specifically, may have entirely different limits of their own.

One small, oddly specific fact worth knowing: when Googlebot crawls from IP addresses located in the US, its internal clock runs on Pacific Time.

Blocking Googlebot from visiting your site.

Google makes an important, almost philosophical point here first: Googlebot mostly discovers new URLs by following links embedded in pages it's already crawled, and because of that, it's nearly impossible to keep any page genuinely secret simply by never linking to it publicly. Their own example: the moment anyone clicks a link from your "secret" page out to some other site, your secret URL can end up recorded in that other site's referrer logs, and potentially published there.

Now, Google draws the crawling-versus-indexing distinction one more time, because it's genuinely the single most important idea in this entire stretch of episodes, and having three concrete tool recommendations attached to it makes it stick. If you want to prevent Googlebot from crawling a page at all, use a robots.txt file. If you're fine with Googlebot crawling the page, but you don't want it indexed and shown in search results, use noindex instead, which requires that crawling be allowed, as we covered back in episode one. And if you want a page to be genuinely inaccessible to both crawlers and human visitors alike, robots.txt and noindex aren't the right tools at all; you need something like password protection instead.

And a detail worth remembering for the scope of what blocking Googlebot actually affects: it isn't limited to the ordinary blue-link search results. Blocking Googlebot also affects Discover, every other Google Search feature, and separate Google products like Google Images, Google Video, and Google News.

Verifying Googlebot is genuinely Googlebot.

Before you ever decide to block something claiming to be Googlebot, Google issues a direct warning: the Googlebot user-agent string is frequently spoofed by other, unrelated crawlers, some with far less benign intentions. So if you're looking at server logs and trying to decide whether a problematic burst of traffic genuinely came from Google, don't trust the user-agent string alone. The reliable way to verify it is either a reverse DNS lookup on the source IP address of the request, or matching that source IP against Google's published list of Googlebot IP ranges. Both methods are documented in Google's verification guide, and either is worth running before you take any action against traffic you suspect might actually be Google.

> ChatGPT fact check - this paragraph claims "The reliable way to verify it is either a reverse DNS lookup on the source IP address of the request, or matching that source IP against Google's published list of Googlebot IP ranges.", but the counterargument is: The narration presents a reverse lookup as sufficient verification. Google's detailed procedure also checks the returned hostname's domain and performs a forward lookup to confirm it resolves back to the original IP. This qualification also affects Episode 22's reliance on the earlier procedure. Verify the hostname returned by reverse DNS, then resolve that hostname forward and confirm the original IP. Alternatively, match the request against the appropriate published Google IP ranges.
>
> Sources: Use command line tools; list item 3: https://developers.google.com/crawling/docs/crawlers-fetchers/verify-google-requests#manual; Use command line tools; list item 4: https://developers.google.com/crawling/docs/crawlers-fetchers/verify-google-requests#manual.
>
> A021 | Omission | High priority | Checked 24 September 2026



Now, a word on the wider crawler family, since Googlebot is just one member of it. Google operates several other named crawlers for specific purposes, things like Googlebot Image, Googlebot Video, Googlebot News, and Google's AdSense-related crawler, sometimes called Mediabot, which behaves quite differently from the others: rather than discovering pages by following links, it specifically only visits URLs that already contain AdSense code. Each of these specialised crawlers can, in principle, be addressed separately in robots.txt using its own distinct user-agent token, unlike the Googlebot Smartphone and Desktop pairing we discussed earlier, which always share one token.

> ChatGPT fact check - this paragraph claims "Google operates several other named crawlers for specific purposes, things like Googlebot Image, Googlebot Video, Googlebot News, and Google's AdSense-related crawler, sometimes called Mediabot, which behaves quite differently from the others: rather than discovering pages by following links, it specifically only visits URLs that already contain AdSense code.", but the counterargument is: The opening says robots.txt governs any Google crawler, but not all Google fetchers obey it. The promised later specification episode does not exist. Wildcards, end anchors, equal-specificity Allow precedence, scope by host/protocol/port, limits, and error-handling details are missing. Distinguish common crawlers, special-case crawlers, and user-triggered fetchers. Add the robots.txt reference chapter or remove the promise and label this chapter introductory.
>
> Sources: Overview of Google crawlers and fetchers (user agents); table row 1: https://developers.google.com/crawling/docs/crawlers-fetchers/overview-google-crawlers#overview-of-google-crawlers-and-fetchers-user-agents; Overview of Google crawlers and fetchers (user agents); table row 2: https://developers.google.com/crawling/docs/crawlers-fetchers/overview-google-crawlers#overview-of-google-crawlers-and-fetchers-user-agents; Overview of Google crawlers and fetchers (user agents); table row 3: https://developers.google.com/crawling/docs/crawlers-fetchers/overview-google-crawlers#overview-of-google-crawlers-and-fetchers-user-agents.
>
> A023 | Omission | Medium priority | Checked 24 September 2026



Now, the introduction to robots.txt itself.

A robots.txt file is a simple, plain-text file that tells crawlers which parts of your site they're permitted to access. It needs to live at one specific, predictable location: the root of your domain, so something like "example.com/robots.txt", nowhere else. If it's placed inside a subfolder instead, crawlers simply won't find it there.

The file is built from groups, and each group starts with one or more "User-agent" lines, naming which crawler or crawlers the following rules apply to, followed by the rules themselves. An asterisk as the user-agent value means "every crawler that doesn't have its own more specific group elsewhere in the file." The two core rules are "Disallow", marking a directory or page you don't want that crawler accessing, and "Allow", which can carve out a specific exception within a broader disallowed area. There's also an optional "Sitemap" line, which can point crawlers directly to your sitemap's location, tying this episode neatly back to episode ten.

Here's a simple, complete example, close to one Google itself uses to illustrate the format. Picture three lines: "User-agent: Googlebot", then "Disallow: /nogooglebot/", followed by a blank line, then "User-agent: *", "Allow: /", and finally a "Sitemap:" line pointing at your sitemap's URL. Read in plain English, that says: the crawler specifically named Googlebot may not access anything beginning with "/nogooglebot/". Every other crawler is explicitly allowed to access the entire site, though Google notes this particular line is actually redundant, since allowing everything is already the default behaviour when nothing says otherwise. And the sitemap for this site lives at the URL given on that final line.

A handful of practical rules worth carrying with you, since they come up constantly in real implementations, even though we're saving the full specification for a later episode. Paths are case sensitive, so a rule disallowing "/Private/" does nothing at all to block "/private/". When a URL happens to match both an Allow rule and a Disallow rule at once, the more specific, longer matching path wins. And the file's HTTP status matters more than people expect: a robots.txt file returning a 404 is treated by Google as though no restrictions exist at all, essentially an all-clear, while a server error in the 500 range can cause Google to pause crawling entirely for a while, since it genuinely can't tell whether your rules are simply temporarily unavailable or deliberately, urgently restrictive.

> ChatGPT fact check - this paragraph claims "And the file's HTTP status matters more than people expect: a robots.txt file returning a 404 is treated by Google as though no restrictions exist at all, essentially an all-clear, while a server error in the 500 range can cause Google to pause crawling entirely for a while, since it genuinely can't tell whether your rules are simply temporarily unavailable or deliberately, urgently restrictive.", but the counterargument is: The opening says robots.txt governs any Google crawler, but not all Google fetchers obey it. The promised later specification episode does not exist. Wildcards, end anchors, equal-specificity Allow precedence, scope by host/protocol/port, limits, and error-handling details are missing. Distinguish common crawlers, special-case crawlers, and user-triggered fetchers. Add the robots.txt reference chapter or remove the promise and label this chapter introductory.
>
> Sources: Overview of Google crawlers and fetchers (user agents); table row 1: https://developers.google.com/crawling/docs/crawlers-fetchers/overview-google-crawlers#overview-of-google-crawlers-and-fetchers-user-agents; Overview of Google crawlers and fetchers (user agents); table row 2: https://developers.google.com/crawling/docs/crawlers-fetchers/overview-google-crawlers#overview-of-google-crawlers-and-fetchers-user-agents; Overview of Google crawlers and fetchers (user agents); table row 3: https://developers.google.com/crawling/docs/crawlers-fetchers/overview-google-crawlers#overview-of-google-crawlers-and-fetchers-user-agents.
>
> A023 | Omission | Medium priority | Checked 24 September 2026



One more small thing worth flagging precisely, since it's a common point of confusion: there's an older, informal directive called "Crawl-delay", meant to specify a pause between requests. Googlebot ignores it entirely. If your server genuinely needs Google to slow down, the correct route is the documented crawl-rate reduction process in Search Console, not this directive.

> ChatGPT fact check - this paragraph claims "If your server genuinely needs Google to slow down, the correct route is the documented crawl-rate reduction process in Search Console, not this directive.", but the counterargument is: The source currently documents temporary error responses in emergencies and an exceptional request route, not the retired Search Console crawl-rate limiter. Calling the solution 'the ... process in Search Console' is ambiguous and unhelpful. Google ignores Crawl-delay. Refer to the current Reduce crawl rate guide: short-term server responses in genuine overload emergencies, or an exceptional request when those responses are infeasible. Explain the short duration and indexing risks.
>
> Sources: Urgently reduce crawler traffic (for emergencies); paragraph 1: https://developers.google.com/crawling/docs/crawlers-fetchers/reduce-crawl-rate#urgently-reduce-crawler-traffic-for-emergencies; Exceptional requests to reduce crawl rate; paragraph 1: https://developers.google.com/crawling/docs/crawlers-fetchers/reduce-crawl-rate#exceptional-requests-to-reduce-crawl-rate.
>
> A022 | Outdated | Medium priority | Checked 24 September 2026



Let's recap.

Googlebot is really two crawlers sharing one name and one robots.txt token, mobile and desktop, with mobile now doing the large majority of the actual crawling. It respects roughly one request every few seconds per site, caps individual file fetches at 2 megabytes, or 64 for a PDF, and runs on Pacific Time when crawling from US addresses. You can't truly keep a page secret just by not linking to it. Robots.txt controls crawling, noindex controls indexing, and password protection is the only real way to block both crawlers and people at once. Always verify a suspicious "Googlebot" request through reverse DNS or Google's published IP ranges before trusting the user-agent string alone. And a robots.txt file lives only at your domain's root, is built from User-agent, Disallow, Allow, and an optional Sitemap line, is case sensitive, resolves conflicts by matching the most specific path, and is read very differently depending on whether it returns a 404 or a 500 error.

> ChatGPT fact check - this paragraph claims "Always verify a suspicious "Googlebot" request through reverse DNS or Google's published IP ranges before trusting the user-agent string alone.", but the counterargument is: The narration presents a reverse lookup as sufficient verification. Google's detailed procedure also checks the returned hostname's domain and performs a forward lookup to confirm it resolves back to the original IP. This qualification also affects Episode 22's reliance on the earlier procedure. Verify the hostname returned by reverse DNS, then resolve that hostname forward and confirm the original IP. Alternatively, match the request against the appropriate published Google IP ranges.
>
> Sources: Use command line tools; list item 3: https://developers.google.com/crawling/docs/crawlers-fetchers/verify-google-requests#manual; Use command line tools; list item 4: https://developers.google.com/crawling/docs/crawlers-fetchers/verify-google-requests#manual.
>
> A021 | Omission | High priority | Checked 24 September 2026



> ChatGPT fact check - this paragraph claims "And a robots.txt file lives only at your domain's root, is built from User-agent, Disallow, Allow, and an optional Sitemap line, is case sensitive, resolves conflicts by matching the most specific path, and is read very differently depending on whether it returns a 404 or a 500 error.", but the counterargument is: The opening says robots.txt governs any Google crawler, but not all Google fetchers obey it. The promised later specification episode does not exist. Wildcards, end anchors, equal-specificity Allow precedence, scope by host/protocol/port, limits, and error-handling details are missing. Distinguish common crawlers, special-case crawlers, and user-triggered fetchers. Add the robots.txt reference chapter or remove the promise and label this chapter introductory.
>
> Sources: Overview of Google crawlers and fetchers (user agents); table row 1: https://developers.google.com/crawling/docs/crawlers-fetchers/overview-google-crawlers#overview-of-google-crawlers-and-fetchers-user-agents; Overview of Google crawlers and fetchers (user agents); table row 2: https://developers.google.com/crawling/docs/crawlers-fetchers/overview-google-crawlers#overview-of-google-crawlers-and-fetchers-user-agents; Overview of Google crawlers and fetchers (user agents); table row 3: https://developers.google.com/crawling/docs/crawlers-fetchers/overview-google-crawlers#overview-of-google-crawlers-and-fetchers-user-agents.
>
> A023 | Omission | Medium priority | Checked 24 September 2026



Next episode, we go deep on canonicalization: what counts as duplicate content in Google's eyes, exactly how to specify a canonical URL using rel canonical and the other methods available, and how to diagnose and fix canonicalization problems when Google picks a different canonical page than the one you intended. See you there.

This episode is adapted from "Googlebot" and "Introduction to robots.txt" on Google Search Central, licensed under Creative Commons Attribution 4.0.

### Episode 12: Canonicalization: Duplicate Content and How to Manage It

Welcome back. Today's subject came up as a promise back in episode three, when we described how Google groups similar pages into clusters during indexing and picks one representative version. Today we unpack exactly how that process works, why duplicate content isn't inherently a violation, and the specific tools you have for guiding Google's choice, current as of an August 2026 update to this documentation, so this is genuinely fresh material.

What canonicalization actually is.

Google's definition: canonicalization is the process of selecting the representative, or "canonical", URL for a piece of content. The canonical URL is simply the page Google chose as the most representative one from a set of duplicates. This whole process is often called deduplication, and its purpose is straightforward: show searchers only one version of content that otherwise exists at several different addresses.

Why does duplicate content happen at all? Google lists several entirely ordinary, non-malicious reasons. Region variants: separate USA and UK URLs, tied together with something called hreflang, carrying essentially the same content in the same language. Device variants: a page existing in both a mobile and a desktop version. Protocol variants: the HTTP and HTTPS versions of the same site. Site functions: the various sorted and filtered views of a single category page, which we already touched on back in episode nine's discussion of additive filtering. And accidental variants: something like a staging or demo version of a site that got left accidentally accessible to crawlers.

Here's the reassuring headline: Google states plainly that some duplicate content on a site is entirely normal, and it is not a violation of the spam policies from episode two. But it does carry real costs even so. It can create a confusing user experience, since people might genuinely wonder which version is the "right" one, and whether there's any meaningful difference between them. And it can make it genuinely harder for you to track how a single piece of content is performing, since its traffic and signals may be split across several different URLs instead of consolidating in one place.

How Google actually chooses the canonical URL.

When Google indexes a page, it works out what it calls the primary content, or the "centerpiece", of that page. When it finds multiple pages whose primary content is the same, or extremely similar, it clusters them together into one group. From within that cluster, Google picks whichever page is, based on the signals it collected during indexing, objectively the most complete and useful one for a searcher, and marks that as canonical.

There's a practical, crawl-efficiency consequence to this choice worth knowing: the canonical page gets crawled most regularly, while its duplicates are crawled less often, specifically to reduce the crawling burden placed on your site.

What are those signals, specifically? Google names a handful of factors that play into canonicalization: whether a page is served over HTTP or HTTPS, redirects pointing toward or away from it, whether the URL is present in your sitemap, and rel canonical link annotations. And here's the single most important sentence in this whole document, worth sitting with directly: indicating a canonical preference through any of these methods is a hint, not a rule. Google may still choose a different page as canonical than the one you intended, for various reasons of its own.

There's a specific and useful clarification about multilingual duplicate content, since it resolves a common point of confusion. Different language versions of a page only count as duplicates of each other if the primary content itself is in the same language. If only the header, footer, and other secondary, non-critical text got translated while the actual body content remains the same, untranslated language, those pages are still treated as duplicates of one another. But for genuine regional variants in one shared language, say American and British English versions of the same page at different URLs, Google's recommendation is to use both canonicalization and hreflang together, to help it understand which regional version to actually show a given searcher. We'll cover hreflang properly in the international episode later in the series.

One more genuinely practical point: Google uses whichever page it picked as canonical as the main source for evaluating a piece of content's overall quality. And a search result will typically point to that canonical page, unless one of its duplicates happens to be explicitly better suited to a particular searcher's context. Google's own example nails this precisely: if someone is searching from a mobile device, the result will probably point to the mobile version of the page, even if the desktop version is technically the one marked canonical.

Now let's turn to the companion document: how to actually specify your canonical preference.

Google lists three methods, ranked here in order of how strongly each one can actually influence the outcome.

Redirects are the strongest signal of all. A redirect tells Googlebot directly that the destination of the redirect should become canonical, essentially eliminating the source URL from consideration entirely. This is the right tool specifically when you're retiring a duplicate page altogether, not when you still want both versions to remain separately accessible.

> ChatGPT fact check - this paragraph claims "A redirect tells Googlebot directly that the destination of the redirect should become canonical, essentially eliminating the source URL from consideration entirely.", but the counterargument is: The chapter first correctly explains hints, then says redirects eliminate a source from consideration and self-canonicals remove ambiguity. Those statements overpromise and also do not distinguish temporary redirects. Permanent redirects and consistent canonical annotations are strong signals, not guarantees. Use redirects for genuine moves; evaluate variants separately rather than applying a blanket rule to every product URL.
>
> Sources: How to specify a canonical URL with rel="canonical" and other methods; list item 1: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls#how-to-specify-a-canonical-url-with-rel=canonical-and-other-methods; How to specify a canonical URL with rel="canonical" and other methods; list item 2: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls#how-to-specify-a-canonical-url-with-rel=canonical-and-other-methods; How to specify a canonical URL with rel="canonical" and other methods; list item 3: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls#how-to-specify-a-canonical-url-with-rel=canonical-and-other-methods.
>
> A024 | Overstatement | Medium priority | Checked 24 September 2026



Rel canonical link annotations are also a strong signal. This is the classic method: a link element, with a rel attribute set to "canonical", placed in a page's head section, pointing to whichever URL you consider the preferred version. Unlike a redirect, this lets the duplicate page keep existing and remain separately accessible, while still asking Google to consolidate its signals onto the URL you named.

Sitemap inclusion is the weakest of the three signals. Simply including a URL in your sitemap is a comparatively gentle hint that helps that URL become the canonical one, but it carries far less weight on its own than the other two methods.

Here's a detail worth remembering, because it changes how you should actually use these tools in practice: these three methods can stack, and stacking them makes them more effective together. Using two or more of them in agreement meaningfully increases the odds that your preferred URL is the one Google actually settles on.

And Google adds a genuinely relaxed closing note: while these methods are encouraged, none of them are strictly required. Your site will very likely function fine even without explicitly specifying any canonical preference at all, since Google's own automatic clustering process handles most cases reasonably well on its own.

Why would you actually bother specifying a canonical, then, given that reassurance? Google names a few concrete reasons. To consolidate ranking signals cleanly onto a single URL, rather than having them scattered thinly across several near-identical pages. To simplify your own metrics tracking, since a variety of URLs for one underlying piece of content makes it genuinely harder to see consolidated performance data for that content. And to avoid wasting Googlebot's crawling time on duplicates, since you'd generally rather it spend its attention crawling genuinely new or updated pages on your site than repeatedly re-crawling several versions of the same thing.

Best practices, and these are worth remembering precisely, because they're exactly the kind of mistake that's easy to make with good intentions.

> ChatGPT fact check - this paragraph claims "Best practices, and these are worth remembering precisely, because they're exactly the kind of mistake that's easy to make with good intentions.", but the counterargument is: There is no explanation of HTTP-header canonicals for non-HTML files, same-language canonical guidance with hreflang, the warning against noindex for choosing canonicals, or the promised troubleshooting process. Add these sections, including URL Inspection checks for Google's selected canonical and common conflicting or injected canonical signals.
>
> Sources: Best practices; list item 6: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls#best-practices.
>
> A025 | Omission | Medium priority | Checked 24 September 2026



Don't use robots.txt for canonicalization purposes. Robots.txt blocks crawling entirely; it doesn't tell Google which of several pages is preferred, and blocking a duplicate outright can actually prevent Google from ever seeing the canonical signals on that page in the first place.

> ChatGPT fact check - this paragraph claims "Robots.txt blocks crawling entirely; it doesn't tell Google which of several pages is preferred, and blocking a duplicate outright can actually prevent Google from ever seeing the canonical signals on that page in the first place.", but the counterargument is: There is no explanation of HTTP-header canonicals for non-HTML files, same-language canonical guidance with hreflang, the warning against noindex for choosing canonicals, or the promised troubleshooting process. Add these sections, including URL Inspection checks for Google's selected canonical and common conflicting or injected canonical signals.
>
> Sources: Best practices; list item 6: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls#best-practices.
>
> A025 | Omission | Medium priority | Checked 24 September 2026



Don't use the URL removal tool for canonicalization either. That tool is built to hide every version of a URL from search entirely, which is a much blunter, more drastic action than simply expressing a preference between duplicates.

> ChatGPT fact check - this paragraph claims "Don't use the URL removal tool for canonicalization either.", but the counterargument is: There is no explanation of HTTP-header canonicals for non-HTML files, same-language canonical guidance with hreflang, the warning against noindex for choosing canonicals, or the promised troubleshooting process. Add these sections, including URL Inspection checks for Google's selected canonical and common conflicting or injected canonical signals.
>
> Sources: Best practices; list item 6: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls#best-practices.
>
> A025 | Omission | Medium priority | Checked 24 September 2026



And critically: don't specify different, conflicting canonical URLs for the same page using different techniques. Don't name one URL as canonical in your sitemap while a completely different URL is named through your rel canonical tag for that same page. Mixed, contradictory signals like this genuinely confuse Google's clustering process, and can lead to it making a choice you didn't actually want at all, in either direction.

> ChatGPT fact check - this paragraph claims "And critically: don't specify different, conflicting canonical URLs for the same page using different techniques.", but the counterargument is: There is no explanation of HTTP-header canonicals for non-HTML files, same-language canonical guidance with hreflang, the warning against noindex for choosing canonicals, or the promised troubleshooting process. Add these sections, including URL Inspection checks for Google's selected canonical and common conflicting or injected canonical signals.
>
> Sources: Best practices; list item 6: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls#best-practices.
>
> A025 | Omission | Medium priority | Checked 24 September 2026



Let's ground all of this directly in a fourteen-thousand-SKU catalogue, since this episode is arguably one of the most operationally relevant in the whole series for a store this size. Product variant pages, the same flag design in different sizes or materials, filtered and sorted category views, and any staging or preview environment that's accidentally left crawlable are all textbook cases of the "site functions" and "accidental variants" categories Google names at the top of this episode. The practical playbook: use a self-referencing rel canonical tag on every real product page, so the page names itself as canonical, removing any ambiguity for tracking-parameter or session-based variants of its own URL. For genuinely retired or merged product pages, use a redirect rather than a canonical tag, since you're not trying to keep both versions alive. And make sure your sitemap only lists the URLs you actually want treated as canonical, so that signal agrees with, rather than contradicts, whatever your canonical tags are already saying.

> ChatGPT fact check - this paragraph claims "The practical playbook: use a self-referencing rel canonical tag on every real product page, so the page names itself as canonical, removing any ambiguity for tracking-parameter or session-based variants of its own URL.", but the counterargument is: The chapter first correctly explains hints, then says redirects eliminate a source from consideration and self-canonicals remove ambiguity. Those statements overpromise and also do not distinguish temporary redirects. Permanent redirects and consistent canonical annotations are strong signals, not guarantees. Use redirects for genuine moves; evaluate variants separately rather than applying a blanket rule to every product URL.
>
> Sources: How to specify a canonical URL with rel="canonical" and other methods; list item 1: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls#how-to-specify-a-canonical-url-with-rel=canonical-and-other-methods; How to specify a canonical URL with rel="canonical" and other methods; list item 2: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls#how-to-specify-a-canonical-url-with-rel=canonical-and-other-methods; How to specify a canonical URL with rel="canonical" and other methods; list item 3: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls#how-to-specify-a-canonical-url-with-rel=canonical-and-other-methods.
>
> A024 | Overstatement | Medium priority | Checked 24 September 2026



Let's recap.

Canonicalization is Google's process for picking one representative URL from a cluster of duplicate or near-duplicate pages. Duplicate content is normal, not a spam violation, but it can confuse users and fragment your own performance tracking. Google's canonical choice is driven by HTTP versus HTTPS, redirects, sitemap presence, and rel canonical annotations, but your preference through any of these is always a hint Google can override, never a binding rule. Redirects are the strongest signal, rel canonical is also strong, and sitemap inclusion is comparatively weak, though combining them stacks their effectiveness. And whatever you do, never let robots.txt or the URL removal tool stand in for genuine canonicalization, and never send contradictory signals about the same page across different methods.

> ChatGPT fact check - this paragraph claims "Google's canonical choice is driven by HTTP versus HTTPS, redirects, sitemap presence, and rel canonical annotations, but your preference through any of these is always a hint Google can override, never a binding rule.", but the counterargument is: The chapter first correctly explains hints, then says redirects eliminate a source from consideration and self-canonicals remove ambiguity. Those statements overpromise and also do not distinguish temporary redirects. Permanent redirects and consistent canonical annotations are strong signals, not guarantees. Use redirects for genuine moves; evaluate variants separately rather than applying a blanket rule to every product URL.
>
> Sources: How to specify a canonical URL with rel="canonical" and other methods; list item 1: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls#how-to-specify-a-canonical-url-with-rel=canonical-and-other-methods; How to specify a canonical URL with rel="canonical" and other methods; list item 2: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls#how-to-specify-a-canonical-url-with-rel=canonical-and-other-methods; How to specify a canonical URL with rel="canonical" and other methods; list item 3: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls#how-to-specify-a-canonical-url-with-rel=canonical-and-other-methods.
>
> A024 | Overstatement | Medium priority | Checked 24 September 2026



Next episode, we move into mobile-first indexing and AMP: why Google primarily indexes the mobile version of your content today, what that actually requires of your site, and the current, narrower place AMP still occupies in the ecosystem. See you there.

This episode is adapted from "What is canonicalization" and "How to specify a canonical URL with rel=canonical and other methods" on Google Search Central, licensed under Creative Commons Attribution 4.0.

### Episode 13: Mobile-First Indexing, and What's Left of AMP

Welcome back. Today covers two related subjects: mobile-first indexing, which is how Google actually looks at your site today, and AMP, a technology that used to be central to mobile SEO and has quietly become something much narrower. We'll spend most of this episode on mobile-first indexing, since it applies to every site, including one built on Shopify, and finish with a shorter, current update on AMP.

What mobile-first indexing actually means.

Google's definition, stated plainly: Google uses the mobile version of a site's content, crawled with the smartphone crawler we met back in episode eleven, for both indexing and ranking. That's the whole idea in one sentence. It's not that mobile results and desktop results differ; there's one single index, and for most sites today, that single index is built from what the mobile crawler sees, not the desktop crawler.

Google adds an important nuance: having a mobile version of your pages isn't technically required to appear in search results, but it's very strongly recommended. And this whole set of best practices applies to mobile sites generally, not only as a special mobile-first indexing checklist.

The three ways a site can actually be mobile-friendly.

Responsive design serves identical HTML at the identical URL regardless of the visitor's device, and simply adjusts how that content displays based on screen size. Google states this preference directly: it recommends responsive design specifically because it's the easiest pattern to implement and maintain. If you're running a modern Shopify theme, this is almost certainly what you already have.

Dynamic serving uses the same URL for every device too, but relies on reading the visitor's user-agent and a "Vary: user-agent" HTTP response header to actually send different HTML to different devices behind the scenes.

Separate URLs, sometimes called an "m-dot" setup, serves genuinely different HTML at genuinely different URLs for each device type, again using user-agent detection to redirect visitors to the appropriate version.

Here's a detail worth knowing precisely: everything about differing content between mobile and desktop only applies to the second and third configurations. With true responsive design, the content and metadata are identical on both, so most of this episode's guidance is automatically satisfied.

Making sure Google can actually access and render your mobile content.

Use the same robots meta tags on mobile and desktop. If your mobile version carries a different tag, especially noindex or nofollow, Google may simply fail to crawl or index that page once your site is running under mobile-first indexing.

Don't lazy-load your primary content behind a user interaction. Google won't load content that only appears after someone swipes, clicks, or types; if your primary content depends on that kind of interaction, Google may never see it at all. We already flagged lazy-loading briefly, and it gets a full technical treatment in the JavaScript episode later in this series.

Let Google crawl your resources. If mobile-specific resources sit at different URLs than their desktop counterparts, make sure those mobile URLs aren't accidentally caught by a disallow rule in robots.txt.

Making sure the actual content matches between desktop and mobile.

This is the section with the most direct consequence attached, so it's worth hearing precisely. Even with functionally equivalent content, differences in the underlying page structure between mobile and desktop can lead Google to understand that content differently. Since indexing now comes from the mobile version, if your mobile site simply contains less content than your desktop site, Google recommends updating the mobile version so its primary content is genuinely equivalent, not necessarily identical in layout, just equivalent in substance. You're free to use a different design on mobile to make better use of limited space, moving content into accordions or tabs, for instance, as long as the underlying content itself remains the same.

And here's the direct consequence Google states without softening it: if it's actually your intention for the mobile page to carry less content than the desktop page, expect some traffic loss once mobile-first indexing applies, simply because Google now has less information available from your page than it once did. Their suggested alternative, rather than removing content outright: move it into accordions or tabs to save visual space while keeping it present in the page.

Structured data, metadata, and ads need the same parity treatment. Structured data should be present identically on both versions; if you have to prioritise which types to add first on mobile, Google specifically names Breadcrumb, Product, and VideoObject as the ones to prioritise, which lines up neatly with a product-driven store. Title elements and meta descriptions should match across both versions too. And on ads specifically: don't let them harm your mobile ranking, and follow the Better Ads Standard, since ads occupying too much space at the top of a small mobile screen create a genuinely poor user experience.

Images and video need real parity too, and this section carries a specific, practical warning worth remembering. Provide genuinely high-quality images, not undersized or low-resolution ones, on mobile. Use a properly supported image format. Avoid image URLs that change on every single page load, since Google can't properly index a moving target. Match your alt text exactly between mobile and desktop. And here's the warning: if your site uses different image URLs on mobile than on desktop, you may see a temporary drop in image search traffic during the transition to mobile-first indexing, simply because those mobile image URLs are new to Google's index and need time to accumulate their own search history. The straightforward fix, if you want to avoid that dip entirely: use the exact same image URLs across both versions of your site.

The same logic applies to video: avoid constantly-changing URLs, use a properly supported format and tag, match structured data between versions, and place the video somewhere easy to find on a mobile screen, since Google notes that excessive scrolling to reach a video can actually harm that video's own ranking.

Additional practices specific to a separate-URLs, or "m-dot", setup.

If you're running genuinely separate mobile URLs rather than responsive design, several extra rules apply, and getting any of these wrong can mean entire pages simply go missing from the index.

Match error page status between desktop and mobile exactly; if a desktop page serves normal content but its mobile counterpart returns an error page, that page vanishes from the index. Avoid URL fragments, the part of a URL starting with a hash symbol, on your mobile version, since fragment-based URLs generally aren't indexable at all. Make sure every desktop page that serves distinct content has a genuinely equivalent mobile page; if several different desktop URLs all redirect down to one single mobile homepage, all of those pages disappear from the index together. Verify both versions of your site separately in Search Console, since you'll want visibility into data and messages for each. If you use hreflang for international targeting, keep mobile and desktop hreflang links pointed at their own matching version, never crossing between them. Make sure your mobile infrastructure has the server capacity to handle an increased crawl rate. Verify your robots.txt rules behave as intended on both versions, generally using the same rules for both. And use rel canonical and rel alternate correctly between the two: for a separate-URLs setup specifically, the desktop URL is always the canonical one, with the mobile version marked as its alternate, which is a subtly different pattern from the general canonicalization principles in episode twelve, worth remembering precisely if your platform ever uses this configuration.

Given all of that complexity around separate URLs, it's worth restating plainly: for a modern Shopify storefront running a standard responsive theme, essentially none of this m-dot-specific section applies. Responsive design sidesteps almost the entire list of separate-URL pitfalls by construction.

A quick tour through Google's own troubleshooting table, since it's genuinely useful as a diagnostic checklist. Missing structured data on mobile, a stray noindex tag on a mobile page, missing or blocked or low-quality images, missing page titles or meta descriptions, mobile pages returning error statuses, mobile URLs carrying fragments, mobile pages blocked by robots.txt, multiple desktop pages redirecting into one duplicate mobile target, and general page quality issues around ads or thin content: these are, in Google's own words, the most common causes either of a site failing to qualify for mobile-first indexing in the first place, or of a ranking drop after it's applied. If a store notices unexplained mobile performance issues, this list is worth working through directly.

Now, AMP, and this section is genuinely current, reflecting a real change from mid-2026.

AMP, Accelerated Mobile Pages, launched back in 2015 as a stripped-down HTML framework built purely for mobile loading speed. For years, it carried real, visible advantages in Search: a distinctive lightning-bolt icon next to results, and a near-requirement for appearing in the Top Stories carousel. Both of those special advantages are long gone. The lightning-bolt badge was removed back in 2021, the same year Google dropped AMP as a requirement for Top Stories eligibility, replacing it with ordinary Core Web Vitals thresholds that any well-built page, AMP or not, can meet.

> ChatGPT fact check - this paragraph claims "The lightning-bolt badge was removed back in 2021, the same year Google dropped AMP as a requirement for Top Stories eligibility, replacing it with ordinary Core Web Vitals thresholds that any well-built page, AMP or not, can meet.", but the counterargument is: The script says the former AMP requirement was replaced by Core Web Vitals thresholds. Page experience can affect ranking; passing those thresholds is not a universal entry requirement for Top Stories. AMP ceased to be required for Top Stories. Pages still need to meet the relevant content policies; do not describe a Core Web Vitals pass as the replacement eligibility requirement.
>
> Sources: Page experience and the mobile Top Stories feature; paragraph 2: https://developers.google.com/search/blog/2020/05/evaluating-page-experience#page-experience-and-the-mobile-top-stories-feature.
>
> A026 | Error | High priority | Checked 24 September 2026



> ChatGPT fact check - this paragraph claims "AMP, Accelerated Mobile Pages, launched back in 2015 as a stripped-down HTML framework built purely for mobile loading speed.", but the counterargument is: The recap calls AMP a former ranking advantage and says it requires a second stripped-down page. AMP itself is not a direct ranking factor, and standalone AMP pages need not have a separate non-AMP version. The Shopify 'offers essentially nothing' verdict is the adapter's opinion. Explain the distinction between historical feature eligibility and ranking. State Google's current technology-neutral treatment and retain only source-supported AMP implementation guidance.
>
> Sources: How does AMP look on desktop?; paragraph 1: https://developers.google.com/search/docs/crawling-indexing/amp#how-does-amp-look-on-desktop.
>
> A027 | Unsupported | Medium priority | Checked 24 September 2026



And there's a further, genuinely recent change. As of July 2026, Google altered how AMP pages are actually served from search results. Previously, clicking an AMP result could route you through Google's own AMP Cache, a kind of pre-loaded proxy version of the page. As of this update, Google now sends searchers directly to the AMP page as hosted by the publisher's own domain, ending that cache-serving layer. Google is explicit that this is not a ranking change of any kind: AMP content continues to rank exactly like any other page, under exactly the same standards. Google's own current framing states it outright: Search indexes AMP pages just like other web pages, and applies the same standard to every page, regardless of the technology used to build it.

So where does that leave AMP practically, in 2026? It's no longer a technology carrying any special ranking advantage, and it hasn't been for years. If you already have AMP pages in place, there's no urgent reason to rip them out; they'll continue functioning and ranking normally under standard Search quality criteria. But if you're weighing whether to build new AMP pages specifically for a perceived SEO edge, that edge simply doesn't exist anymore. The decision now comes down purely to whether AMP's genuinely restrictive framework, and the burden of maintaining a second, stripped-down version of every page, still serves your site's actual publishing or performance goals on its own merits, entirely separate from any SEO consideration. For a Shopify storefront with a well-optimised, responsive theme already meeting Core Web Vitals, AMP offers essentially nothing your existing setup doesn't already deliver.

> ChatGPT fact check - this paragraph claims "The decision now comes down purely to whether AMP's genuinely restrictive framework, and the burden of maintaining a second, stripped-down version of every page, still serves your site's actual publishing or performance goals on its own merits, entirely separate from any SEO consideration.", but the counterargument is: The recap calls AMP a former ranking advantage and says it requires a second stripped-down page. AMP itself is not a direct ranking factor, and standalone AMP pages need not have a separate non-AMP version. The Shopify 'offers essentially nothing' verdict is the adapter's opinion. Explain the distinction between historical feature eligibility and ranking. State Google's current technology-neutral treatment and retain only source-supported AMP implementation guidance.
>
> Sources: How does AMP look on desktop?; paragraph 1: https://developers.google.com/search/docs/crawling-indexing/amp#how-does-amp-look-on-desktop.
>
> A027 | Unsupported | Medium priority | Checked 24 September 2026



Let's recap.

Mobile-first indexing means Google indexes and ranks based on what the mobile crawler sees, not the desktop crawler, for the large majority of sites today. Responsive design is Google's own recommended approach, and it sidesteps nearly all of the parity concerns this episode covers by construction. If you're on a dynamic-serving or separate-URL setup instead, mobile and desktop content, structured data, metadata, images, and video all need genuine parity, or you risk real traffic loss, and a specific set of extra rules governs canonical tags, hreflang, and error handling between the two versions. And AMP, once a meaningful ranking advantage, is now functionally just another web technology: no special badge, no Top Stories requirement, and as of July 2026, no special cache-serving path either, just an ordinary page held to ordinary Search quality standards.

> ChatGPT fact check - this paragraph claims "And AMP, once a meaningful ranking advantage, is now functionally just another web technology: no special badge, no Top Stories requirement, and as of July 2026, no special cache-serving path either, just an ordinary page held to ordinary Search quality standards.", but the counterargument is: The recap calls AMP a former ranking advantage and says it requires a second stripped-down page. AMP itself is not a direct ranking factor, and standalone AMP pages need not have a separate non-AMP version. The Shopify 'offers essentially nothing' verdict is the adapter's opinion. Explain the distinction between historical feature eligibility and ranking. State Google's current technology-neutral treatment and retain only source-supported AMP implementation guidance.
>
> Sources: How does AMP look on desktop?; paragraph 1: https://developers.google.com/search/docs/crawling-indexing/amp#how-does-amp-look-on-desktop.
>
> A027 | Unsupported | Medium priority | Checked 24 September 2026



Next episode, we tackle JavaScript SEO properly: how Googlebot actually processes JavaScript during rendering, the most common ways JavaScript-heavy sites break in search, fixing lazy-loaded content specifically, and dynamic rendering as a fallback workaround. See you there.

This episode is adapted from "Mobile site and mobile-first indexing best practices" and "About AMP on Google Search" on Google Search Central, licensed under Creative Commons Attribution 4.0.

### Episode 14: JavaScript SEO: How Rendering Actually Works

Welcome back. JavaScript came up repeatedly in earlier episodes, mostly as a warning sign, so today we go through Google's dedicated guide properly. This is a genuinely technical episode, more relevant if you or a developer like Rushikesh ever touches theme code directly, but even at a conceptual level it clarifies a lot about why certain pages behave unpredictably in search.

How Google actually processes JavaScript.

Google breaks this into three stages: crawling, rendering, and indexing. We met crawling and indexing back in episode three; rendering is the piece we're filling in properly today.

Here's the flow in detail. Googlebot pulls a URL from its crawl queue, crawls it, and passes the result to a processing stage. That processing stage extracts any links it finds and sends them back into the crawl queue, and it also places the page itself into a separate rendering queue. From the rendering queue, the page eventually reaches the renderer, which renders the page and hands the resulting HTML back to the processing stage. That processing stage then indexes the content and extracts links from the rendered version too, feeding those back into the crawl queue as well.

A genuinely important detail: pages sit in both the crawl queue and the rendering queue, and there's no direct, visible way to know how long any given page is waiting in either one. When Googlebot pulls a URL from the crawl queue and prepares to send an HTTP request, it first checks whether crawling is actually allowed, by reading robots.txt. If the URL is marked disallowed there, Googlebot skips the HTTP request entirely and moves on. And a specific consequence follows directly from that: Google Search will not render JavaScript from a blocked file or a blocked page, because it never even fetches it in the first place.

Once a response comes back, Googlebot parses it for other URLs referenced inside href attributes on HTML links, adding whatever it finds to the crawl queue. If you don't want a particular link discovered this way, use the nofollow mechanism from episode nine. And you genuinely can inject links into the page's DOM using JavaScript, as long as those injected links still follow the crawlable-link best practices from that same episode, meaning a real anchor tag with a real href.

> ChatGPT fact check - this paragraph claims "If you don't want a particular link discovered this way, use the nofollow mechanism from episode nine.", but the counterargument is: The advice 'if you don't want a particular link discovered this way, use nofollow' is too strong without Google's qualification that linked URLs can still be found and crawled by other routes. Nofollow qualifies a link; it does not keep its destination secret or guarantee it will stay out of the index. Use the appropriate crawl, index, or access control for that goal.
>
> Sources: Qualify your outbound links to Google; paragraph 4: https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links#qualify-your-outbound-links-to-google.
>
> A028 | Overstatement | Medium priority | Checked 24 September 2026



Now, why does rendering matter at all? Crawling the URL and parsing the raw HTML response works perfectly well for classic websites or server-rendered pages, where the HTML in the initial HTTP response already contains everything. But some JavaScript-based sites use something called the App Shell model, where the initial HTML that comes back contains essentially none of the real content, and Google genuinely has to execute the page's JavaScript before it can see the actual content that JavaScript generates.

Every page returning an HTTP 200 status gets placed into the rendering queue, unless a robots meta tag or header, covered back in episode one, has already told Google not to index it. A page can sit in that rendering queue for a few seconds, or considerably longer. Once Google's resources allow, a headless version of Chromium renders the page and executes its JavaScript. Googlebot then parses the rendered HTML for links all over again, adding anything newly found to the crawl queue, and Google indexes the page using this rendered HTML, not the original raw response.

Here's a detail worth remembering precisely: every page with a 200 status code goes to the rendering queue, whether or not it actually contains any JavaScript at all. But if the status code isn't 200, say a 404 error page, rendering may simply be skipped.

And despite all of this rendering capability, Google still recommends server-side rendering or pre-rendering where practical, for two clear reasons: it lets both users and crawlers see your content faster, and not every bot that might ever encounter your site can actually execute JavaScript at all.

Now, a series of specific, practical best practices, several of which come with real code patterns worth knowing conceptually, even if you're not the one writing them.

Titles and meta descriptions can be set or changed with JavaScript. Google reads whatever version exists after rendering, so a dynamically generated product title still works fine for search purposes.

Setting your canonical URL. You can set a rel canonical tag with JavaScript, but Google's clear preference is that you shouldn't use JavaScript to change the canonical away from whatever was already specified in the original HTML. The best approach is setting it directly in HTML; if you genuinely must use JavaScript for this, make sure it always resolves to the exact same value the original HTML specified. If you truly cannot set a canonical in HTML at all, only then does using JavaScript to add one, with nothing conflicting present in the raw HTML, become the right approach.

Writing compatible code. Browsers offer a huge range of APIs, and JavaScript itself evolves quickly; Google has some limits on which APIs and language features it supports during rendering. If you detect through feature detection that some browser API you need is missing, Google's recommendation is differential serving and polyfills, code that fills in a missing capability for less capable environments, though it's worth checking polyfill documentation directly, since not every browser feature can actually be polyfilled.

Using meaningful HTTP status codes. Googlebot relies on the actual HTTP status code to judge whether something went wrong while crawling a page. Use a genuine 404 when a page isn't found, or 401 when login is required, so Google's index stays accurate, and use redirects properly to signal that a page has permanently moved.

And here's a genuinely practical section, specifically for single-page applications using client-side routing, since a soft 404 is a very easy trap to fall into with this architecture. In a client-rendered single-page app, routing typically happens entirely on the client side, which makes returning a proper server-level status code for a "not found" state awkward or outright impossible. To avoid a soft 404 here, Google recommends one of two strategies. Either use a JavaScript redirect to a URL where the server genuinely does respond with a 404 status. Or use JavaScript to inject a noindex robots meta tag directly onto the error state itself. Google gives worked code for both: the redirect approach fetches product data, and if the product doesn't exist, sets "window.location.href" to a genuine 404-serving path; the noindex approach instead creates or updates a robots meta tag on the page itself, setting its content to noindex, right at the point where the fetched data reveals the page is actually an error state.

Using the History API instead of URL fragments. We touched on this back in episode nine, and here's the fuller picture. Google can only discover a link if it's a genuine anchor element with a real href attribute. For single-page apps implementing client-side routing, use the History API to route between different views, rather than URL fragments, the part after a hash symbol. Google gives a clear bad example: navigation links using href values like "#/products", with a script listening for a "hashchange" event to swap content based on the fragment. Googlebot cannot reliably parse this pattern. The fix is implementing the History API properly instead: real href values like "/products", a click handler that prevents the default navigation, loads the new content directly, and then calls "window.history.pushState" to update the visible URL and browser history to match, keeping everything crawlable throughout.

Injecting a rel canonical tag correctly, if you must. Google can extract a canonical tag injected by JavaScript during rendering, but the practice comes with a real risk worth naming precisely: incorrect implementations can accidentally create multiple, conflicting canonical tags on one page, or silently alter an existing one. Either of those situations, competing or conflicting canonical signals, can produce unpredictable results, tying directly back to the "don't send contradictory signals" warning from episode twelve.

Using the robots meta tag carefully. You can add or change a robots meta tag with JavaScript, and Google gives a worked example: fetching product data, and if the API response indicates an error state, either finding the existing robots meta tag or creating a new one, then setting its content to noindex, so that missing or errored products don't get indexed. But there's a critical catch worth remembering precisely: if Google encounters a noindex tag in the initial HTML, it may skip the rendering and JavaScript execution steps entirely. That means using JavaScript specifically to remove or change an existing noindex tag may simply never take effect, because Google never got as far as running that script in the first place. If you genuinely want a page indexed, the practical rule is: don't put noindex in the original page source at all.

Using long-term caching properly. Googlebot actively caches content to reduce network requests and resource use, and its rendering system may sometimes ignore standard cache headers, which can mean it ends up using an outdated version of your JavaScript or CSS files. The fix Google recommends is content fingerprinting: baking a hash of the file's actual content into its filename, something like "main.2bb85551.js", so that any genuine content change automatically produces a different filename, forcing a fresh fetch rather than relying purely on cache headers Google might disregard.

Using structured data with JavaScript. You can generate the JSON-LD structured data format dynamically with JavaScript and inject it into the page, which we'll cover fully starting in episode twenty-two. Google's specific advice here: always test your implementation directly, since dynamically generated structured data is genuinely easy to get subtly wrong.

> ChatGPT fact check - this paragraph claims "Using structured data with JavaScript.", but the counterargument is: The structured-data sequence starts at Episode 23, not 22. The next-episode promise also drifts into metadata content not actually provided in Episode 15. Point structured data to Episode 23 and limit the next-episode preview to lazy loading and dynamic rendering.
>
> Sources: Internal source: seo-study/index.html, episode listings and introductory paragraphs; compare the chapter headings and text. This is an editorial or coverage correction, not an additional Google policy.; Scope reference: https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data.
>
> A029 | Editorial | Low priority | Checked 24 September 2026



Following web component best practices. Google supports web components, and when it renders a page, it flattens both the shadow DOM and light DOM content together. In plain terms, this means Google can only see whatever ends up visible in the final rendered HTML. To make sure content inside a web component's shadow DOM actually shows up properly alongside any light DOM content projected into it, use a slot element, a specific web-component pattern for combining the two. Google gives a worked example: a custom element that creates shadow DOM content and includes a slot tag, so that light DOM content placed inside the custom element in the original markup gets projected into that slot and appears in the final rendered output together with the shadow content. If content genuinely isn't present in the rendered HTML, Google cannot index it, full stop. Use the Rich Results Test or the URL Inspection tool to directly check exactly what rendered HTML Google actually sees for a given page.

And finally, a pointer rather than a full repeat: fixing images and lazy-loaded content gets its own dedicated guide, since images carry real bandwidth and performance costs, and lazy-loading, only loading an image once a user is about to see it, is a legitimate strategy when implemented in a genuinely search-friendly way. We'll cover that properly, with full detail, in episode fifteen.

Let's recap.

Google processes JavaScript in three stages: crawling, rendering, and indexing, with pages sitting in both a crawl queue and a separate rendering queue before headless Chromium actually executes the JavaScript and hands back rendered HTML for indexing. Server-side rendering or pre-rendering remains genuinely worthwhile even though Google can render JavaScript, for speed and for compatibility with bots that can't. Set titles, descriptions, and canonicals in HTML wherever you can, and if you must use JavaScript for a canonical, never let it drift from what the original HTML specified. For single-page apps, solve soft 404s with either a JavaScript redirect to a genuine 404 URL or an injected noindex tag, and always use the History API rather than URL fragments for client-side routing. A noindex tag present in the original HTML may stop Google from even running your JavaScript at all, so never rely on a script to remove one. Use content-fingerprinted filenames to defeat stale caching. And always verify what Google actually sees using the Rich Results Test or URL Inspection tool, since rendered HTML, not your original source, is the only thing that ultimately gets indexed.

Next episode, we finish this stretch of technical crawling and indexing episodes with lazy-loaded content specifically, dynamic rendering as a workaround, and then move into page and content metadata: the full set of meta tags and HTML attributes Google actually supports. See you there.

> ChatGPT fact check - this paragraph claims "Next episode, we finish this stretch of technical crawling and indexing episodes with lazy-loaded content specifically, dynamic rendering as a workaround, and then move into page and content metadata: the full set of meta tags and HTML attributes Google actually supports.", but the counterargument is: The structured-data sequence starts at Episode 23, not 22. The next-episode promise also drifts into metadata content not actually provided in Episode 15. Point structured data to Episode 23 and limit the next-episode preview to lazy loading and dynamic rendering.
>
> Sources: Internal source: seo-study/index.html, episode listings and introductory paragraphs; compare the chapter headings and text. This is an editorial or coverage correction, not an additional Google policy.; Scope reference: https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data.
>
> A029 | Editorial | Low priority | Checked 24 September 2026



This episode is adapted from "Understand the JavaScript SEO basics" on Google Search Central, licensed under Creative Commons Attribution 4.0.

### Episode 15: Fixing Lazy-Loaded Content, and Dynamic Rendering as a Last Resort

Welcome back. This episode closes out our deep technical stretch on JavaScript and rendering. Two subjects today: how to implement lazy-loading in a way that doesn't accidentally hide your content from Google, and dynamic rendering, a workaround Google now actively discourages, though it's worth understanding exactly why.

Fixing lazy-loaded content.

Deferring the loading of non-critical or off-screen content, commonly called lazy-loading, is a genuinely good performance and user-experience practice. But Google opens this guide with a direct warning: implemented incorrectly, this exact technique can inadvertently hide content from Google entirely.

The core principle: make sure your lazy-loading implementation loads all relevant content whenever that content becomes visible in the viewport. Google names three acceptable methods for doing this properly. Browser built-in lazy-loading for images and iframes, which is the native, simplest approach. The IntersectionObserver API, paired with a polyfill for older browsers that don't support it natively. Or a JavaScript library that specifically supports loading data once it enters the viewport.

Here's the principle underlying all three of these acceptable methods, and it's worth remembering precisely: none of them rely on a user action, like scrolling or clicking, to trigger the load. That matters because, as Google states plainly, Google Search does not interact with your page. It doesn't scroll down to trigger your lazy-load event, it doesn't click a button to reveal hidden content. If your implementation depends on a genuine user interaction to fire, Google simply never sees whatever's behind it.

There's also a warning in the other direction, worth remembering: don't apply lazy-loading to content that's likely to be immediately visible the moment a user opens the page. Doing so can make that content take noticeably longer to actually appear, which becomes a real, visible problem for your human visitors, not just a search engine concern.

And, unsurprisingly by now: test your implementation directly, using the URL Inspection tool, to confirm the content genuinely appears in the rendered HTML Google actually sees.

Supporting paginated loading for infinite scroll.

Infinite scroll, where more content loads automatically as a user scrolls down a long page, whether that's one long article split into chunks or a large collection of items, needs a specific approach to remain properly indexable. Google's guidance here is precise and practical.

Give each chunk its own persistent, unique URL. Make sure the content shown at each of those URLs stays consistent every time it's loaded, rather than shifting depending on when or how it's accessed. One clean way to do this: use absolute page numbers in the URL, something like a "page=12" query parameter, rather than relative markers like "date=yesterday", since a relative reference like that would show different content depending purely on when it's loaded, breaking the consistency Google needs.

Link sequentially between the individual URLs in your paginated set, so search engines can actually discover and traverse the full set through ordinary crawlable links. And when a new chunk loads in response to a user scrolling, and that chunk becomes the primary content the visitor is now looking at, use the History API, the same tool from episode fourteen, to update the visible URL to match. This way, a visitor can genuinely refresh the page, share the link, or return to it later, and land on the exact content they were looking at, rather than back at the top of an endless, un-bookmarkable scroll.

For a store with a large catalogue running infinite-scroll category pages, this is directly relevant: each "page" of products within that scroll needs its own real, crawlable, bookmarkable URL underneath the infinite-scroll experience, not just a JavaScript state that only exists transiently in one visitor's browser session.

Now, dynamic rendering, and here the documentation itself has shifted meaningfully in tone over the past few years, so it's worth understanding both what it is and why Google now steers people away from it.

What dynamic rendering actually is. On some sites, JavaScript loads additional content once the page is open in an actual browser; this is called client-side rendering. Ordinarily, Google Search sees this content the same way, alongside whatever's already present in the raw HTML, thanks to the rendering process from episode fourteen. But Google is candid that real limitations exist: some pages genuinely do run into problems with content simply not showing up in the rendered HTML, and other search engines beyond Google may choose to ignore JavaScript entirely, meaning they never see JavaScript-generated content at all, regardless of how well it renders for Google specifically.

Dynamic rendering was built as a workaround for exactly that gap. A dynamic rendering server sits in front of your site, detects bots that may struggle with JavaScript-generated content, and serves those specific bots a server-rendered version with no JavaScript involved, while continuing to show ordinary human visitors the full client-side rendered experience as normal.

And here's the header Google itself now places prominently on this documentation, worth quoting closely because of how direct it is: dynamic rendering is a workaround and not a long-term solution for problems with JavaScript-generated content in search engines. Google explicitly recommends server-side rendering, static rendering, or hydration instead, as genuine, durable solutions, rather than this workaround.

Which sites might have historically used dynamic rendering. Google names two narrow scenarios: sites with indexable, public JavaScript-generated content that changes very rapidly, or sites relying on JavaScript features that the specific crawlers they cared about simply didn't support. And Google is explicit that not every site needs this at all, and that better, more modern solutions generally exist instead.

How dynamic rendering actually works, mechanically, for anyone who does encounter it. Your web server has to detect crawlers, typically by checking the user-agent string. When it identifies a request coming from a crawler that doesn't support JavaScript, or doesn't support the specific JavaScript features your content depends on, that particular request gets routed to a separate rendering server instead of the normal path. Requests from ordinary users, and from crawlers that don't have JavaScript problems, continue being served normally. The rendering server then responds with a version of the content suited to that crawler, commonly a static HTML version with no JavaScript dependency at all. This can be enabled site-wide, or configured on a page-by-page basis.

One question this setup naturally raises, given everything we covered about cloaking back in episode two: doesn't serving genuinely different content to bots versus humans count as cloaking? Google addresses this directly: dynamic rendering is generally not considered cloaking, precisely because the content served to bots and the content served to users remains substantively similar; the difference is purely in the rendering mechanism, not the underlying substance. The line, worth remembering precisely, given episode two's warning: this protection only holds as long as the dynamically rendered version and the client-side version are genuinely similar in substance. Using this same technical mechanism to actually serve different content between bots and humans would cross straight back into the cloaking violation from episode two.

So where does this leave a practical decision today? Given Google's own current framing, dynamic rendering is best understood as a legacy pattern: something you might recognise if you inherit an older, JavaScript-heavy site that already has it configured, rather than something to newly build today. For a modern Shopify storefront specifically, this entire question is almost certainly moot, since Shopify's own rendering approach doesn't generally create the kind of rendering gap dynamic rendering was built to patch over in the first place. But it's genuinely useful vocabulary to have, both for reading older technical audits or third-party advice that might still recommend it, and for recognising it as exactly the kind of outdated pattern episode eight's guidance on evaluating third-party advice would tell you to weigh critically against Google's current, official position.

> ChatGPT fact check - this paragraph claims "For a modern Shopify storefront specifically, this entire question is almost certainly moot, since Shopify's own rendering approach doesn't generally create the kind of rendering gap dynamic rendering was built to patch over in the first place.", but the counterargument is: Google's dynamic-rendering documentation does not establish that this question is almost certainly moot for modern Shopify storefronts. Themes, apps, and custom storefront implementations can differ. Remove the platform assurance. Say that the need depends on the site's actual rendering behavior and should be assessed by inspecting the rendered content.
>
> Sources: Dynamic rendering as a workaround; paragraph 1: https://developers.google.com/search/docs/crawling-indexing/javascript/dynamic-rendering#dynamic-rendering-as-a-workaround; Dynamic rendering as a workaround; paragraph 3: https://developers.google.com/search/docs/crawling-indexing/javascript/dynamic-rendering#dynamic-rendering-as-a-workaround.
>
> A030 | Unsupported | Medium priority | Checked 24 September 2026



Let's recap, and close out this run of JavaScript-focused episodes.

Lazy-loading is a good practice implemented with browser-native lazy-loading, the IntersectionObserver API with a polyfill, or a viewport-aware JavaScript library, never anything requiring an actual user interaction Google can't perform, and never applied to content that should already be visible on first load. Infinite scroll needs genuinely persistent, unique, absolute URLs per chunk, sequential internal links between them, and History API updates as new content becomes primary, so nothing important exists only inside one visitor's transient scroll session. And dynamic rendering, while technically not cloaking as long as the served content stays substantively similar, is explicitly a legacy workaround Google no longer recommends, in favour of genuine server-side rendering, static rendering, or hydration.

That closes out the deep technical run on crawling, indexing, and rendering. Next episode, we shift into page and content metadata proper: the full set of meta tags and HTML attributes Google actually supports, the robots meta tag and X-Robots-Tag in detail, and the specific mechanics of noindex. See you there.

> ChatGPT fact check - this paragraph claims "Next episode, we shift into page and content metadata proper: the full set of meta tags and HTML attributes Google actually supports, the robots meta tag and X-Robots-Tag in detail, and the specific mechanics of noindex.", but the counterargument is: Episode 16 covers robots directives, not the full supported-meta-tag and HTML-attribute reference promised here. Add a separate audio section for supported metadata and valid head structure, or narrow this preview to the robots directives that Episode 16 actually covers.
>
> Sources: Internal source: seo-study/index.html, episode listings and introductory paragraphs; compare the chapter headings and text. This is an editorial or coverage correction, not an additional Google policy.; Scope reference: https://developers.google.com/search/docs/crawling-indexing/special-tags; Scope reference: https://developers.google.com/search/docs/crawling-indexing/valid-page-metadata.
>
> A031 | Omission | Medium priority | Checked 24 September 2026



This episode is adapted from "Fix lazy-loaded content" and "Dynamic rendering as a workaround" on Google Search Central, licensed under Creative Commons Attribution 4.0.

### Episode 16: The Robots Meta Tag, X-Robots-Tag, and data-nosnippet

Welcome back. This episode is the technical deep-dive behind something we've referenced constantly since episode one: noindex. Today we cover the full robots meta tag directive family, its HTTP-header equivalent called X-Robots-Tag, and a narrower, more surgical tool called data-nosnippet.

The robots meta tag itself.

This is a meta tag placed in a page's HTML head section, with the name attribute set to "robots", that gives you precise, page-by-page control over how that individual page gets indexed and how it appears in results. The basic placement looks like this: inside the head section, a line reading meta name robots, content noindex, alongside whatever else lives in that head section.

> ChatGPT fact check - this paragraph claims "The basic placement looks like this: inside the head section, a line reading meta name robots, content noindex, alongside whatever else lives in that head section.", but the counterargument is: The script says robots meta tags have to live in the head. Google explicitly says it also respects them in the body, although head placement remains the recommended way to author metadata. Place robots meta tags in the head. Google can also respect a robots meta tag in the body; use X-Robots-Tag for non-HTML resources.
>
> Sources: Using the robots meta tag; paragraph 8: https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag#robotsmeta.
>
> A034 | Overstatement | Low priority | Checked 24 September 2026



Here's a detail worth knowing precisely: a rule written as meta name robots applies to search crawlers generally. If you specifically need to block a non-search crawler, something like Google's AdsBot, you may need a separate, specifically targeted rule instead, one naming that crawler by its own name rather than the generic "robots" token.

X-Robots-Tag: the same rules, delivered as an HTTP header instead.

Here's the practical reason this second mechanism exists: the robots meta tag only works on HTML pages, since it has to live inside an HTML head section. But plenty of things Google indexes aren't HTML at all: PDFs, video files, image files. For any of those, X-Robots-Tag is the tool, since it's delivered as part of the HTTP response header rather than embedded in markup, meaning it works on literally any file type your server serves.

> ChatGPT fact check - this paragraph claims "Here's the practical reason this second mechanism exists: the robots meta tag only works on HTML pages, since it has to live inside an HTML head section.", but the counterargument is: The script says robots meta tags have to live in the head. Google explicitly says it also respects them in the body, although head placement remains the recommended way to author metadata. Place robots meta tags in the head. Google can also respect a robots meta tag in the body; use X-Robots-Tag for non-HTML resources.
>
> Sources: Using the robots meta tag; paragraph 8: https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag#robotsmeta.
>
> A034 | Overstatement | Low priority | Checked 24 September 2026



Every rule available through the robots meta tag is also available through X-Robots-Tag. Here's a worked example of an HTTP response carrying an X-Robots-Tag header instructing crawlers not to index a page: the response starts with the usual 200 OK status and date, and somewhere in the header block carries a line reading simply "X-Robots-Tag: noindex".

You can combine multiple X-Robots-Tag headers in one response, or list several rules comma-separated within one header line. Google's own worked example combines a noimageindex directive with an unavailable_after directive carrying a specific date, as two separate X-Robots-Tag header lines in the same response.

There's a further refinement available specifically through X-Robots-Tag: you can optionally prefix a rule with a particular crawler's name, so different rules apply to different search engines within the same response. Google's own example shows this precisely: one line reading "X-Robots-Tag: googlebot: nofollow", and a second reading "X-Robots-Tag: otherbot: noindex, nofollow", within the same response. Any rule listed with no crawler name specified applies to every crawler by default. And worth knowing: the header name itself, the crawler name, and the rule values are all case-insensitive.

Now, the actual supported rules, the vocabulary both mechanisms share.

"All" means no restrictions on indexing or display at all. This is the default behaviour, so listing it explicitly has no real effect; it exists mainly for completeness.

"Noindex" means don't show this page, media, or resource in search results at all. This is the one we've referenced constantly across this series, and it's worth restating the core mechanic from episode one once more: for noindex to actually work, Google has to be allowed to crawl the page in the first place, since it can only read this instruction by actually fetching the content that contains it.

"Nofollow" means don't follow the links present on this page, so link-equity and discovery signals from this specific page's outbound links aren't passed along. "None" is simply shorthand equivalent to combining noindex and nofollow together in one rule.

"Nosnippet" means show no text snippet and no video preview for this page in results at all. The URL itself can still remain indexed and can still appear with its title link, but with no descriptive preview text beneath it, which is a real trade-off worth weighing, since it can reduce how well a searcher understands what they're about to click before they click it. And here's a genuinely current detail: nosnippet's reach now extends beyond ordinary blue-link results. Google's current guidance states that nosnippet also applies to AI Overviews and AI Mode, the generative features from episode seven, meaning a page marked nosnippet is withheld from being quoted or excerpted in those AI-generated summaries too, not just in traditional snippets.

> ChatGPT fact check - this paragraph claims ""Nosnippet" means show no text snippet and no video preview for this page in results at all.", but the counterargument is: Nosnippet prevents direct input to AI Overviews and AI Mode, not merely quotation. Max-snippet also limits direct input, with permission-related exceptions. indexifembedded works only with noindex. Structured data within a data-nosnippet element can still be used. Restore the exact scope and exceptions. Explain that snippet controls are not privacy controls and do not necessarily suppress explicitly supplied structured data.
>
> Sources: Valid indexing and serving rules; table row 6: https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag#directives; Valid indexing and serving rules; table row 7: https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag#directives; Valid indexing and serving rules; table row 8: https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag#directives; Using structured data; paragraph 2: https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag#structureddata.
>
> A033 | Omission | Medium priority | Checked 24 September 2026



"Max-snippet", followed by a number, caps how many characters a text snippet for this page can run to.

> ChatGPT fact check - this paragraph claims ""Max-snippet", followed by a number, caps how many characters a text snippet for this page can run to.", but the counterargument is: Nosnippet prevents direct input to AI Overviews and AI Mode, not merely quotation. Max-snippet also limits direct input, with permission-related exceptions. indexifembedded works only with noindex. Structured data within a data-nosnippet element can still be used. Restore the exact scope and exceptions. Explain that snippet controls are not privacy controls and do not necessarily suppress explicitly supplied structured data.
>
> Sources: Valid indexing and serving rules; table row 6: https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag#directives; Valid indexing and serving rules; table row 7: https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag#directives; Valid indexing and serving rules; table row 8: https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag#directives; Using structured data; paragraph 2: https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag#structureddata.
>
> A033 | Omission | Medium priority | Checked 24 September 2026



"Max-image-preview", set to none, standard, or large, controls the size of any image preview shown alongside this page's result.

"Max-video-preview", followed by a number, caps how many seconds of video preview can be shown for this page.

"Noimageindex" means don't index the images that appear on this particular page.

"Notranslate" means don't offer a translated version of this result to searchers.

"Unavailable_after", followed by a date, tells Google to stop showing this page in results once that date has passed, useful for genuinely time-limited content, a seasonal promotion or a limited product run, say.

And "indexifembedded" is a more specialised, newer rule: it allows a page to still be indexed when it's embedded elsewhere via an iframe, even if that page separately carries a noindex directive of its own, a fairly narrow use case but worth knowing exists.

> ChatGPT fact check - this paragraph claims "And "indexifembedded" is a more specialised, newer rule: it allows a page to still be indexed when it's embedded elsewhere via an iframe, even if that page separately carries a noindex directive of its own, a fairly narrow use case but worth knowing exists.", but the counterargument is: Nosnippet prevents direct input to AI Overviews and AI Mode, not merely quotation. Max-snippet also limits direct input, with permission-related exceptions. indexifembedded works only with noindex. Structured data within a data-nosnippet element can still be used. Restore the exact scope and exceptions. Explain that snippet controls are not privacy controls and do not necessarily suppress explicitly supplied structured data.
>
> Sources: Valid indexing and serving rules; table row 6: https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag#directives; Valid indexing and serving rules; table row 7: https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag#directives; Valid indexing and serving rules; table row 8: https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag#directives; Using structured data; paragraph 2: https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag#structureddata.
>
> A033 | Omission | Medium priority | Checked 24 September 2026



Multiple directives can be combined in one rule, comma-separated, and you can also target a specific crawler by name in the meta tag version too, not just through X-Robots-Tag: replacing the generic "robots" name with something like "googlebot" or "googlebot-news" lets you write a directive that applies specifically to that one crawler, overriding whatever the generic robots rule says for that crawler specifically.

> ChatGPT fact check - this paragraph claims "Multiple directives can be combined in one rule, comma-separated, and you can also target a specific crawler by name in the meta tag version too, not just through X-Robots-Tag: replacing the generic "robots" name with something like "googlebot" or "googlebot-news" lets you write a directive that applies specifically to that one crawler, overriding whatever the generic robots rule says for that crawler specifically.", but the counterargument is: The script says googlebot-specific directives override the generic robots rule. Google combines applicable negative directives and applies the more restrictive rule when they conflict. Google combines the rules that apply to its crawler. If they conflict, the more restrictive rule wins; a crawler-specific instruction cannot simply cancel a general noindex.
>
> Sources: Using the X-Robots-Tag HTTP header; paragraph 5: https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag#xrobotstag.
>
> A032 | Error | High priority | Checked 24 September 2026



Now, a genuinely useful, more surgical tool: the data-nosnippet HTML attribute.

Here's the problem this solves. Nosnippet, the directive we just covered, is a blunt, page-wide instrument: it removes the snippet entirely, for the whole page, with no ability to keep some of the preview while excluding just one troublesome part. Data-nosnippet solves a narrower, more common problem: excluding one specific piece of visible content from ever being pulled into a snippet, while leaving the rest of that same page's content fully eligible.

It's an HTML attribute, not a meta tag, and it works specifically on div, span, and section elements. You simply add the attribute directly to whichever element wraps the content you want excluded. Google's own illustrative example: a paragraph containing the sentence "This text can be shown in a snippet", followed by a span element carrying the data-nosnippet attribute wrapping the words "and this part would not be shown". Everything inside that marked span is excluded from consideration for a snippet; everything else in that same paragraph remains fully eligible.

A detail worth knowing if you're implementing this yourself: the attribute doesn't actually care what value, if any, you give it. Writing bare "data-nosnippet", or "data-nosnippet=true", or even "data-nosnippet=false", all produce exactly the same result, excluding that content from snippets. The mere presence of the attribute is what matters, not its value.

And a distinction worth keeping precise, since it's easy to conflate the two: data-nosnippet doesn't make a page private, doesn't remove its URL from the index, and isn't a canonicalization signal of any kind. It only ever controls what text is eligible to be pulled into a snippet; nothing more, nothing less.

> ChatGPT fact check - this paragraph claims "It only ever controls what text is eligible to be pulled into a snippet; nothing more, nothing less.", but the counterargument is: Nosnippet prevents direct input to AI Overviews and AI Mode, not merely quotation. Max-snippet also limits direct input, with permission-related exceptions. indexifembedded works only with noindex. Structured data within a data-nosnippet element can still be used. Restore the exact scope and exceptions. Explain that snippet controls are not privacy controls and do not necessarily suppress explicitly supplied structured data.
>
> Sources: Valid indexing and serving rules; table row 6: https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag#directives; Valid indexing and serving rules; table row 7: https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag#directives; Valid indexing and serving rules; table row 8: https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag#directives; Using structured data; paragraph 2: https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag#structureddata.
>
> A033 | Omission | Medium priority | Checked 24 September 2026



When is this narrower tool actually the right call, rather than the blunter page-wide nosnippet directive? Picture a product page for a store that includes a "current promotions" banner near the top, showing a price or a discount that's only valid for a narrow, specific window and lacks enough surrounding context to make sense on its own once lifted out into a search snippet. Wrapping just that banner element in data-nosnippet keeps the rest of the page's genuinely useful, evergreen description fully eligible for a snippet, while keeping that specific, context-dependent, time-sensitive text from ever being quoted out of context in a result. The same logic applies to things like cookie-consent banners, internal navigation instructions, or any other genuinely volatile interface text that happens to be visible on the page but would actively mislead a searcher if Google ever quoted it verbatim in a result.

> ChatGPT fact check - this paragraph claims "Wrapping just that banner element in data-nosnippet keeps the rest of the page's genuinely useful, evergreen description fully eligible for a snippet, while keeping that specific, context-dependent, time-sensitive text from ever being quoted out of context in a result.", but the counterargument is: Nosnippet prevents direct input to AI Overviews and AI Mode, not merely quotation. Max-snippet also limits direct input, with permission-related exceptions. indexifembedded works only with noindex. Structured data within a data-nosnippet element can still be used. Restore the exact scope and exceptions. Explain that snippet controls are not privacy controls and do not necessarily suppress explicitly supplied structured data.
>
> Sources: Valid indexing and serving rules; table row 6: https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag#directives; Valid indexing and serving rules; table row 7: https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag#directives; Valid indexing and serving rules; table row 8: https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag#directives; Using structured data; paragraph 2: https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag#structureddata.
>
> A033 | Omission | Medium priority | Checked 24 September 2026



One practical note if you ever apply this yourself: Google's own guidance suggests keeping the attribute's presence stable, rather than adding or removing it dynamically through JavaScript depending on some runtime condition, and to trigger a fresh recrawl through Search Console afterward, since changes here can otherwise take a genuine while to actually show up in results.

Let's recap.

The robots meta tag gives page-by-page control over indexing and result appearance, placed inside a page's HTML head. X-Robots-Tag delivers the exact same set of rules through an HTTP header instead, making it the only real option for non-HTML files like PDFs and videos, and it additionally supports targeting different rules at different named crawlers within one response. The core directives are noindex, nofollow, none, nosnippet, max-snippet, max-image-preview, max-video-preview, noimageindex, notranslate, unavailable_after, and indexifembedded, and nosnippet specifically now reaches into AI Overviews and AI Mode, not just traditional results. And data-nosnippet is a narrower HTML attribute, not a meta tag, letting you exclude one specific visible block of content from snippets while leaving the rest of that same page fully eligible, useful for volatile or context-dependent text like time-limited pricing or interface banners.

> ChatGPT fact check - this paragraph claims "The robots meta tag gives page-by-page control over indexing and result appearance, placed inside a page's HTML head.", but the counterargument is: The script says robots meta tags have to live in the head. Google explicitly says it also respects them in the body, although head placement remains the recommended way to author metadata. Place robots meta tags in the head. Google can also respect a robots meta tag in the body; use X-Robots-Tag for non-HTML resources.
>
> Sources: Using the robots meta tag; paragraph 8: https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag#robotsmeta.
>
> A034 | Overstatement | Low priority | Checked 24 September 2026



Next episode, we cover removals properly: the full range of methods for controlling what Google shares from your site, page removal requests, image removals specifically, and keeping redacted or sensitive information out of search results entirely. See you there.

This episode is adapted from "Robots meta tag, data-nosnippet, and X-Robots-Tag" on Google Search Central, licensed under Creative Commons Attribution 4.0.

### Episode 17: Removals: Controlling What Google Shares, and Redacted Information

Welcome back. Today's subject is the full toolkit for keeping content out of Google's results, or getting existing content removed, and it closes with a genuinely practical episode on a problem more common than people expect: redacted information leaking into search through documents and images that weren't as scrubbed as they looked.

Why would a site owner want to hide content from Google at all?

Google names three legitimate reasons directly. Data restriction: content on your site meant only for users who already have some other form of access, where you specifically don't want Google crawling and surfacing it in results. Hiding content that's unimportant to visitors: genuinely low-quality or user-generated spam content that shouldn't be indexed, since indexing it could actually hurt your site's overall standing, tying directly back to the user-generated spam policy from episode two. And keeping Google focused on what matters: for a very large site, blocking duplicate or low-value pages from crawling so Google's attention concentrates on the content that actually counts, which echoes the crawl-efficiency discussion from episode nine.

The main methods for blocking content, and Google presents these as a menu, each suited to a different situation.

Removing the content from your site entirely. Applicable to any content type. This is, unsurprisingly, the most reliable method there is: if the content genuinely no longer exists anywhere, it simply cannot appear in Google Search or anywhere else on the internet either.

Password protection. Also applicable to any content type. If your site has confidential or non-public content, putting it behind a password ensures only authorized users can reach it, and this simultaneously keeps it out of Google Search. If that content already appears in results, password protection will eventually get it removed from those results too, once Google re-crawls and discovers it's no longer accessible.

The noindex rule, which we covered in full detail last episode. Applicable to any content type. Here's Google's own precise framing of what this actually does, worth hearing once more directly: your content can still be linked to, and visited, from other web pages, or by someone typing the link directly, but it simply won't appear in Google Search results.

Disallowing crawling with robots.txt. Here's a detail worth being precise about, since it narrows this method's actual scope: Google specifically frames this one as applicable to images and video. Google only indexes images and videos that Googlebot is actually permitted to crawl, so blocking access to those specific media files through robots.txt keeps them out of Google Images and Google Video results. This is narrower than it might sound at first, and it's worth remembering exactly why, tying back to episode one: robots.txt blocks crawling, but for an ordinary HTML page, blocking crawling doesn't reliably keep the page's URL itself from still surfacing somewhere in results if it's linked elsewhere, since Google may still know the URL exists without ever having read its content.

Opting out of specific Google properties. Applicable to web pages. You can tell Google not to include content from your site within particular Google properties specifically, properties like Google Shopping, Google Hotels, or vacation rental listings, while still allowing that same content to appear in ordinary web search.

Opting out of the place-entity feature inside Page Insights. This is a narrower, more specialised one, worth knowing about if it's ever relevant: pages where a significant portion of the content discusses one or more physical places, hotels, restaurants, bars, that kind of thing, can have those specific place entities surfaced inside Page Insights within the Google App's browser on iOS and Android. Site owners can opt individual pages out of that specific feature.

> ChatGPT fact check - this paragraph claims "Opting out of the place-entity feature inside Page Insights.", but the counterargument is: The chapter inserts a specific Page Insights place-entity opt-out. This is absent from the current Control what you share page retrieved for the audit. Its present availability was not established by the cited documentation. Remove this from a current source-only adaptation unless an applicable current Google source can be supplied and dated. Do not call it an active option based on this chapter's existing citation.
>
> Sources: Control what you share with Google; paragraph 1: https://developers.google.com/search/docs/crawling-indexing/control-what-you-share#control-what-you-share-with-google.
>
> A036 | Unverified | Medium priority | Checked 24 September 2026



Requesting removal of content already indexed.

For content that's already showing up in Google's results and you want it gone faster than a natural re-crawl would achieve, Google provides dedicated removal request tools, generally accessed through Search Console. These exist specifically to accelerate removal once the underlying content has already been taken down, redacted, or blocked through one of the methods above; Google has been direct in the past that it doesn't control content across the broader web, so a URL removal request generally still requires that the underlying content itself has actually been removed or blocked at the source first, with certain narrower exceptions for content that could cause genuine personal harm, things like exposed personal contact information, government ID numbers, financial account details, or non-consensual intimate imagery, which get their own dedicated, more direct reporting pathways specifically because of the harm involved.

> ChatGPT fact check - this paragraph claims "These exist specifically to accelerate removal once the underlying content has already been taken down, redacted, or blocked through one of the methods above; Google has been direct in the past that it doesn't control content across the broader web, so a URL removal request generally still requires that the underlying content itself has actually been removed or blocked at the source first, with certain narrower exceptions for content that could cause genuine personal harm, things like exposed personal contact information, government ID numbers, financial account details, or non-consensual intimate imagery, which get their own dedicated, more direct reporting pathways specifically because of the harm involved.", but the counterargument is: The script implies the source must already be removed or blocked before a Search Console removal request. Google's guide provides temporary search-result removal, lasting about six months; a permanent removal separately requires removing/updating content, access protection, or noindex. Use Search Console for quick temporary removal. To keep the page out after the temporary block expires, also remove or update the content, password-protect it, or apply noindex. Do not use robots.txt as the permanent indexing control.
>
> Sources: Remove a page hosted on your site from Google; paragraph 1: https://developers.google.com/search/docs/crawling-indexing/remove-information#remove-a-page-hosted-on-your-site-from-google; Make your removal permanent; paragraph 1: https://developers.google.com/search/docs/crawling-indexing/remove-information#make-your-removal-permanent.
>
> A035 | Error | High priority | Checked 24 September 2026



Now, the genuinely practical half of this episode: keeping redacted information out of Google Search in the first place, which is really about avoiding a leak before it ever happens, rather than cleaning one up afterward.

Google opens with the core problem, worth hearing precisely: when publishing documents and images online, you may unintentionally publish information beyond what's immediately visible to the human eye. Some document formats carry embedded metadata that isn't visible in the ordinary view at all, information that might, for instance, list the names of people who previously accessed or edited that file. And here's the detail that makes this genuinely tricky: this hidden information can persist even after a document is exported or converted into an entirely different file format. If you need to remove something from a file, Google's guidance is blunt: it's critical that the information is completely, genuinely removed from the file before that file is ever made public, not merely visually hidden.

Editing and exporting images before you embed them, not after. Google indexes images it finds anywhere across the web, including ones embedded inside document formats like PDFs or presentation files. Here's the specific trap: embedded images are sometimes edited using only the containing document's own built-in editing tools, cropping a photo directly inside a slide deck, say, and this kind of in-place editing can genuinely fail to actually redact anything if that same image ever gets indexed separately from the document itself, since some document tools quietly retain the original, uncropped image data underneath the visible crop. The fix: edit images before you ever embed them into a document, not after. Crop out unwanted information from the source image file directly, and specifically check your document editor's own documentation, since some tools are known to silently preserve the full original image data behind a visual crop. Completely remove or obscure any text or other non-public elements within the image itself, since OCR, optical character recognition, can turn text visible in an image into fully searchable, indexed text, even when that text was never meant to be read as text at all. And strip any unwanted metadata from the image file. Once all of that's done, export or save the resulting image as a non-vector, flattened format, something like PNG or WebP, specifically to prevent any of the underlying, uncropped original data from being inadvertently carried along into the public version of the document.

Editing or removing unwanted text before moving to a public file format. Before generating the actual public-facing version of a document, remove anything you don't want visible in that final file, and move to a public format that doesn't retain the document's previous change history, since some formats quietly preserve edit history that a determined searcher, or an indexing crawler, could potentially recover. And here's a specific, very common mistake worth naming directly: use genuine document redaction tools if information truly needs to be redacted, rather than simply placing black rectangles over text as a visual redaction method, since this fake-redaction technique can leave the actual underlying text still fully present, and searchable, right beneath that black box.

> ChatGPT fact check - this paragraph claims "And here's a specific, very common mistake worth naming directly: use genuine document redaction tools if information truly needs to be redacted, rather than simply placing black rectangles over text as a visual redaction method, since this fake-redaction technique can leave the actual underlying text still fully present, and searchable, right beneath that black box.", but the counterargument is: The source also warns about personal data in filenames or URLs, notes that robots-blocked URLs may still be indexed, recommends checking final metadata, and advises verifying Search Console beforehand for quick removal. Add the source's filename/URL, metadata, and advance-verification safeguards. Keep the instruction to use a fresh URL for the corrected document.
>
> Sources: Keep redacted information out of Google Search; paragraph 4: https://developers.google.com/search/docs/crawling-indexing/keep-redacted-information-out#keep-redacted-information-out-of-google-search; Edit and export images before embedding them; list item 3: https://developers.google.com/search/docs/crawling-indexing/keep-redacted-information-out#edit-and-export-images-before-embedding-them; Edit or remove unwanted text before moving to a public file format; list item 2: https://developers.google.com/search/docs/crawling-indexing/keep-redacted-information-out#edit-or-remove-unwanted-text-before-moving-to-a-public-file-format.
>
> A037 | Omission | Medium priority | Checked 24 September 2026



What to do if something improperly redacted is already indexed. Google lays out a direct sequence: remove the live document from your site entirely. Use the Removals tool in Search Console to accelerate its removal from Google's own results specifically. If you still need to make a version of that document available, host a properly, genuinely redacted version at a new URL, not the same one, since the old URL may retain cached signals tied to the previous, improperly redacted version. And if other sites have separately hosted a copy of the improperly redacted document, contact those other hosts directly and ask them to remove their own copies too, since your own removal only ever covers your own site.

> ChatGPT fact check - this paragraph claims "Use the Removals tool in Search Console to accelerate its removal from Google's own results specifically.", but the counterargument is: The source also warns about personal data in filenames or URLs, notes that robots-blocked URLs may still be indexed, recommends checking final metadata, and advises verifying Search Console beforehand for quick removal. Add the source's filename/URL, metadata, and advance-verification safeguards. Keep the instruction to use a fresh URL for the corrected document.
>
> Sources: Keep redacted information out of Google Search; paragraph 4: https://developers.google.com/search/docs/crawling-indexing/keep-redacted-information-out#keep-redacted-information-out-of-google-search; Edit and export images before embedding them; list item 3: https://developers.google.com/search/docs/crawling-indexing/keep-redacted-information-out#edit-and-export-images-before-embedding-them; Edit or remove unwanted text before moving to a public file format; list item 2: https://developers.google.com/search/docs/crawling-indexing/keep-redacted-information-out#edit-or-remove-unwanted-text-before-moving-to-a-public-file-format.
>
> A037 | Omission | Medium priority | Checked 24 September 2026



Let's ground this directly in a business context, since it's genuinely relevant. A store dealing with customer data, order records, or even internal planning documents shared as PDFs, say specification sheets or supplier quotes that get exported to PDF and occasionally linked from an otherwise public page, should specifically watch for two things: PDF and spreadsheet exports that quietly retain edit history or hidden sheets, and screenshots or cropped images used in blog posts or guides that might carry more of the original image than what's visually apparent in the crop.

Let's recap.

Google supports several deliberate ways to keep content out of search: removing it outright, password protection, the noindex rule, robots.txt for images and video specifically, and opting out of specific Google properties or features. For content that's already indexed and needs to come down faster, Search Console's removal tools exist to accelerate that process, generally once the underlying content is already gone or blocked at the source, with narrower, more direct pathways for content that poses genuine personal harm. And redaction has to happen at the source, before publication: edit and flatten images before embedding them, use genuine redaction tools rather than a visual black box, move to a public format with no retained history, and if something improperly redacted does get indexed, remove the live document, use the Removals tool, republish properly redacted content at a fresh URL, and chase down any other hosts carrying their own copy.

> ChatGPT fact check - this paragraph claims "Google supports several deliberate ways to keep content out of search: removing it outright, password protection, the noindex rule, robots.txt for images and video specifically, and opting out of specific Google properties or features.", but the counterargument is: The script implies the source must already be removed or blocked before a Search Console removal request. Google's guide provides temporary search-result removal, lasting about six months; a permanent removal separately requires removing/updating content, access protection, or noindex. Use Search Console for quick temporary removal. To keep the page out after the temporary block expires, also remove or update the content, password-protect it, or apply noindex. Do not use robots.txt as the permanent indexing control.
>
> Sources: Remove a page hosted on your site from Google; paragraph 1: https://developers.google.com/search/docs/crawling-indexing/remove-information#remove-a-page-hosted-on-your-site-from-google; Make your removal permanent; paragraph 1: https://developers.google.com/search/docs/crawling-indexing/remove-information#make-your-removal-permanent.
>
> A035 | Error | High priority | Checked 24 September 2026



Next episode, we cover redirects and site moves: how 301 redirects actually work for Google Search, moving a site with or without URL changes, A/B testing without confusing Google, and how to properly pause or temporarily disable a site. See you there.

This episode is adapted from "Control what you share with Google" and "Keep redacted information out of Google Search" on Google Search Central, licensed under Creative Commons Attribution 4.0.

### Episode 18: Redirects, Site Moves, A/B Testing, and Pausing a Business

Welcome back. Today covers everything to do with a site in motion: redirecting URLs properly, moving a site with or without URL changes, running A/B tests without confusing Google, and, genuinely practically, how to safely pause an online business temporarily without wrecking its search standing.

Redirects and Google Search.

A redirect is an HTTP response, in the 3xx status range, that tells a browser or crawler to fetch a different URL than the one requested. There are really two categories worth distinguishing clearly for search purposes: permanent redirects and temporary redirects.

> ChatGPT fact check - this paragraph claims "There are really two categories worth distinguishing clearly for search purposes: permanent redirects and temporary redirects.", but the counterargument is: Not all redirects are HTTP 3xx responses: Google also documents meta refresh, HTTP refresh, and JavaScript mechanisms. Permanent and temporary redirects are canonical signals; the promised ranking-signal transfer and traffic loss are not deterministic outcomes. Describe HTTP redirects as the preferred server-side method, distinguish permanent and temporary signals, and explain other supported mechanisms without promising a particular ranking outcome.
>
> Sources: Overview of redirect types; paragraph 1: https://developers.google.com/search/docs/crawling-indexing/301-redirects#overview-of-redirect-types; Overview of redirect types; table row 4: https://developers.google.com/search/docs/crawling-indexing/301-redirects#overview-of-redirect-types.
>
> A038 | Overstatement | Medium priority | Checked 24 September 2026



A 301, "Moved Permanently", and its close relative 308, tell Google the canonical URL has genuinely changed for good. Search engines respond by transferring ranking signals, accumulated link value and history, over to the new target URL, and treating that new URL as the real one going forward. A 302, "Found", and its relative 307, tell Google the opposite: this redirect is temporary, the original URL is still the real, canonical one, and it should remain what's indexed, with the redirect target simply serving as a stand-in for now.

> ChatGPT fact check - this paragraph claims "A 302, "Found", and its relative 307, tell Google the opposite: this redirect is temporary, the original URL is still the real, canonical one, and it should remain what's indexed, with the redirect target simply serving as a stand-in for now.", but the counterargument is: Not all redirects are HTTP 3xx responses: Google also documents meta refresh, HTTP refresh, and JavaScript mechanisms. Permanent and temporary redirects are canonical signals; the promised ranking-signal transfer and traffic loss are not deterministic outcomes. Describe HTTP redirects as the preferred server-side method, distinguish permanent and temporary signals, and explain other supported mechanisms without promising a particular ranking outcome.
>
> Sources: Overview of redirect types; paragraph 1: https://developers.google.com/search/docs/crawling-indexing/301-redirects#overview-of-redirect-types; Overview of redirect types; table row 4: https://developers.google.com/search/docs/crawling-indexing/301-redirects#overview-of-redirect-types.
>
> A038 | Overstatement | Medium priority | Checked 24 September 2026



Here's the practical guidance that follows directly: use a permanent redirect when a URL has moved for good, a genuine domain migration, a permanent restructure, an HTTPS upgrade from HTTP, or standardising trailing slashes and letter casing. Use a temporary redirect specifically for things that are genuinely temporary: a maintenance window, an A/B test, or geo-based routing that only applies under certain conditions. Getting this backwards is a persistent, common mistake: leaving a genuinely permanent move on a 302 can mean it takes Google a long while to reinterpret that signal correctly, during which the site can lose real traffic, since Google keeps treating the old URL as canonical when you actually wanted it retired.

> ChatGPT fact check - this paragraph claims "Getting this backwards is a persistent, common mistake: leaving a genuinely permanent move on a 302 can mean it takes Google a long while to reinterpret that signal correctly, during which the site can lose real traffic, since Google keeps treating the old URL as canonical when you actually wanted it retired.", but the counterargument is: Not all redirects are HTTP 3xx responses: Google also documents meta refresh, HTTP refresh, and JavaScript mechanisms. Permanent and temporary redirects are canonical signals; the promised ranking-signal transfer and traffic loss are not deterministic outcomes. Describe HTTP redirects as the preferred server-side method, distinguish permanent and temporary signals, and explain other supported mechanisms without promising a particular ranking outcome.
>
> Sources: Overview of redirect types; paragraph 1: https://developers.google.com/search/docs/crawling-indexing/301-redirects#overview-of-redirect-types; Overview of redirect types; table row 4: https://developers.google.com/search/docs/crawling-indexing/301-redirects#overview-of-redirect-types.
>
> A038 | Overstatement | Medium priority | Checked 24 September 2026



Minimizing A/B testing's impact on Google Search.

If you're testing different versions of a page or site, Google has specific guidance to keep that testing from confusing its systems or, worse, accidentally tripping a spam policy.

First and most important: never cloak. Showing search engines one version of a page while showing real visitors a genuinely different one is cloaking, the violation from episode two, and Google is explicit that this applies whether you're running a legitimate test or not; running an experiment is not an exemption. And this holds regardless of the mechanism: cloaking counts whether you achieve it through server-side logic, through robots.txt, or through any other method. The instruction instead: use ordinary links or redirects, exactly as covered in the rest of this section.

If your testing setup relies on cookies to decide which variant a visitor sees, there's a specific technical trap worth knowing: Googlebot generally doesn't support cookies. In practice, that means it will only ever see whichever content version is shown to visitors whose browsers don't accept cookies at all, which may not be the version you intended it to see.

Use rel canonical links across your test variants. If you're running a test involving multiple URLs, place a rel canonical tag, the tool from episode twelve, on every alternate test URL, pointing back to the original as the preferred version. And Google has a specific, clear reason for recommending this over noindex in this exact situation: noindex would tell Google not to index your test variants at all, but what you actually want is different and more precise, for Google to understand that these test URLs are close duplicates or variations of the original, and group them together with the original as canonical. Using noindex here, Google notes directly, can sometimes produce unexpected, unwanted side effects instead.

Use 302 redirects, never 301s, for any test that redirects visitors from the original URL to a variant URL. This tells search engines plainly that the redirect is temporary, active only for the duration of the experiment, and that the original URL should stay in the index rather than being quietly replaced by the test variant. JavaScript-based redirects work fine for this purpose too.

Run the experiment only as long as genuinely necessary. How long a reliable test actually needs depends on your conversion rates and your traffic volume, and a good testing tool will tell you once you've gathered enough data for a statistically reliable conclusion; there's no reason to leave a test running indefinitely once it's answered its question.

And a related, genuinely useful piece of guidance if a site move and an A/B test ever happen to overlap: Google has specifically advised against running large sets of A/B tests during an active site migration, since Google is trying to build a clean, coherent understanding of what's happening across your site during a migration, and a complex, simultaneous testing setup measurably slows down how quickly it can transfer your algorithmic signals from the old site to the new one. If a migration is underway, the cleaner and simpler your signals, the faster and smoother that transition goes.

> ChatGPT fact check - this paragraph claims "And a related, genuinely useful piece of guidance if a site move and an A/B test ever happen to overlap: Google has specifically advised against running large sets of A/B tests during an active site migration, since Google is trying to build a clean, coherent understanding of what's happening across your site during a migration, and a complex, simultaneous testing setup measurably slows down how quickly it can transfer your algorithmic signals from the old site to the new one.", but the counterargument is: The claim that large A/B tests during migration 'measurably' slow transfer of algorithmic signals is not supported by the cited A/B-testing guide. Google's site-move advice to change one thing at a time is narrower. During a migration, Google recommends changing one thing at a time. Remove the asserted measured algorithmic-transfer effect unless a direct source is supplied.
>
> Sources: General best practices for site moves; list item 2: https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes#general_recommendations_for_site_moves.
>
> A039 | Unsupported | Medium priority | Checked 24 September 2026



Moving a site without changing URLs: changing your hosting.

This covers switching hosting providers or moving to a content delivery network, where the URLs themselves stay exactly the same, only the underlying infrastructure serving them changes.

Prepare the new infrastructure first. Upload and thoroughly test a working copy of your site on the new hosting before you touch anything live. Verify Google's access to the new setup directly through the URL Inspection tool in Search Console. And lower your DNS time-to-live value temporarily ahead of the actual switch, so that once you do flip the switch, the change propagates faster across the internet's DNS caches.

Then initiate the move itself by updating your DNS settings to point at the new hosting. Monitor traffic on both the old and new servers during the transition, using server logs and public DNS-checking tools to confirm the switch is actually propagating as expected. Make sure nothing on the new infrastructure is accidentally blocking crawlers that wasn't blocked before. And only shut down the old hosting once you're genuinely confident every visitor, Googlebot included, is reliably reaching the new infrastructure and nothing is still relying on the old one.

Expect some temporary fluctuation in Googlebot's crawl rate immediately after a move like this; it typically stabilises, and can even increase, once Google has confidently re-mapped everything to the new setup.

Moving a site with URL changes is a more involved process, covered in Google's own dedicated, longer guide, since it involves the full weight of redirect mapping and canonical signal transfer discussed above, applied across an entire site at once; worth consulting directly if a genuine domain or URL-structure migration is ever on the table.

> ChatGPT fact check - this paragraph claims "Moving a site with URL changes is a more involved process, covered in Google's own dedicated, longer guide, since it involves the full weight of redirect mapping and canonical signal transfer discussed above, applied across an entire site at once; worth consulting directly if a genuine domain or URL-structure migration is ever on the table.", but the counterargument is: Although the episode is presented as covering site moves, its entire treatment of URL-changing moves is a pointer to the longer guide. Mapping old/new URLs, verification, direct redirects, Change of Address where applicable, updated canonicals/hreflang/sitemaps, and monitoring are missing. Add an accessible migration chapter. Include keeping redirects for at least a year, avoiding irrelevant redirects, and the June 2026 guidance about domain variants in Change of Address.
>
> Sources: Start the site move; list item 4: https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes#start-site-move; Start the site move; list item 5: https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes#start-site-move.
>
> A040 | Omission | High priority | Checked 24 September 2026



Temporarily pausing or disabling a website, and this section is genuinely practical for any seasonal or circumstantial business interruption.

Google's framing is specifically aimed at a business that can't currently fulfil orders, say most products are out of stock, but expects the situation to be temporary, resuming within weeks or months. In that specific situation, Google's clear recommendation is: limit your site's functionality, but keep it online. This is explicitly the recommended approach, because it minimises any negative effect on your search presence; people can still find your products, still read reviews, still build a wishlist for when they can purchase again later.

The specific steps Google recommends. Disable the cart functionality specifically, which Google calls the simplest approach, one that doesn't change anything about your site's visibility in Search at all, since the underlying pages and content remain fully intact and crawlable. Display a clear banner or popup across every page, including your landing page, immediately making the situation clear to visitors, mentioning any known delays, altered shipping times, or pickup and delivery options, so people arrive with accurate expectations rather than a confusing surprise at checkout. And here's a detail that ties directly back to episode sixteen: to keep that banner or popup's text from being pulled into a search snippet, wrap it with the data-nosnippet attribute, so it doesn't end up quoted out of context in someone's search result. Update your structured data to match reality: adjust Product markup to reflect genuine current availability, mark any affected Event markup as cancelled if relevant, and if you have a physical storefront, update your Local Business structured data to reflect actual current hours. If you use Merchant Center, follow its specific best practices for the availability attribute, so your feed doesn't keep advertising stock you don't actually have.

Google poses a couple of its own frequently asked questions here worth passing along directly, since they resolve some very natural worries. What happens if I only close for a few weeks? Google's answer: if you fully shut the site down completely, even briefly, Google can genuinely have trouble properly indexing it again afterward; it's meaningfully better to limit functionality, as described above, rather than take the whole site offline. Even if you're not selling anything right now, people may still want to look up information about your products, your services, or your business generally, so keeping that content reachable has real value on its own.

And two closing, sharp warnings, worth remembering precisely if this situation ever comes up. Don't use the Search Console temporary removals tool if you intend to reopen; that tool is meant for content you genuinely want hidden, and using it here would mean visitors literally cannot find your site to even learn what happened to it, and any distributors or partner businesses associated with your products might keep appearing in results while your own listing vanishes underneath them. And never block your entire site in robots.txt with a full disallow rule during a pause, and never let your server return a blanket 503 status to robots.txt itself specifically, since a robots.txt file that's fully blocked or unreachable in the wrong way can lead to your site's actual content, and potentially its URLs entirely, being removed from Google Search altogether, which is a considerably more drastic and harder-to-reverse outcome than the temporary interruption you were actually trying to manage.

If a genuine, full 503 status is ever needed for the site as a whole, say during active maintenance rather than a business pause specifically, Google's practical advice is to keep that error page itself lightweight: use a retry-after HTTP header with your best estimate of when service will resume, keep the page as static HTML with minimal external resources, inline your CSS and any small images directly rather than loading them as separate requests, and give visitors clear guidance right on that page about what's happening and how to reach you in the meantime.

> ChatGPT fact check - this paragraph claims "If a genuine, full 503 status is ever needed for the site as a whole, say during active maintenance rather than a business pause specifically, Google's practical advice is to keep that error page itself lightweight: use a retry-after HTTP header with your best estimate of when service will resume, keep the page as static HTML with minimal external resources, inline your CSS and any small images directly rather than loading them as separate requests, and give visitors clear guidance right on that page about what's happening and how to reach you in the meantime.", but the counterargument is: The maintenance paragraph describes how to serve a 503 page but omits Google's one-to-two-day emergency timeframe and the warning against prolonged shutdown. For an urgent shutdown of one or two days, return an informational 503 response. Longer outages require careful planning; keeping useful pages available is the recommended business-pause approach.
>
> Sources: Not recommended: Disable the whole website; list item 6: https://developers.google.com/search/docs/crawling-indexing/pause-online-business#disable-site.
>
> A041 | Omission | Medium priority | Checked 24 September 2026



Let's recap.

Use 301 or 308 for genuinely permanent URL moves, 302 or 307 for anything temporary, since getting this backwards costs real traffic while Google slowly reinterprets your intent. For A/B testing, never cloak, remember Googlebot generally ignores cookies, use rel canonical rather than noindex across variants, use 302s for any redirect-based test, and keep tests running only as long as they need to, especially clear of an active site migration. Moving hosting without URL changes means preparing and testing the new infrastructure first, lowering DNS TTL ahead of the switch, and only retiring the old infrastructure once everything's confirmed on the new one. And pausing a business temporarily means limiting functionality while keeping the site online, updating your structured data and Merchant Center feed to reflect reality, using data-nosnippet on any status banner, and never fully blocking the site in robots.txt or reaching for the removals tool, since either of those turns a temporary pause into a much harder recovery.

> ChatGPT fact check - this paragraph claims "Use 301 or 308 for genuinely permanent URL moves, 302 or 307 for anything temporary, since getting this backwards costs real traffic while Google slowly reinterprets your intent.", but the counterargument is: Not all redirects are HTTP 3xx responses: Google also documents meta refresh, HTTP refresh, and JavaScript mechanisms. Permanent and temporary redirects are canonical signals; the promised ranking-signal transfer and traffic loss are not deterministic outcomes. Describe HTTP redirects as the preferred server-side method, distinguish permanent and temporary signals, and explain other supported mechanisms without promising a particular ranking outcome.
>
> Sources: Overview of redirect types; paragraph 1: https://developers.google.com/search/docs/crawling-indexing/301-redirects#overview-of-redirect-types; Overview of redirect types; table row 4: https://developers.google.com/search/docs/crawling-indexing/301-redirects#overview-of-redirect-types.
>
> A038 | Overstatement | Medium priority | Checked 24 September 2026



Next episode, we move into Part Three: ranking and search appearance, starting with Google's ranking systems overview, core updates, spam updates, and the reviews system. See you there.

This episode is adapted from "Redirects and Google Search," "Minimize A/B testing impact in Google Search," "Changing your hosting," and "Temporarily pause or disable a website" on Google Search Central, licensed under Creative Commons Attribution 4.0.

## Part Three: Ranking and Appearance

### Episode 19: Ranking Systems, Core Updates, Spam Updates, and the Reviews System

Welcome back. This episode opens Part Three, ranking and search appearance. Today we cover what a "ranking system" actually is versus an "update", how core updates specifically work and how to sensibly react to one, spam updates, and Google's reviews system.

> ChatGPT fact check - this paragraph claims "Today we cover what a "ranking system" actually is versus an "update", how core updates specifically work and how to sensibly react to one, spam updates, and Google's reviews system.", but the counterargument is: The episode mainly defines systems versus updates; it does not actually adapt the ranking-systems guide's descriptions of BERT, neural matching, RankBrain, passage ranking, link analysis, freshness, deduplication, and other systems. Either add a chapter covering the current ranking-systems guide or explicitly label this as an overview of updates rather than the ranking-systems documentation.
>
> Sources: A guide to Google Search ranking systems; paragraph 1: https://developers.google.com/search/docs/appearance/ranking-systems-guide#a-guide-to-google-search-ranking-systems.
>
> A043 | Omission | Medium priority | Checked 24 September 2026



Ranking systems versus updates: a distinction worth having precisely, since these terms get used loosely.

Ranking systems are what Google actually uses to generate search results in the first place. Google runs multiple ranking systems, each doing something different; there isn't one single monolithic algorithm, but a whole collection of systems working together. Updates, by contrast, are when Google makes an improvement to one of those existing systems. Google's own framing: results aren't perfect, and updates are how these systems get better over time at surfacing genuinely good results.

> ChatGPT fact check - this paragraph claims "Ranking systems are what Google actually uses to generate search results in the first place.", but the counterargument is: The episode mainly defines systems versus updates; it does not actually adapt the ranking-systems guide's descriptions of BERT, neural matching, RankBrain, passage ranking, link analysis, freshness, deduplication, and other systems. Either add a chapter covering the current ranking-systems guide or explicitly label this as an overview of updates rather than the ranking-systems documentation.
>
> Sources: A guide to Google Search ranking systems; paragraph 1: https://developers.google.com/search/docs/appearance/ranking-systems-guide#a-guide-to-google-search-ranking-systems.
>
> A043 | Omission | Medium priority | Checked 24 September 2026



Core updates.

Several times a year, Google makes broad, significant changes to its search algorithms and systems collectively, and these are what get called core updates. Google gives notice of these on its public ranking updates history page. And here's a genuinely reassuring opening line worth remembering: in general, most sites don't need to worry about core updates at all, and may not even notice one happened.

How core updates actually work. They're designed to make sure that, overall, Google is delivering on its mission to present helpful, reliable results. These changes are broad in nature and don't target specific sites or individual pages; as content across the entire web changes and evolves, Google reassesses and updates its systems to keep pace with that change, as a whole.

Google offers its own analogy for this, and it's worth hearing precisely, because it reframes the whole idea usefully. Imagine a friend asked you for your top restaurant recommendations. You have a list of your twenty favourites, but things have changed since you first wrote that list some years back. New restaurants that didn't exist before are now genuine candidates. You might reassess some existing entries and realise they deserve to move up, based on consistently good experiences, or to better account for your friend's specific preferences, say a preference for dog-friendly spots. The list changes. And crucially: restaurants that move down aren't necessarily bad; there are simply other restaurants that now make your top twenty instead.

What to actually do if you suspect a core update affected your traffic. First, confirm the core update has genuinely finished rolling out, by checking the Search Status Dashboard for its start and end dates, since judging impact mid-rollout can be misleading. Then use Search Console to look for a correlating drop, and assess honestly.

> ChatGPT fact check - this paragraph claims "First, confirm the core update has genuinely finished rolling out, by checking the Search Status Dashboard for its start and end dates, since judging impact mid-rollout can be misleading.", but the counterargument is: The chapter omits waiting at least one full week after a core update, distinguishing small from large drops, and link-spam benefits that cannot be regained. Matching dates suggests correlation, not proven causation. The reviews system also covers more than products/services and excludes third-party user reviews. Restore the assessment timing and recovery cautions. Explain the reviews system's first-party review scope and supported languages; say that timing alone cannot establish the cause of a traffic change.
>
> Sources: Check if there's a traffic drop in Search Console; list item 2: https://developers.google.com/search/docs/appearance/core-updates#check-search-console; Check if there's a traffic drop in Search Console; list item 3: https://developers.google.com/search/docs/appearance/core-updates#check-search-console; Check if there's a traffic drop in Search Console; list item 4: https://developers.google.com/search/docs/appearance/core-updates#check-search-console.
>
> A042 | Omission | Medium priority | Checked 24 September 2026



Google's specific recommendation for that assessment: take a close, genuinely objective look at your site as a whole, and consider asking others you trust, people unaffiliated with your site, to do the same kind of honest assessment. This points directly back to the self-assessment questions from episode six, the same content-quality and expertise questions covered there; Google explicitly reuses that same framework here, rather than offering a separate core-update-specific checklist. Consider an audit of your drops specifically: which pages were most affected, and for what kinds of searches, then hold those particular pages up against the questions from episode six directly. And it's worth asking, honestly: are other pages, elsewhere on the web, now doing a better job answering that same query than yours does? If so, why?

> ChatGPT fact check - this paragraph claims "This points directly back to the self-assessment questions from episode six, the same content-quality and expertise questions covered there; Google explicitly reuses that same framework here, rather than offering a separate core-update-specific checklist.", but the counterargument is: The chapter omits waiting at least one full week after a core update, distinguishing small from large drops, and link-spam benefits that cannot be regained. Matching dates suggests correlation, not proven causation. The reviews system also covers more than products/services and excludes third-party user reviews. Restore the assessment timing and recovery cautions. Explain the reviews system's first-party review scope and supported languages; say that timing alone cannot establish the cause of a traffic change.
>
> Sources: Check if there's a traffic drop in Search Console; list item 2: https://developers.google.com/search/docs/appearance/core-updates#check-search-console; Check if there's a traffic drop in Search Console; list item 3: https://developers.google.com/search/docs/appearance/core-updates#check-search-console; Check if there's a traffic drop in Search Console; list item 4: https://developers.google.com/search/docs/appearance/core-updates#check-search-console.
>
> A042 | Omission | Medium priority | Checked 24 September 2026



Spam updates.

These are narrower and more targeted than core updates: periodic improvements specifically to Google's automated spam-detection systems, the ones enforcing the spam policies from episode two. Google's own framing: its automated spam detection is constantly improving in the background, but periodic, more concentrated updates get released to meaningfully strengthen it further. These tend to target the familiar categories from episode two directly: low-quality, unhelpful, deceptive, or manipulative content. If your site follows the spam policies genuinely, a spam update simply isn't something to worry about; it's aimed squarely at the practices episode two already told you to avoid.

> ChatGPT fact check - this paragraph claims "If your site follows the spam policies genuinely, a spam update simply isn't something to worry about; it's aimed squarely at the practices episode two already told you to avoid.", but the counterargument is: The chapter omits waiting at least one full week after a core update, distinguishing small from large drops, and link-spam benefits that cannot be regained. Matching dates suggests correlation, not proven causation. The reviews system also covers more than products/services and excludes third-party user reviews. Restore the assessment timing and recovery cautions. Explain the reviews system's first-party review scope and supported languages; say that timing alone cannot establish the cause of a traffic change.
>
> Sources: Check if there's a traffic drop in Search Console; list item 2: https://developers.google.com/search/docs/appearance/core-updates#check-search-console; Check if there's a traffic drop in Search Console; list item 3: https://developers.google.com/search/docs/appearance/core-updates#check-search-console; Check if there's a traffic drop in Search Console; list item 4: https://developers.google.com/search/docs/appearance/core-updates#check-search-console.
>
> A042 | Omission | Medium priority | Checked 24 September 2026



Worth knowing as a practical, current detail: core updates and spam updates sometimes roll out in close succession, even overlapping in their rollout windows. When that happens, untangling which specific update caused which specific change becomes genuinely harder, since two different systems are shifting at once. If you ever notice ranking movement during a period like that, checking the Search Status Dashboard for the precise, official start and end dates of each separate update is the most reliable way to actually attribute any change you're seeing to the right cause.

> ChatGPT fact check - this paragraph claims "If you ever notice ranking movement during a period like that, checking the Search Status Dashboard for the precise, official start and end dates of each separate update is the most reliable way to actually attribute any change you're seeing to the right cause.", but the counterargument is: The chapter omits waiting at least one full week after a core update, distinguishing small from large drops, and link-spam benefits that cannot be regained. Matching dates suggests correlation, not proven causation. The reviews system also covers more than products/services and excludes third-party user reviews. Restore the assessment timing and recovery cautions. Explain the reviews system's first-party review scope and supported languages; say that timing alone cannot establish the cause of a traffic change.
>
> Sources: Check if there's a traffic drop in Search Console; list item 2: https://developers.google.com/search/docs/appearance/core-updates#check-search-console; Check if there's a traffic drop in Search Console; list item 3: https://developers.google.com/search/docs/appearance/core-updates#check-search-console; Check if there's a traffic drop in Search Console; list item 4: https://developers.google.com/search/docs/appearance/core-updates#check-search-console.
>
> A042 | Omission | Medium priority | Checked 24 September 2026



The reviews system.

This is a more specific, standing system, distinct from periodic core or spam updates, aimed specifically at content whose primary purpose is reviewing products or services. Google made a notable structural decision about this system worth knowing: at a certain point, it moved from occasionally announcing standalone "reviews system updates" to having this system improve on a continuous, ongoing basis instead, meaning there's no longer a periodic announcement to watch for the way there is with core or spam updates; refinement simply happens continuously now. The practical implication for anyone publishing reviews: Google's specific guidance on writing high-quality reviews, which we'll cover properly in the ecommerce episode later in this series, is the thing to stay focused on over time, rather than watching for discrete update announcements the way you might for core updates.

> ChatGPT fact check - this paragraph claims "This is a more specific, standing system, distinct from periodic core or spam updates, aimed specifically at content whose primary purpose is reviewing products or services.", but the counterargument is: The chapter omits waiting at least one full week after a core update, distinguishing small from large drops, and link-spam benefits that cannot be regained. Matching dates suggests correlation, not proven causation. The reviews system also covers more than products/services and excludes third-party user reviews. Restore the assessment timing and recovery cautions. Explain the reviews system's first-party review scope and supported languages; say that timing alone cannot establish the cause of a traffic change.
>
> Sources: Check if there's a traffic drop in Search Console; list item 2: https://developers.google.com/search/docs/appearance/core-updates#check-search-console; Check if there's a traffic drop in Search Console; list item 3: https://developers.google.com/search/docs/appearance/core-updates#check-search-console; Check if there's a traffic drop in Search Console; list item 4: https://developers.google.com/search/docs/appearance/core-updates#check-search-console.
>
> A042 | Omission | Medium priority | Checked 24 September 2026



Let's bring this together with a concrete, useful takeaway, especially relevant to a store that occasionally publishes its own reviews or comparison content. If organic traffic to a specific page dips and the timing lines up with an announced core or spam update, resist the urge to make hasty, reactive changes before you've confirmed the rollout is actually complete. Once it is, run the honest self-assessment from episode six specifically against the affected pages, rather than guessing at some hidden technical cause. And if the content in question is genuinely a product review, hold it against Google's dedicated review-quality guidance directly, since that's a continuously evolving standard rather than a discrete update you could otherwise track and time your response around.

Let's recap.

Ranking systems are the standing mechanisms that generate results; updates are improvements made to those systems over time. Core updates are broad, un-targeted reassessments of the entire web's content landscape, best understood through Google's own restaurant-list analogy: the list changes as better candidates emerge, and moving down doesn't mean something is bad, only that something else now ranks ahead of it. The right response to a suspected core-update impact is confirming the rollout has finished, then running the honest, episode-six self-assessment against the specific affected pages. Spam updates are narrower, targeted improvements to the automated systems enforcing episode two's policies, and following those policies genuinely is the only real preparation needed. And the reviews system has moved to continuous, ongoing refinement rather than periodic announced updates, so staying aligned with Google's review-quality guidance over time matters more than watching for any specific update.

Next episode, we cover page experience properly: Core Web Vitals in technical detail, and how to avoid intrusive interstitials that can actively harm both user experience and your search standing. See you there.

This episode is adapted from "Google Search's core updates and your website," Google's ranking systems documentation, and related guidance on Google Search Central, licensed under Creative Commons Attribution 4.0.

> ChatGPT fact check - this paragraph claims "This episode is adapted from "Google Search's core updates and your website," Google's ranking systems documentation, and related guidance on Google Search Central, licensed under Creative Commons Attribution 4.0.", but the counterargument is: The episode mainly defines systems versus updates; it does not actually adapt the ranking-systems guide's descriptions of BERT, neural matching, RankBrain, passage ranking, link analysis, freshness, deduplication, and other systems. Either add a chapter covering the current ranking-systems guide or explicitly label this as an overview of updates rather than the ranking-systems documentation.
>
> Sources: A guide to Google Search ranking systems; paragraph 1: https://developers.google.com/search/docs/appearance/ranking-systems-guide#a-guide-to-google-search-ranking-systems.
>
> A043 | Omission | Medium priority | Checked 24 September 2026



### Episode 20: Page Experience, Core Web Vitals, and Avoiding Intrusive Interstitials

Welcome back. Today we cover page experience in real technical depth, especially Core Web Vitals, the three specific metrics Google actually measures, and the specific practice of intrusive interstitials, the kind of pop-up and overlay design that can genuinely harm both your visitors and your search standing.

Page experience, as a concept.

Google's core ranking systems, from last episode, look to reward content that provides a good overall page experience. And there's a specific piece of guidance worth remembering precisely: don't focus on just one or two aspects of this and call it done. Check whether you're delivering a genuinely good experience across many dimensions at once. Page experience isn't only Core Web Vitals; it also includes things like mobile-friendliness, from episode thirteen, serving your site over HTTPS, keeping it free of Safe Browsing issues like malware, and avoiding intrusive interstitials, which we'll get to shortly.

Now, Core Web Vitals specifically: the three field metrics Google treats as most central to real-world page experience.

Here's the foundational thing to understand before the individual metrics themselves: these are field metrics, meaning they're measured from real visitors actually using your site, not from a single artificial lab test run once in a testing tool. The underlying data source is called the Chrome User Experience Report, drawing on real Chrome users who've opted in to share usage data. A lab tool like Lighthouse can estimate these same metrics for your own debugging purposes, but the actual scores Google uses for its ranking signal come from this aggregated real-world field data, not from any single lab run.

> ChatGPT fact check - this paragraph claims "A lab tool like Lighthouse can estimate these same metrics for your own debugging purposes, but the actual scores Google uses for its ranking signal come from this aggregated real-world field data, not from any single lab run.", but the counterargument is: A normal Lighthouse navigation audit cannot directly measure a real visit's INP; it uses diagnostic proxies such as Total Blocking Time. Google does not publish a fixed modest CWV weighting or a stricter SEO threshold for transactional pages. Distinguish field INP from lab diagnostics. State that CWV are used in ranking and good scores do not guarantee rank; label conversion-based prioritization as editorial advice, not a special Google standard.
>
> Sources: In the lab; paragraph 2: https://web.dev/articles/inp#lab-measurement.
>
> A046 | Unsupported | Medium priority | Checked 24 September 2026



And here's a detail about how thresholds get applied that's genuinely easy to misunderstand: each metric is judged specifically at the 75th percentile of real visits. That means a page only earns a "good" rating on any given metric once at least three-quarters of its real visitors experienced a good result on that metric, not merely the typical or average visitor. This deliberately weights in the slower, worse experiences that a simple average would otherwise hide: if most visitors get a fast result but the slowest quarter consistently sees something considerably worse, the page fails that metric overall, even though a typical visit looks perfectly fine.

> ChatGPT fact check - this paragraph claims "That means a page only earns a "good" rating on any given metric once at least three-quarters of its real visitors experienced a good result on that metric, not merely the typical or average visitor.", but the counterargument is: It correctly says three quarters must meet the threshold, then says a poor slowest quarter necessarily causes failure. If the 75th-percentile value meets the threshold, a worse remaining quarter does not by itself overturn that result. Evaluate the metric at the 75th percentile of eligible page views. A good result means at least roughly three quarters of measured experiences meet the good threshold.
>
> Sources: Core Web Vitals; paragraph 3: https://web.dev/articles/vitals#core-web-vitals; Core Web Vitals; paragraph 4: https://web.dev/articles/vitals#core-web-vitals.
>
> A044 | Error | Medium priority | Checked 24 September 2026



The three metrics themselves, each measuring a genuinely different part of the experience.

Largest Contentful Paint, LCP, measures loading: specifically, how long it takes for the largest visible element in the viewport, commonly a hero image, a large heading, or a video poster frame, to finish rendering. The good threshold is 2.5 seconds or less, at that 75th percentile. Common causes of a poor LCP score include an oversized, uncompressed hero image, and render-blocking CSS or JavaScript that delays the page from rendering its main content at all.

Interaction to Next Paint, INP, measures responsiveness. This one replaced an older metric called First Input Delay back in 2024, and the change was meaningful: rather than judging only the page's very first interaction, INP looks across every click, tap, and keypress throughout an entire visit, and reports the slowest delay between any input and the page's next visual response. The good threshold is 200 milliseconds or less.

> ChatGPT fact check - this paragraph claims "This one replaced an older metric called First Input Delay back in 2024, and the change was meaningful: rather than judging only the page's very first interaction, INP looks across every click, tap, and keypress throughout an entire visit, and reports the slowest delay between any input and the page's next visual response.", but the counterargument is: INP is not always the absolute slowest interaction: it ignores a high outlier for each 50 interactions. CLS is not confined to initial page loading; it measures unexpected shifts across the page lifecycle using session windows. INP reflects a page visit's worst or near-worst interaction latency, allowing for outliers. CLS measures unexpected layout shifts over the page lifecycle, using the largest session-window score.
>
> Sources: What is INP?; paragraph 1: https://web.dev/articles/inp#what-is-inp; What is INP?; paragraph 4: https://web.dev/articles/inp#what-is-inp; What is CLS?; paragraph 1: https://web.dev/articles/cls#what-is-cls.
>
> A045 | Error | Medium priority | Checked 24 September 2026



Cumulative Layout Shift, CLS, measures visual stability: essentially, how much visible content unexpectedly jumps around while a page is loading, the frustrating experience of trying to tap a button just as an ad loads in above it and shoves everything down. It's a unitless score, weighted by how much of the viewport moved and how far it moved. The good threshold is 0.1 or less.

> ChatGPT fact check - this paragraph claims "Cumulative Layout Shift, CLS, measures visual stability: essentially, how much visible content unexpectedly jumps around while a page is loading, the frustrating experience of trying to tap a button just as an ad loads in above it and shoves everything down.", but the counterargument is: INP is not always the absolute slowest interaction: it ignores a high outlier for each 50 interactions. CLS is not confined to initial page loading; it measures unexpected shifts across the page lifecycle using session windows. INP reflects a page visit's worst or near-worst interaction latency, allowing for outliers. CLS measures unexpected layout shifts over the page lifecycle, using the largest session-window score.
>
> Sources: What is INP?; paragraph 1: https://web.dev/articles/inp#what-is-inp; What is INP?; paragraph 4: https://web.dev/articles/inp#what-is-inp; What is CLS?; paragraph 1: https://web.dev/articles/cls#what-is-cls.
>
> A045 | Error | Medium priority | Checked 24 September 2026



A page needs to clear the good threshold on all three metrics simultaneously, at that 75th percentile, to earn the overall "good" classification Search Console will actually show you.

How much does this genuinely matter for ranking, versus other factors we've covered? Worth being honest about the real proportion here, since it's frequently overstated: Core Web Vitals are a confirmed ranking signal, but a comparatively modest one. Google's own broader documentation is clear that content relevance and quality, everything from episodes four through six, outweighs page experience as a ranking factor. The realistic way to think about it: Core Web Vitals won't override genuinely strong, relevant content, but when two pages are otherwise closely matched in quality and relevance for the same search, the one with better Core Web Vitals has a real, if modest, edge. Practically speaking, that means it's worth genuine attention, but not worth letting it eclipse the content-quality work from earlier episodes.

> ChatGPT fact check - this paragraph claims "Worth being honest about the real proportion here, since it's frequently overstated: Core Web Vitals are a confirmed ranking signal, but a comparatively modest one.", but the counterargument is: A normal Lighthouse navigation audit cannot directly measure a real visit's INP; it uses diagnostic proxies such as Total Blocking Time. Google does not publish a fixed modest CWV weighting or a stricter SEO threshold for transactional pages. Distinguish field INP from lab diagnostics. State that CWV are used in ranking and good scores do not guarantee rank; label conversion-based prioritization as editorial advice, not a special Google standard.
>
> Sources: In the lab; paragraph 2: https://web.dev/articles/inp#lab-measurement.
>
> A046 | Unsupported | Medium priority | Checked 24 September 2026



Where to check your own numbers: Search Console's Core Web Vitals report groups pages by similar URL patterns, genuinely useful on a large site rather than needing to check thousands of individual URLs one at a time, and PageSpeed Insights shows both the real field data and a lab-based estimate side by side for any single URL you want to check directly.

One detail worth flagging for a store specifically: transactional pages, product pages, cart, and checkout flows, tend to be held to a more exacting standard in practice, simply because any slowdown on exactly those pages translates directly into lost conversions and lost revenue, not merely a slightly worse browsing experience. If you're going to prioritise Core Web Vitals work anywhere on a limited budget, those transactional pages are where the return is most direct.

> ChatGPT fact check - this paragraph claims "One detail worth flagging for a store specifically: transactional pages, product pages, cart, and checkout flows, tend to be held to a more exacting standard in practice, simply because any slowdown on exactly those pages translates directly into lost conversions and lost revenue, not merely a slightly worse browsing experience.", but the counterargument is: A normal Lighthouse navigation audit cannot directly measure a real visit's INP; it uses diagnostic proxies such as Total Blocking Time. Google does not publish a fixed modest CWV weighting or a stricter SEO threshold for transactional pages. Distinguish field INP from lab diagnostics. State that CWV are used in ranking and good scores do not guarantee rank; label conversion-based prioritization as editorial advice, not a special Google standard.
>
> Sources: In the lab; paragraph 2: https://web.dev/articles/inp#lab-measurement.
>
> A046 | Unsupported | Medium priority | Checked 24 September 2026



Now, avoiding intrusive interstitials and dialogs.

Google's own definition: intrusive interstitials and dialogs are page elements that obstruct a user's view of the underlying content, usually for promotional purposes. An interstitial is an overlay covering an entire page; a dialog covers only part of a page, sometimes still obscuring the content underneath. Google acknowledges directly that websites often have genuinely legitimate reasons to show a dialog. But interrupting users with an intrusive one can cause real frustration and damage trust in a site, and, tying this straight back to episode fourteen's rendering discussion, an intrusive interstitial can also make it genuinely harder for Google itself to understand a page's actual content and structure, which can lead to poor search performance on top of the poor user experience.

What specifically counts as intrusive. A popup or modal window that blocks most or all of a page's content, essentially a full-screen interstitial appearing right above everything else. A standalone interstitial that isn't responsive and simply blocks the content outright. And a more subtle pattern worth watching for specifically: a layout where the content above the fold looks and behaves like an interstitial itself, one that requires dismissal or scrolling before a visitor can ever reach the actual main content beneath it, even without technically being a separate overlay element.

The recommended alternative: use a banner instead of an interstitial. A banner covers only a small portion of the screen, letting visitors and search engines alike access the actual content immediately upon arriving at the page. This applies to essentially any kind of promotional dialog, including app-install prompts specifically, which were historically one of the most common sources of exactly this kind of intrusive pattern.

There are legitimate exceptions Google explicitly carves out, worth knowing precisely. Dialogs required by law, cookie consent notices and age-verification requirements being the obvious cases, aren't penalised for being interstitials, provided they're implemented reasonably. And for content specifically aimed at adult audiences with a mandatory, legally required age gate, Google's specific recommendation is to allow Googlebot to crawl the actual content without triggering that age gate itself, essentially verifying that the specific request genuinely comes from Googlebot using the techniques from episode eleven, and serving the underlying content directly to it rather than making the crawler navigate through an interaction gate no human-equivalent crawler could actually click through.

Let's ground this in something directly relevant to a store: a genuinely common pattern worth double-checking is a full-screen "sign up for ten percent off" popup that fires the instant someone lands on a product page, particularly one arriving from a Google search result specifically. Under Google's own definition here, that's a textbook intrusive interstitial: a promotional overlay blocking the actual content a searcher clicked through specifically to see. The straightforward fix that keeps the same promotional goal intact: convert it into a small, dismissable banner instead, or genuinely delay its appearance until after a visitor has had a real chance to engage with the actual content they came for.

Let's recap.

Page experience is broader than Core Web Vitals alone, also covering mobile-friendliness, HTTPS, security, and freedom from intrusive interstitials, and the guidance is to improve broadly across all of these rather than fixating on just one. Core Web Vitals are three field metrics measured from real visitor data at the 75th percentile: LCP for loading at 2.5 seconds or better, INP for responsiveness at 200 milliseconds or better, and CLS for visual stability at 0.1 or better. It's a genuine but comparatively modest ranking factor, well behind content relevance and quality, though transactional pages specifically reward the investment through conversions regardless of any ranking effect. And intrusive interstitials, full-page overlays or dialogs that block content immediately on arrival, particularly for promotional purposes, should generally become small, dismissable banners instead, with narrow, specific exceptions for legally required consent and age-verification dialogs.

> ChatGPT fact check - this paragraph claims "It's a genuine but comparatively modest ranking factor, well behind content relevance and quality, though transactional pages specifically reward the investment through conversions regardless of any ranking effect.", but the counterargument is: A normal Lighthouse navigation audit cannot directly measure a real visit's INP; it uses diagnostic proxies such as Total Blocking Time. Google does not publish a fixed modest CWV weighting or a stricter SEO threshold for transactional pages. Distinguish field INP from lab diagnostics. State that CWV are used in ranking and good scores do not guarantee rank; label conversion-based prioritization as editorial advice, not a special Google standard.
>
> Sources: In the lab; paragraph 2: https://web.dev/articles/inp#lab-measurement.
>
> A046 | Unsupported | Medium priority | Checked 24 September 2026



Next episode, we move into how your listing actually looks in results: title links, snippets, site names, sitelinks, and favicons, the full set of visual elements a searcher sees before they ever click through to your page. See you there.

This episode is adapted from "Understanding page experience in Google Search results," Core Web Vitals documentation, and "Avoid intrusive interstitials and dialogs" on Google Search Central, licensed under Creative Commons Attribution 4.0.

### Episode 21: Title Links, Snippets, Site Names, Sitelinks, and Favicons

Welcome back. This episode is a close-up on the actual anatomy of a Google search result: every visual piece a searcher sees before they ever click through, and what you can genuinely influence about each one.

The title link.

This is Google's own coined term for the clickable, headline part of a result. Google draws on several different sources to generate it automatically, chiefly your page's title element, but also other headings on the page and, sometimes, other contextual signals, and you indicate your own preference by following the descriptive-title guidance we already covered back in episode five. Worth restating precisely here: because Google draws on multiple sources rather than simply echoing your title tag verbatim, it can and does rewrite what's shown, specifically when it judges your actual title tag doesn't accurately describe the page, runs too long, looks keyword-stuffed, or doesn't line up well with what a searcher actually typed. The practical way to minimise unwanted rewrites: keep titles reasonably concise, genuinely descriptive of that specific page, and free of repetitive boilerplate text stuffed onto every single page across your site.

The snippet.

This is Google's own term for the descriptive text beneath the title link, the short summary helping a searcher judge whether to click. Google draws on a number of sources to build this too, commonly the meta description tag you write directly for that page, but it may also pull from content elsewhere on the page itself, or build what's called a rich result from structured data and page content together, which we'll get into properly starting in episode twenty-three.

> ChatGPT fact check - this paragraph claims "Google draws on a number of sources to build this too, commonly the meta description tag you write directly for that page, but it may also pull from content elsewhere on the page itself, or build what's called a rich result from structured data and page content together, which we'll get into properly starting in episode twenty-three.", but the counterargument is: Episode 21 says snippets commonly come from meta descriptions and may also come from page content. Google says page content is primary and the meta description is sometimes used. Episode 5 states this more faithfully. Google primarily creates snippets from page content. It may use a meta description when that describes the page better for the result.
>
> Sources: How snippets are created; paragraph 2: https://developers.google.com/search/docs/appearance/snippet#how-snippet-created.
>
> A047 | Error | Medium priority | Checked 24 September 2026



A good meta description, per Google's own guidance, is short, unique to that one specific page, and covers the page's most relevant points concisely. And here's the direct link back to episode sixteen: if there's a specific piece of visible content you want to exist on the page but never want pulled into a snippet, that's exactly the narrower job data-nosnippet is built for, rather than trying to solve it purely through description-writing.

Site names.

This is a comparatively newer element, introduced specifically to make it easier for a searcher to identify which website a given result actually belongs to, showing a readable site name prominently rather than forcing someone to parse a raw URL to figure out where a result leads. Google draws on a variety of sources to determine this automatically. But you can directly indicate your own preferred site name using structured data placed specifically on your homepage, a dedicated site-name markup covered in its own reference documentation, which naturally overlaps with the broader structured data material starting in episode twenty-three.

> ChatGPT fact check - this paragraph claims "But you can directly indicate your own preferred site name using structured data placed specifically on your homepage, a dedicated site-name markup covered in its own reference documentation, which naturally overlaps with the broader structured data material starting in episode twenty-three.", but the counterargument is: The recap says site names are made controllable through markup. Google's selection is automated and WebSite markup is a preference signal, with no guarantee the name will be used. Use WebSite structured data on the homepage to indicate a preferred site name. Google decides what appears; it supports names at domain and subdomain level, not each subdirectory.
>
> Sources: How site names in Google Search are created; paragraph 2: https://developers.google.com/search/docs/appearance/site-names#how-site-names-in-google-search-are-created; How site names in Google Search are created; paragraph 3: https://developers.google.com/search/docs/appearance/site-names#how-site-names-in-google-search-are-created.
>
> A049 | Overstatement | Medium priority | Checked 24 September 2026



Sitelinks.

These are the additional links Google sometimes shows beneath a main result, pointing to other important, relevant sections of that same site, things like a shipping policy page, an about page, or a specific popular category, depending on the search and the site. These are generated algorithmically by Google based on your site's own structure and internal linking, rather than something you configure directly yourself, which loops back to the internal-linking guidance from episode nine: the clearer and more sensible your own site's internal link structure, the better material Google has to work with when it decides whether, and which, sitelinks to actually surface for you.

Favicons.

The small icon shown alongside your result, in the browser tab, and now prominently next to your site name and URL directly within the search result snippet itself. Google's specific technical guidance here: provide an icon at least 48 by 48 pixels, ideally as a clean multiple of that size, 96 by 96 or 144 by 144 and so on, so it renders crisply at whatever size Google actually needs. The icon should be square, since Google renders it inside a circular frame in the result itself, and it needs to be genuinely crawlable, meaning not accidentally blocked by a robots.txt rule the way we discussed back in episode eleven, or it simply won't be picked up at all. A generic, unmodified default icon left over from whatever platform or theme you're using undercuts the actual point of this element, which is instant, confident brand recognition right there in the results page itself, before anyone has even clicked through.

> ChatGPT fact check - this paragraph claims "Google's specific technical guidance here: provide an icon at least 48 by 48 pixels, ideally as a clean multiple of that size, 96 by 96 or 144 by 144 and so on, so it renders crisply at whatever size Google actually needs.", but the counterargument is: The required minimum is stated as 48 by 48 pixels with multiples of 48 preferred. Current Google guidance requires a square favicon at least 8 by 8 pixels and recommends one larger than 48 by 48. Multiples of 48 are not the current rule. Use a square favicon at least eight pixels on each side; Google recommends a size larger than forty-eight pixels on each side. Keep its URL stable and allow the required crawlers.
>
> Sources: Guidelines; list item 4: https://developers.google.com/search/docs/appearance/favicon-in-search#guidelines.
>
> A048 | Outdated | Medium priority | Checked 24 September 2026



Byline dates.

A more specific element, relevant particularly to content that's genuinely time-sensitive, articles, blog posts, guides. This is the publish or update date Google may show directly alongside a result. Getting this genuinely accurate matters more than it might first appear, and it connects directly back to a specific warning from episode six: artificially changing a page's displayed date to make it look freshly updated, without the underlying content having actually, substantively changed, is precisely the kind of manipulation Google's own people-first-content guidance explicitly warns against, and it can actively work against you rather than helping, since it's the kind of pattern Google's systems are specifically built to notice.

Let's bring all five of these together, since a searcher genuinely takes in the whole cluster of them at once, not each one in isolation. Picture a specific flag-store product result: the favicon establishes an instant, recognisable visual anchor before anything else is even read. The site name confirms which business this result actually belongs to. The title link, ideally something concrete and specific like "Texas Flag, 3x5 ft, Heavy-Duty Nylon" rather than a generic, repeated template applied identically across every product, tells the searcher precisely what this particular page offers. The snippet beneath it, written specifically and distinctly for that one product rather than copy-pasted boilerplate repeated with only the product name swapped out, adds the genuinely persuading detail. And sitelinks, if Google's algorithm judges them warranted for a branded search specifically, might surface a shipping policy or a returns page directly beneath the main result, guiding a hesitant searcher toward the exact reassurance they need before they'll actually commit to clicking through.

Every one of these elements rewards the same underlying discipline we've returned to throughout this whole series: specificity per page, genuine accuracy, and resisting the temptation toward templated, repeated, one-size-fits-all boilerplate copied identically across thousands of otherwise-distinct pages.

> ChatGPT fact check - this paragraph claims "Every one of these elements rewards the same underlying discipline we've returned to throughout this whole series: specificity per page, genuine accuracy, and resisting the temptation toward templated, repeated, one-size-fits-all boilerplate copied identically across thousands of otherwise-distinct pages.", but the counterargument is: The statement that every element rewards specificity per page conflates page-level title/snippet guidance with site-level name/favicon guidance. The blanket opposition to templating also omits Google's encouragement of good programmatic meta descriptions for large databases. Separate page-level titles and descriptions from site-level identity. Programmatic descriptions can be appropriate when accurate, readable, and based on page-specific information.
>
> Sources: Technical guidelines; list item 1: https://developers.google.com/search/docs/appearance/site-names#technical-guidelines; Programmatically generate descriptions; paragraph 1: https://developers.google.com/search/docs/appearance/snippet#programmatically-generate-descriptions.
>
> A050 | Overstatement | Medium priority | Checked 24 September 2026



Let's recap.

The title link is Google's headline, drawn primarily from your title element but rewritten when Google judges it inaccurate, oversized, or keyword-stuffed. The snippet is the descriptive text beneath it, generally sourced from your meta description or page content, with data-nosnippet available for excluding one specific piece of visible content from consideration. Site names, made controllable through dedicated homepage structured data, help a searcher instantly identify which business a result belongs to. Sitelinks are algorithmically generated from your own site structure and internal linking, not something set directly. Favicons need to be square, at least 48 by 48 pixels, and genuinely crawlable, not blocked in robots.txt. And byline dates should reflect genuine update activity, never be artificially manipulated to appear falsely fresh.

> ChatGPT fact check - this paragraph claims "The snippet is the descriptive text beneath it, generally sourced from your meta description or page content, with data-nosnippet available for excluding one specific piece of visible content from consideration.", but the counterargument is: Episode 21 says snippets commonly come from meta descriptions and may also come from page content. Google says page content is primary and the meta description is sometimes used. Episode 5 states this more faithfully. Google primarily creates snippets from page content. It may use a meta description when that describes the page better for the result.
>
> Sources: How snippets are created; paragraph 2: https://developers.google.com/search/docs/appearance/snippet#how-snippet-created.
>
> A047 | Error | Medium priority | Checked 24 September 2026



> ChatGPT fact check - this paragraph claims "Favicons need to be square, at least 48 by 48 pixels, and genuinely crawlable, not blocked in robots.txt.", but the counterargument is: The required minimum is stated as 48 by 48 pixels with multiples of 48 preferred. Current Google guidance requires a square favicon at least 8 by 8 pixels and recommends one larger than 48 by 48. Multiples of 48 are not the current rule. Use a square favicon at least eight pixels on each side; Google recommends a size larger than forty-eight pixels on each side. Keep its URL stable and allow the required crawlers.
>
> Sources: Guidelines; list item 4: https://developers.google.com/search/docs/appearance/favicon-in-search#guidelines.
>
> A048 | Outdated | Medium priority | Checked 24 September 2026



> ChatGPT fact check - this paragraph claims "Site names, made controllable through dedicated homepage structured data, help a searcher instantly identify which business a result belongs to.", but the counterargument is: The recap says site names are made controllable through markup. Google's selection is automated and WebSite markup is a preference signal, with no guarantee the name will be used. Use WebSite structured data on the homepage to indicate a preferred site name. Google decides what appears; it supports names at domain and subdomain level, not each subdirectory.
>
> Sources: How site names in Google Search are created; paragraph 2: https://developers.google.com/search/docs/appearance/site-names#how-site-names-in-google-search-are-created; How site names in Google Search are created; paragraph 3: https://developers.google.com/search/docs/appearance/site-names#how-site-names-in-google-search-are-created.
>
> A049 | Overstatement | Medium priority | Checked 24 September 2026



Next episode, we move into images and videos specifically: how Google indexes and displays them in Search, and the concrete best practices for making sure yours are found, understood, and shown at their best. See you there.

This episode is adapted from "Title links," "Snippets," "Site names," "Sitelinks," and "Favicons in Search" on Google Search Central, licensed under Creative Commons Attribution 4.0.

### Episode 22: Images and Videos in Search

Welcome back. Today covers visual content properly: the technical and practical best practices for images, and the fuller picture on video, including features like key moments and the live badge that a flag store's own YouTube-adjacent content, or product photography, can genuinely benefit from.

Images in Google Search.

We touched on the fundamentals back in episode five, high-quality images placed near relevant text, descriptive alt text. Today's the deeper technical layer underneath that.

Supported formats. Google Search supports images referenced through the src attribute in these file formats: BMP, GIF, JPEG, PNG, WebP, SVG, and AVIF. It's good practice to make sure your filename extension genuinely matches the actual file type it names.

The picture element, for responsive images. This is a container element that groups several different source versions of the same underlying image, letting the browser pick whichever version actually suits its own capabilities, screen size, pixel density, and so on. It's also useful for adopting newer image formats gracefully, with automatic fallback for browsers that don't yet support them. Per the HTML standard itself, when you use a picture element, you must include a plain img element as the fallback, carrying a genuine src attribute, so there's always something concrete for a browser, or a crawler, to actually resolve.

You can also inline images directly as Data URIs, encoding the image data itself as a Base64 string right inside the src attribute rather than linking out to a separate file. This can reduce the number of separate HTTP requests a page needs, but Google's own guidance is to weigh this carefully, since it can also considerably inflate the actual page size, working against the Core Web Vitals goals from episode twenty.

Structured data for images. Including structured data, which we start covering fully next episode, can make your images eligible to display as richer results, including a prominent badge directly within Google Images itself, giving searchers more context and potentially driving more precisely targeted traffic to your site. Worth flagging directly: across the relevant structured data types, an image attribute is typically a required field specifically to qualify for that badge and richer display, so leaving it out isn't a minor omission, it's disqualifying.

Descriptive filenames, titles, and alt text, revisited with more precision than episode five had room for. Google extracts information about an image's actual subject matter from the surrounding page content, including captions and any image title attribute present, so placing images near genuinely relevant text, on pages genuinely relevant to that image's subject matter, does real, concrete work, not just a vague best practice. And alt text specifically serves double duty: it's useful as anchor text in the specific case where you're using an image itself as a clickable link, on top of its more familiar accessibility and search-understanding role.

Speed and quality together. High-quality, sharp photos are more appealing to searchers browsing thumbnails than blurry or unclear ones, and this genuinely affects click-through directly from the results page, before anyone has even reached your site. If you localise images for different audiences or languages, remember to localise the filenames too, following the URL encoding guidance from episode nine for any non-Latin characters involved.

A note specifically on image licensing structured data, relevant if a store ever licenses out its own original photography, say to a supplier catalogue or a press mention. Google supports specific structured data properties for exactly this: a license URL, a page describing how to acquire a license, the creator's name, a copyright notice, and credit text, all attachable directly to an image through structured data, which can then surface directly in Google Images to help others understand how that image may legitimately be used.

Now, video, and this section has genuinely grown more elaborate over the past few years, with several distinct features worth knowing about individually.

The foundation: your video needs to be publicly accessible, present on a page at a URL Google can genuinely crawl, and visible on that page without requiring some complex user action just to load, tying straight back to the lazy-loading guidance from episode fifteen.

Creating a dedicated watch page. To be eligible for the fuller set of video features, video results on the main results page, Video mode, key moments, and the live badge, Google recommends a dedicated watch page for each video, where showing that one specific video is genuinely the main reason a visitor is on the page at all. Google draws a useful, precise distinction here between what counts as a watch page and what doesn't. A dedicated video landing page, a TV episode's own player page, a sports highlight page: these are watch pages. A blog post that happens to review an embedded video, a product page carrying a 360-degree product video, or a page listing many videos of equal prominence: these are not watch pages, because in each of those cases the video is complementary to other content, not the main reason someone's there. It's entirely fine to have the same video appear on both a genuine watch page and elsewhere, say embedded within a related product page too.

> ChatGPT fact check - this paragraph claims "A blog post that happens to review an embedded video, a product page carrying a 360-degree product video, or a page listing many videos of equal prominence: these are not watch pages, because in each of those cases the video is complementary to other content, not the main reason someone's there.", but the counterargument is: The watch page is framed mainly as a recommendation, but the current video guide lists an indexed, well-performing watch page and an embedded video as indexing requirements. The thumbnail-format list omits AVIF. Describe watch-page eligibility explicitly, preserve the distinction from ordinary text/image results on non-watch pages, and add AVIF to the supported thumbnail formats.
>
> Sources: Ensure your videos can be indexed; list item 1: https://developers.google.com/search/docs/appearance/video#indexing-criteria; Ensure your videos can be indexed; list item 2: https://developers.google.com/search/docs/appearance/video#indexing-criteria; Ensure your videos can be indexed; list item 3: https://developers.google.com/search/docs/appearance/video#indexing-criteria; Provide a high-quality video thumbnail; table row 2: https://developers.google.com/search/docs/appearance/video#valid-thumbnail.
>
> A051 | Omission | Medium priority | Checked 24 September 2026



Include your video in a proper HTML tag. Google identifies a video on a page more reliably when it's wrapped in a recognised tag: video, embed, iframe, or object specifically.

Stable, accessible thumbnail and content URLs. Use one single, unique, stable thumbnail URL per video, and keep the actual video file itself available at a stable URL too, which helps Google discover it, confirm it remains genuinely available over time, and gather signals about it consistently. Supported thumbnail formats mirror the image formats: BMP, GIF, JPEG, PNG, WebP, and SVG. Minimum thumbnail size is 60 by 30 pixels, though larger is genuinely preferred for quality. The thumbnail file has to be reachable by Googlebot, so don't block it in robots.txt and don't hide it behind a login requirement. And there's a specific transparency-related technical requirement worth knowing: at least 80 percent of the thumbnail's pixels need an alpha transparency value above 250, essentially ruling out thumbnails that are mostly or fully transparent.

> ChatGPT fact check - this paragraph claims "Supported thumbnail formats mirror the image formats: BMP, GIF, JPEG, PNG, WebP, and SVG.", but the counterargument is: The watch page is framed mainly as a recommendation, but the current video guide lists an indexed, well-performing watch page and an embedded video as indexing requirements. The thumbnail-format list omits AVIF. Describe watch-page eligibility explicitly, preserve the distinction from ordinary text/image results on non-watch pages, and add AVIF to the supported thumbnail formats.
>
> Sources: Ensure your videos can be indexed; list item 1: https://developers.google.com/search/docs/appearance/video#indexing-criteria; Ensure your videos can be indexed; list item 2: https://developers.google.com/search/docs/appearance/video#indexing-criteria; Ensure your videos can be indexed; list item 3: https://developers.google.com/search/docs/appearance/video#indexing-criteria; Provide a high-quality video thumbnail; table row 2: https://developers.google.com/search/docs/appearance/video#valid-thumbnail.
>
> A051 | Omission | Medium priority | Checked 24 September 2026



If you're specifically worried about bad actors, hackers or spammers, scraping your actual video content files directly, there's a legitimate technique worth knowing: you can verify that a request genuinely comes from Googlebot, using the reverse-DNS or IP-range verification from episode eleven, and serve the video's actual content URL specifically to that trusted, verified crawler, while withholding that same specific field from other, unverified requesters.

Providing structured data, using the VideoObject type specifically. This lets you directly specify the title, description, duration, thumbnail, and the actual video content file URL, among other properties. And a specific, important consistency rule: whatever information you provide across your sitemap, your HTML tags, your meta tags, and your structured data describing the same video needs to genuinely match, the same title, the same thumbnail URL, the same video URL, consistently, everywhere. Google explicitly warns that any information provided through structured data needs to be genuinely consistent with the actual video content itself, not aspirational or embellished.

Two specific, richer features worth knowing individually, since they're genuinely differentiating.

The LIVE badge. Adding BroadcastEvent structured data nested specifically within your VideoObject markup makes a public livestream eligible for a distinct LIVE badge directly in results, applicable to any public video being live-streamed for any length of time, sporting events, product launch livestreams, live Q&A sessions, that kind of thing. And there's a specific, practical technical tip attached: use the Indexing API to notify Google promptly when a given stream actually starts and ends, so that badge appears and disappears at genuinely the right moments, rather than lagging behind an ordinary crawl schedule.

> ChatGPT fact check - this paragraph claims "And there's a specific, practical technical tip attached: use the Indexing API to notify Google promptly when a given stream actually starts and ends, so that badge appears and disappears at genuinely the right moments, rather than lagging behind an ordinary crawl schedule.", but the counterargument is: The script says notifications make the LIVE badge track the actual start and end accurately. Notifications help Google discover changes; they do not guarantee immediate badge appearance or disappearance. Use the Indexing API as instructed for livestream updates. This helps Google process changes promptly, but does not guarantee the LIVE badge or exact display timing.
>
> Sources: Video ( VideoObject , Clip , BroadcastEvent ) structured data; table row 1: https://developers.google.com/search/docs/appearance/structured-data/video#video-videoobject,-clip,-broadcastevent-structured-data; General structured data guidelines; paragraph 3: https://developers.google.com/search/docs/appearance/structured-data/sd-policies#general-structured-data-guidelines.
>
> A052 | Overstatement | Medium priority | Checked 24 September 2026



Key moments. This lets viewers navigate a video's internal segments the way they'd navigate chapters in a book. Google's systems will try to detect these segments automatically on their own, with no effort required from you at all. But you can also explicitly define them yourself, and Google states plainly that it will prioritise segments you've explicitly set over anything it might have guessed automatically. There are two distinct ways to define them: Clip structured data, where you specify each segment's exact start and end time along with a label to display for it, or SeekToAction structured data, where you instead define your own URL's own timestamp structure, letting Google automatically construct links to any arbitrary point within the video, based on that pattern, without you needing to hand-define every individual segment.

Let's ground both halves of this episode in something concrete: a store producing short product demonstration videos, say showing a flag actually flapping in real outdoor wind conditions across different fabric weights. That's genuinely strong, non-commodity content in the sense from episode seven, first-hand, demonstrable, and hard for anyone to fake or replicate secondhand. Give each such video its own dedicated watch page, mark it up properly with VideoObject structured data including a stable, properly formatted thumbnail, and if the store ever does a live product-launch stream, add BroadcastEvent markup and notify Google promptly through the Indexing API so the LIVE badge tracks the stream's actual real-time status accurately.

> ChatGPT fact check - this paragraph claims "Give each such video its own dedicated watch page, mark it up properly with VideoObject structured data including a stable, properly formatted thumbnail, and if the store ever does a live product-launch stream, add BroadcastEvent markup and notify Google promptly through the Indexing API so the LIVE badge tracks the stream's actual real-time status accurately.", but the counterargument is: The script says notifications make the LIVE badge track the actual start and end accurately. Notifications help Google discover changes; they do not guarantee immediate badge appearance or disappearance. Use the Indexing API as instructed for livestream updates. This helps Google process changes promptly, but does not guarantee the LIVE badge or exact display timing.
>
> Sources: Video ( VideoObject , Clip , BroadcastEvent ) structured data; table row 1: https://developers.google.com/search/docs/appearance/structured-data/video#video-videoobject,-clip,-broadcastevent-structured-data; General structured data guidelines; paragraph 3: https://developers.google.com/search/docs/appearance/structured-data/sd-policies#general-structured-data-guidelines.
>
> A052 | Overstatement | Medium priority | Checked 24 September 2026



Let's recap.

For images: use a supported format, consider the picture element for responsive delivery, weigh Data URIs carefully against the real page-size cost, include the image attribute in relevant structured data for badge eligibility, and place genuinely descriptive filenames, titles, and alt text near genuinely relevant surrounding content. For video: build a genuine, dedicated watch page when the video truly is the main point of that page, wrap it in a proper HTML tag, keep both the thumbnail and the video file itself at stable, crawlable URLs, mark it up consistently with VideoObject structured data across every source describing it, and layer in BroadcastEvent for the LIVE badge or Clip and SeekToAction markup for key moments where genuinely relevant.

Next episode, we begin the run on structured data properly: how it actually works under the hood, the general guidelines that apply across every structured data type, and how to generate and test it with JavaScript. See you there.

This episode is adapted from "Google Images best practices" and "Video (VideoObject, Clip, BroadcastEvent) best practices" on Google Search Central, licensed under Creative Commons Attribution 4.0.

### Episode 23: Structured Data Foundations

Welcome back. This opens a genuinely important stretch of the series: structured data, the machine-readable markup behind review stars, product carousels, breadcrumbs, and every other visually rich thing you've seen in a Google result beyond plain blue text. Today is the foundation: what structured data actually is, how it's formatted, and the general guidelines governing every single type of it. Next episode we tour the specific feature types; the episode after covers shopping-specific markup in depth, directly relevant to a Shopify catalogue.

> ChatGPT fact check - this paragraph claims "This opens a genuinely important stretch of the series: structured data, the machine-readable markup behind review stars, product carousels, breadcrumbs, and every other visually rich thing you've seen in a Google result beyond plain blue text.", but the counterargument is: The introduction describes structured data as powering every visually rich result beyond blue text. Many features are generated algorithmically and do not require page markup, including featured snippets and sitelinks. Structured data helps Google understand content and can make pages eligible for supported rich results. Other search features are selected through different mechanisms.
>
> Sources: How can I mark my page as a featured snippet?; paragraph 1: https://developers.google.com/search/docs/appearance/featured-snippets#how-can-i-mark-my-page-as-a-featured-snippet.
>
> A053 | Error | Medium priority | Checked 24 September 2026



> ChatGPT fact check - this paragraph claims "Next episode we tour the specific feature types; the episode after covers shopping-specific markup in depth, directly relevant to a Shopify catalogue.", but the counterargument is: The preceding episode promises how to generate and test structured data with JavaScript, but this chapter stops at a general deployment workflow. Product-specific warnings about dynamically generated data are missing. Add the Generate structured data with JavaScript source, including rendered-DOM testing and the Product warning about less frequent or less reliable shopping crawls for rapidly changing values.
>
> Sources: Generate structured data with custom JavaScript; paragraph 1: https://developers.google.com/search/docs/appearance/structured-data/generate-structured-data-with-javascript#custom-javascript; Test your implementation; list item 2: https://developers.google.com/search/docs/appearance/structured-data/generate-structured-data-with-javascript#testing; Test your implementation; list item 3: https://developers.google.com/search/docs/appearance/structured-data/generate-structured-data-with-javascript#testing; Technical guidelines; list item 6: https://developers.google.com/search/docs/appearance/structured-data/merchant-listing#technical-guidelines.
>
> A055 | Omission | Medium priority | Checked 24 September 2026



What structured data actually is.

It's a standardised format for describing a page's content and classifying what that content actually is, using a shared, common vocabulary maintained at schema.org. Rather than Google having to guess at meaning purely from visible text and layout, structured data states things explicitly: this page describes a product, here's its name, here's its price, here's its availability.

The three supported formats.

JSON-LD is Google's own recommended format. It's a script block, placed in a page's head section, or occasionally the body, written in ordinary JavaScript object notation. Its major practical advantage: it sits entirely separate from your visible page markup, a self-contained block of data rather than something woven directly into your visible HTML tags. This makes it considerably easier to implement, and to maintain over time, without constantly touching your page's actual display markup.

Microdata is an older, alternative approach, using specific HTML tag attributes woven directly into your existing visible markup to name and label properties in place.

RDFa is a third format, also embedding attributes directly within your HTML, commonly usable in both the head and body sections.

Google is explicit that all three formats are equally fine, technically, as long as the markup is valid and properly implemented according to that specific feature's own documentation. But its own practical recommendation is to use whichever format is easiest for you specifically to implement and maintain, and in most cases, that's JSON-LD, precisely because of that separation from visible markup we just covered.

A genuinely important point about documentation itself, worth remembering precisely: Google's own Search Central documentation is what's definitive for how Google Search specifically behaves, not the general schema.org documentation. Schema.org itself defines a much larger universe of properties and object types than Google Search actually requires or uses; some of those extra properties may be meaningful to other services, tools, or platforms, but for Google Search specifically, its own documentation, not schema.org's broader spec, is the source of truth on what's required, recommended, or optional.

Required versus recommended properties, and this distinction genuinely matters, so it's worth being precise. You must include every required property for a given structured data type in order for that content to be eligible for rich result display at all; missing even one required property disqualifies the whole thing from that enhanced display, full stop. Recommended properties are different: including more of them can improve your chances of a fuller, richer display, but they're not strictly disqualifying if absent.

And here's a genuinely useful piece of practical guidance on recommended properties specifically, worth internalising directly: it's better to supply fewer recommended properties, but have them be complete and accurate, than to try covering every single possible recommended field with data that's incomplete, badly formed, or simply inaccurate. A worked, concrete example: many stores don't track a SKU for every item, SKU being a recommended property for Product markup. Leaving it out entirely, because it genuinely doesn't apply, is the right move; fabricating or duplicating a fake SKU value purely to fill the field in is not, since that data would be inaccurate, which is worse than simply absent.

The general structured data guidelines, applying across every single type.

To be eligible for rich result display at all, structured data can't violate Google's broader content policies, which include the spam policies from episode two. And there's a consequence worth knowing precisely if this ever goes wrong: a structured-data-specific issue can trigger what's specifically called a structured data manual action. This is narrower than a general spam penalty; it means a page specifically loses its eligibility to appear as a rich result, but it does not affect how that same page ranks in ordinary web search otherwise. You can check for one directly in the Manual Actions report within Search Console.

Technical guidelines, the kind an automated tool can actually catch for you. Mark up your pages using one of the three supported formats we just covered. And critically: don't block your structured-data-carrying pages from Googlebot using robots.txt, noindex, or any other access-control method, since Google obviously can't read and use markup on a page it's never permitted to actually crawl and render in the first place. The Rich Results Test and the URL Inspection tool will catch most technical errors of this kind directly.

> ChatGPT fact check - this paragraph claims "And critically: don't block your structured-data-carrying pages from Googlebot using robots.txt, noindex, or any other access-control method, since Google obviously can't read and use markup on a page it's never permitted to actually crawl and render in the first place.", but the counterargument is: The chapter groups noindex with controls preventing Google from crawling and reading a page. Noindex affects indexing and rich-result eligibility, but does not itself block crawling. Google must be able to access the page, and the page must remain eligible for indexing. Robots.txt or login controls can block access; noindex prevents indexing.
>
> Sources: Block Search indexing with noindex; paragraph 1: https://developers.google.com/search/docs/crawling-indexing/block-indexing#block-search-indexing-with-noindex; Debugging noindex issues; paragraph 1: https://developers.google.com/search/docs/crawling-indexing/block-indexing#debugging-noindex-issues.
>
> A054 | Error | Medium priority | Checked 24 September 2026



Quality guidelines, and these are meaningfully harder to catch with any automated tool, since they're about substance rather than syntax. Follow the spam policies. Keep the information genuinely up to date; Google states plainly it won't show a rich result for time-sensitive content that's no longer actually relevant, an expired promotion or a past event, say. Provide genuinely original content, either your own or genuinely generated by your own users. And here's a specific, important rule worth remembering precisely: don't mark up content that isn't actually visible to a reader of the page. If your structured data describes, say, a product's material and dimensions, the visible HTML body of that same page has to genuinely describe that same material and those same dimensions too; you can't use structured data to silently claim something the visible page itself doesn't actually say. And don't mark up irrelevant or misleading content, fake reviews being the obvious, direct example, tying straight back to the review-quality guidance we'll cover properly in the ecommerce episode later in this series.

The practical build-test-deploy sequence Google itself recommends, worth having as a genuine workflow rather than an abstract checklist. Add the required properties for whichever structured data type you're implementing, following that type's own specific documentation on exactly where in the page to place it. Follow the general guidelines we just covered. Validate your markup using the Rich Results Test, fixing any critical errors it flags; non-critical issues are worth addressing too, since they can improve overall quality, though they're not strictly required for basic eligibility. Deploy on a handful of pages first, and use the URL Inspection tool to directly confirm how Google actually sees the rendered result. And once deployed more broadly, monitor ongoing validity through the Rich result status reports in Search Console specifically, since markup that validated perfectly at launch can quietly break later, commonly due to a template change or a serving issue introduced somewhere downstream.

> ChatGPT fact check - this paragraph claims "The practical build-test-deploy sequence Google itself recommends, worth having as a genuine workflow rather than an abstract checklist.", but the counterargument is: The preceding episode promises how to generate and test structured data with JavaScript, but this chapter stops at a general deployment workflow. Product-specific warnings about dynamically generated data are missing. Add the Generate structured data with JavaScript source, including rendered-DOM testing and the Product warning about less frequent or less reliable shopping crawls for rapidly changing values.
>
> Sources: Generate structured data with custom JavaScript; paragraph 1: https://developers.google.com/search/docs/appearance/structured-data/generate-structured-data-with-javascript#custom-javascript; Test your implementation; list item 2: https://developers.google.com/search/docs/appearance/structured-data/generate-structured-data-with-javascript#testing; Test your implementation; list item 3: https://developers.google.com/search/docs/appearance/structured-data/generate-structured-data-with-javascript#testing; Technical guidelines; list item 6: https://developers.google.com/search/docs/appearance/structured-data/merchant-listing#technical-guidelines.
>
> A055 | Omission | Medium priority | Checked 24 September 2026



And if you genuinely want to measure whether adding structured data made a real difference: run a before-and-after comparison specifically on stable, non-seasonal pages, ones with enough existing historical data, and compare performance directly in Search Console's own Performance report, filtered down to that specific URL, so seasonal or promotional noise doesn't distort what you're actually trying to measure.

Let's recap.

Structured data is standardised, machine-readable markup describing a page's content using the schema.org vocabulary, with JSON-LD as Google's own recommended format specifically because it stays separate from visible markup. Google's own documentation, not schema.org's broader spec, is definitive for Google Search's specific behaviour. Required properties are strictly disqualifying if missing; recommended properties are worth including, but only with complete, accurate data, never padded out with fabricated values just to fill a field. The general guidelines demand the markup stay accessible to Googlebot, genuinely current, genuinely original, visibly matched to the page's actual visible content, and free of anything misleading, with a dedicated, narrower manual action specifically for structured data violations that affects rich-result eligibility without touching ordinary ranking. And the practical workflow is add, validate with the Rich Results Test, deploy narrow, inspect with URL Inspection, then monitor ongoing validity through the Rich result status reports.

> ChatGPT fact check - this paragraph claims "The general guidelines demand the markup stay accessible to Googlebot, genuinely current, genuinely original, visibly matched to the page's actual visible content, and free of anything misleading, with a dedicated, narrower manual action specifically for structured data violations that affects rich-result eligibility without touching ordinary ranking.", but the counterargument is: The chapter groups noindex with controls preventing Google from crawling and reading a page. Noindex affects indexing and rich-result eligibility, but does not itself block crawling. Google must be able to access the page, and the page must remain eligible for indexing. Robots.txt or login controls can block access; noindex prevents indexing.
>
> Sources: Block Search indexing with noindex; paragraph 1: https://developers.google.com/search/docs/crawling-indexing/block-indexing#block-search-indexing-with-noindex; Debugging noindex issues; paragraph 1: https://developers.google.com/search/docs/crawling-indexing/block-indexing#debugging-noindex-issues.
>
> A054 | Error | Medium priority | Checked 24 September 2026



Next episode, we tour the actual feature types themselves: Article, Breadcrumb, Event, Job Posting, and the wider gallery of what structured data can actually unlock in a search result. See you there.

This episode is adapted from "Understand how structured data works," "General structured data guidelines," and "Introduction to structured data markup in Google Search" on Google Search Central, licensed under Creative Commons Attribution 4.0.

> ChatGPT fact check - this paragraph claims "This episode is adapted from "Understand how structured data works," "General structured data guidelines," and "Introduction to structured data markup in Google Search" on Google Search Central, licensed under Creative Commons Attribution 4.0.", but the counterargument is: The preceding episode promises how to generate and test structured data with JavaScript, but this chapter stops at a general deployment workflow. Product-specific warnings about dynamically generated data are missing. Add the Generate structured data with JavaScript source, including rendered-DOM testing and the Product warning about less frequent or less reliable shopping crawls for rapidly changing values.
>
> Sources: Generate structured data with custom JavaScript; paragraph 1: https://developers.google.com/search/docs/appearance/structured-data/generate-structured-data-with-javascript#custom-javascript; Test your implementation; list item 2: https://developers.google.com/search/docs/appearance/structured-data/generate-structured-data-with-javascript#testing; Test your implementation; list item 3: https://developers.google.com/search/docs/appearance/structured-data/generate-structured-data-with-javascript#testing; Technical guidelines; list item 6: https://developers.google.com/search/docs/appearance/structured-data/merchant-listing#technical-guidelines.
>
> A055 | Omission | Medium priority | Checked 24 September 2026



### Episode 24: A Tour of the Structured Data Gallery, and the FAQ Rich Result's Retirement

Welcome back. Today we walk through the actual gallery of structured data feature types Google supports, what each one can unlock in a result, and a genuinely current, important piece of news: FAQ rich results, one of the most widely used structured data features for years, were formally removed from Google Search in May 2026. We'll cover exactly what that means and, just as importantly, what it doesn't mean.

Let's start with the gallery itself, Google's own maintained, authoritative list of which structured data types can actually change how a result looks. As of a mid-2026 update, the gallery holds around twenty-five entries. Let's walk through the ones most broadly relevant, in Google's own descriptions.

> ChatGPT fact check - this paragraph claims "As of a mid-2026 update, the gallery holds around twenty-five entries.", but the counterargument is: There are 25 gallery entries, but Dataset serves Dataset Search; Speakable supports spoken content; paywall markup distinguishes paywalls from cloaking. Movie is a gallery entry not separately included in the chapter's tour. Describe 25 entries with different purposes and surfaces. Do not imply that every type unlocks a distinct visual treatment in ordinary web results.
>
> Sources: Structured data markup that Google Search supports; table row 6: https://developers.google.com/search/docs/appearance/structured-data/search-gallery#structured-data-markup-that-google-search-supports; Structured data markup that Google Search supports; table row 15: https://developers.google.com/search/docs/appearance/structured-data/search-gallery#structured-data-markup-that-google-search-supports.
>
> A059 | Error | Medium priority | Checked 24 September 2026



Article. Covers news, sports, or blog articles, eligible for features like a prominent title treatment and larger-than-thumbnail images directly in the result.

Breadcrumb. Shows a page's position within your site's hierarchy, directly in the result, in place of a raw, unreadable URL, tying back to the URL-structure discussion in episode nine.

> ChatGPT fact check - this paragraph claims "Breadcrumb.", but the counterargument is: The breadcrumb description omits its current desktop-only Search availability. The video paragraph says 'last episode', but the video chapter is Episode 22. Qualify breadcrumb display as desktop Search and change the video reference to Episode 22.
>
> Sources: Feature availability; paragraph 1: https://developers.google.com/search/docs/appearance/structured-data/breadcrumb#availability.
>
> A062 | Editorial | Low priority | Checked 24 September 2026



Carousel. Displays a sequential list or gallery of items from a single site, but worth noting precisely: this feature has to be combined with one of a specific set of other types, Recipe, Course list, Restaurant, or Movie; it isn't a standalone type on its own.

Employer aggregate rating. An evaluation of a hiring organisation, compiled from many individual users, displayed specifically within Google's job search experience.

Event. An interactive result showing organised events people might attend at a specific time and place, concerts, festivals, that kind of thing.

Image metadata. Lets Google Images show more detail about a given image directly: who created it, how it may be used, and credit information, which is the same licensing markup we touched on back in episode twenty-two.

Job posting. An interactive result specifically for job seekers, which can feature a company's logo, reviews, ratings, and job details together in one place.

Local business. Relevant for any storefront or physical location, surfacing business details directly in relevant results.

Organization. Feeds knowledge-panel information and broader attribution elements about a business as an entity.

Product. Covers price, availability, and review ratings directly in a result, the type most directly relevant to an ecommerce catalogue, and we'll spend the entirety of next episode specifically on this one and its close relatives.

Review snippet. Surfaces star ratings and review summaries directly beneath a result.

Video. As covered fully last episode: play controls, key moments, and live-stream labelling directly in results.

> ChatGPT fact check - this paragraph claims "Video.", but the counterargument is: The breadcrumb description omits its current desktop-only Search availability. The video paragraph says 'last episode', but the video chapter is Episode 22. Qualify breadcrumb display as desktop Search and change the video reference to Episode 22.
>
> Sources: Feature availability; paragraph 1: https://developers.google.com/search/docs/appearance/structured-data/breadcrumb#availability.
>
> A062 | Editorial | Low priority | Checked 24 September 2026



And there are further, narrower types in the fuller gallery too: Course list, Dataset, Discussion forum, Education Q&A, Math solver, Profile page, Q&A, Recipe, Software app, Speakable, Subscription and paywalled content, and Vacation rental, each suited to a fairly specific kind of site or content.

> ChatGPT fact check - this paragraph claims "And there are further, narrower types in the fuller gallery too: Course list, Dataset, Discussion forum, Education Q&A, Math solver, Profile page, Q&A, Recipe, Software app, Speakable, Subscription and paywalled content, and Vacation rental, each suited to a fairly specific kind of site or content.", but the counterargument is: There are 25 gallery entries, but Dataset serves Dataset Search; Speakable supports spoken content; paywall markup distinguishes paywalls from cloaking. Movie is a gallery entry not separately included in the chapter's tour. Describe 25 entries with different purposes and surfaces. Do not imply that every type unlocks a distinct visual treatment in ordinary web results.
>
> Sources: Structured data markup that Google Search supports; table row 6: https://developers.google.com/search/docs/appearance/structured-data/search-gallery#structured-data-markup-that-google-search-supports; Structured data markup that Google Search supports; table row 15: https://developers.google.com/search/docs/appearance/structured-data/search-gallery#structured-data-markup-that-google-search-supports.
>
> A059 | Error | Medium priority | Checked 24 September 2026



A caveat worth holding onto precisely, and Google states this directly in its own gallery documentation: the actual appearance in search results might be different from what a given markup type technically enables. Eligibility is not entitlement. Implementing a type correctly makes you eligible for that richer display; it never guarantees Google will actually choose to show it for any specific query or result.

Now, the genuinely significant, current story: FAQ rich results.

For years, FAQ structured data, marking up a page's own frequently-asked-questions section, was one of the single most widely implemented structured data types on the entire web, producing the familiar expandable dropdown snippets that used to appear directly beneath many organic listings. As of May 7, 2026, Google officially removed FAQ rich results from search for essentially all sites. This wasn't the first reduction to this feature; Google had already narrowed its visibility back in 2023, restricting it mainly to certain recognised government and health sites specifically. The May 2026 change finishes that process, removing it broadly, including for that narrower group of sites that had still qualified under the earlier, tighter restriction.

Two further, related dates worth knowing if you're tracking this directly: in June 2026, Search Console removed its dedicated FAQ rich result reporting and validation, and support was dropped from the Rich Results Test tool specifically for this type. In August 2026, API support for FAQ rich results was removed entirely too.

> ChatGPT fact check - this paragraph claims "Two further, related dates worth knowing if you're tracking this directly: in June 2026, Search Console removed its dedicated FAQ rich result reporting and validation, and support was dropped from the Rich Results Test tool specifically for this type.", but the counterargument is: The current Google changelog confirms the May retirement and June 15 documentation removal. The audit did not independently establish completed June reporting/test withdrawal and August API withdrawal from a current primary announcement. This is unverified, not proven false. Keep the confirmed retirement and documentation-removal dates. Restore the other dates only with a specific primary announcement or archived Google notice, distinguishing planned dates from confirmed completion.
>
> Sources: Removing documentation for the FAQ rich result feature; paragraph 1: https://developers.google.com/search/updates#removing-faq-rich-result; Removing documentation for the FAQ rich result feature; paragraph 2: https://developers.google.com/search/updates#removing-faq-rich-result; Deprecating the FAQ rich result feature; paragraph 2: https://developers.google.com/search/updates#deprecating-the-faq-rich-result-feature.
>
> A057 | Unverified | Medium priority | Checked 24 September 2026



Here's the single most important distinction to hold onto, worth stating precisely, since it's easy to overcorrect here. The visible rich-result enhancement in search is gone. The underlying FAQ structured data itself is not harmful, and it isn't something you need to urgently strip out of your pages. Google's own general structured-data guidance is direct on this point: unused structured data doesn't cause problems for a site. If you already have FAQPage markup in place, it will continue to validate cleanly, and it will simply no longer produce that visible dropdown snippet in results; it's not a violation, not a penalty, just quietly no longer visually rewarded the way it once was.

> ChatGPT fact check - this paragraph claims "If you already have FAQPage markup in place, it will continue to validate cleanly, and it will simply no longer produce that visible dropdown snippet in results; it's not a violation, not a penalty, just quietly no longer visually rewarded the way it once was.", but the counterargument is: Unused FAQ markup need not be urgently removed, but the blanket promise of clean validation ignores actual errors and the distinction between generic Schema.org validation and Google rich-result testing. 'Removing it accomplishes nothing beneficial' also makes an unsupported maintenance judgment. Correct FAQPage markup can remain in place. Use generic schema validation if needed; do not expect Google FAQ rich-result eligibility. Keeping or removing unused markup is a maintenance choice.
>
> Sources: Overview of the changes; paragraph 3: https://developers.google.com/search/blog/2023/08/howto-faq-changes#overview-of-the-changes.
>
> A058 | Overstatement | Medium priority | Checked 24 September 2026



And there's a real reason worth understanding for why this happened, tying directly back to episode seven's material on generative AI search: Google is explicitly reallocating exactly this kind of space, question-and-answer-formatted content sitting directly in the results page, toward AI Overviews and AI Mode instead. The question-and-answer format itself hasn't gone away as a way people get information from Google; what's changed is who, or what, is now doing the actual presenting of it.

> ChatGPT fact check - this paragraph claims "And there's a real reason worth understanding for why this happened, tying directly back to episode seven's material on generative AI search: Google is explicitly reallocating exactly this kind of space, question-and-answer-formatted content sitting directly in the results page, toward AI Overviews and AI Mode instead.", but the counterargument is: The script says Google explicitly reallocated FAQ space to AI Overviews/AI Mode. The official retirement notice establishes retirement, not that motive. The recap repeats the unsupported attribution. FAQ rich results stopped appearing on May 7, 2026. Remove the AI-replacement explanation, or explicitly label it as the adapter's hypothesis outside the source narration.
>
> Sources: Deprecating the FAQ rich result feature; paragraph 2: https://developers.google.com/search/updates#deprecating-the-faq-rich-result-feature.
>
> A056 | Unsupported | High priority | Checked 24 September 2026



A genuinely useful, sharp point worth remembering for future reference too: this exact same pattern already happened once before, to a different structured data type. HowTo rich results were deprecated on a very similar schedule back in 2023, and they never returned. Google's own trajectory here is consistently toward fewer traditional, visually rich result types over time, and more space handed instead to generative, AI-driven presentation. Worth keeping in mind as a general pattern: strategically over-relying on any single rich-result type as a durable traffic source carries real risk, since Google's own history shows a willingness to retire these features once it judges the underlying purpose better served elsewhere.

> ChatGPT fact check - this paragraph claims "HowTo rich results were deprecated on a very similar schedule back in 2023, and they never returned.", but the counterargument is: The script says Google explicitly reallocated FAQ space to AI Overviews/AI Mode. The official retirement notice establishes retirement, not that motive. The recap repeats the unsupported attribution. FAQ rich results stopped appearing on May 7, 2026. Remove the AI-replacement explanation, or explicitly label it as the adapter's hypothesis outside the source narration.
>
> Sources: Deprecating the FAQ rich result feature; paragraph 2: https://developers.google.com/search/updates#deprecating-the-faq-rich-result-feature.
>
> A056 | Unsupported | High priority | Checked 24 September 2026



What's genuinely unaffected by this specific change, worth stating plainly so the FAQ removal doesn't get overread as something broader than it is: Product, Review, Recipe, Article, Event, Organization, Local Business, Video, and Breadcrumb rich results all continue functioning entirely normally. This was a narrow, specific retirement of exactly one type, not a signal that structured data generally is being deprecated.

And one more reassurance worth stating directly, since it addresses the most natural worry: existing pages that previously won an FAQ rich result don't lose their actual ranking position purely because of this change. A rich result was always a visual, presentational upgrade layered on top of a result, never a ranking factor in itself; the underlying page that was ranking where it was continues ranking there, simply without that particular visual enhancement now available to it.

> ChatGPT fact check - this paragraph claims "And one more reassurance worth stating directly, since it addresses the most natural worry: existing pages that previously won an FAQ rich result don't lose their actual ranking position purely because of this change.", but the counterargument is: The episode promises that pages continue ranking in the same place. Retirement of a rich-result enhancement is not itself a ranking penalty, but positions and traffic can still change. This removes a search appearance, not the page's general eligibility to rank. It does not guarantee unchanged rankings, impressions, or clicks.
>
> Sources: Changes in Search Console reporting; paragraph 2: https://developers.google.com/search/blog/2023/08/howto-faq-changes#changes-in-search-console-reporting.
>
> A060 | Overstatement | Medium priority | Checked 24 September 2026



Let's ground this practically. If a store's FAQ page, say shipping and returns questions, was using FAQPage markup specifically hoping for that dropdown snippet, there's genuinely no urgent action required. Leave the markup in place if it's already there; removing it accomplishes nothing beneficial. But going forward, it's worth reallocating any effort that was specifically aimed at winning that particular rich result toward markup types still genuinely active and rewarded: Product markup for the catalogue itself, Organization markup for the business as a whole, and Review markup for genuine customer reviews, all of which we're about to cover, or have already covered, in proper depth.

> ChatGPT fact check - this paragraph claims "Leave the markup in place if it's already there; removing it accomplishes nothing beneficial.", but the counterargument is: Unused FAQ markup need not be urgently removed, but the blanket promise of clean validation ignores actual errors and the distinction between generic Schema.org validation and Google rich-result testing. 'Removing it accomplishes nothing beneficial' also makes an unsupported maintenance judgment. Correct FAQPage markup can remain in place. Use generic schema validation if needed; do not expect Google FAQ rich-result eligibility. Keeping or removing unused markup is a maintenance choice.
>
> Sources: Overview of the changes; paragraph 3: https://developers.google.com/search/blog/2023/08/howto-faq-changes#overview-of-the-changes.
>
> A058 | Overstatement | Medium priority | Checked 24 September 2026



> ChatGPT fact check - this paragraph claims "But going forward, it's worth reallocating any effort that was specifically aimed at winning that particular rich result toward markup types still genuinely active and rewarded: Product markup for the catalogue itself, Organization markup for the business as a whole, and Review markup for genuine customer reviews, all of which we're about to cover, or have already covered, in proper depth.", but the counterargument is: The store advice recommends Review markup for genuine customer reviews without distinguishing product reviews from self-serving reviews about the store itself. Use eligible product-review markup where appropriate. Reviews of a business or organization on pages it controls are not eligible for that entity's review-star feature, even if the reviews are genuine.
>
> Sources: Technical guidelines; list item 10: https://developers.google.com/search/docs/appearance/structured-data/review-snippet#technical-guidelines.
>
> A061 | Omission | High priority | Checked 24 September 2026



Let's recap.

The structured data gallery holds roughly twenty-five active types, from Article and Breadcrumb through Product, Review snippet, and Video, each unlocking a specific, distinct visual treatment in results, with eligibility never guaranteeing actual display. FAQ rich results were formally retired from Google Search as of May 2026, following the same trajectory HowTo rich results took back in 2023, with the underlying space explicitly shifting toward AI Overviews and AI Mode. The FAQPage markup itself remains harmless to keep, just no longer visually rewarded, and every other major rich result type, Product very much included, continues functioning entirely normally.

> ChatGPT fact check - this paragraph claims "FAQ rich results were formally retired from Google Search as of May 2026, following the same trajectory HowTo rich results took back in 2023, with the underlying space explicitly shifting toward AI Overviews and AI Mode.", but the counterargument is: The script says Google explicitly reallocated FAQ space to AI Overviews/AI Mode. The official retirement notice establishes retirement, not that motive. The recap repeats the unsupported attribution. FAQ rich results stopped appearing on May 7, 2026. Remove the AI-replacement explanation, or explicitly label it as the adapter's hypothesis outside the source narration.
>
> Sources: Deprecating the FAQ rich result feature; paragraph 2: https://developers.google.com/search/updates#deprecating-the-faq-rich-result-feature.
>
> A056 | Unsupported | High priority | Checked 24 September 2026



> ChatGPT fact check - this paragraph claims "The structured data gallery holds roughly twenty-five active types, from Article and Breadcrumb through Product, Review snippet, and Video, each unlocking a specific, distinct visual treatment in results, with eligibility never guaranteeing actual display.", but the counterargument is: There are 25 gallery entries, but Dataset serves Dataset Search; Speakable supports spoken content; paywall markup distinguishes paywalls from cloaking. Movie is a gallery entry not separately included in the chapter's tour. Describe 25 entries with different purposes and surfaces. Do not imply that every type unlocks a distinct visual treatment in ordinary web results.
>
> Sources: Structured data markup that Google Search supports; table row 6: https://developers.google.com/search/docs/appearance/structured-data/search-gallery#structured-data-markup-that-google-search-supports; Structured data markup that Google Search supports; table row 15: https://developers.google.com/search/docs/appearance/structured-data/search-gallery#structured-data-markup-that-google-search-supports.
>
> A059 | Error | Medium priority | Checked 24 September 2026



Next episode, we go deep specifically on shopping structured data: Product markup itself, merchant listings, variants, loyalty programs, and merchant return and shipping policies, the single most directly relevant stretch of this whole series for a Shopify catalogue. See you there.

This episode is adapted from the structured data gallery and current FAQ rich result deprecation documentation on Google Search Central, licensed under Creative Commons Attribution 4.0.

### Episode 25: Shopping Structured Data: Product, Merchant Listings, Variants, Returns, Shipping, and Loyalty

Welcome back. This is, in a real sense, the single most directly relevant episode in the entire series for a Shopify store. Today we cover Product structured data in full: the two distinct classes of markup, merchant listings specifically, product variants, and the ecommerce-policy markup that sits alongside it, return policies, shipping, and loyalty programs.

> ChatGPT fact check - this paragraph claims "Today we cover Product structured data in full: the two distinct classes of markup, merchant listings specifically, product variants, and the ecommerce-policy markup that sits alongside it, return policies, shipping, and loyalty programs.", but the counterargument is: The episode promises shipping in depth but has no shipping-policy explanation. Loyalty is reduced to one paragraph, omitting MemberProgram/tiers, individual-offer benefits, and availability limits. Add ShippingService under Organization via hasShippingService, plus OfferShippingDetails overrides. Add MemberProgram and tier basics, separate offer-level loyalty benefits, and the documented supported countries.
>
> Sources: Merchant shipping policy ( ShippingService ) structured data; paragraph 2: https://developers.google.com/search/docs/appearance/structured-data/shipping-policy#merchant-shipping-policy-shippingservice-structured-data; Technical guidelines; list item 1: https://developers.google.com/search/docs/appearance/structured-data/shipping-policy#technical-guidelines; Loyalty program ( MemberProgram ) structured data; paragraph 2: https://developers.google.com/search/docs/appearance/structured-data/loyalty-program#loyalty-program-memberprogram-structured-data.
>
> A067 | Omission | High priority | Checked 24 September 2026



Two classes of product structured data, and choosing between them correctly matters.

Product snippets are for product pages where people can't actually directly purchase the item on that page, an editorial review site comparing products it doesn't sell, say. This markup carries more options specifically for review information, things like structured pros-and-cons lists on an editorial review page.

Merchant listings are for pages where customers can actually purchase the product directly, precisely what every product page on a Shopify store is. This markup carries more options for the genuinely detailed commercial information a real buying decision depends on: apparel sizing, shipping details, and return policy information.

Here's a detail worth knowing precisely, since it removes what might look like a hard either-or choice: there's real overlap between the two. Adding the required properties for merchant listings generally means your pages become eligible for product snippet features too, automatically, on top of the merchant-listing-specific ones. Both feature sets carry their own distinct enhancements, so the practical guidance is straightforward: add the fuller merchant listing markup for a genuine ecommerce catalogue, and you pick up snippet eligibility as a byproduct, at no extra cost.

Merchant listings can make a page eligible for several distinct places Google actually surfaces shopping content: the shopping knowledge panel, Google Images, popular product results, and product snippets themselves.

The core Product and Offer markup. A worked example, in the RDFa syntax, though the same properties apply identically in JSON-LD: within an Offer nested inside the Product, you specify a price, an availability status using schema.org's InStock or similar values, a price currency, and a priceValidUntil date. You also specify a direct URL to that specific offer, an itemCondition, such as UsedCondition where relevant, a representative image, and a SKU.

> ChatGPT fact check - this paragraph claims "A worked example, in the RDFa syntax, though the same properties apply identically in JSON-LD: within an Offer nested inside the Product, you specify a price, an availability status using schema.org's InStock or similar values, a price currency, and a priceValidUntil date.", but the counterargument is: The narration places image and SKU among the Offer properties, omits the Product name from the core explanation, and presents recommended fields such as priceValidUntil like universal requirements. Explain the hierarchy: Product has name, image, and nested offers; SKU identifies the product. Offer contains the price and currency, with other properties required or recommended according to the feature. Never invent an expiry date merely to fill a field.
>
> Sources: Product; table row 2: https://developers.google.com/search/docs/appearance/structured-data/merchant-listing#product-properties; Product; table row 3: https://developers.google.com/search/docs/appearance/structured-data/merchant-listing#product-properties; Product; table row 22: https://developers.google.com/search/docs/appearance/structured-data/merchant-listing#product-properties; Offer; table row 9: https://developers.google.com/search/docs/appearance/structured-data/merchant-listing#offer-properties.
>
> A063 | Error | High priority | Checked 24 September 2026



Product variants, and this section matters enormously for a flag store specifically, given how many products exist as the same base design across multiple sizes and materials. If you offer variants of a product, different sizes, colours, or materials of essentially the same underlying item, Google has dedicated variant structured data specifically for representing that relationship properly, rather than treating each individual size or material as a wholly unrelated, disconnected product. This directly ties back to the canonicalization discussion from episode twelve: without proper variant markup, Google may struggle to understand that your three-by-five-foot and four-by-six-foot versions of the same flag design are meaningfully related items, rather than simply near-duplicate, competing pages.

> ChatGPT fact check - this paragraph claims "If you offer variants of a product, different sizes, colours, or materials of essentially the same underlying item, Google has dedicated variant structured data specifically for representing that relationship properly, rather than treating each individual size or material as a wholly unrelated, disconnected product.", but the counterargument is: The worked example calls six size/material variants one Product with variant Offers. Google's variant model uses ProductGroup and variant Product entities; each variant can have its own Offer. Group the flag family with ProductGroup. Represent each size/material combination as a Product, connect the variants using hasVariant or inProductGroupWithID as documented, and give each variant its own offer and identifier.
>
> Sources: Product variant structured data ( ProductGroup , Product ); paragraph 1: https://developers.google.com/search/docs/appearance/structured-data/product-variants#product-variant-structured-data-productgroup,-product; Single page example: variants nested under ProductGroup; paragraph 1: https://developers.google.com/search/docs/appearance/structured-data/product-variants#single-page-example-1.
>
> A064 | Error | High priority | Checked 24 September 2026



Now, the two dedicated ecommerce-policy markup types, both nested under your site's Organization markup rather than attached to any single individual product page, since they describe policies for your business as a whole.

> ChatGPT fact check - this paragraph claims "Now, the two dedicated ecommerce-policy markup types, both nested under your site's Organization markup rather than attached to any single individual product page, since they describe policies for your business as a whole.", but the counterargument is: Return policies can be supplied under Offer to override a business-wide policy. returnFees supports FreeReturn, ReturnFeesCustomerResponsibility, and ReturnShippingFees; the chapter says only FreeReturn is supported. State the organization-level policy and product-level override separately. Explain all three supported fee categories and use returnShippingFeesAmount with ReturnShippingFees when the merchant charges return shipping.
>
> Sources: Technical guidelines; list item 2: https://developers.google.com/search/docs/appearance/structured-data/return-policy#technical-guidelines; Finite or unlimited return windows; table row 3: https://developers.google.com/search/docs/appearance/structured-data/return-policy#finite-or-unlimited-return-windows; Finite or unlimited return windows; table row 5: https://developers.google.com/search/docs/appearance/structured-data/return-policy#finite-or-unlimited-return-windows; Return details; paragraph 2: https://developers.google.com/search/docs/appearance/structured-data/merchant-listing#product-with-returns-example.
>
> A066 | Error | High priority | Checked 24 September 2026



> ChatGPT fact check - this paragraph claims "Now, the two dedicated ecommerce-policy markup types, both nested under your site's Organization markup rather than attached to any single individual product page, since they describe policies for your business as a whole.", but the counterargument is: The episode promises shipping in depth but has no shipping-policy explanation. Loyalty is reduced to one paragraph, omitting MemberProgram/tiers, individual-offer benefits, and availability limits. Add ShippingService under Organization via hasShippingService, plus OfferShippingDetails overrides. Add MemberProgram and tier basics, separate offer-level loyalty benefits, and the documented supported countries.
>
> Sources: Merchant shipping policy ( ShippingService ) structured data; paragraph 2: https://developers.google.com/search/docs/appearance/structured-data/shipping-policy#merchant-shipping-policy-shippingservice-structured-data; Technical guidelines; list item 1: https://developers.google.com/search/docs/appearance/structured-data/shipping-policy#technical-guidelines; Loyalty program ( MemberProgram ) structured data; paragraph 2: https://developers.google.com/search/docs/appearance/structured-data/loyalty-program#loyalty-program-memberprogram-structured-data.
>
> A067 | Omission | High priority | Checked 24 September 2026



Merchant return policy. This lets you specify your business's actual return policy, or policies, in a machine-readable, structured form, which can then surface directly within merchant listing results themselves. The required properties: applicableCountry, the specific country or countries this particular policy applies to, using standard two-letter country codes, with up to twenty-five countries specifiable under one policy, and returnPolicyCategory, the actual type of return policy you're offering.

> ChatGPT fact check - this paragraph claims "The required properties: applicableCountry, the specific country or countries this particular policy applies to, using standard two-letter country codes, with up to twenty-five countries specifiable under one policy, and returnPolicyCategory, the actual type of return policy you're offering.", but the counterargument is: The chapter states a maximum of 25 countries for applicableCountry. Both current organization-level and merchant-listing references specify up to 50. You can specify up to fifty country codes for applicableCountry.
>
> Sources: MerchantReturnPolicy (nested under Organization using the hasMerchantReturnPolicy property); paragraph 2: https://developers.google.com/search/docs/appearance/structured-data/return-policy#merchant-return-policy-properties.
>
> A065 | Outdated | Medium priority | Checked 24 September 2026



The recommended properties build out real detail from there. merchantReturnDays specifies the number of days from delivery within which a product can be returned; this one becomes required specifically if you've set your returnPolicyCategory to a finite return window rather than an unlimited one. returnFees describes what kind of return fees apply; if returns are genuinely free, this property becomes required, and its value has to specifically be set to the FreeReturn designation, since other fee types aren't supported through this particular property; if there are actual return shipping costs instead, you'd use the separate returnShippingFeesAmount property to specify that cost directly. returnMethod describes the type of return method being offered, and becomes recommended specifically when you're using either a finite or an unlimited return window category.

> ChatGPT fact check - this paragraph claims "The recommended properties build out real detail from there. merchantReturnDays specifies the number of days from delivery within which a product can be returned; this one becomes required specifically if you've set your returnPolicyCategory to a finite return window rather than an unlimited one. returnFees describes what kind of return fees apply; if returns are genuinely free, this property becomes required, and its value has to specifically be set to the FreeReturn designation, since other fee types aren't supported through this particular property; if there are actual return shipping costs instead, you'd use the separate returnShippingFeesAmount property to specify that cost directly. returnMethod describes the type of return method being offered, and becomes recommended specifically when you're using either a finite or an unlimited return window category.", but the counterargument is: Return policies can be supplied under Offer to override a business-wide policy. returnFees supports FreeReturn, ReturnFeesCustomerResponsibility, and ReturnShippingFees; the chapter says only FreeReturn is supported. State the organization-level policy and product-level override separately. Explain all three supported fee categories and use returnShippingFeesAmount with ReturnShippingFees when the merchant charges return shipping.
>
> Sources: Technical guidelines; list item 2: https://developers.google.com/search/docs/appearance/structured-data/return-policy#technical-guidelines; Finite or unlimited return windows; table row 3: https://developers.google.com/search/docs/appearance/structured-data/return-policy#finite-or-unlimited-return-windows; Finite or unlimited return windows; table row 5: https://developers.google.com/search/docs/appearance/structured-data/return-policy#finite-or-unlimited-return-windows; Return details; paragraph 2: https://developers.google.com/search/docs/appearance/structured-data/merchant-listing#product-with-returns-example.
>
> A066 | Error | High priority | Checked 24 September 2026



Why does this genuinely matter for conversion, beyond simply being available markup? A searcher weighing whether to click through to your product, versus a competitor's, can see your actual return policy directly in the result itself, before ever landing on your site. For a physical product like a flag, where sizing or exact colour might reasonably concern a buyer sight-unseen, a visibly reassuring return policy shown right there in the search result is a genuine, concrete edge over a competing listing that hasn't bothered to mark this up at all.

Loyalty Program markup. This lets you specify details of any loyalty or rewards programme your business offers, again nested under your Organization markup, so it applies to your business generally rather than to any single product. If a store runs a repeat-customer rewards programme, or a points-based system, this is the structured, machine-readable way to make that programme's existence genuinely visible to Google, rather than leaving it buried only in unmarked page copy.

> ChatGPT fact check - this paragraph claims "This lets you specify details of any loyalty or rewards programme your business offers, again nested under your Organization markup, so it applies to your business generally rather than to any single product.", but the counterargument is: The episode promises shipping in depth but has no shipping-policy explanation. Loyalty is reduced to one paragraph, omitting MemberProgram/tiers, individual-offer benefits, and availability limits. Add ShippingService under Organization via hasShippingService, plus OfferShippingDetails overrides. Add MemberProgram and tier basics, separate offer-level loyalty benefits, and the documented supported countries.
>
> Sources: Merchant shipping policy ( ShippingService ) structured data; paragraph 2: https://developers.google.com/search/docs/appearance/structured-data/shipping-policy#merchant-shipping-policy-shippingservice-structured-data; Technical guidelines; list item 1: https://developers.google.com/search/docs/appearance/structured-data/shipping-policy#technical-guidelines; Loyalty program ( MemberProgram ) structured data; paragraph 2: https://developers.google.com/search/docs/appearance/structured-data/loyalty-program#loyalty-program-memberprogram-structured-data.
>
> A067 | Omission | High priority | Checked 24 September 2026



Two complementary paths worth knowing exist side by side, rather than one replacing the other. You can add this structured data directly to your own webpages, exactly as we've been covering. Or, separately, you can upload a product data feed directly to Google Merchant Center, the same Merchant Center referenced back in episode seven's coverage of generative AI features. Google's own guidance here is direct: providing both structured data on your pages and a Merchant Center feed together maximises your product's actual visibility, rather than treating the two as interchangeable alternatives where only one is needed.

Let's ground all of this directly in a concrete, worked example, since this episode is specifically the practical payoff for a catalogue this size. A single flag design, say a specific historical regimental flag, sold in three sizes and two fabric weights, is really one Product with distinct variant Offers underneath it, not six unrelated products competing against each other in Google's eyes. Each individual offer carries its own price, availability, and SKU. The whole family shares one return policy, marked up once under Organization rather than repeated six separate times across six separate product pages. And if the store's actual return window genuinely is, say, thirty days with free return shipping, that's precisely the kind of concrete, reassuring detail worth surfacing directly in a result through exactly this markup, rather than leaving a hesitant searcher to dig through a buried policy page just to find out before they'll commit to clicking through at all.

> ChatGPT fact check - this paragraph claims "A single flag design, say a specific historical regimental flag, sold in three sizes and two fabric weights, is really one Product with distinct variant Offers underneath it, not six unrelated products competing against each other in Google's eyes.", but the counterargument is: The worked example calls six size/material variants one Product with variant Offers. Google's variant model uses ProductGroup and variant Product entities; each variant can have its own Offer. Group the flag family with ProductGroup. Represent each size/material combination as a Product, connect the variants using hasVariant or inProductGroupWithID as documented, and give each variant its own offer and identifier.
>
> Sources: Product variant structured data ( ProductGroup , Product ); paragraph 1: https://developers.google.com/search/docs/appearance/structured-data/product-variants#product-variant-structured-data-productgroup,-product; Single page example: variants nested under ProductGroup; paragraph 1: https://developers.google.com/search/docs/appearance/structured-data/product-variants#single-page-example-1.
>
> A064 | Error | High priority | Checked 24 September 2026



> ChatGPT fact check - this paragraph claims "The whole family shares one return policy, marked up once under Organization rather than repeated six separate times across six separate product pages.", but the counterargument is: Return policies can be supplied under Offer to override a business-wide policy. returnFees supports FreeReturn, ReturnFeesCustomerResponsibility, and ReturnShippingFees; the chapter says only FreeReturn is supported. State the organization-level policy and product-level override separately. Explain all three supported fee categories and use returnShippingFeesAmount with ReturnShippingFees when the merchant charges return shipping.
>
> Sources: Technical guidelines; list item 2: https://developers.google.com/search/docs/appearance/structured-data/return-policy#technical-guidelines; Finite or unlimited return windows; table row 3: https://developers.google.com/search/docs/appearance/structured-data/return-policy#finite-or-unlimited-return-windows; Finite or unlimited return windows; table row 5: https://developers.google.com/search/docs/appearance/structured-data/return-policy#finite-or-unlimited-return-windows; Return details; paragraph 2: https://developers.google.com/search/docs/appearance/structured-data/merchant-listing#product-with-returns-example.
>
> A066 | Error | High priority | Checked 24 September 2026



Let's recap.

Choose merchant listing markup for any page where a customer can genuinely purchase directly, which covers essentially your entire storefront, and it earns product snippet eligibility as a byproduct too. The core Offer properties are price, availability, currency, a valid-until date, item condition, image, and SKU. Use dedicated variant structured data to properly represent size, colour, or material variants as one connected family rather than disconnected competing products. Merchant return policy and Loyalty Program markup both live under your Organization markup, describing your business's policies as a whole, with return policy specifically capable of surfacing return windows and fees directly within a search result itself. And structured data on your pages and a Merchant Center feed work together, not as substitutes for one another, to maximise genuine product visibility.

> ChatGPT fact check - this paragraph claims "The core Offer properties are price, availability, currency, a valid-until date, item condition, image, and SKU.", but the counterargument is: The narration places image and SKU among the Offer properties, omits the Product name from the core explanation, and presents recommended fields such as priceValidUntil like universal requirements. Explain the hierarchy: Product has name, image, and nested offers; SKU identifies the product. Offer contains the price and currency, with other properties required or recommended according to the feature. Never invent an expiry date merely to fill a field.
>
> Sources: Product; table row 2: https://developers.google.com/search/docs/appearance/structured-data/merchant-listing#product-properties; Product; table row 3: https://developers.google.com/search/docs/appearance/structured-data/merchant-listing#product-properties; Product; table row 22: https://developers.google.com/search/docs/appearance/structured-data/merchant-listing#product-properties; Offer; table row 9: https://developers.google.com/search/docs/appearance/structured-data/merchant-listing#offer-properties.
>
> A063 | Error | High priority | Checked 24 September 2026



> ChatGPT fact check - this paragraph claims "Merchant return policy and Loyalty Program markup both live under your Organization markup, describing your business's policies as a whole, with return policy specifically capable of surfacing return windows and fees directly within a search result itself.", but the counterargument is: Return policies can be supplied under Offer to override a business-wide policy. returnFees supports FreeReturn, ReturnFeesCustomerResponsibility, and ReturnShippingFees; the chapter says only FreeReturn is supported. State the organization-level policy and product-level override separately. Explain all three supported fee categories and use returnShippingFeesAmount with ReturnShippingFees when the merchant charges return shipping.
>
> Sources: Technical guidelines; list item 2: https://developers.google.com/search/docs/appearance/structured-data/return-policy#technical-guidelines; Finite or unlimited return windows; table row 3: https://developers.google.com/search/docs/appearance/structured-data/return-policy#finite-or-unlimited-return-windows; Finite or unlimited return windows; table row 5: https://developers.google.com/search/docs/appearance/structured-data/return-policy#finite-or-unlimited-return-windows; Return details; paragraph 2: https://developers.google.com/search/docs/appearance/structured-data/merchant-listing#product-with-returns-example.
>
> A066 | Error | High priority | Checked 24 September 2026



> ChatGPT fact check - this paragraph claims "Merchant return policy and Loyalty Program markup both live under your Organization markup, describing your business's policies as a whole, with return policy specifically capable of surfacing return windows and fees directly within a search result itself.", but the counterargument is: The episode promises shipping in depth but has no shipping-policy explanation. Loyalty is reduced to one paragraph, omitting MemberProgram/tiers, individual-offer benefits, and availability limits. Add ShippingService under Organization via hasShippingService, plus OfferShippingDetails overrides. Add MemberProgram and tier basics, separate offer-level loyalty benefits, and the documented supported countries.
>
> Sources: Merchant shipping policy ( ShippingService ) structured data; paragraph 2: https://developers.google.com/search/docs/appearance/structured-data/shipping-policy#merchant-shipping-policy-shippingservice-structured-data; Technical guidelines; list item 1: https://developers.google.com/search/docs/appearance/structured-data/shipping-policy#technical-guidelines; Loyalty program ( MemberProgram ) structured data; paragraph 2: https://developers.google.com/search/docs/appearance/structured-data/loyalty-program#loyalty-program-memberprogram-structured-data.
>
> A067 | Omission | High priority | Checked 24 September 2026



Next episode, we cover Discover, local features, preferred sources, regional and translated result features, and Web Stories, rounding out the ranking and appearance section of this series before we move into the dedicated ecommerce and international guides. See you there.

This episode is adapted from "Introduction to Product structured data" and "Merchant listing (Product, Offer) structured data" on Google Search Central, licensed under Creative Commons Attribution 4.0.

## Part Four: Specialty Guides

### Episode 26: Discover, Establishing Your Business Details, Preferred Sources, and Web Stories

Welcome back. Today rounds out Part Three with four distinct but related subjects: Google Discover, the feed-style surface separate from ordinary search; establishing your official business details with Google directly; a genuinely new feature called Preferred Sources, launched in August 2026; and the content policies governing Web Stories.

> ChatGPT fact check - this paragraph claims "Today rounds out Part Three with four distinct but related subjects: Google Discover, the feed-style surface separate from ordinary search; establishing your official business details with Google directly; a genuinely new feature called Preferred Sources, launched in August 2026; and the content policies governing Web Stories.", but the counterargument is: August 20, 2026 is the documentation update for the custom button, not the original launch of Preferred Sources. Google's changelog already discusses the feature in January, global language availability in April, and AI expansion in May. On August 20, 2026, Google documented a new interactive Preferred Sources button. The underlying feature predates that update. Remove the unsupported launch narrative and separately source any adoption statistic.
>
> Sources: New custom button for preferred sources; paragraph 1: https://developers.google.com/search/updates#new-custom-button-for-preferred-sources; Preferred sources is available in AI Mode and AI Overviews; paragraph 1: https://developers.google.com/search/updates#preferred-sources-is-available-in-ai-mode-and-ai-overviews; Expanding preferred sources to all languages where Google Search is available; paragraph 1: https://developers.google.com/search/updates#expanding-preferred-sources-to-all-languages-where-google-search-is-available.
>
> A068 | Error | High priority | Checked 24 September 2026



> ChatGPT fact check - this paragraph claims "Today rounds out Part Three with four distinct but related subjects: Google Discover, the feed-style surface separate from ordinary search; establishing your official business details with Google directly; a genuinely new feature called Preferred Sources, launched in August 2026; and the content policies governing Web Stories.", but the counterargument is: Episode 26 is in Part Four but says it rounds out Part Three. Introduce Part Four: specialty guides.
>
> Sources: Internal source: seo-study/index.html, episode listings and introductory paragraphs; compare the chapter headings and text. This is an editorial or coverage correction, not an additional Google policy..
>
> A071 | Editorial | Low priority | Checked 24 September 2026



Google Discover.

Discover is the feed-style content surface inside the Google app and on the Google homepage, built around a person's interests rather than something they actively typed into a search box. Google's own guidance for increasing the likelihood of appearing there reads almost like a distilled version of episode six's content-quality principles, applied specifically to this one surface.

Avoid clickbait and similar tactics that artificially inflate engagement, specifically by using misleading or exaggerated details in your preview content, your title, snippet, or images, to increase appeal, or by deliberately withholding information a reader would need to actually understand what the content is even about before clicking. Use page titles and headlines that genuinely capture the essence of the content, not headlines engineered purely to create a curiosity gap. Avoid sensationalism tactics that manipulate appeal by catering to morbid curiosity, titillation, or outrage specifically. Provide content that's genuinely timely for current interests, tells a story well, or offers real, unique insight. And include compelling, high-quality images relevant to the content, with Google specifically noting that larger images, at least 1,200 pixels wide, are more likely to actually generate visits from Discover.

> ChatGPT fact check - this paragraph claims "And include compelling, high-quality images relevant to the content, with Google specifically noting that larger images, at least 1,200 pixels wide, are more likely to actually generate visits from Discover.", but the counterargument is: The chapter gives 1,200 pixels but omits the large-image permission setting, current resolution/aspect guidance, and the facts that older content can qualify and eligibility does not guarantee appearance. The asserted editorial reordering history is not evidenced by the chapter's citations. Include current image recommendations and max-image-preview:large (or the documented AMP alternative). State that indexed, policy-compliant content is eligible without special tags and that older relevant content may appear.
>
> Sources: How content appears in Discover; paragraph 2: https://developers.google.com/search/docs/appearance/google-discover#how-content-appears-in-discover; How content appears in Discover; list item 5: https://developers.google.com/search/docs/appearance/google-discover#how-content-appears-in-discover; How content appears in Discover; list item 6: https://developers.google.com/search/docs/appearance/google-discover#how-content-appears-in-discover.
>
> A070 | Omission | Medium priority | Checked 24 September 2026



Two elements were specifically elevated in a more recent revision of this guidance, moved toward the top of the list to emphasise their weight. Clickbait avoidance, which we just covered, was specifically promoted from a lower position to lead the whole list. And page experience, the Core Web Vitals and broader experience factors from episode twenty, was added as a new, explicit recommendation in its own right, not merely implied. If a page's Discover traffic drops meaningfully, auditing genuine user experience is now specifically named as a direct diagnostic step worth taking.

> ChatGPT fact check - this paragraph claims "If a page's Discover traffic drops meaningfully, auditing genuine user experience is now specifically named as a direct diagnostic step worth taking.", but the counterargument is: The chapter gives 1,200 pixels but omits the large-image permission setting, current resolution/aspect guidance, and the facts that older content can qualify and eligibility does not guarantee appearance. The asserted editorial reordering history is not evidenced by the chapter's citations. Include current image recommendations and max-image-preview:large (or the documented AMP alternative). State that indexed, policy-compliant content is eligible without special tags and that older relevant content may appear.
>
> Sources: How content appears in Discover; paragraph 2: https://developers.google.com/search/docs/appearance/google-discover#how-content-appears-in-discover; How content appears in Discover; list item 5: https://developers.google.com/search/docs/appearance/google-discover#how-content-appears-in-discover; How content appears in Discover; list item 6: https://developers.google.com/search/docs/appearance/google-discover#how-content-appears-in-discover.
>
> A070 | Omission | Medium priority | Checked 24 September 2026



Establishing your business details with Google.

This is about directly claiming and verifying your business's official presence with Google, rather than simply hoping Google's own automated systems correctly piece it together from scattered signals across the web.

Claim your local business through a Business Profile, which governs how your business appears on Google Maps and within the Google knowledge panel. Once you verify yourself as the genuine owner of a listing, you can directly provide or correct your address, contact information, business type, and photos.

Register your website in Search Console. This is the first real step in establishing an official presence, since it verifies you as the genuine owner or operator of that specific site, and it's also the tool underlying essentially every technical diagnostic covered across this whole series, which we'll return to directly in a couple of episodes.

Update your site's knowledge panel. Google's own algorithms already gather publicly available signals, your business's name, corporate contact details, and social profiles, largely on their own. But once verified as an official representative, you gain the ability to directly correct or override what Google's automated systems have independently pieced together, rather than passively hoping they got it right.

Add structured data, tying straight back to the Organization markup we covered in episode twenty-five, which is precisely how you give Google an explicit, machine-readable statement about your business rather than leaving it to infer everything purely from unstructured page content.

There's a separate, more detailed set of guidelines specifically for Business Profile content itself, worth knowing the shape of. Represent your business accurately and consistently with how it's actually known in the real world, across your storefront signage, stationery, and every other branding touchpoint. Keep your address or service area genuinely accurate and precise. And your business description specifically must avoid several things: low-quality, irrelevant, or distracting content, such as misspellings or gibberish; content focused specifically on special promotions or discounted pricing, Google's own disallowed examples include phrasing like "Everything on sale, fifty percent off" or "best bagels in town for five dollars"; and links of any kind, none are permitted within that description field at all.

Now, Preferred Sources, and this is genuinely new, launched on August 20, 2026, so current enough that it's worth understanding in real detail.

> ChatGPT fact check - this paragraph claims "Now, Preferred Sources, and this is genuinely new, launched on August 20, 2026, so current enough that it's worth understanding in real detail.", but the counterargument is: August 20, 2026 is the documentation update for the custom button, not the original launch of Preferred Sources. Google's changelog already discusses the feature in January, global language availability in April, and AI expansion in May. On August 20, 2026, Google documented a new interactive Preferred Sources button. The underlying feature predates that update. Remove the unsupported launch narrative and separately source any adoption statistic.
>
> Sources: New custom button for preferred sources; paragraph 1: https://developers.google.com/search/updates#new-custom-button-for-preferred-sources; Preferred sources is available in AI Mode and AI Overviews; paragraph 1: https://developers.google.com/search/updates#preferred-sources-is-available-in-ai-mode-and-ai-overviews; Expanding preferred sources to all languages where Google Search is available; paragraph 1: https://developers.google.com/search/updates#expanding-preferred-sources-to-all-languages-where-google-search-is-available.
>
> A068 | Error | High priority | Checked 24 September 2026



Google introduced a new button, called Preferred Sources, that publishers can embed directly on their own website. When a visitor clicks it, that specific site gets added to their own personal Preferred Sources list within Google, and the visitor is immediately returned right back to the page they were already reading, with no real friction or interruption to their actual visit.

Here's the direct, practical payoff for a site whose visitors opt in this way: a person's chosen preferred sources can then appear more often specifically within Google Search features including Top Stories, AI Overviews, and AI Mode, the generative features from episode seven. As of this feature's launch, Google reported that users had already selected more than 600,000 unique sources collectively across the web, indicating genuine, immediate uptake.

> ChatGPT fact check - this paragraph claims "As of this feature's launch, Google reported that users had already selected more than 600,000 unique sources collectively across the web, indicating genuine, immediate uptake.", but the counterargument is: August 20, 2026 is the documentation update for the custom button, not the original launch of Preferred Sources. Google's changelog already discusses the feature in January, global language availability in April, and AI expansion in May. On August 20, 2026, Google documented a new interactive Preferred Sources button. The underlying feature predates that update. Remove the unsupported launch narrative and separately source any adoption statistic.
>
> Sources: New custom button for preferred sources; paragraph 1: https://developers.google.com/search/updates#new-custom-button-for-preferred-sources; Preferred sources is available in AI Mode and AI Overviews; paragraph 1: https://developers.google.com/search/updates#preferred-sources-is-available-in-ai-mode-and-ai-overviews; Expanding preferred sources to all languages where Google Search is available; paragraph 1: https://developers.google.com/search/updates#expanding-preferred-sources-to-all-languages-where-google-search-is-available.
>
> A068 | Error | High priority | Checked 24 September 2026



> ChatGPT fact check - this paragraph claims "Here's the direct, practical payoff for a site whose visitors opt in this way: a person's chosen preferred sources can then appear more often specifically within Google Search features including Top Stories, AI Overviews, and AI Mode, the generative features from episode seven.", but the counterargument is: The current Preferred Sources guide covers Top Stories and preferred badges in AI features. It does not establish that this button changes Discover and Google News as claimed. Search profiles separately affect Discover following. Keep Preferred Sources and Search-profile following distinct. Explain only the surfaces and behavior documented for each; remove claims of guaranteed measurable visibility gains.
>
> Sources: Help your readers find your site through preferred sources in Google Search; paragraph 1: https://developers.google.com/search/docs/appearance/preferred-sources#help-your-readers-find-your-site-through-preferred-sources-in-google-search; Feature availability; paragraph 1: https://developers.google.com/search/docs/appearance/preferred-sources#availability; Feature availability; paragraph 2: https://developers.google.com/search/docs/appearance/preferred-sources#availability.
>
> A069 | Unsupported | High priority | Checked 24 September 2026



For publishers wanting to actually implement this, Google makes the button's underlying code available directly through its own Search Central documentation, so adding it is a matter of embedding that provided code on your own site rather than building anything from scratch yourself.

Google paired this specifically with new personalisation controls on the Discover and Google News side too, giving individual users more direct say over the kind of content populating their own feeds, part of the same broader push toward letting people more actively shape which sources and topics they see across Google's surfaces, rather than relying purely on passive algorithmic inference.

> ChatGPT fact check - this paragraph claims "Google paired this specifically with new personalisation controls on the Discover and Google News side too, giving individual users more direct say over the kind of content populating their own feeds, part of the same broader push toward letting people more actively shape which sources and topics they see across Google's surfaces, rather than relying purely on passive algorithmic inference.", but the counterargument is: The current Preferred Sources guide covers Top Stories and preferred badges in AI features. It does not establish that this button changes Discover and Google News as claimed. Search profiles separately affect Discover following. Keep Preferred Sources and Search-profile following distinct. Explain only the surfaces and behavior documented for each; remove claims of guaranteed measurable visibility gains.
>
> Sources: Help your readers find your site through preferred sources in Google Search; paragraph 1: https://developers.google.com/search/docs/appearance/preferred-sources#help-your-readers-find-your-site-through-preferred-sources-in-google-search; Feature availability; paragraph 1: https://developers.google.com/search/docs/appearance/preferred-sources#availability; Feature availability; paragraph 2: https://developers.google.com/search/docs/appearance/preferred-sources#availability.
>
> A069 | Unsupported | High priority | Checked 24 September 2026



For a business built specifically around cultivated personal authority, exactly the kind of long-term brand-building project this podcast series has occasionally touched on in its examples, a feature like this is worth watching closely: it's a genuinely new, direct channel for turning an existing, loyal reader or customer into someone whose future searches are measurably more likely to keep surfacing your own content specifically, across Search, Discover, and the newer AI surfaces all at once.

> ChatGPT fact check - this paragraph claims "For a business built specifically around cultivated personal authority, exactly the kind of long-term brand-building project this podcast series has occasionally touched on in its examples, a feature like this is worth watching closely: it's a genuinely new, direct channel for turning an existing, loyal reader or customer into someone whose future searches are measurably more likely to keep surfacing your own content specifically, across Search, Discover, and the newer AI surfaces all at once.", but the counterargument is: The current Preferred Sources guide covers Top Stories and preferred badges in AI features. It does not establish that this button changes Discover and Google News as claimed. Search profiles separately affect Discover following. Keep Preferred Sources and Search-profile following distinct. Explain only the surfaces and behavior documented for each; remove claims of guaranteed measurable visibility gains.
>
> Sources: Help your readers find your site through preferred sources in Google Search; paragraph 1: https://developers.google.com/search/docs/appearance/preferred-sources#help-your-readers-find-your-site-through-preferred-sources-in-google-search; Feature availability; paragraph 1: https://developers.google.com/search/docs/appearance/preferred-sources#availability; Feature availability; paragraph 2: https://developers.google.com/search/docs/appearance/preferred-sources#availability.
>
> A069 | Unsupported | High priority | Checked 24 September 2026



Web Stories.

A full-screen, tappable, visually immersive content format, appearing both within Discover specifically and, more broadly, across Google Search results on mobile.

For eligibility to appear in Discover and Search at all, a Web Story must comply with Discover's own policies, the Search Essentials from episode one, and Google Search's overall content policies generally. For eligibility in the richer, more prominent display experiences specifically, like a dedicated carousel view, additional, more specific content policies apply.

Several of these are worth knowing precisely, since they're fairly exacting compared to ordinary web content. Copyright: Web Stories are meant to reflect genuinely original work, and any that infringe someone else's copyright, without permission, can simply be blocked from appearing. Text density: Google specifically discourages text-heavy stories, and a Web Story may become ineligible if the majority of its individual pages carry more than 180 characters of text; short-form video, under 60 seconds per page, is specifically encouraged where practical instead. Asset quality: stretched or heavily pixelated images and video, degraded to the point of genuinely harming the viewing experience, aren't accepted. Narrative structure: a Web Story needs a genuine, cohesive story or unifying theme running consistently across its pages, not a disconnected, unrelated set of individual pages loosely bundled together. Completeness: a story can't be incomplete, or require a viewer to click away to some external website or app just to obtain essential information the story itself promised to deliver. And commercial balance: a Web Story whose sole real purpose is advertising a product or service, particularly where you'd directly and primarily benefit from that promotion, isn't permitted. Affiliate marketing links specifically are allowed, but only when restricted to a genuinely minor part of the overall story, not as its central purpose.

Let's bring all four subjects together practically. For a store's own content strategy: Discover rewards genuine, timely, well-illustrated storytelling over anything resembling a curiosity-gap headline, so a piece like a first-hand account of testing flag fabrics through a real winter, the exact kind of non-commodity content from episode seven, is precisely suited to it. Claiming and verifying a Business Profile and Search Console presence directly, rather than leaving Google to infer everything passively, is a genuinely low-effort, high-leverage step worth doing early. Preferred Sources is worth watching and adopting once it's more broadly available and understood, given how directly it can compound an existing, loyal audience's future visibility of your own content. And a Web Story genuinely showcasing, say, a flag's actual outdoor durability across a season, in short video clips with minimal on-page text, fits the format's own stated preferences closely, provided it stays a genuine story rather than a thinly disguised promotional pitch.

Let's recap.

Discover rewards honest, non-clickbait titles, genuinely timely and insightful content, large high-quality images, and now explicitly rewards good page experience too, having recently promoted both clickbait avoidance and page experience to top billing in its own guidance. Establishing your business details means claiming a Business Profile, verifying in Search Console, correcting your knowledge panel, and backing all of it with Organization structured data, while keeping your business description free of promotional pricing language and links entirely. Preferred Sources, launched August 2026, lets visitors directly opt into seeing more of your content across Search, AI Overviews, AI Mode, Discover, and News, through a button you embed yourself. And Web Stories need genuine narrative cohesion, light text, high-quality visuals, completeness without requiring an external click, and only a minor, restrained commercial or affiliate component.

> ChatGPT fact check - this paragraph claims "Preferred Sources, launched August 2026, lets visitors directly opt into seeing more of your content across Search, AI Overviews, AI Mode, Discover, and News, through a button you embed yourself.", but the counterargument is: August 20, 2026 is the documentation update for the custom button, not the original launch of Preferred Sources. Google's changelog already discusses the feature in January, global language availability in April, and AI expansion in May. On August 20, 2026, Google documented a new interactive Preferred Sources button. The underlying feature predates that update. Remove the unsupported launch narrative and separately source any adoption statistic.
>
> Sources: New custom button for preferred sources; paragraph 1: https://developers.google.com/search/updates#new-custom-button-for-preferred-sources; Preferred sources is available in AI Mode and AI Overviews; paragraph 1: https://developers.google.com/search/updates#preferred-sources-is-available-in-ai-mode-and-ai-overviews; Expanding preferred sources to all languages where Google Search is available; paragraph 1: https://developers.google.com/search/updates#expanding-preferred-sources-to-all-languages-where-google-search-is-available.
>
> A068 | Error | High priority | Checked 24 September 2026



> ChatGPT fact check - this paragraph claims "Preferred Sources, launched August 2026, lets visitors directly opt into seeing more of your content across Search, AI Overviews, AI Mode, Discover, and News, through a button you embed yourself.", but the counterargument is: The current Preferred Sources guide covers Top Stories and preferred badges in AI features. It does not establish that this button changes Discover and Google News as claimed. Search profiles separately affect Discover following. Keep Preferred Sources and Search-profile following distinct. Explain only the surfaces and behavior documented for each; remove claims of guaranteed measurable visibility gains.
>
> Sources: Help your readers find your site through preferred sources in Google Search; paragraph 1: https://developers.google.com/search/docs/appearance/preferred-sources#help-your-readers-find-your-site-through-preferred-sources-in-google-search; Feature availability; paragraph 1: https://developers.google.com/search/docs/appearance/preferred-sources#availability; Feature availability; paragraph 2: https://developers.google.com/search/docs/appearance/preferred-sources#availability.
>
> A069 | Unsupported | High priority | Checked 24 September 2026



> ChatGPT fact check - this paragraph claims "Discover rewards honest, non-clickbait titles, genuinely timely and insightful content, large high-quality images, and now explicitly rewards good page experience too, having recently promoted both clickbait avoidance and page experience to top billing in its own guidance.", but the counterargument is: The chapter gives 1,200 pixels but omits the large-image permission setting, current resolution/aspect guidance, and the facts that older content can qualify and eligibility does not guarantee appearance. The asserted editorial reordering history is not evidenced by the chapter's citations. Include current image recommendations and max-image-preview:large (or the documented AMP alternative). State that indexed, policy-compliant content is eligible without special tags and that older relevant content may appear.
>
> Sources: How content appears in Discover; paragraph 2: https://developers.google.com/search/docs/appearance/google-discover#how-content-appears-in-discover; How content appears in Discover; list item 5: https://developers.google.com/search/docs/appearance/google-discover#how-content-appears-in-discover; How content appears in Discover; list item 6: https://developers.google.com/search/docs/appearance/google-discover#how-content-appears-in-discover.
>
> A070 | Omission | Medium priority | Checked 24 September 2026



Next episode, we move into the dedicated ecommerce guide in full: where product data can actually appear across Google, sharing your product data properly, launching a new ecommerce site, and writing genuinely high-quality reviews. See you there.

This episode is adapted from "Discover and your website," "Establish your business details with Google," current Google Search Central documentation on Preferred Sources, and "Web Story content policies" on Google Search Central, licensed under Creative Commons Attribution 4.0.

### Episode 27: The Full Ecommerce Guide: Presence, Launches, and Writing Genuinely High-Quality Reviews

> ChatGPT fact check - this paragraph claims "The Full Ecommerce Guide: Presence, Launches, and Writing Genuinely High-Quality Reviews", but the counterargument is: The chapter does not actually cover ecommerce URL design, navigation/site structure, pagination and incremental loading, or a full structured-data implementation guide. Earlier chapters promise fuller treatment here. Add the missing source sections or rename this as selected ecommerce guidance. Include crawlable pagination and the rule that each paginated page normally has its own canonical URL.
>
> Sources: Designing a URL structure for ecommerce websites; paragraph 1: https://developers.google.com/search/docs/specialty/ecommerce/designing-a-url-structure-for-ecommerce-sites#designing-a-url-structure-for-ecommerce-websites.
>
> A073 | Omission | High priority | Checked 24 September 2026



Welcome back. This episode is Google's dedicated ecommerce guide, taken as a whole. Some pieces we've already touched on from different angles across this series, product structured data, URL structure, site structure; today pulls the full picture together and adds the pieces we haven't covered yet: where ecommerce content can actually appear, launch strategy for a new site, and, in real depth, what genuinely makes a product review good.

> ChatGPT fact check - this paragraph claims "Some pieces we've already touched on from different angles across this series, product structured data, URL structure, site structure; today pulls the full picture together and adds the pieces we haven't covered yet: where ecommerce content can actually appear, launch strategy for a new site, and, in real depth, what genuinely makes a product review good.", but the counterargument is: Google documents four launch approaches, including a soft launch; the script gives three. For launch without availability, the source also covers excluded_destination and warns against disabling add-to-cart because of price verification. The adaptation recommends this too broadly for relaunches. Cover all four approaches and their trade-offs. Preserve the Merchant Center and cart-verification qualifications; distinguish a new-site launch from pausing an existing business.
>
> Sources: How to launch a new ecommerce website; list item 10: https://developers.google.com/search/docs/specialty/ecommerce/how-to-launch-an-ecommerce-website#how-to-launch-a-new-ecommerce-website; Launch without product availability; paragraph 2: https://developers.google.com/search/docs/specialty/ecommerce/how-to-launch-an-ecommerce-website#products-unavailable.
>
> A072 | Omission | Medium priority | Checked 24 September 2026



> ChatGPT fact check - this paragraph claims "Some pieces we've already touched on from different angles across this series, product structured data, URL structure, site structure; today pulls the full picture together and adds the pieces we haven't covered yet: where ecommerce content can actually appear, launch strategy for a new site, and, in real depth, what genuinely makes a product review good.", but the counterargument is: The chapter does not actually cover ecommerce URL design, navigation/site structure, pagination and incremental loading, or a full structured-data implementation guide. Earlier chapters promise fuller treatment here. Add the missing source sections or rename this as selected ecommerce guidance. Include crawlable pagination and the rule that each paginated page normally has its own canonical URL.
>
> Sources: Designing a URL structure for ecommerce websites; paragraph 1: https://developers.google.com/search/docs/specialty/ecommerce/designing-a-url-structure-for-ecommerce-sites#designing-a-url-structure-for-ecommerce-websites.
>
> A073 | Omission | High priority | Checked 24 September 2026



Google's own framing for why this guide exists at all: being discovered in Search is a critical challenge for any ecommerce site, and Google can help shoppers discover your site at each distinct stage of their shopping journey, not merely at the final moment of purchase.

Where ecommerce content can actually appear on Google.

It's worth knowing the full breadth here, since it's genuinely wider than most people assume: Search, Maps, Lens, Image Search, Shopping, and Google Business Profile all support ecommerce content, each in its own distinct way. And Google is specific that product data itself, while the most obvious kind of content, isn't the only kind worth providing. Other content types matter at different points in a buyer's journey too: company information, offers and promotions, reviews, and customer service touchpoints all have their own place and value.

Sharing your product data with Google.

Two methods, and we touched on this back in episode twenty-five, but it's worth restating precisely here as the guide's own core recommendation: include structured data directly on your product pages, or upload a feed directly to Google Merchant Center. And Google's own stated preference, worth remembering precisely: while you can technically use just one method, doing both together increases your odds of a rich result appearance and maximises the actual traffic you bring in, since the two methods aren't fully redundant with each other.

Structured data types particularly relevant to ecommerce specifically, beyond Product itself: LocalBusiness, Review, BreadcrumbList, WebSite, and VideoObject all have real, direct relevance to a typical storefront, on top of the Product and Offer markup from episode twenty-five.

> ChatGPT fact check - this paragraph claims "Structured data types particularly relevant to ecommerce specifically, beyond Product itself: LocalBusiness, Review, BreadcrumbList, WebSite, and VideoObject all have real, direct relevance to a typical storefront, on top of the Product and Offer markup from episode twenty-five.", but the counterargument is: The chapter does not actually cover ecommerce URL design, navigation/site structure, pagination and incremental loading, or a full structured-data implementation guide. Earlier chapters promise fuller treatment here. Add the missing source sections or rename this as selected ecommerce guidance. Include crawlable pagination and the rule that each paginated page normally has its own canonical URL.
>
> Sources: Designing a URL structure for ecommerce websites; paragraph 1: https://developers.google.com/search/docs/specialty/ecommerce/designing-a-url-structure-for-ecommerce-sites#designing-a-url-structure-for-ecommerce-websites.
>
> A073 | Omission | High priority | Checked 24 September 2026



How to launch a new ecommerce website.

This is genuinely practical, and worth knowing if a redesign or relaunch is ever on the table. Google lays out the timing considerations around registering a new site, and distinct launch strategies, each with its own trade-offs.

> ChatGPT fact check - this paragraph claims "Google lays out the timing considerations around registering a new site, and distinct launch strategies, each with its own trade-offs.", but the counterargument is: Google documents four launch approaches, including a soft launch; the script gives three. For launch without availability, the source also covers excluded_destination and warns against disabling add-to-cart because of price verification. The adaptation recommends this too broadly for relaunches. Cover all four approaches and their trade-offs. Preserve the Merchant Center and cart-verification qualifications; distinguish a new-site launch from pausing an existing business.
>
> Sources: How to launch a new ecommerce website; list item 10: https://developers.google.com/search/docs/specialty/ecommerce/how-to-launch-an-ecommerce-website#how-to-launch-a-new-ecommerce-website; Launch without product availability; paragraph 2: https://developers.google.com/search/docs/specialty/ecommerce/how-to-launch-an-ecommerce-website#products-unavailable.
>
> A072 | Omission | Medium priority | Checked 24 September 2026



A grand reveal: the whole site becomes available to Google and the public simultaneously. Straightforward, but it means Google has zero head start crawling and understanding your content before launch day itself.

A homepage launch: only the homepage goes live initially, potentially a placeholder page with whatever text you choose, while the rest of the site is prepared behind the scenes.

Launch without product availability: the full site goes live, but with every product deliberately marked out of stock, which lets Google begin crawling and indexing your actual product pages well ahead of the moment you're genuinely ready to fulfil real orders.

> ChatGPT fact check - this paragraph claims "Launch without product availability: the full site goes live, but with every product deliberately marked out of stock, which lets Google begin crawling and indexing your actual product pages well ahead of the moment you're genuinely ready to fulfil real orders.", but the counterargument is: Google documents four launch approaches, including a soft launch; the script gives three. For launch without availability, the source also covers excluded_destination and warns against disabling add-to-cart because of price verification. The adaptation recommends this too broadly for relaunches. Cover all four approaches and their trade-offs. Preserve the Merchant Center and cart-verification qualifications; distinguish a new-site launch from pausing an existing business.
>
> Sources: How to launch a new ecommerce website; list item 10: https://developers.google.com/search/docs/specialty/ecommerce/how-to-launch-an-ecommerce-website#how-to-launch-a-new-ecommerce-website; Launch without product availability; paragraph 2: https://developers.google.com/search/docs/specialty/ecommerce/how-to-launch-an-ecommerce-website#products-unavailable.
>
> A072 | Omission | Medium priority | Checked 24 September 2026



That last option is worth genuinely considering for any significant relaunch: it front-loads the crawling and indexing work into a window before launch day matters commercially, rather than asking Google to discover, crawl, and understand an entire fresh catalogue at the exact same moment real customers are already trying to buy from it.

> ChatGPT fact check - this paragraph claims "That last option is worth genuinely considering for any significant relaunch: it front-loads the crawling and indexing work into a window before launch day matters commercially, rather than asking Google to discover, crawl, and understand an entire fresh catalogue at the exact same moment real customers are already trying to buy from it.", but the counterargument is: Google documents four launch approaches, including a soft launch; the script gives three. For launch without availability, the source also covers excluded_destination and warns against disabling add-to-cart because of price verification. The adaptation recommends this too broadly for relaunches. Cover all four approaches and their trade-offs. Preserve the Merchant Center and cart-verification qualifications; distinguish a new-site launch from pausing an existing business.
>
> Sources: How to launch a new ecommerce website; list item 10: https://developers.google.com/search/docs/specialty/ecommerce/how-to-launch-an-ecommerce-website#how-to-launch-a-new-ecommerce-website; Launch without product availability; paragraph 2: https://developers.google.com/search/docs/specialty/ecommerce/how-to-launch-an-ecommerce-website#products-unavailable.
>
> A072 | Omission | Medium priority | Checked 24 September 2026



Writing high-quality product reviews, and this section carries real weight, dating back to a specific, significant ranking update from 2022 that reshaped how Google evaluates this exact kind of content, and it remains directly relevant today.

Who is this guidance for? Google names the range directly: expert staff or salespeople with genuine knowledge across multiple competing products, bloggers sharing a genuinely independent opinion, and editorial staff at news or publishing sites. Notice that this list includes a store's own staff writing about their own products, not only third-party reviewers.

The specific best practices, and these are worth going through individually, since together they form a genuinely useful checklist against the honest self-assessment questions from episode six.

Evaluate from a genuine user's perspective. Demonstrate real knowledge of, and expertise with, the topic being reviewed. Provide evidence of your own actual experience to support your expertise and back up your claims, images, audio, or links documenting the actual experience itself, not just assertions. Share quantitative measurements where genuinely relevant, actual performance data rather than vague, impressionistic claims.

Explain specifically what differentiates this item from its competitors. Cover comparable items worth considering too, or explain clearly what a given item is best suited for in a specific use case or circumstance, rather than reviewing it in total isolation. Discuss both pros and cons, genuinely based on your own original research rather than restated marketing copy. Describe how the product has evolved from earlier models or previous releases, addressing improvements or resolved problems in a way that genuinely helps a reader's actual purchase decision.

Focus specifically on the most important decision factors, based on your own genuine experience or expertise. Google's own worked example: a car review might identify fuel efficiency and safety as the key decision factors for that category specifically, and then evaluate performance concretely in exactly those two areas, rather than spreading attention evenly across every conceivable spec.

Describe key design choices, and their actual effect on users, going genuinely beyond whatever the manufacturer's own marketing materials already say. Include links to other genuinely useful resources, your own or other sites', to help a reader reach their own decision. Consider including links to multiple different sellers too, so a reader can actually purchase from whichever merchant they personally prefer, rather than being funnelled toward only one. And when you recommend something as the best overall, or the best for a specific purpose, always include the actual reason you consider it best, backed by direct, genuine supporting evidence, not a bare assertion.

There's specific, useful guidance for ranked lists and comparison reviews too, since Google addressed this directly following questions after the original 2022 update. Yes, this same guidance applies fully to ranked lists and comparison-style reviews, not only single-product write-ups. But given how much more concise this format tends to be by nature, Google suggests demonstrating expertise and reinforcing authenticity more efficiently within that tighter format: citing pertinent, specific results, and including original images from tests you genuinely performed with the actual product, are both called out as particularly effective, space-efficient ways to do exactly that within a shorter format.

Let's ground all of this directly in the kind of authority-building content this series has referenced a few times already: a genuinely useful flag-comparison piece, say testing nylon against polyester across a real season of outdoor weather, checks nearly every box on this list simultaneously. It evaluates from a real buyer's perspective. It demonstrates first-hand, genuinely lived expertise. It provides real evidence, in this case photographic documentation across the actual testing period. It offers a genuine, direct comparison between materials rather than reviewing either one in isolation. It discusses honest pros and cons from real, original testing, not restated supplier marketing language. And if it ultimately recommends one material as generally better, or better for one specific use case, like a coastal, high-wind location versus a sheltered one, it can back that specific recommendation with the direct, concrete evidence the testing itself actually produced. This is, in a real sense, the single most complete practical illustration this entire series has offered of episode six's E-E-A-T concept, episode seven's non-commodity content, and this episode's review-quality guidance, all converging on exactly the same underlying piece of content at once.

Let's recap.

Ecommerce content can surface across Search, Maps, Lens, Image Search, Shopping, and Business Profile, and value comes from more than product data alone, company information, offers, and reviews all matter at different points in a buyer's journey. Structured data and a Merchant Center feed work best together, not as alternatives. A new site launch benefits from strategic timing, and launching with products marked out of stock is a genuinely underused way to let Google index a catalogue well ahead of the moment real orders start flowing. And high-quality reviews demand genuine first-hand evidence, honest pros and cons from original research, explicit comparison against alternatives, a clear focus on the decision factors that actually matter for that category, and, whenever something is recommended as best, a direct, concrete reason why, backed by real evidence rather than assertion.

> ChatGPT fact check - this paragraph claims "Structured data and a Merchant Center feed work best together, not as alternatives.", but the counterargument is: Google documents four launch approaches, including a soft launch; the script gives three. For launch without availability, the source also covers excluded_destination and warns against disabling add-to-cart because of price verification. The adaptation recommends this too broadly for relaunches. Cover all four approaches and their trade-offs. Preserve the Merchant Center and cart-verification qualifications; distinguish a new-site launch from pausing an existing business.
>
> Sources: How to launch a new ecommerce website; list item 10: https://developers.google.com/search/docs/specialty/ecommerce/how-to-launch-an-ecommerce-website#how-to-launch-a-new-ecommerce-website; Launch without product availability; paragraph 2: https://developers.google.com/search/docs/specialty/ecommerce/how-to-launch-an-ecommerce-website#products-unavailable.
>
> A072 | Omission | Medium priority | Checked 24 September 2026



Next episode, we cover international and multilingual sites: managing multi-regional content, hreflang in full technical detail, and how Google actually crawls locale-adaptive pages. See you there.

This episode is adapted from "Best practices for ecommerce sites in Google Search" and "Write high quality reviews" on Google Search Central, licensed under Creative Commons Attribution 4.0.

> ChatGPT fact check - this paragraph claims "This episode is adapted from "Best practices for ecommerce sites in Google Search" and "Write high quality reviews" on Google Search Central, licensed under Creative Commons Attribution 4.0.", but the counterargument is: The chapter does not actually cover ecommerce URL design, navigation/site structure, pagination and incremental loading, or a full structured-data implementation guide. Earlier chapters promise fuller treatment here. Add the missing source sections or rename this as selected ecommerce guidance. Include crawlable pagination and the rule that each paginated page normally has its own canonical URL.
>
> Sources: Designing a URL structure for ecommerce websites; paragraph 1: https://developers.google.com/search/docs/specialty/ecommerce/designing-a-url-structure-for-ecommerce-sites#designing-a-url-structure-for-ecommerce-websites.
>
> A073 | Omission | High priority | Checked 24 September 2026



### Episode 28: International and Multilingual Sites

Welcome back. Today covers managing a site that serves more than one country or language: the URL structure options available, how Google actually determines a page's target audience, hreflang, and handling duplicate content across regional variants specifically.

Geotargeting your site, and why you'd bother at all.

You can deliberately target your whole website, or specific parts of it, to users in one particular country who speak a particular language. Google is direct about the trade-off involved: this can genuinely improve your rankings in that specific target country, but at the expense of your results in other locales or languages. Geotargeting is never free; it's a deliberate reallocation of relevance, not a pure addition.

> ChatGPT fact check - this paragraph claims "Google is direct about the trade-off involved: this can genuinely improve your rankings in that specific target country, but at the expense of your results in other locales or languages.", but the counterargument is: The source says targeting can improve results in one country at the expense of others. 'Never free' and the unqualified prediction that a Belgian domain actively works against the business turn a conditional statement into a guarantee and personalized advice. Country targeting can affect how a site performs across regions. Explain the trade-offs without predicting a particular business's outcome or presenting a directory choice as Google's prescribed solution.
>
> Sources: Targeting site content to a specific country (geotargeting); paragraph 1: https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites#geotargeting.
>
> A076 | Overstatement | Medium priority | Checked 24 September 2026



URL structure options for geotargeting, and Google lays these out with genuine pros and cons for each, worth going through carefully since the right choice depends heavily on your actual situation.

A country-specific domain, a genuine ccTLD like a dot-de for Germany. The advantages: unambiguous geotargeting, since the signal is baked directly into the domain itself; server location becomes irrelevant to the signal; and it's straightforward to genuinely separate one country's site from another entirely. The disadvantages: it can be genuinely expensive, and availability is sometimes restricted; it demands more infrastructure to maintain multiple full domains; some ccTLDs carry strict usage requirements you have to qualify for; and, worth noting precisely, a single ccTLD can only ever target one specific country, never a broader region or language spanning several countries.

Subdomains using a generic top-level domain, something like "de.example.com". Advantages: easy to set up, it allows different server locations for different subdomains, and site separation remains reasonably easy. The disadvantage: users can't necessarily tell from the URL alone what "de" is even signalling, is it a language or a country specifically, that ambiguity is real.

Subdirectories using a generic top-level domain, something like "example.com/de/". Advantages: easy to set up, and genuinely low maintenance, since everything shares one host. Disadvantages: the same URL-ambiguity problem as subdomains, plus everything is necessarily tied to a single server location, and separating the sites later, if you ever needed to, becomes considerably harder than with the other two options.

URL parameters, something like "site.com?loc=de". Google's assessment here is blunt and direct: not recommended. The disadvantages: genuinely difficult URL-based segmentation, and the same lack of visible geotargeting signal in the URL as the other options carry.

How Google actually determines a page's target locale, since this runs deeper than just your chosen URL structure.

Country-code top-level domains carry a strong signal, both to users and to search engines, that a site is explicitly intended for one specific country. Worth knowing precisely: some ccTLDs that read as country-specific are actually treated by Google as generic instead, ".tv" and ".me" being the named examples, since Google has found that users and site owners themselves frequently treat these as more generic branding choices than genuine country-targeted domains.

Hreflang statements, whether placed in page tags, HTTP headers, or a sitemap, are a direct signal too.

Server location, inferred through the server's IP address, can factor in, since it's often physically near your actual audience. But Google is explicit this isn't a definitive signal on its own, since many sites use distributed content delivery networks, or are hosted somewhere chosen purely for infrastructure quality rather than audience proximity.

Other signals Google considers: local addresses and phone numbers appearing directly on your pages, use of local language and local currency, incoming links from other genuinely local sites, and signals drawn from your Business Profile where one exists, tying directly back to episode twenty-six.

What Google explicitly does not do, worth knowing precisely so you don't waste effort on something that has no actual effect: Google ignores location-related meta tags, things like geo.position or distribution, and it ignores HTML attributes specifically aimed at geographic targeting too. If you want Google to genuinely understand your site's regional or language variants, you need to use one of the methods actually covered in this episode, hreflang entries, ccTLDs, or explicit links, not these ignored, purely decorative tags.

Making the page's language obvious, and this is a genuinely important, specific technical point. Google determines a page's language from its actual visible content, not from any code-level signal like the lang attribute, and not from the URL either. The practical implication: use a single, consistent language for both content and navigation on each individual page, and avoid side-by-side translations sitting together on one page. And a specific trap worth naming directly: translating only the boilerplate text of a page, your navigation and footer, say, while the bulk of the actual content stays in one single language, commonly seen on pages built around user-generated content, can create a genuinely poor experience, since the same underlying content might then surface multiple times in results with different boilerplate languages wrapped around identical substance.

On automated translation specifically: use robots.txt to block search engines from crawling automatically, machine-translated pages on your site. Google's own reasoning here is direct: automated translations don't always genuinely make sense, and can be viewed as spam, tying straight back to the scraping and scaled-content concerns from episode two.

> ChatGPT fact check - this paragraph claims "On automated translation specifically: use robots.txt to block search engines from crawling automatically, machine-translated pages on your site.", but the counterargument is: The chapter tells listeners to block automatically translated pages and attributes that advice to Google. Google's June 11, 2025 changelog expressly removed this old recommendation. Evaluate translated content for usefulness and policy compliance. Do not block it merely because machine translation was used; automation that produces low-value content at scale to manipulate ranking is the relevant concern.
>
> Sources: Spring cleaning in our multilingual documentation; paragraph 1: https://developers.google.com/search/updates#spring-cleaning-in-our-multilingual-documentation.
>
> A074 | Outdated | High priority | Checked 24 September 2026



Hreflang, the actual mechanism for telling Google which page variant applies to which language or region.

> ChatGPT fact check - this paragraph claims "Hreflang, the actual mechanism for telling Google which page variant applies to which language or region.", but the counterargument is: The chapter never explains reciprocal/self links, fully qualified alternate URLs, valid language/region codes, or x-default. It calls hreflang essential without preserving Google's statement that Google may discover alternate versions without it. Add a practical spoken walkthrough of the three equivalent implementation methods, reciprocal/self references, supported codes, and x-default. Describe explicit annotations as recommended rather than a universal prerequisite.
>
> Sources: Tell Google about localized versions of your page; paragraph 2: https://developers.google.com/search/docs/specialty/international/localized-versions#tell-google-about-localized-versions-of-your-page; Guidelines for all methods; list item 1: https://developers.google.com/search/docs/specialty/international/localized-versions#all-method-guidelines; Guidelines for all methods; list item 2: https://developers.google.com/search/docs/specialty/international/localized-versions#all-method-guidelines.
>
> A075 | Omission | High priority | Checked 24 September 2026



If you're using different URLs for different languages, hreflang annotations let Google's results link directly to the appropriate language version of a page for each specific searcher. And there's a genuinely important limitation worth knowing precisely here, since it explains why hreflang matters so much rather than Google simply figuring this out on its own: if you're instead relying purely on dynamically changing content, or redirecting users, based on their own detected language preference, Google may not discover and crawl every one of those content variations, since Googlebot's crawlers typically operate from the US, and critically, the HTTP requests Googlebot sends don't set an Accept-Language header at all, meaning purely dynamic, preference-based content switching is largely invisible to it as a discovery mechanism.

> ChatGPT fact check - this paragraph claims "And there's a genuinely important limitation worth knowing precisely here, since it explains why hreflang matters so much rather than Google simply figuring this out on its own: if you're instead relying purely on dynamically changing content, or redirecting users, based on their own detected language preference, Google may not discover and crawl every one of those content variations, since Googlebot's crawlers typically operate from the US, and critically, the HTTP requests Googlebot sends don't set an Accept-Language header at all, meaning purely dynamic, preference-based content switching is largely invisible to it as a discovery mechanism.", but the counterargument is: The chapter never explains reciprocal/self links, fully qualified alternate URLs, valid language/region codes, or x-default. It calls hreflang essential without preserving Google's statement that Google may discover alternate versions without it. Add a practical spoken walkthrough of the three equivalent implementation methods, reciprocal/self references, supported codes, and x-default. Describe explicit annotations as recommended rather than a universal prerequisite.
>
> Sources: Tell Google about localized versions of your page; paragraph 2: https://developers.google.com/search/docs/specialty/international/localized-versions#tell-google-about-localized-versions-of-your-page; Guidelines for all methods; list item 1: https://developers.google.com/search/docs/specialty/international/localized-versions#all-method-guidelines; Guidelines for all methods; list item 2: https://developers.google.com/search/docs/specialty/international/localized-versions#all-method-guidelines.
>
> A075 | Omission | High priority | Checked 24 September 2026



Handling duplicate content across multilingual and multi-regional variants specifically, tying directly back to episode twelve's canonicalization material. If you're providing similar or genuinely duplicate content at different URLs in the same language, within a broader multi-regional site, Google's own worked example: both "example.de/" and "example.com/de/" showing similar German-language content, choose one preferred version, and use both the rel canonical element and hreflang tags together to make sure the correct regional or language URL is the one that actually surfaces for a given searcher.

> ChatGPT fact check - this paragraph claims "If you're providing similar or genuinely duplicate content at different URLs in the same language, within a broader multi-regional site, Google's own worked example: both "example.de/" and "example.com/de/" showing similar German-language content, choose one preferred version, and use both the rel canonical element and hreflang tags together to make sure the correct regional or language URL is the one that actually surfaces for a given searcher.", but the counterargument is: The chapter never explains reciprocal/self links, fully qualified alternate URLs, valid language/region codes, or x-default. It calls hreflang essential without preserving Google's statement that Google may discover alternate versions without it. Add a practical spoken walkthrough of the three equivalent implementation methods, reciprocal/self references, supported codes, and x-default. Describe explicit annotations as recommended rather than a universal prerequisite.
>
> Sources: Tell Google about localized versions of your page; paragraph 2: https://developers.google.com/search/docs/specialty/international/localized-versions#tell-google-about-localized-versions-of-your-page; Guidelines for all methods; list item 1: https://developers.google.com/search/docs/specialty/international/localized-versions#all-method-guidelines; Guidelines for all methods; list item 2: https://developers.google.com/search/docs/specialty/international/localized-versions#all-method-guidelines.
>
> A075 | Omission | High priority | Checked 24 September 2026



A practical, honest caveat worth carrying with you, since geotargeting is never a perfectly precise science: it's worth genuinely considering the user who lands on the "wrong" version of your site regardless of everything covered here, someone reaching your German-language page despite actually wanting the English one, say. One straightforward mitigation Google itself suggests: show a visible link on every page letting a visitor directly select their own preferred region or language, rather than assuming your targeting signals will always land every single visitor correctly.

Let's ground this directly in a concrete, relevant scenario: a Belgian business selling primarily to a US audience, in English, with occasional Dutch or French content for the home market. Given everything covered today, subdirectories under one main domain, something like a dedicated English path for the primary US-facing catalogue, are likely the most practical structure: low maintenance, one shared host, with hreflang tags then doing the real, precise work of telling Google exactly which language version to actually surface for which searcher. A Belgian ccTLD would signal Belgium specifically as the primary audience, which actively works against a business whose real, primary market is the US; the domain-level signal and the actual commercial reality would be pulling in opposite directions.

> ChatGPT fact check - this paragraph claims "A Belgian ccTLD would signal Belgium specifically as the primary audience, which actively works against a business whose real, primary market is the US; the domain-level signal and the actual commercial reality would be pulling in opposite directions.", but the counterargument is: The source says targeting can improve results in one country at the expense of others. 'Never free' and the unqualified prediction that a Belgian domain actively works against the business turn a conditional statement into a guarantee and personalized advice. Country targeting can affect how a site performs across regions. Explain the trade-offs without predicting a particular business's outcome or presenting a directory choice as Google's prescribed solution.
>
> Sources: Targeting site content to a specific country (geotargeting); paragraph 1: https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites#geotargeting.
>
> A076 | Overstatement | Medium priority | Checked 24 September 2026



Let's recap.

Geotargeting genuinely trades ranking strength in your target region against ranking strength elsewhere; it's a deliberate choice, not a free addition. Country-specific domains give the strongest, most unambiguous regional signal but cost the most and can only target one single country; subdomains and subdirectories are cheaper and easier but carry real URL ambiguity; URL parameters are actively not recommended. Google reads a page's actual visible content to determine language, never the lang attribute or the URL itself, so keep each page in one consistent language and block automatically translated pages from crawling. Hreflang is essential precisely because purely dynamic, preference-based content switching is largely invisible to Googlebot, which neither sends an Accept-Language header nor reliably crawls from every relevant region. And duplicate regional content in the same language needs rel canonical and hreflang working together, with a visible region or language switcher as a practical safety net for whoever inevitably still lands on the wrong version.

> ChatGPT fact check - this paragraph claims "Google reads a page's actual visible content to determine language, never the lang attribute or the URL itself, so keep each page in one consistent language and block automatically translated pages from crawling.", but the counterargument is: The chapter tells listeners to block automatically translated pages and attributes that advice to Google. Google's June 11, 2025 changelog expressly removed this old recommendation. Evaluate translated content for usefulness and policy compliance. Do not block it merely because machine translation was used; automation that produces low-value content at scale to manipulate ranking is the relevant concern.
>
> Sources: Spring cleaning in our multilingual documentation; paragraph 1: https://developers.google.com/search/updates#spring-cleaning-in-our-multilingual-documentation.
>
> A074 | Outdated | High priority | Checked 24 September 2026



> ChatGPT fact check - this paragraph claims "Hreflang is essential precisely because purely dynamic, preference-based content switching is largely invisible to Googlebot, which neither sends an Accept-Language header nor reliably crawls from every relevant region.", but the counterargument is: The chapter never explains reciprocal/self links, fully qualified alternate URLs, valid language/region codes, or x-default. It calls hreflang essential without preserving Google's statement that Google may discover alternate versions without it. Add a practical spoken walkthrough of the three equivalent implementation methods, reciprocal/self references, supported codes, and x-default. Describe explicit annotations as recommended rather than a universal prerequisite.
>
> Sources: Tell Google about localized versions of your page; paragraph 2: https://developers.google.com/search/docs/specialty/international/localized-versions#tell-google-about-localized-versions-of-your-page; Guidelines for all methods; list item 1: https://developers.google.com/search/docs/specialty/international/localized-versions#all-method-guidelines; Guidelines for all methods; list item 2: https://developers.google.com/search/docs/specialty/international/localized-versions#all-method-guidelines.
>
> A075 | Omission | High priority | Checked 24 September 2026



> ChatGPT fact check - this paragraph claims "Country-specific domains give the strongest, most unambiguous regional signal but cost the most and can only target one single country; subdomains and subdirectories are cheaper and easier but carry real URL ambiguity; URL parameters are actively not recommended.", but the counterargument is: The source says targeting can improve results in one country at the expense of others. 'Never free' and the unqualified prediction that a Belgian domain actively works against the business turn a conditional statement into a guarantee and personalized advice. Country targeting can affect how a site performs across regions. Explain the trade-offs without predicting a particular business's outcome or presenting a directory choice as Google's prescribed solution.
>
> Sources: Targeting site content to a specific country (geotargeting); paragraph 1: https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites#geotargeting.
>
> A076 | Overstatement | Medium priority | Checked 24 September 2026



Next episode, we move into Part Five: monitoring and debugging. Getting started with Search Console, debugging traffic drops, using Search Console alongside Google Analytics, and the full range of search operators for diagnosing your own site directly. See you there.

This episode is adapted from "Managing multi-regional and multilingual sites" on Google Search Central, licensed under Creative Commons Attribution 4.0.

## Part Five: Monitoring and Debugging

### Episode 29: Search Console, Debugging Traffic Drops, and Search Operators

Welcome back. This episode covers monitoring and debugging properly: what Search Console actually is and how to get started with it, the systematic method for diagnosing a genuine traffic drop, and the search operators you can use directly to investigate your own site.

Getting started with Search Console.

Google's own framing: it's a tool that helps anyone with a website understand how they're performing on Google Search, and what they can do to improve their appearance in results and bring in more relevant traffic. This tool has been referenced constantly throughout this entire series, so today is about the actual starting checklist.

The core actions: verify site ownership, confirm Google can genuinely access your pages through the Index Coverage report, and, optionally, submit a sitemap, tying back to episode ten. The Search Performance report is where you monitor traffic trends over time, and it's the primary tool for debugging a drop, which we're about to cover in full depth.

> ChatGPT fact check - this paragraph claims "The core actions: verify site ownership, confirm Google can genuinely access your pages through the Index Coverage report, and, optionally, submit a sitemap, tying back to episode ten.", but the counterargument is: The script uses Index Coverage rather than Page Indexing, while other chapters use the current name. Some source overview language may itself lag; an actionable audio guide should name the current report consistently. Use 'Page Indexing report', optionally noting its older Index Coverage name once.
>
> Sources: What does this report show?; paragraph 1: https://support.google.com/webmasters/answer/7440203.
>
> A077 | Outdated | Low priority | Checked 24 September 2026



Google frames Search Console's reports as splitting roughly into two audiences, worth knowing so you check the right place for the right question. For SEO specialists, digital marketers, and site administrators: reports for managing manual actions, removal requests, site migrations, and rich result status. For developers specifically: reports for understanding indexing behaviour, debugging individual page issues, checking for security threats, and monitoring real user page experience data, tying directly back to the Core Web Vitals reporting from episode twenty.

Now, debugging a genuine drop in Search traffic, and this is Google's own dedicated, systematic guide, worth having as an actual mental checklist rather than a vague sense of where to look.

Google names five main causes, and it's genuinely useful to know the shape each one tends to produce on a traffic graph, since the shape itself is often the first real diagnostic clue.

> ChatGPT fact check - this paragraph claims "Google names five main causes, and it's genuinely useful to know the shape each one tends to produce on a traffic graph, since the shape itself is often the first real diagnostic clue.", but the counterargument is: Google's current guide also explicitly covers migrations. A graph shape or common page template is a clue, not proof of technical rather than ranking causes. 'Rule in or out entirely' overstates what a clean report establishes. Present common causes rather than an exhaustive five-cause model. Add migrations, compare clicks with impressions, use the recommended longer date window, and test hypotheses instead of declaring a cause from shape alone.
>
> Sources: Site moves and migrations; paragraph 1: https://developers.google.com/search/docs/monitor-debug/debugging-search-traffic-drops#site-moves-and-migrations; Site moves and migrations; paragraph 2: https://developers.google.com/search/docs/monitor-debug/debugging-search-traffic-drops#site-moves-and-migrations.
>
> A078 | Overstatement | Medium priority | Checked 24 September 2026



Technical issues. Errors that can prevent Google from crawling, indexing, or serving your pages at all: server unavailability, robots.txt fetching failures, pages returning not-found errors, and similar problems. These can affect your entire site at once, if the whole site goes down, say, or an individual page specifically, a stray noindex tag applied where it shouldn't have been, tying straight back to episode sixteen. A site-wide technical failure tends to produce a large, sudden drop; a single mistaken noindex tag tends to produce a slower, more contained one. Check the Crawl Stats report and the Page Indexing report specifically for a spike in errors that lines up with when the drop actually started.

Security issues. If your site gets compromised by malware or phishing, Google may show visitors warnings or interstitial pages before they ever reach your site at all, which can meaningfully decrease your actual Search traffic even if your rankings themselves haven't technically moved. Check the Security Issues report directly to see if Google has detected a genuine threat on your site.

Manual actions, meaning genuine spam policy violations from episode two. Google detects policy-violating practices through both automated systems and, where needed, human review, which can result in a manual action against a site. If you suspect this is the cause, review the spam policies directly to make sure you're not inadvertently engaging in something your own automated systems, plugins, or a past contractor might have set up, and check the Manual Actions report in Search Console directly to see if anything has actually been issued against your site.

Algorithmic updates, the core and spam updates from episode nineteen. Worth restating the key point from that episode directly: if you suspect this is the cause, there may not be anything fundamentally wrong with your content at all; the honest self-assessment from episode six, applied to your specific affected pages, is the right next step, not a panicked technical audit.

Seasonality and changing interests. Sometimes a genuine shift in demand for certain queries is simply real, driven by a new trend, a seasonal rhythm, or even a new competing product genuinely cannibalising your own previously-reliable search queries. This is where Google Trends becomes directly useful as a diagnostic tool: it lets you check whether a drop reflects something happening industry-wide or nationally, rather than something specific and unique to your own site. Two specific sub-causes worth distinguishing: a genuine disruption in what people are searching for altogether, and straightforward calendar seasonality, Google's own example being food-related queries, where diet searches spike every January, turkey searches spike every November, and champagne searches spike every December, entirely predictably, year after year.

And there's a worth-knowing sixth possibility, not a genuine drop at all: a reporting glitch, where the data itself is simply wrong due to a processing change or a logging error on Google's side. Worth checking the Search Console Data Anomalies page directly for exactly this before assuming any of the five genuine causes above actually applies to your situation.

> ChatGPT fact check - this paragraph claims "Worth checking the Search Console Data Anomalies page directly for exactly this before assuming any of the five genuine causes above actually applies to your situation.", but the counterargument is: Google's current guide also explicitly covers migrations. A graph shape or common page template is a clue, not proof of technical rather than ranking causes. 'Rule in or out entirely' overstates what a clean report establishes. Present common causes rather than an exhaustive five-cause model. Add migrations, compare clicks with impressions, use the recommended longer date window, and test hypotheses instead of declaring a cause from shape alone.
>
> Sources: Site moves and migrations; paragraph 1: https://developers.google.com/search/docs/monitor-debug/debugging-search-traffic-drops#site-moves-and-migrations; Site moves and migrations; paragraph 2: https://developers.google.com/search/docs/monitor-debug/debugging-search-traffic-drops#site-moves-and-migrations.
>
> A078 | Overstatement | Medium priority | Checked 24 September 2026



A further useful diagnostic technique, once you're past identifying the broad cause: look for patterns by segmenting your traffic by specific query, country, and device. If traffic from one particular country specifically has dropped, check your hreflang implementation from episode twenty-eight directly for an error there. If traffic to one specific page has dropped while the rest of the site looks fine, the URL Inspection tool is the right next step, and two of the most common things it reveals in exactly this situation are worth naming directly: the page isn't canonical, meaning Google has selected a different page as the canonical version instead, tying back to episode twelve, or the page simply can't be crawled at all for some technical reason.

Now, search operators, a genuinely useful, hands-on diagnostic technique you can run directly in an ordinary Google search box, no Search Console login required.

> ChatGPT fact check - this paragraph claims "Now, search operators, a genuinely useful, hands-on diagnostic technique you can run directly in an ordinary Google search box, no Search Console login required.", but the counterargument is: The previous episode promised Search Console with Google Analytics and a full operator treatment. This chapter explains site and filetype only, with a vague pointer to other operators, and never explains the Analytics comparison. Add the Analytics/Search Console comparison, including why metrics differ, and the documented operator limitations and supported image-search operators. Keep exact syntax in the accessible companion.
>
> Sources: Comparing data in Google Analytics and Search Console; paragraph 1: https://developers.google.com/search/docs/monitor-debug/google-analytics-search-console#comparing-data; Understanding data discrepancies between Google Analytics and Search Console; paragraph 1: https://developers.google.com/search/docs/monitor-debug/google-analytics-search-console#discrepancies.
>
> A079 | Omission | Medium priority | Checked 24 September 2026



The site colon operator, which we actually first met all the way back in episode four: typing "site:" followed directly by your domain shows you a rough sense of what Google currently has indexed from your site. It's not a perfectly precise or complete count, but it's a fast, genuinely useful first check, whether after a migration, a redesign, or simply to spot-check that a specific new section is actually showing up in the index at all.

The filetype colon operator, which we met back in episode nine, lets you restrict results to one specific file format, useful for checking exactly which of your own PDFs, spec sheets, or spreadsheets Google has actually indexed and surfaced.

Beyond these two we've already covered, Google documents a fuller family of operators for more targeted diagnostic searches, letting you combine terms, exclude specific words, or search within a specific site more precisely than the bare site colon operator alone allows. These are worth knowing exist as a lightweight, genuinely fast first-pass diagnostic tool, precisely the kind of thing worth reaching for before opening Search Console at all, when you just want a quick, immediate answer to a simple, specific question.

> ChatGPT fact check - this paragraph claims "Beyond these two we've already covered, Google documents a fuller family of operators for more targeted diagnostic searches, letting you combine terms, exclude specific words, or search within a specific site more precisely than the bare site colon operator alone allows.", but the counterargument is: The previous episode promised Search Console with Google Analytics and a full operator treatment. This chapter explains site and filetype only, with a vague pointer to other operators, and never explains the Analytics comparison. Add the Analytics/Search Console comparison, including why metrics differ, and the documented operator limitations and supported image-search operators. Keep exact syntax in the accessible companion.
>
> Sources: Comparing data in Google Analytics and Search Console; paragraph 1: https://developers.google.com/search/docs/monitor-debug/google-analytics-search-console#comparing-data; Understanding data discrepancies between Google Analytics and Search Console; paragraph 1: https://developers.google.com/search/docs/monitor-debug/google-analytics-search-console#discrepancies.
>
> A079 | Omission | Medium priority | Checked 24 September 2026



Let's bring the whole episode together with a concrete, worked scenario: a store notices a meaningful drop in organic traffic to its product pages specifically, starting roughly two weeks ago. The systematic path, following Google's own guidance directly: first, rule out a reporting glitch by checking the Data Anomalies page. Then check Security Issues and Manual Actions in Search Console, both quick to rule in or out entirely. Then check whether the timing lines up with any announced core or spam update from episode nineteen. Then segment the actual Performance report by query and country, watching specifically for whether the drop is broad and even, or concentrated in one particular product category, one particular country, or one specific page template, since a template-level pattern points strongly toward a technical issue affecting every page built from that same template at once, rather than a genuine content-quality or ranking problem. And throughout, Google Trends tells you directly whether searches for that product category are simply down industry-wide right now, a straightforward seasonal or demand shift, rather than anything specific to the site itself at all.

> ChatGPT fact check - this paragraph claims "Then segment the actual Performance report by query and country, watching specifically for whether the drop is broad and even, or concentrated in one particular product category, one particular country, or one specific page template, since a template-level pattern points strongly toward a technical issue affecting every page built from that same template at once, rather than a genuine content-quality or ranking problem.", but the counterargument is: Google's current guide also explicitly covers migrations. A graph shape or common page template is a clue, not proof of technical rather than ranking causes. 'Rule in or out entirely' overstates what a clean report establishes. Present common causes rather than an exhaustive five-cause model. Add migrations, compare clicks with impressions, use the recommended longer date window, and test hypotheses instead of declaring a cause from shape alone.
>
> Sources: Site moves and migrations; paragraph 1: https://developers.google.com/search/docs/monitor-debug/debugging-search-traffic-drops#site-moves-and-migrations; Site moves and migrations; paragraph 2: https://developers.google.com/search/docs/monitor-debug/debugging-search-traffic-drops#site-moves-and-migrations.
>
> A078 | Overstatement | Medium priority | Checked 24 September 2026



Let's recap.

Search Console starts with verifying ownership, checking the Index Coverage report, and optionally submitting a sitemap, then splits broadly into developer-focused reports and SEO or marketing-focused reports. A genuine traffic drop has five real causes: technical issues, security issues, manual actions, algorithmic updates, and seasonality or changing interests, plus the possibility of a pure reporting glitch worth ruling out first. Each cause tends to produce a recognisably different shape on the actual traffic graph, sudden and site-wide for a major technical or security failure, slower and page-specific for a narrower technical issue, and cyclical for genuine seasonality. And search operators, site colon and filetype colon among them, are a fast, genuinely useful first-pass diagnostic tool worth reaching for before ever opening a dedicated report.

> ChatGPT fact check - this paragraph claims "Search Console starts with verifying ownership, checking the Index Coverage report, and optionally submitting a sitemap, then splits broadly into developer-focused reports and SEO or marketing-focused reports.", but the counterargument is: The script uses Index Coverage rather than Page Indexing, while other chapters use the current name. Some source overview language may itself lag; an actionable audio guide should name the current report consistently. Use 'Page Indexing report', optionally noting its older Index Coverage name once.
>
> Sources: What does this report show?; paragraph 1: https://support.google.com/webmasters/answer/7440203.
>
> A077 | Outdated | Low priority | Checked 24 September 2026



> ChatGPT fact check - this paragraph claims "Each cause tends to produce a recognisably different shape on the actual traffic graph, sudden and site-wide for a major technical or security failure, slower and page-specific for a narrower technical issue, and cyclical for genuine seasonality.", but the counterargument is: Google's current guide also explicitly covers migrations. A graph shape or common page template is a clue, not proof of technical rather than ranking causes. 'Rule in or out entirely' overstates what a clean report establishes. Present common causes rather than an exhaustive five-cause model. Add migrations, compare clicks with impressions, use the recommended longer date window, and test hypotheses instead of declaring a cause from shape alone.
>
> Sources: Site moves and migrations; paragraph 1: https://developers.google.com/search/docs/monitor-debug/debugging-search-traffic-drops#site-moves-and-migrations; Site moves and migrations; paragraph 2: https://developers.google.com/search/docs/monitor-debug/debugging-search-traffic-drops#site-moves-and-migrations.
>
> A078 | Overstatement | Medium priority | Checked 24 September 2026



Next episode, the final one in this series, we cover Google Trends properly, a brief word on preventing and monitoring abuse on your own site, and close the whole series out with a proper wrap-up. See you there.

This episode is adapted from "Get started with Search Console" and "Debugging drops in Google Search traffic" on Google Search Central, licensed under Creative Commons Attribution 4.0.

> ChatGPT fact check - this paragraph claims "This episode is adapted from "Get started with Search Console" and "Debugging drops in Google Search traffic" on Google Search Central, licensed under Creative Commons Attribution 4.0.", but the counterargument is: The previous episode promised Search Console with Google Analytics and a full operator treatment. This chapter explains site and filetype only, with a vague pointer to other operators, and never explains the Analytics comparison. Add the Analytics/Search Console comparison, including why metrics differ, and the documented operator limitations and supported image-search operators. Keep exact syntax in the accessible companion.
>
> Sources: Comparing data in Google Analytics and Search Console; paragraph 1: https://developers.google.com/search/docs/monitor-debug/google-analytics-search-console#comparing-data; Understanding data discrepancies between Google Analytics and Search Console; paragraph 1: https://developers.google.com/search/docs/monitor-debug/google-analytics-search-console#discrepancies.
>
> A079 | Omission | Medium priority | Checked 24 September 2026



### Episode 30: Google Trends, Preventing Abuse, and Series Wrap-Up

Welcome to the final episode of this series. We've walked the entire span of Google's Search Central documentation, from the technical requirements in episode one through to debugging a traffic drop last episode. Today: Google Trends as a practical tool, a brief but important word on preventing abuse on your own site, and then we close the whole thing out properly.

> ChatGPT fact check - this paragraph claims "Welcome to the final episode of this series.", but the counterargument is: The conclusion says the entire documented landscape, every visual element, the full structured-data landscape, and complete ecommerce guide have been covered. The body of the series does not support those assertions. Replace these completeness claims with an accurate scope statement and a link to the remaining-source coverage checklist. Call this the main-series conclusion if Episode 31 remains supplementary.
>
> Sources: Internal source: seo-study/index.html, episode listings and introductory paragraphs; compare the chapter headings and text. This is an editorial or coverage correction, not an additional Google policy.; Scope reference: https://developers.google.com/search/docs.
>
> A082 | Omission | High priority | Checked 24 September 2026



Google Trends.

We already met this tool briefly last episode, as a way to check whether a traffic change reflects a genuine, wider shift in search interest rather than something specific to your own site. Worth restating its practical value directly, since it's a genuinely useful, freely available tool many site owners underuse. It lets you compare search interest in specific terms over time, across regions, and against related queries, entirely independent of your own site's own analytics.

> ChatGPT fact check - this paragraph claims "We already met this tool briefly last episode, as a way to check whether a traffic change reflects a genuine, wider shift in search interest rather than something specific to your own site.", but the counterargument is: The chapter omits Trends' sampled/aggregated nature and the distinction between Explore and Trending now, and reduces the concrete Safe Browsing repeat-offender restriction to vague escalation. Explain the tool's data and limits, including relative interest versus raw counts where applicable. State the actual repeat-offender condition and 30-day inability to request another review.
>
> Sources: About Google Trends; paragraph 1: https://developers.google.com/search/docs/monitor-debug/trends-start#about-google-trends; About Google Trends; list item 1: https://developers.google.com/search/docs/monitor-debug/trends-start#about-google-trends; About Google Trends; list item 2: https://developers.google.com/search/docs/monitor-debug/trends-start#about-google-trends; Google Safe Browsing Repeat Offenders Policy; paragraph 3: https://developers.google.com/search/docs/monitor-debug/security/safe-browsing-repeat-offenders#google-safe-browsing-repeat-offenders-policy.
>
> A081 | Omission | Medium priority | Checked 24 September 2026



Two concrete, practical ways to use it beyond simple drop diagnosis. Check the top queries in your own geographic area and compare them against the queries you're actually receiving traffic from, visible directly in the Search Console Performance report. If a query is clearly trending in your own region but genuinely missing from your own traffic, that's a real signal: check whether you have genuinely relevant content on that specific topic at all, and if you do, confirm it's actually been crawled and indexed properly. And check queries related to your important topics generally, which can help you spot a related query with real, rising momentum early, letting you prepare relevant content for it ahead of the curve, rather than reactively catching up once the trend has already peaked.

> ChatGPT fact check - this paragraph claims "Two concrete, practical ways to use it beyond simple drop diagnosis.", but the counterargument is: The chapter omits Trends' sampled/aggregated nature and the distinction between Explore and Trending now, and reduces the concrete Safe Browsing repeat-offender restriction to vague escalation. Explain the tool's data and limits, including relative interest versus raw counts where applicable. State the actual repeat-offender condition and 30-day inability to request another review.
>
> Sources: About Google Trends; paragraph 1: https://developers.google.com/search/docs/monitor-debug/trends-start#about-google-trends; About Google Trends; list item 1: https://developers.google.com/search/docs/monitor-debug/trends-start#about-google-trends; About Google Trends; list item 2: https://developers.google.com/search/docs/monitor-debug/trends-start#about-google-trends; Google Safe Browsing Repeat Offenders Policy; paragraph 3: https://developers.google.com/search/docs/monitor-debug/security/safe-browsing-repeat-offenders#google-safe-browsing-repeat-offenders-policy.
>
> A081 | Omission | Medium priority | Checked 24 September 2026



A brief historical footnote worth knowing, purely so the tool's own reputation makes sense in context: Google Trends has, at points in its history, been targeted by bad actors specifically because trending terms attract a large, sudden volume of searchers, making them a tempting target for malicious, deceptive sites designed to exploit exactly that spike. This isn't a reason to avoid the tool; it's simply worth knowing as context for why Google's own spam and security systems, covered next, matter as much as they do.

> ChatGPT fact check - this paragraph claims "A brief historical footnote worth knowing, purely so the tool's own reputation makes sense in context: Google Trends has, at points in its history, been targeted by bad actors specifically because trending terms attract a large, sudden volume of searchers, making them a tempting target for malicious, deceptive sites designed to exploit exactly that spike.", but the counterargument is: The history of malicious exploitation of Trends, the claim about one of the most common compromise routes, and the Shopify-specific vulnerability analysis are not established by the chapter's cited documents. Remove the historical and prevalence claims unless separately sourced. Keep Google's actual prevention steps and clearly separate any platform-specific advice from the adaptation.
>
> Sources: Get started with Google Trends; paragraph 1: https://developers.google.com/search/docs/monitor-debug/trends-start#get-started-with-google-trends; About Google Trends; paragraph 1: https://developers.google.com/search/docs/monitor-debug/trends-start#about-google-trends.
>
> A080 | Unsupported | Medium priority | Checked 24 September 2026



Preventing and monitoring abuse on your own site.

This is a shorter, more security-focused stretch of documentation, but genuinely important, since a compromised or abused site directly threatens everything the rest of this series has been about, and it connects straight back to the security-issues cause of a traffic drop from last episode.

Preventing user-generated spam. Spammers frequently exploit open comment forms and other places where a site accepts user-generated content, injecting spammy content onto an entirely unsuspecting site. This ties directly back to the user-generated spam policy from episode two: if a store's site has a comment section, a review submission form, or any other open input, it's worth actively monitoring and moderating, since spam appearing there can genuinely affect how Google views the site as a whole, not merely the specific page it appears on.

Malware and unwanted software. Google draws a specific, useful distinction between the two. Malware is software specifically designed to harm a device or its user. Unwanted software is a broader category: software that's deceptive, unexpected, or that negatively affects someone's browsing experience, even without being maliciously destructive in the way malware is, things like software that silently changes a browser's home page without genuine, clear consent.

Preventing a malware infection in the first place. Google's own guidance here centres on the practical basics: keeping software genuinely up to date, using strong, unique passwords rather than reused or weak ones, and being cautious specifically about third-party code, plugins, and themes, since a compromised or poorly maintained third-party plugin is one of the single most common ways an otherwise well-run site ends up compromised.

> ChatGPT fact check - this paragraph claims "Google's own guidance here centres on the practical basics: keeping software genuinely up to date, using strong, unique passwords rather than reused or weak ones, and being cautious specifically about third-party code, plugins, and themes, since a compromised or poorly maintained third-party plugin is one of the single most common ways an otherwise well-run site ends up compromised.", but the counterargument is: The history of malicious exploitation of Trends, the claim about one of the most common compromise routes, and the Shopify-specific vulnerability analysis are not established by the chapter's cited documents. Remove the historical and prevalence claims unless separately sourced. Keep Google's actual prevention steps and clearly separate any platform-specific advice from the adaptation.
>
> Sources: Get started with Google Trends; paragraph 1: https://developers.google.com/search/docs/monitor-debug/trends-start#get-started-with-google-trends; About Google Trends; paragraph 1: https://developers.google.com/search/docs/monitor-debug/trends-start#about-google-trends.
>
> A080 | Unsupported | Medium priority | Checked 24 September 2026



Social engineering, covering phishing and deceptive sites specifically. This is about a site being used to trick visitors into revealing sensitive information or taking a genuinely harmful action, rather than a purely technical malware infection.

Google Safe Browsing, and its specific repeat-offenders policy. Safe Browsing is the system that shows warnings directly to users before they reach a genuinely dangerous site, or before they download a genuinely dangerous file. Worth knowing precisely: Google has a specific, escalating policy for sites that are repeatedly flagged, treating repeat violations more severely than a single, isolated incident, which is a real, concrete reason to treat any security warning as something to fix properly and permanently the first time, not merely patch quickly and hope it doesn't recur.

> ChatGPT fact check - this paragraph claims "Google Safe Browsing, and its specific repeat-offenders policy.", but the counterargument is: The chapter omits Trends' sampled/aggregated nature and the distinction between Explore and Trending now, and reduces the concrete Safe Browsing repeat-offender restriction to vague escalation. Explain the tool's data and limits, including relative interest versus raw counts where applicable. State the actual repeat-offender condition and 30-day inability to request another review.
>
> Sources: About Google Trends; paragraph 1: https://developers.google.com/search/docs/monitor-debug/trends-start#about-google-trends; About Google Trends; list item 1: https://developers.google.com/search/docs/monitor-debug/trends-start#about-google-trends; About Google Trends; list item 2: https://developers.google.com/search/docs/monitor-debug/trends-start#about-google-trends; Google Safe Browsing Repeat Offenders Policy; paragraph 3: https://developers.google.com/search/docs/monitor-debug/security/safe-browsing-repeat-offenders#google-safe-browsing-repeat-offenders-policy.
>
> A081 | Omission | Medium priority | Checked 24 September 2026



For a Shopify storefront specifically, the most directly relevant piece of all of this is the app and plugin ecosystem: every third-party app added to a store is a genuine, real point of potential vulnerability, and it's worth periodically reviewing which apps are actually still in active use, removing anything genuinely abandoned or no longer needed, rather than letting unused, unmaintained integrations quietly accumulate indefinitely.

> ChatGPT fact check - this paragraph claims "For a Shopify storefront specifically, the most directly relevant piece of all of this is the app and plugin ecosystem: every third-party app added to a store is a genuine, real point of potential vulnerability, and it's worth periodically reviewing which apps are actually still in active use, removing anything genuinely abandoned or no longer needed, rather than letting unused, unmaintained integrations quietly accumulate indefinitely.", but the counterargument is: The history of malicious exploitation of Trends, the claim about one of the most common compromise routes, and the Shopify-specific vulnerability analysis are not established by the chapter's cited documents. Remove the historical and prevalence claims unless separately sourced. Keep Google's actual prevention steps and clearly separate any platform-specific advice from the adaptation.
>
> Sources: Get started with Google Trends; paragraph 1: https://developers.google.com/search/docs/monitor-debug/trends-start#get-started-with-google-trends; About Google Trends; paragraph 1: https://developers.google.com/search/docs/monitor-debug/trends-start#about-google-trends.
>
> A080 | Unsupported | Medium priority | Checked 24 September 2026



And now, the series wrap-up itself.

We began, back in episode one, with the Search Essentials: three technical requirements, and the promise that appearing in Google's results costs nothing and can't be bought. Thirty episodes later, we've covered the entire documented landscape built on top of that simple foundation.

> ChatGPT fact check - this paragraph claims "Thirty episodes later, we've covered the entire documented landscape built on top of that simple foundation.", but the counterargument is: The conclusion says the entire documented landscape, every visual element, the full structured-data landscape, and complete ecommerce guide have been covered. The body of the series does not support those assertions. Replace these completeness claims with an accurate scope statement and a link to the remaining-source coverage checklist. Call this the main-series conclusion if Episode 31 remains supplementary.
>
> Sources: Internal source: seo-study/index.html, episode listings and introductory paragraphs; compare the chapter headings and text. This is an editorial or coverage correction, not an additional Google policy.; Scope reference: https://developers.google.com/search/docs.
>
> A082 | Omission | High priority | Checked 24 September 2026



Part One covered the rules of the road: the spam policies, how search actually works end to end, the full Starter Guide, genuine people-first content and E-E-A-T, the newly current guidance on generative AI search, and how to sensibly evaluate outside help.

Part Two went deep on crawling and indexing: file types, URL structure, links, sitemaps, Googlebot and robots.txt, canonicalization, mobile-first indexing, and the full technical arc of JavaScript rendering, lazy-loading, dynamic rendering, meta tag directives, removals, and redirects.

Part Three covered ranking and appearance: how ranking systems and updates actually work, page experience and Core Web Vitals, every visual element of a result from title link to favicon, images and video, and the full structured data landscape, general guidelines, the feature gallery, the genuinely current FAQ rich result retirement, and shopping markup in real depth.

> ChatGPT fact check - this paragraph claims "Part Three covered ranking and appearance: how ranking systems and updates actually work, page experience and Core Web Vitals, every visual element of a result from title link to favicon, images and video, and the full structured data landscape, general guidelines, the feature gallery, the genuinely current FAQ rich result retirement, and shopping markup in real depth.", but the counterargument is: The conclusion says the entire documented landscape, every visual element, the full structured-data landscape, and complete ecommerce guide have been covered. The body of the series does not support those assertions. Replace these completeness claims with an accurate scope statement and a link to the remaining-source coverage checklist. Call this the main-series conclusion if Episode 31 remains supplementary.
>
> Sources: Internal source: seo-study/index.html, episode listings and introductory paragraphs; compare the chapter headings and text. This is an editorial or coverage correction, not an additional Google policy.; Scope reference: https://developers.google.com/search/docs.
>
> A082 | Omission | High priority | Checked 24 September 2026



Part Four covered the specialty guides: Discover, business details, the brand-new Preferred Sources feature, Web Stories, the complete ecommerce guide including how to actually write a review worth reading, and managing an international, multilingual presence properly.

> ChatGPT fact check - this paragraph claims "Part Four covered the specialty guides: Discover, business details, the brand-new Preferred Sources feature, Web Stories, the complete ecommerce guide including how to actually write a review worth reading, and managing an international, multilingual presence properly.", but the counterargument is: The conclusion says the entire documented landscape, every visual element, the full structured-data landscape, and complete ecommerce guide have been covered. The body of the series does not support those assertions. Replace these completeness claims with an accurate scope statement and a link to the remaining-source coverage checklist. Call this the main-series conclusion if Episode 31 remains supplementary.
>
> Sources: Internal source: seo-study/index.html, episode listings and introductory paragraphs; compare the chapter headings and text. This is an editorial or coverage correction, not an additional Google policy.; Scope reference: https://developers.google.com/search/docs.
>
> A082 | Omission | High priority | Checked 24 September 2026



And Part Five closed with monitoring and debugging: Search Console itself, the systematic five-cause method for diagnosing a genuine traffic drop, search operators as a fast diagnostic tool, Google Trends, and keeping a site genuinely secure.

If there's one idea worth carrying forward above every other single detail in these thirty episodes, it's the one Google itself returns to more often than any other, across nearly every single document we've covered: write for the person actually reading it, make sure Google can technically find and understand what you've written, and never mistake a technical trick for a substitute for something genuinely worth someone's time. Everything else in this entire series, every meta tag, every structured data type, every crawl budget consideration, is ultimately in service of that one simple idea.

Thank you for walking through all of this. This has been Walking Through Google Search, a complete adaptation of Google Search Central's own documentation, current as of September 2026.

> ChatGPT fact check - this paragraph claims "This has been Walking Through Google Search, a complete adaptation of Google Search Central's own documentation, current as of September 2026.", but the counterargument is: The conclusion says the entire documented landscape, every visual element, the full structured-data landscape, and complete ecommerce guide have been covered. The body of the series does not support those assertions. Replace these completeness claims with an accurate scope statement and a link to the remaining-source coverage checklist. Call this the main-series conclusion if Episode 31 remains supplementary.
>
> Sources: Internal source: seo-study/index.html, episode listings and introductory paragraphs; compare the chapter headings and text. This is an editorial or coverage correction, not an additional Google policy.; Scope reference: https://developers.google.com/search/docs.
>
> A082 | Omission | High priority | Checked 24 September 2026



This episode is adapted from "Get started with Google Trends" and "Preventing and monitoring abuse on your site" on Google Search Central, licensed under Creative Commons Attribution 4.0.

### Episode 31: Supplementary Update: Search Profiles, Regional Search Experiences, Social and Video Analysis, and Fake Reviews

Welcome to a supplementary episode. The rest of this series was researched and written across September 2026, but Google Search Central kept publishing during that same window. This episode covers four genuinely new pieces of documentation that landed after the relevant main episodes were finished: Search profile badges, regional differences in Search experience, a new Search Console guide for social and video content, and a real tightening of the review-snippet rules around fake and incentivized reviews.

> ChatGPT fact check - this paragraph claims "The rest of this series was researched and written across September 2026, but Google Search Central kept publishing during that same window.", but the counterargument is: The script says the main series was researched in September 2026, yet describes July 24 and July 29 documentation as unavailable at the time and published after the main episodes were finished. The July dates are genuine; the explanatory research story is inconsistent. Describe these as supplementary topics omitted from the main series. Do not invent a research timeline or imply that July updates postdated September research.
>
> Sources: Added guide on analyzing social and video platform content; paragraph 1: https://developers.google.com/search/updates#added-guide-on-analyzing-social-and-video-platform-content; Added a new review snippet guideline; paragraph 1: https://developers.google.com/search/updates#added-a-new-review-snippet-guideline.
>
> A083 | Error | Medium priority | Checked 24 September 2026



Search profile badges.

This is new documentation, published mid-September 2026, explaining how to add a Search profile badge to your own website. A Search profile is a way for an entity, a business, a creator, an author, to have a dedicated presence Google can point searchers toward directly. The badge itself is something you embed on your own site, functioning similarly in spirit to the Preferred Sources button from episode twenty-six: a direct, site-owner-controlled way to point your own audience toward your official Search profile, rather than leaving Google to piece one together purely from scattered signals. If a personal-brand or authority-building project is actively cultivating a recognisable public presence, this is worth pairing directly with the knowledge panel and Business Profile guidance from episode twenty-six.

> ChatGPT fact check - this paragraph claims "This is new documentation, published mid-September 2026, explaining how to add a Search profile badge to your own website.", but the counterargument is: Search profiles' Discover-following purpose and prior claiming step are omitted. Regional units are not identified as EEA features, and supplier units' dependence on an aggregator unit is omitted. Social/video reporting requires separately added and verified platform properties. Restore those conditions and distinguish documentation publication from feature launch. Explain supported platform properties and verification rather than implying an ordinary website property automatically contains this data.
>
> Sources: How Search profiles work on Google; paragraph 1: https://developers.google.com/search/docs/appearance/search-profiles#how-search-profiles-work; Add a Search profile badge to your website; paragraph 2: https://developers.google.com/search/docs/appearance/search-profiles#how-to; Aggregator unit in Google Search; paragraph 1: https://developers.google.com/search/docs/appearance/aggregator-unit#aggregator-unit-in-google-search; Supplier unit in Google Search; paragraph 1: https://developers.google.com/search/docs/appearance/supplier-unit#supplier-unit-in-google-search; Get started with Search Console; paragraph 2: https://developers.google.com/search/docs/monitor-debug/analyze-social-video-content#get-started.
>
> A084 | Omission | Medium priority | Checked 24 September 2026



Regional differences in Search experience.

New documentation, published in two parts in early-to-mid September 2026, covering something worth knowing conceptually even if it may not immediately apply everywhere: certain countries get distinct Search features unavailable elsewhere. Google specifically names aggregator units and supplier units as examples. An aggregator unit is a distinct visual treatment for sites that aggregate listings from many underlying suppliers, think a marketplace or a comparison site; a supplier unit is the counterpart treatment for the individual businesses actually being aggregated within that experience. As of the most recent update, these units now also support local business queries specifically, on top of whatever query types they originally launched with.

> ChatGPT fact check - this paragraph claims "Google specifically names aggregator units and supplier units as examples.", but the counterargument is: Search profiles' Discover-following purpose and prior claiming step are omitted. Regional units are not identified as EEA features, and supplier units' dependence on an aggregator unit is omitted. Social/video reporting requires separately added and verified platform properties. Restore those conditions and distinguish documentation publication from feature launch. Explain supported platform properties and verification rather than implying an ordinary website property automatically contains this data.
>
> Sources: How Search profiles work on Google; paragraph 1: https://developers.google.com/search/docs/appearance/search-profiles#how-search-profiles-work; Add a Search profile badge to your website; paragraph 2: https://developers.google.com/search/docs/appearance/search-profiles#how-to; Aggregator unit in Google Search; paragraph 1: https://developers.google.com/search/docs/appearance/aggregator-unit#aggregator-unit-in-google-search; Supplier unit in Google Search; paragraph 1: https://developers.google.com/search/docs/appearance/supplier-unit#supplier-unit-in-google-search; Get started with Search Console; paragraph 2: https://developers.google.com/search/docs/monitor-debug/analyze-social-video-content#get-started.
>
> A084 | Omission | Medium priority | Checked 24 September 2026



The practical relevance: these features carry their own specific eligibility criteria and their own regional availability, so a site genuinely operating in, or targeting, a market where these features exist has a real, concrete reason to check the current eligibility requirements directly, since regional feature rollouts like this one tend to expand gradually over time, exactly the pattern we saw repeatedly with Preferred Sources across episode twenty-six's own changelog history, and could plausibly extend further since this documentation entry itself.

> ChatGPT fact check - this paragraph claims "The practical relevance: these features carry their own specific eligibility criteria and their own regional availability, so a site genuinely operating in, or targeting, a market where these features exist has a real, concrete reason to check the current eligibility requirements directly, since regional feature rollouts like this one tend to expand gradually over time, exactly the pattern we saw repeatedly with Preferred Sources across episode twenty-six's own changelog history, and could plausibly extend further since this documentation entry itself.", but the counterargument is: Search profiles' Discover-following purpose and prior claiming step are omitted. Regional units are not identified as EEA features, and supplier units' dependence on an aggregator unit is omitted. Social/video reporting requires separately added and verified platform properties. Restore those conditions and distinguish documentation publication from feature launch. Explain supported platform properties and verification rather than implying an ordinary website property automatically contains this data.
>
> Sources: How Search profiles work on Google; paragraph 1: https://developers.google.com/search/docs/appearance/search-profiles#how-search-profiles-work; Add a Search profile badge to your website; paragraph 2: https://developers.google.com/search/docs/appearance/search-profiles#how-to; Aggregator unit in Google Search; paragraph 1: https://developers.google.com/search/docs/appearance/aggregator-unit#aggregator-unit-in-google-search; Supplier unit in Google Search; paragraph 1: https://developers.google.com/search/docs/appearance/supplier-unit#supplier-unit-in-google-search; Get started with Search Console; paragraph 2: https://developers.google.com/search/docs/monitor-debug/analyze-social-video-content#get-started.
>
> A084 | Omission | Medium priority | Checked 24 September 2026



Analyzing social and video platform content.

This is a genuinely new Search Console guide, published in late July 2026, and it fills a real gap that episode twenty-nine's coverage of Search Console didn't have available to draw on at the time. It explains how to analyse the performance of your social media and video platform content specifically within Search Console's own reporting, intended directly for content creators, social media managers, and SEO professionals who want to understand how that specific kind of content performs within Google Search itself, not merely within the native platform it was posted to.

> ChatGPT fact check - this paragraph claims "This is a genuinely new Search Console guide, published in late July 2026, and it fills a real gap that episode twenty-nine's coverage of Search Console didn't have available to draw on at the time.", but the counterargument is: The script says the main series was researched in September 2026, yet describes July 24 and July 29 documentation as unavailable at the time and published after the main episodes were finished. The July dates are genuine; the explanatory research story is inconsistent. Describe these as supplementary topics omitted from the main series. Do not invent a research timeline or imply that July updates postdated September research.
>
> Sources: Added guide on analyzing social and video platform content; paragraph 1: https://developers.google.com/search/updates#added-guide-on-analyzing-social-and-video-platform-content; Added a new review snippet guideline; paragraph 1: https://developers.google.com/search/updates#added-a-new-review-snippet-guideline.
>
> A083 | Error | Medium priority | Checked 24 September 2026



> ChatGPT fact check - this paragraph claims "It explains how to analyse the performance of your social media and video platform content specifically within Search Console's own reporting, intended directly for content creators, social media managers, and SEO professionals who want to understand how that specific kind of content performs within Google Search itself, not merely within the native platform it was posted to.", but the counterargument is: Search profiles' Discover-following purpose and prior claiming step are omitted. Regional units are not identified as EEA features, and supplier units' dependence on an aggregator unit is omitted. Social/video reporting requires separately added and verified platform properties. Restore those conditions and distinguish documentation publication from feature launch. Explain supported platform properties and verification rather than implying an ordinary website property automatically contains this data.
>
> Sources: How Search profiles work on Google; paragraph 1: https://developers.google.com/search/docs/appearance/search-profiles#how-search-profiles-work; Add a Search profile badge to your website; paragraph 2: https://developers.google.com/search/docs/appearance/search-profiles#how-to; Aggregator unit in Google Search; paragraph 1: https://developers.google.com/search/docs/appearance/aggregator-unit#aggregator-unit-in-google-search; Supplier unit in Google Search; paragraph 1: https://developers.google.com/search/docs/appearance/supplier-unit#supplier-unit-in-google-search; Get started with Search Console; paragraph 2: https://developers.google.com/search/docs/monitor-debug/analyze-social-video-content#get-started.
>
> A084 | Omission | Medium priority | Checked 24 September 2026



Here's why this genuinely matters, tying back to episode twenty-two's video coverage: content posted to platforms like YouTube, or to other video and social platforms, can itself surface directly within Google Search results, and this new guide is specifically about measuring that cross-platform visibility properly, inside the same Search Console interface already covered in episode twenty-nine, rather than needing to piece that picture together from each platform's own separate, siloed native analytics.

> ChatGPT fact check - this paragraph claims "Here's why this genuinely matters, tying back to episode twenty-two's video coverage: content posted to platforms like YouTube, or to other video and social platforms, can itself surface directly within Google Search results, and this new guide is specifically about measuring that cross-platform visibility properly, inside the same Search Console interface already covered in episode twenty-nine, rather than needing to piece that picture together from each platform's own separate, siloed native analytics.", but the counterargument is: Search profiles' Discover-following purpose and prior claiming step are omitted. Regional units are not identified as EEA features, and supplier units' dependence on an aggregator unit is omitted. Social/video reporting requires separately added and verified platform properties. Restore those conditions and distinguish documentation publication from feature launch. Explain supported platform properties and verification rather than implying an ordinary website property automatically contains this data.
>
> Sources: How Search profiles work on Google; paragraph 1: https://developers.google.com/search/docs/appearance/search-profiles#how-search-profiles-work; Add a Search profile badge to your website; paragraph 2: https://developers.google.com/search/docs/appearance/search-profiles#how-to; Aggregator unit in Google Search; paragraph 1: https://developers.google.com/search/docs/appearance/aggregator-unit#aggregator-unit-in-google-search; Supplier unit in Google Search; paragraph 1: https://developers.google.com/search/docs/appearance/supplier-unit#supplier-unit-in-google-search; Get started with Search Console; paragraph 2: https://developers.google.com/search/docs/monitor-debug/analyze-social-video-content#get-started.
>
> A084 | Omission | Medium priority | Checked 24 September 2026



And now, the update that carries the most direct, practical weight of all four: a new review snippet guideline addressing fake and undisclosed incentivized reviews.

This landed in late July 2026, as a direct addition to the review snippet documentation we referenced back in episode twenty-five's shopping structured data material, and it deserves to be understood precisely, since it sharpens something episode twenty-seven already covered from a different angle.

> ChatGPT fact check - this paragraph claims "This landed in late July 2026, as a direct addition to the review snippet documentation we referenced back in episode twenty-five's shopping structured data material, and it deserves to be understood precisely, since it sharpens something episode twenty-seven already covered from a different angle.", but the counterargument is: The script says the main series was researched in September 2026, yet describes July 24 and July 29 documentation as unavailable at the time and published after the main episodes were finished. The July dates are genuine; the explanatory research story is inconsistent. Describe these as supplementary topics omitted from the main series. Do not invent a research timeline or imply that July updates postdated September research.
>
> Sources: Added guide on analyzing social and video platform content; paragraph 1: https://developers.google.com/search/updates#added-guide-on-analyzing-social-and-video-platform-content; Added a new review snippet guideline; paragraph 1: https://developers.google.com/search/updates#added-a-new-review-snippet-guideline.
>
> A083 | Error | Medium priority | Checked 24 September 2026



Recall from episode twenty-seven: Google's guidance on writing genuinely high-quality reviews already emphasised real, original testing and honest, evidence-backed pros and cons. This new guideline adds a more explicit, more pointed layer specifically targeting reviews that are fake outright, or that were incentivized, meaning the reviewer received some form of compensation or benefit in exchange for writing it, without that incentive being genuinely, clearly disclosed to the reader. Google's stated purpose, worth remembering precisely: to improve user review transparency specifically.

Why this matters directly for a store collecting its own product reviews: if a business ever runs a review-incentive programme, offering a discount, a small gift, or any other benefit in exchange for a customer leaving a review, that relationship now needs to be clearly, genuinely disclosed within the review content itself, not quietly omitted. An undisclosed incentivized review sits in essentially the same category Google is now actively targeting as a fake one, at least for the purposes of review-snippet structured data eligibility. This connects directly back to episode sixteen's data-nosnippet material and episode twenty-three's structured data quality guidelines too: Google has been consistently tightening what counts as legitimate, trustworthy review content across this entire series, and this is simply the newest, most explicit instance of that same underlying pressure.

> ChatGPT fact check - this paragraph claims "Why this matters directly for a store collecting its own product reviews: if a business ever runs a review-incentive programme, offering a discount, a small gift, or any other benefit in exchange for a customer leaving a review, that relationship now needs to be clearly, genuinely disclosed within the review content itself, not quietly omitted.", but the counterargument is: The new review rule prohibits fake or undisclosed incentivized reviews on the page or in markup. There is no source-supported connection making data-nosnippet a compliance remedy. Require genuine experience and clear, prominent incentive disclosure. Remove the data-nosnippet connection and retain the separate self-serving-review restriction for organizations/local businesses.
>
> Sources: Technical guidelines; list item 8: https://developers.google.com/search/docs/appearance/structured-data/review-snippet#technical-guidelines; Technical guidelines; list item 9: https://developers.google.com/search/docs/appearance/structured-data/review-snippet#technical-guidelines.
>
> A085 | Unsupported | Medium priority | Checked 24 September 2026



The practical takeaway, stated plainly: if a store solicits reviews with any kind of incentive attached, disclose that incentive directly and visibly within the review itself, and audit any existing review collection process now, before this newer, more explicit guideline gets tested against actual review content already live on the site.

Let's recap this supplementary episode.

Search profile badges give a site owner a direct, embeddable way to point their own audience toward an official Search profile, in the same spirit as episode twenty-six's Preferred Sources button. Regional Search experiences, aggregator and supplier units specifically, now support local business queries too, and remain a feature worth checking directly against current eligibility criteria for any site with real regional ambitions. The new social and video platform content guide fills a genuine gap in episode twenty-nine's Search Console coverage, letting cross-platform video and social performance be measured directly inside the same reporting interface. And the fake and undisclosed incentivized reviews guideline meaningfully sharpens episode twenty-seven's review-quality material: any incentive offered in exchange for a review now needs clear, direct disclosure within that review, not quiet omission.

This closes the series, genuinely this time, current through Google Search Central's own published changelog as of September 18, 2026.

This episode is adapted from Google Search Central's documentation changelog, covering "Add a Search profile badge to your website," "Regional differences in Search experience," "Analyze social and video platform content," and the review snippet guidelines, licensed under Creative Commons Attribution 4.0.

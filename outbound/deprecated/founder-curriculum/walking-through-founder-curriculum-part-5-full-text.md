> DEPRECATED — withdrawn from the active curriculum at Vincent’s request on 2 November 2026. Retained for history only. Narrator attribution corrected to Alistair.

# Walking Through the Founder's Curriculum, Part Five: When the Software Meets the Order

*Written on 2 November 2026. A continuous audio essay narrated by Alistair. Scenarios are illustrative, not reports of incidents in Vincent's shops. Technical recommendations are editorial judgement; they must be adapted to the actual platform and verified provider contracts. Sources and implementation notes follow the closing rule.*

## Part One: Understand the Journey

### Episode 1: One customer, several versions of the truth

Hello Vincent. Alistair here.

Today we're following an order through the machinery. You do not need to become the engineer who builds every part. You do need to recognise the promises each part makes, and the evidence that those promises were kept.

A customer finishes a design. The browser shows a preview. A service creates the print file. The shop records a product and a price. The customer pays. Another service sends instructions to the supplier. Later, tracking comes back.

From the customer's point of view, that is one purchase. Inside the business, it is a conversation between several systems, each holding a slightly different account of what happened.

The preview might reflect the most recent edit while the print file reflects the previous one. The payment might succeed while the confirmation screen fails. A supplier might receive the order while your software times out waiting for its reply.

This is why “the page works” is an incomplete definition of done for commerce software. You need to follow the promise all the way to the object the customer receives.

Start by asking an agent to draw the actual journey. At each step, identify what is stored, which system is authoritative and how a failed step becomes visible. Keep unknowns marked as unknowns. An honest gap in the diagram is useful; an invented integration is expensive.

Your exercise for this walk is to choose one order journey and ask where you could lose track of the truth.

### Episode 2: Describe the states before the buttons

An order has a life, and it helps to name its stages.

A design can be editable, submitted or approved. A print file can be waiting, ready or failed. A payment can be pending, successful or refunded. Fulfilment can be waiting, accepted, dispatched or cancelled.

Those are separate dimensions. “Paid” does not mean “ready to print”. “Submitted to supplier” does not necessarily mean “accepted by supplier”. A single green status called “complete” can hide quite a lot of unfinished business.

Ask your developer to describe which transitions are allowed and what evidence permits each one. A file becoming ready should require the file to exist and pass the checks that matter. Sending to production should require the necessary payment and artwork conditions, according to the actual business process.

Then ask about exceptions. What if the customer changes the design after approval? What if payment is refunded while production is already under way? What if the supplier rejects the address?

The software needs somewhere to put these cases. Often the appropriate destination is a visible exception queue for a human decision. It should preserve what happened and explain what is waiting.

Naming states is a design exercise. It often reveals a missing operational decision before anyone writes code. That is an excellent time to discover it.

## Part Two: Surviving Uncertainty

### Episode 3: The reply never arrived

Suppose your software asks a supplier to create an order. The request goes out. No reply comes back.

There are at least two possibilities. The request never reached the supplier. Or it reached the supplier, the order was created, and the reply was lost.

If you simply send it again, the second possibility can become two physical orders.

This is where the word idempotency becomes useful. You met it earlier with catalogue imports. Here, it means that repeating the same logical request should not repeat its business effect.

A provider may support a unique request key. Reusing that key for the same operation allows the provider to recognise a retry. But you must check the provider's actual rules: how long keys remain valid, what happens if the request contents change and which operations support them.

Where the provider offers no suitable guarantee, your system needs another recovery design. Perhaps it can look up the external order using a reference you assigned before sending. Perhaps an uncertain result must wait for reconciliation or a human check. A timeout is a state of uncertainty, not proof of failure.

The question to ask your developer is straightforward. “If the reply is lost after the action succeeds, what stops us doing it twice?”

Ask for a demonstrated answer. A comment saying “avoid duplicates” is an aspiration. A recovery test that produces one order after a lost reply is evidence.

### Episode 4: Notifications are messages, not magic

A webhook is a system sending your system a message about something that happened. Payment succeeded. An order changed. A parcel was dispatched.

These messages are useful because you do not have to ask constantly whether anything changed. But you must build for the delivery behaviour the provider actually documents. Messages may be repeated, delayed or arrive in an order you did not expect.

Your receiver should verify that the message came from the expected provider, following that provider's signature procedure. It should record enough information to recognise a duplicate and recover from an interruption. It should acknowledge and process messages according to the provider's timing requirements.

There is a subtle failure worth asking about. Imagine the receiver records that a message has been handled, then crashes before updating the order. When the provider retries, the receiver dismisses it as a duplicate. The order remains wrong.

The design must coordinate those steps so a message cannot disappear between “seen” and “finished”. There are several engineering approaches. Your role is to ask which one was chosen and see its failure test.

Also ask how stale information is handled. An old notification should not casually move a dispatched order back to waiting. Sometimes the right response is to fetch the authoritative current state and reconcile it, with the provider's limits and consistency behaviour in mind.

For a shopping agent, the same principles apply. An agent calling your tool is another client. It needs explicit outcomes and a safe way to recover from uncertainty, just as a browser or payment service does.

## Part Three: Protect the Customer's Intent

### Episode 5: Which design did they actually approve?

For a custom product, correctness includes the customer's intent.

Suppose someone changes a slogan, then clicks buy while an earlier preview is still rendering. Or they approve a design on their phone, then reopen the editor on a laptop. Which version should production receive?

You want an explicit approved version that connects the customer's choice to the generated output. Store the inputs needed to reproduce that version: artwork, text, layout, dimensions and relevant settings. Identify the generated file and the configuration used to make it. Decide what must be retained, for how long, and who may access it.

A file checksum can help establish whether a file changed. It cannot establish that the design is correct. That still requires checks suited to the product: dimensions, safe areas, orientation, font availability and visual comparison, for example.

The preview also needs an honest promise. If it cannot represent fabric translucency, exact colour or stitching precisely, explain the meaningful limitation in customer language. Give customers enough information to make a choice without making them read your rendering architecture.

When a customer edits an approved design, treat the new version deliberately. Either obtain new approval or keep production tied to the previous approval, according to a clearly explained process. Do not silently substitute whichever file happened to finish last.

The practical request to an agent is this: “Show me how an approved design stays attached to the file we send to production, including when rendering finishes out of order.”

### Episode 6: A price needs a contract too

The customer sees a price. The cart records a price. The payment collects an amount. The supplier charges a cost.

Those values are related, but they are not interchangeable.

A custom quote should identify what it covers: product configuration, quantity, currency and the applicable pricing version or quote validity. The server must validate the purchase against the actual rules. A price displayed or supplied by a browser is not sufficient authority to charge it.

Be precise about money in the implementation. Follow the payment provider's currency and rounding rules. Some currencies do not use two decimal places. Avoid assuming that every amount can be handled by multiplying a displayed decimal by a hundred.

Then ask what happens when conditions change. A customer returns to an old cart after a supplier price increase. A quantity discount changes. A delivery address makes a different shipping charge applicable.

The business must decide what is honoured, what is recalculated and how the customer is told before committing. The code should implement that decision consistently.

For testing, choose cases that expose boundaries. A quantity just below and just above a discount threshold. A saved quote after its validity ends. A currency with different minor-unit rules if the shop supports one. A shipping destination the product cannot serve.

The acceptance criterion is the amount and promise the customer actually accepts, carried correctly through the transaction. A correct-looking number on a product page is only the beginning.

## Part Four: Recover and Learn

### Episode 7: Reconciliation finds what notifications missed

Even a careful integration needs a way to compare its records with reality.

That is reconciliation. Periodically, you compare the systems that should agree and investigate the differences.

For example, a paid order without an accepted fulfilment request may need attention. A supplier order with no matching shop order may indicate a duplicate or a broken reference. A dispatched order with no tracking update may leave a customer unnecessarily worried.

Some differences are normal for a short time. A payment and an order update do not arrive simultaneously. Define how long a state can reasonably remain in transit before it becomes an exception. Otherwise the report will be full of harmless timing differences and people will stop reading it.

Start with a read-only report. Show the mismatch, when it began, the evidence and the next safe action. Give it an owner. Automatic repair can come later for cases whose meaning and recovery are well understood.

Keep customer information out of routine logs wherever it is unnecessary. Use internal references to connect events. Access to detailed order information should remain controlled. A debugging system should not become a second, casually maintained customer database.

Your most useful measure here may be the age of unresolved exceptions. Counting errors tells you how noisy the machinery is. Knowing that a paid order has been stuck since Tuesday tells you whom to help.

### Episode 8: Rehearse the awkward afternoon

Let's finish with a rehearsal.

Pick one journey in a safe test environment with synthetic customer information. Ask the developer to show what happens when the customer clicks twice, when a notification is repeated, when the supplier succeeds but the reply is lost, and when rendering finishes in the wrong order.

Then ask what happens when the process stops halfway through and restarts. Can it resume? Can an operator tell what happened? Does the recovery create another charge, another order or another file with an ambiguous status?

You do not need a giant test suite for every harmless page change. These checks belong where mistakes affect payment, customer intent or physical fulfilment. Spend verification effort in proportion to the consequence.

Before release, name the person who can stop the affected workflow and the conditions for doing so. Know which actions remain safe during an incident. You might pause new fulfilment submissions while continuing to accept support enquiries, for example, if the actual system supports that separation.

If an incident happens, preserve the relevant evidence, limit the immediate damage, identify affected customers and restore a trustworthy state. Customer communications should follow your actual approval process. Afterwards, write down the cause, the recovery and the change that would make a recurrence less likely or easier to detect.

For the journey you chose at the start, you now have a practical review agenda. Name the states. Identify the authoritative records. Demonstrate recovery from an uncertain result. Keep the approved design and price attached to the order. Reconcile the systems afterwards.

This is how you review commerce software without writing every line yourself. Follow the customer promise, and keep asking what happens when the happy path takes the afternoon off.

---

## Sources and implementation notes

- Read 2 November 2026 — [Existing Founder's Curriculum](https://github.com/VincentDN/vincentdenil-site/tree/main/docs), parts one through three: continuity, assumed audience and prior treatment of imports, security, testing and review. No historical platform announcement from those essays is treated as current evidence here.
- Read 2 November 2026 — [Repository instructions](https://github.com/VincentDN/vincentdenil-site/blob/main/AGENTS.md): narrator and audio-writing conventions.
- The technical material describes general distributed-system failure modes and editorial review questions. It does not assert a particular delivery guarantee, idempotency implementation, currency format or webhook contract for Shopify, a payment provider or a supplier. Before implementation, read the actual provider's current documentation and test against that integration's supported sandbox or test facilities.
- No live order, payment, supplier request, shop mutation or customer message was used to write or verify these scenarios. The essay proposes a curriculum and acceptance questions; it does not establish that the current business systems have these defects or safeguards.

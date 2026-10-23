# Actually Reading the Manual, Episode 26: Code Review, GitHub and Security

*Part Four, Claude Code, Properly. Narrated by Claudine. Written on 23 October 2026 from Anthropic's own documentation, read that day. Sources are listed below the closing rule.*

Hello, Vincent. Claudine here.

The penultimate episode of Part Four is about checking work. Claude reviewing code, Claude working inside GitHub, and the security page that ties the whole of this part together. If episode eighteen was "what Claude Code can do," this one is "how you'd know it did it properly."

## Five ways to get a review

The code review pages start with a comparison, and it's the right place to begin, because the options differ more than their names suggest.

There's Code Review, the managed service. It reviews pull requests in your GitHub repositories automatically. It's for Team and Enterprise organisations, and an Owner has to turn it on.

There's the code review command, which anyone can type in their own session, on any plan, to review the changes on their branch.

There's ultrareview, a deeper multi-agent review that runs in a cloud sandbox and that you start from Claude Code.

There's Claude in your own pipeline, through GitHub Actions, running on your own runners with an API key.

And there's your own reviewer: a subagent or skill you write yourself.

## How the managed review works

The managed review's design is worth knowing, because it's a good template for any checking process. By default it "focuses on correctness: bugs that would break production, not formatting preferences or missing test coverage." It runs in four stages. Find: several agents examine the change and the surrounding code in parallel. Verify: a step "checks the candidate findings against the code and filters out false positives." Rank: what remains is deduplicated and sorted by severity. Post: results go onto the pull request as inline comments and a summary, plus a check run.

The verify stage is the clever part. Finding possible problems is cheap; most of the noise in automated review comes from findings that look alarming but aren't real. A separate step whose job is to try to confirm each one is what keeps the reviews worth reading.

There are three review levels, Quick, Standard and Deep, with cost rising accordingly. And it's read-only: inside a review, access to your repository is read-only, and a review doesn't push commits. Someone with write access can also ask for a review at any time by commenting a mention on the pull request.

## The command in your own session

The local command does the same job inside a session. You type it, Claude reviews the changes on your branch for correctness bugs and reports what it found. With a fix flag, it also applies the findings to your working files, still through your permission mode. With a comment flag, it posts the findings on the pull request. You can point it at a pull request number, a branch, a file, or a range of commits. And you can escalate to ultrareview from the same command when the change is big enough to deserve it.

Claude can also start the review on its own, if you ask in plain words to review your changes, or from a scheduled task.

## GitHub Actions

The GitHub Actions page describes Claude running inside your repository's own workflows. In the interactive mode, you mention Claude in a pull request or issue comment, and it can "analyze code, implement changes, and push commits," reporting progress as a comment. In the automation mode, you give it a prompt to run on any GitHub event.

Setup is either one command from Claude Code, which installs the GitHub app, adds the secret and prepares a workflow, or a manual route. And there's a detail about permissions that's worth hearing. The Claude GitHub app is shared by every Claude feature that integrates with GitHub, so "a GitHub App has a single permission set covering all of its features." When you install it, you grant it read and write access to contents, issues and pull requests, among others, even if a particular feature doesn't use them all.

## The security plugin

There's one more checking tool, and it works earlier than any of the others. The security-guidance plugin "makes Claude review its own code changes for common vulnerabilities while it works and fix what it finds in the same session."

It checks at three moments. On each file edit, a fast pattern match for risky calls, such as running dynamic code, unsafe deserialisation, or writing raw HTML into a page, with no model call and so no usage cost. It also flags edits to GitHub workflow files, which can grant broad access. At the end of each turn, a background model review of everything that turn changed, including changes made by shell commands and subagents. And on each commit or push, a deeper review that reads surrounding code, callers and sanitisers, to decide whether a finding is real, which keeps false positives low. You can add your own rules on top.

## The security page

Finally, the security page itself, which gathers up much of this part.

It restates the permission-based design, and the user's responsibility: "You're responsible for reviewing proposed code and commands for safety before approval."

Its section on prompt injection, "a technique where an attacker attempts to override or manipulate an AI assistant's instructions by inserting malicious text", lists the protections. Network commands like downloading from the web aren't auto-approved by default. Web pages fetched by the built-in tool are usually summarised by a separate model call, so Claude gets the summary rather than the raw page. A trust dialog appears when you start in a new folder. Commands Claude can't fully analyse prompt for approval. And unmatched commands require approval by default, which the page calls "fail-closed matching."

Then a list of best practices for untrusted content that I'd pin on any noticeboard. Review suggested commands before approval. Avoid piping untrusted content directly to Claude. Verify proposed changes to critical files. Use virtual machines to run scripts and tool calls, "especially when interacting with external web services." And report suspicious behaviour.

## What this means for us

First, use the local review command before merging anything with real code in it. It's on any plan, it takes a minute, and its whole design is aimed at the bugs that break production. For the site repositories, the shop theme and the flag editor, that's a cheap insurance policy.

Second, the four-stage design is a pattern for our own checks, not only for code. The morning walk's flag opportunities, product descriptions, customer replies: find, verify, rank, then post. The verify step, a separate pass that tries to disprove each claim, is the part most worth copying.

Third, consider the security plugin for repositories with real code. Its first layer costs nothing and catches exactly the kind of mistake that ends up in a web page: raw HTML written straight into the page from user input.

And fourth, the prompt-injection list describes our inbox. Customer emails, supplier messages and scraped pages are untrusted content by definition. Draft-only replies, ask-rules on outward tools, and working in disposable cloud containers are the practical answers, and we already have most of them.

Next time: the last episode of Part Four. Costs, models, and the best-practices page that pulls it all together.

---

## Sources (not read aloud)

All pages read on 23 October 2026.

- Code Review (availability, "focuses on correctness", four stages find/verify/rank/post, review levels, read-only access, `@claude review`, compare ways to get a review): https://code.claude.com/docs/en/code-review
- Review locally with /code-review (targets, `--fix`, `--comment`, ultra, Claude starting the review): https://code.claude.com/docs/en/code-review-local
- Claude Code GitHub Actions (interactive and automation modes, quick and manual setup, shared GitHub App permission set): https://code.claude.com/docs/en/github-actions
- Catch security issues as Claude writes code (security-guidance plugin, three check points, workflow-file edits, deeper commit review): https://code.claude.com/docs/en/security-guidance
- Security (permission-based architecture, user responsibility, prompt injection protections, "fail-closed matching", best practices for untrusted content): https://code.claude.com/docs/en/security

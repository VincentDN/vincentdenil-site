# Actually Reading the Manual, Episode 5: Projects

*Part Two, Using Claude Well. Narrated by Claudine. Written on 23 October 2026 from Anthropic's own documentation, read that day. Sources are listed below the closing rule.*

Good morning, Vincent. Claudine here, and welcome to Part Two.

Part One was the map. Part Two is about using the Claude app well, one feature at a time. We start with projects, because they're the feature I think a business like ours underuses the most. And right now they're in the middle of a change, so the manual describes two versions at once. I'll take you through both.

## The project you know: a workspace with a memory

The Help Center describes the current version simply. A project is a "self-contained workspace" with its own chat history and its own knowledge base. Inside it, you upload documents and set instructions, and every chat in the project starts with that context.

Projects are available to everyone, even on the free plan, where you can have up to five. On paid plans there's no such limit.

A project has three parts worth knowing about.

The knowledge base is where you upload files: documents, text, code. Claude uses them across every chat in the project.

Project instructions tell Claude how to behave in that project. For example, the Help Center suggests a more formal tone, or answering from the perspective of a particular role.

Project memory is newer. Each project has its own memory. Claude uses it together with your general memory from chats outside projects, but never with memory from other projects. There's a switch to keep a project's memory completely separate, which we'll come back to in episode seven.

Two small details in the setup article surprised me. First, the project's name and description are for you: the article says Claude can't see them. If something matters, it goes in the instructions or the knowledge, not the title. Second, context isn't shared between chats in a project unless it's in the knowledge base. A decision you made in Tuesday's chat isn't known in Wednesday's, unless you write it into the project.

## RAG: what happens when the knowledge gets big

On paid plans, projects have a trick for large knowledge bases, called retrieval-augmented generation, or RAG.

Normally, everything in the knowledge base is loaded into the conversation. When your project's knowledge gets close to the context window limit, Claude automatically switches to RAG mode. Instead of loading everything, it uses a search tool to pull in only the passages that matter for your question. The Help Center says this expands a project's capacity "by up to 10x" while keeping response quality the same. You'll see a small indicator when it's on, and Claude will visibly use a "project knowledge search" tool.

There's nothing to switch on. But the article gives four tips that matter once it's active.

Upload everything relevant up front.

Use clear, descriptive filenames, because they help Claude find the right document.

Keep related documents in the same project.

And name a specific document in your question when you know where the answer is.

## Sharing, for later

On Team and Enterprise plans, projects can be shared with colleagues, with "Can view" or "Can edit" permissions. Your own chats inside a shared project stay private unless you share them. That's not relevant to your plan today, but it's worth knowing if the team ever moves to a Team plan, for example so your virtual assistants can share one Flagmaker and Print project.

## The new projects: one conversation, many workers

Now the second version, which is newer and quite different. The Help Center calls it "the new version of projects", in beta, rolling out in stages and starting with Claude Code. The Claude Code documentation has a full page on it.

The idea is this. A new-style project is one ongoing conversation where Claude coordinates a stream of related work for you. You tell it what needs doing, and it starts a separate worker, called a thread, for each task. Each thread is usually a cloud session: Claude Code running on Anthropic's servers, on its own branch, opening a pull request when the work calls for one. If you close your laptop, the threads keep going.

The documentation lists what you get compared with running sessions yourself.

You send work to one place. You paste in a bug report or a list of tasks, and Claude either starts a new thread or passes it to the thread already working in that area.

You set context once. Every new thread starts with the project's instructions, so a rule you state once reaches all of them.

And you walk away and come back to finished work. An Overview pane shows which threads finished, which pull requests are ready for review, and which thread is "waiting on you".

There are some details that matter for us. A cloud thread starts with the project's repositories and files, its instructions and memory, and your account's connectors. It reads the CLAUDE.md in each repository. But the page is explicit that it does not pick up the repositories' skills, their settings file or their MCP configuration. Nor does it pick up anything from the Claude Code setup on your own machine. So any rule that only lives in a skill won't reach a project thread unless you bring it in deliberately.

The page also says when not to use a project. For one task that fits in a session, just start a session. For a single job on a schedule with no conversation around it, use a scheduled routine. And for work where every task needs your own machine, use local sessions.

On cost, the page is honest: a project draws on the same plan limits as your other sessions, and "uses them faster", because several threads run at once.

## Who has it

As of today, the new version is in public beta on Pro and Max plans, rolling out gradually. It isn't on Team or Enterprise yet. If you have it, you'll see Projects in the sidebar at claude.ai slash code, or under "More". Existing chat projects are being moved over for some users, and the Help Center promises that nothing is lost in the move: instructions, files, history and scheduled tasks all come along.

## What this means for us

I'd suggest two projects, one of each kind.

First, a classic chat project for Flagmaker and Print's knowledge. Put in the VA wiki, the documentation-links file, the shipping and product facts, and the price ladder. Give it short instructions in your voice. Every question about a customer case or a product spec then starts from the same source of truth. Remember the tip about filenames: "FMP shipping and lead times" beats "doc3 final".

Second, when the new projects reach your account, one project for each body of work that keeps producing tasks. CEP2026 is the obvious candidate: waves, intake files and tag fixes across several steps and repositories, with one conversation to coordinate them and an Overview to show what's waiting on you. That's the approval inbox from Part Three of the curriculum, built into the product.

One warning, from the page itself. Threads read CLAUDE.md, not skills. Our customer-service rules live partly in a skill. Before handing any customer-facing work to a project thread, make sure the hard rules are in AGENTS.md or CLAUDE.md, where a thread will actually read them.

Next time: artifacts, files and visuals. The things Claude makes for you, and what happens when you share them.

---

## Sources (not read aloud)

All pages read on 23 October 2026.

- Help Center, What are projects (both versions, project knowledge, RAG, sharing): https://support.claude.com/en/articles/9517075-what-are-projects
- Help Center, How can I create and manage projects (name and description not visible to Claude; context not shared across chats; project memory): https://support.claude.com/en/articles/9519177-how-can-i-create-and-manage-projects
- Help Center, Manage project visibility and sharing: https://support.claude.com/en/articles/9519189-manage-project-visibility-and-sharing
- Help Center, Retrieval augmented generation (RAG) for projects: https://support.claude.com/en/articles/11473015-retrieval-augmented-generation-rag-for-projects
- Claude Code, Let Claude coordinate ongoing work with Projects (threads, Overview, what threads pick up, when something else fits, usage): https://code.claude.com/docs/en/claude-projects

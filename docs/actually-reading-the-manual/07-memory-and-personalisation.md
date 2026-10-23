# Actually Reading the Manual, Episode 7: Memory and Personalisation

*Part Two, Using Claude Well. Narrated by Claudine. Written on 23 October 2026 from Anthropic's own documentation, read that day. Sources are listed below the closing rule.*

Hello, Vincent. Claudine here.

Today's question is one you've probably asked out loud at some point: what does Claude actually remember about me, and where? The answer turns out to be a set of layers, each with its own job and its own switch. Once you see the layers, a lot of odd behaviour starts to make sense.

## Three ways to tell Claude who you are

The Help Center's personalisation article names three ways to shape how Claude works with you, before memory even comes into it.

The first is Instructions for Claude. These are account-wide: you write them once in Settings, and they apply to every conversation. The article suggests your preferred approaches, the terms you use, the scenarios you meet often, and how you like to be spoken to.

The second is project instructions, which apply only inside one project. That was episode five.

The third is skills, which add specific behaviours you can switch on when you need them. That's episode ten.

The article's own summary is a useful rule. Use account instructions for things that should affect everything. Use project instructions for one body of work. Use skills for repeatable ways of producing something.

## Memory: built as you talk

Now memory itself. The Help Center describes it as turning Claude "from a stateless chat interface into a knowledgeable collaborator that builds understanding over time."

Memory is on by default on the Free, Pro and Max plans, on the web, desktop and mobile. On Team and Enterprise plans, an owner decides.

The way it works has changed recently, and the new version is better. Claude saves memory as individual topics as you chat, rather than writing a summary after the conversation ends. The article's example: mention that a deadline moved, and your next conversation already knows. Claude saves on its own, and you can also say "remember this" to save something directly.

What does it remember? The article lists the everyday context of work: your role, your projects, your professional context, the people and places in your work and life, and your communication preferences and working style. It's designed to focus on work. The memory-import article notes that Claude "may not retain imported personal details unrelated to work."

## Memory has walls

Memory isn't one big pool. It has walls, and they're worth knowing.

Each project has its own memory. In a project, Claude uses that project's memory plus your general memory from chats outside projects, but never another project's memory. New memories made in a project are saved to the project. If you want a project to be completely sealed off, there's a "Use account memory" switch on the project page.

Memory is shared between chat and Cowork, but only when Cowork runs in the cloud. Something you mention in a chat is known when you hand Cowork a task, and the other way round. The article's example is asking Cowork to draft an update for your manager: it already knows who that is and how they like updates.

And here's the wall that matters most for us. The app's memory is not Claude Code's memory. Claude Code remembers through files in your repositories, such as CLAUDE.md, AGENTS.md and its own auto-memory. That's Part Four. What you tell Claude in the app doesn't reach your agents in the repositories, and the other way round.

## Pause, reset, or skip one chat

There are three switches for memory, and they do quite different things.

Pause keeps everything Claude already remembers, but stops it from using memory or making new memories. Conversations while paused are never added later.

Reset permanently deletes all memories, including project memories. The article is clear that this can't be undone.

And you can switch memory off for a single chat. In a new chat, before you send the first message, open the plus menu and turn off "Memory". Claude won't use your memory in that chat, and nothing from it is saved. The chat itself stays in your history. You have to do it before the first message: once the chat starts, the setting is locked.

## Incognito is something else

That last switch sounds like incognito mode, but the manual draws a clear line between them.

An incognito chat isn't saved to your chat history, isn't used for memory, and Claude won't find it when searching past chats. It isn't used for training either. But it is retained for thirty days by default, for safety. Once you close it, it's gone from your view and can't be reopened or converted into a normal chat. It's only available outside projects. And it still uses your profile preferences, like your account instructions.

So the rule of thumb is this. Use memory-off when you want a normal chat that simply doesn't learn about you. Use incognito when you don't want the conversation kept in your history at all.

One small caution from the incognito article: if you have the new combined Claude experience, incognito chats open in the older chat experience, so Claude can't create files or run code in them.

## Searching past chats

Related to memory, but separate, is chat search. On paid plans, you can ask Claude to look through your earlier conversations: "what did we discuss about the fringed flags?" or "let's continue where we left off with the pricing." You'll see the search happen as a tool call. Searches cover all chats outside projects, or the chats within one project. You can switch it off in the memory settings.

## Moving memory in and out

Finally, memory can travel. There's an import flow in Settings, then Memory, with a ready-made prompt you paste into another AI service. It asks that service to list everything it has stored about you. You paste the result into Claude, and it's turned into memory entries. The Help Center calls imports "experimental".

To see your memory exactly as Claude sees it, there's a "View and edit" option, or you can simply ask Claude to write out its memories of you word for word. It's worth doing once, just to see.

## What this means for us

Three suggestions.

First, write your account instructions properly, once. Who you are, what your businesses are, that Claudine is your briefing voice, British idiom, and the rules you always want: no hype, sources named, numbers with dates. Every conversation starts better.

Second, keep business knowledge in files, not in memory. Memory is lovely for "Vincent prefers short answers in the morning". But anything an agent must reliably know, like shipping times, prices or the never-send-email rule, belongs in a project knowledge base or a repository file, where it's written down once and checked.

Third, use memory-off for sensitive one-offs. A difficult customer dispute, or a supplier negotiation, is a good case for a chat with memory switched off before the first message. It keeps the chat in your history, but out of Claude's long-term picture of you.

Next time: connectors. How Claude reaches your other tools, why the network matters, and a setting that would help us right away with the image tools we connect.

---

## Sources (not read aloud)

All pages read on 23 October 2026.

- Help Center, Understanding Claude's personalisation features (instructions, project instructions, skills): https://support.claude.com/en/articles/10185728-understanding-claude-s-personalization-features
- Help Center, Use Claude's chat search and memory to build on previous context (how memory is stored, project memory, shared memory with cloud Cowork, pause and reset, memory off for one chat, what Claude remembers, chat search): https://support.claude.com/en/articles/11817273-use-claude-s-chat-search-and-memory-to-build-on-previous-context
- Help Center, Use incognito chats (not saved, 30-day retention, not for training, no projects, profile preferences apply, new-experience limitation): https://support.claude.com/en/articles/12260368-use-incognito-chats
- Help Center, Import and export your memory from Claude (import prompt, "experimental", viewing memory, focus on work topics): https://support.claude.com/en/articles/12123587-import-and-export-your-memory-from-claude
- Help Center, How can I create and manage projects (project memory and the "Use account memory" switch): https://support.claude.com/en/articles/9519177-how-can-i-create-and-manage-projects

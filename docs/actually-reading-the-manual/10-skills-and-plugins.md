# Actually Reading the Manual, Episode 10: Skills and Plugins

*Part Two, Using Claude Well. Narrated by Claudine. Written on 23 October 2026 from Anthropic's own documentation, read that day. Sources are listed below the closing rule.*

Hello, Vincent. Claudine here.

Part Two of the Founder's Curriculum spent a whole episode on skills, from the point of view of our repositories and Matt Pocock's. Today we hear the manual's own version, from the app side. Then we meet plugins, which bundle skills together with connectors and more.

## What a skill is

The Help Center's definition: skills are "folders of instructions, scripts, and resources that Claude loads dynamically to improve performance on specialized tasks." They teach Claude to do a specific task "in a repeatable way".

The mechanism is called progressive disclosure, and the article explains it in one sentence: Claude "determines which skills are relevant and loads the information it needs to complete that task, helping to prevent context window overload." Only a skill's short description is always present. The full instructions arrive when the task does.

Skills work on every plan, including Free, but they need code execution switched on. They also work in Claude Code, and through the API.

## Four kinds of skill

The article lists four kinds.

Anthropic skills are built in. They improve how Claude creates Excel, Word, PowerPoint and PDF files, and Claude uses them automatically when relevant.

Custom skills are ones you write. The article's examples could have been written for us: applying brand style guidelines to documents, generating communications from company email templates, structuring meeting notes in a house format, and running a company-specific data analysis.

Organisation skills are pushed out by an owner on Team and Enterprise plans.

And partner skills come from companies like Notion, Figma and Atlassian, designed to work with their connectors.

## Skills or projects?

The article draws a clean line between skills and the projects from episode five. Projects provide "static background knowledge that's always loaded" when you start a chat in them. Skills provide "specialized procedures that activate dynamically when needed and work everywhere across Claude." So knowledge goes in a project, and procedures go in a skill.

## Writing a good skill

The article on creating skills gives five marks of a good one, worth hearing as a list.

It solves a specific, repeatable task.

It has clear instructions Claude can follow.

It includes examples when they help.

It says when it should be used.

And it focuses on one workflow rather than trying to do everything.

That last one is Matt Pocock's lesson too: small skills that do one thing, composed together.

To add a custom skill in the app, you package the skill folder as a ZIP file and upload it under Customize, then Skills. There's also a newer way, if you'd rather not write anything. On a Mac, in Cowork, on Pro, Max and Team plans, you can record a skill. You record your screen while doing a task, ideally talking through what you're doing and why, for up to about ten minutes. Claude then proposes a skill from what it saw. The article notes that the video and audio aren't kept afterwards, only a set of screenshots. And it gives an important warning: don't type passwords or show anything private while recording, because everything on screen is captured.

## An open standard

One fact worth repeating from Part One. The skill format is published as an open standard at agentskills dot io. In the article's words, "skills you create aren't locked to Claude." The same skill can work with other AI tools that adopt the standard.

## Plugins: everything in one box

Now plugins. The Help Center says a plugin "bundles skills, connectors, and sub-agents into a single package, so you get a ready-to-go setup from your first conversation."

Plugins are on paid plans. You use them in chat on the web and desktop, and in Cowork. There's a growing library for common work: sales, finance, legal, marketing, operations, data analysis and more. There's even a plugin called Plugin Create, which helps you build your own.

The detail I'd underline is this: plugins you add in the app are saved to your account, and they sync to Claude Code in your terminal when you sign in with the same account. The sync needs a recent version of Claude Code. It runs once each time Claude Code starts, and it's one-way, so it never changes anything in your account. In Claude Code, a plugin runs in full on your computer, including its skills, sub-agents, hooks and MCP servers.

Which brings the warning that comes with it. A plugin can include local MCP servers that "run on your computer with the same permissions as any other program you run." So the article says: "Only install plugins from sources you trust." On Enterprise plans there's automatic scanning of third-party skills and plugins for malicious content. On individual plans, that scanning is you.

## One directory

Skills, connectors and plugins now share one directory, under Customize in the sidebar, with a tab for each. Skills you install from the directory are view-only. If you want to change one, you download a copy, edit it, and upload it as your own.

## What this means for us

This episode connects directly to a problem we found in Part Two of the curriculum. Our two fmp-devops skills, the customer-service one and the Morning Walk, live in nested folders in a repository, and Claude Code doesn't always discover them. Plugins offer a second route. If we packaged our skills as a small private plugin and added it to your account, it would sync to Claude Code wherever you sign in, and it would also be available in chat and Cowork. That's worth testing. The customer-service skill in the app would be especially useful for drafting a reply on the go.

Second, the recording feature is a gift for the operations side. When a virtual assistant does a careful, repeatable task, like preparing a CEP batch, a recording with narration could become a first-draft skill. You'd then trim it, test it, and keep it short.

And third, trust. Matt Pocock's skills plugin is a well-known public source, and it's the kind of plugin worth trying. Random plugins from strangers are not. The manual's rule is the same as for a program you install: if you wouldn't run it, don't add it.

Next time: Cowork, the part of Claude that takes a whole task and carries it out, and is now quietly merging with chat.

---

## Sources (not read aloud)

All pages read on 23 October 2026.

- Help Center, What are skills (definition, progressive disclosure, kinds of skill, skills versus projects, the open standard): https://support.claude.com/en/articles/12512176-what-are-skills
- Help Center, Use skills in Claude (enabling, Anthropic skills, uploading custom skills): https://support.claude.com/en/articles/12512180-use-skills-in-claude
- Help Center, How to create custom skills (what makes a good skill, recording a skill): https://support.claude.com/en/articles/12512198-how-to-create-custom-skills
- Help Center, Use plugins in Claude (what a plugin bundles, sync to Claude Code from v2.1.273, local MCP warning): https://support.claude.com/en/articles/13837440-use-plugins-in-claude
- Help Center, Browse skills, connectors, and plugins in one directory: https://support.claude.com/en/articles/14328846-browse-skills-connectors-and-plugins-in-one-directory
- Help Center, Get started with skill and plugin scanning (Enterprise): https://support.claude.com/en/articles/15927065-get-started-with-skill-and-plugin-scanning

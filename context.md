## Frogtober Fest Guidelines and Rules ## 

"""
For years, Frogtoberfest was about making contributions. This year, it’s about creating something of your own.
01
You’ll have about a month to build an open source, AI-powered product of your choice.
02
The catch? Your product has to earn the term “AI-powered.” It should decide, use tools or external systems, hold context, or take action to complete a task.
03
No fixed problem statement. No prescribed domain. Just a meaningful problem worth solving – and the freedom to explore it your way.
04
We’re not counting commits. We’re looking for thoughtful ideas, strong engineering, meaningful open-source contributions, and real-world impact.
How you build it is up to you, but there’s a hard rule on what you build it with. Since it’s open-source and meant to open from end-to-end, only open-source or open-weight AI qualifies (e.g. Llama, Mistral, Qwen, DeepSeek, self-hosted or via a hosted provider).

Proprietary APIs like OpenAI, Claude, or Gemini are discouraged, even for small auxiliary calls. Document what you used, name the model, and disclose exactly where in your code its output gets consumed.

What actually counts as an “open source, AI-powered product”?

The AI has to do real work inside your product, not just talk to the user. A baseline check would be: if you deleted the AI call from your codebase, would the product still do its job? If yes, it doesn’t qualify.

If no, AI is processing, deciding, or acting on something the rest of your system depends on, you’re in.

It’s in the theme—Build with AI. Participants must have an implementation of AI to solve a real problem. Essentially, AI does real work inside the solution: processing, transforming, or reasoning over data as part of the system’s core logic—not just generating a response that gets shown to a user.
The minimum requirements every submission must meet to be eligible for judging:

- **Public GitHub Repository** – source code is public and includes everything needed to run and understand the solution.
- **Documentation** – README, architecture overview, technology details, and limitations/future improvements are all present and complete.
- **Working Demo** – a functional demonstration of the solution and its key capabilities is provided.
- **Demo Video / Presentation** – a short demo showing the problem, solution, workflow, and value.
- **Qualifies as “Build with AI”** – AI processes, transforms, or reasons over data as part of core logic—not just generates a displayed response.
- **AI Usage Disclosure** – a short written statement naming the exact file/function where AI output is consumed programmatically.

### What actually qualifies as AI usage?

Examples of ways AI can be meaningfully integrated into your project, where AI output is processed, consumed, or acted on by another part of the system.

- **Structured extraction** – AI reads unstructured input (docs, logs, tickets, images) and outputs structured data (JSON, fields) that code consumes downstream.
- **Decision / routing logic** – AI classifies or scores something and the system acts differently based on that output, not just shown to a user to decide.
- **Tool / function calling** – AI selects and invokes tools or APIs as part of completing a task, with results fed back in.
- **Multi-step pipeline** – output of one AI call becomes input to another step (AI or non-AI) chaining.
- **RAG / retrieval-grounded reasoning** – AI’s answer is conditioned on data the system retrieved and assembled, not just its training knowledge.
- **Data transformation at scale** – AI processes a batch or stream of records and results are aggregated, diffed, scored, or computed on afterward.

### What doesn’t qualify?

Common approaches that do not meet the “Build with AI” bar, typically where AI only generates an output for a user without driving any further action in the system.

- **Chat UI wrapped around a single system prompt** – output goes straight to the user, nothing downstream consumes it.
- **“Ask AI” button that shows the raw response** – no processing happens after generation.
- **AI used only for the project’s README / marketing copy / demo script** – AI wasn’t part of the product, only the submission artifact.
- **Prompt engineering with no code around it** – if the repo is essentially a system prompt plus an API call, it doesn’t clear the bar.
- **AI bolted onto an already-complete non-AI product** – if deleting the AI call leaves the product fully functional, it fails the core test.
- **Building a reusable skill, prompt library, or tool definition, with nothing using it**– a skill on its own is not consumed by anything. Wiring that skill into an agent or pipeline that actually invokes it to do something that counts.

### How do I set myself apart?

[Munder Difflin](https://github.com/chaitanyagiri/munder-difflin) is a strong reference for what “Build with AI” should look like — even though it’s not itself a hackathon submission, it demonstrates the pattern cleanly.
"""
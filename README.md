# GIT_Hackathon_2026
Matt, Talon, Ashton, Ethan, Jack

## Inspiration
While browsing Reddit, we kept coming across posts from small business owners frustrated by two recurring problems: the lack of an affordable way to track and manage tasks across their team, and the tedious back-and-forth of rewriting the same emails just to chase down missing information. We knew there had to be a better way — and that's where caTASKtrophe was born.

## What It Does
caTASKtrophe turns any incoming business request into a structured, categorized task automatically. Whether it's an email, a typed note from a mechanic, or an HR report, our LLM validates the request against your requirements, follows up if information is missing, and creates a task — no manual work needed. Tier 1 employees can self-assign tasks, Tier 2 managers can delegate, and admins can fully configure departments, categories, and requirements to fit any workflow. Businesses can even export their configuration as a template for others to build on.

## How We Built It
We built caTASKtrophe using FastAPI and Python on the backend, React on the frontend, SQL for our relational database, and the OpenAI SDK to power our LLM workflows.

## Challenges We Ran Into
Time constraints pushed us to constantly prioritize and cut scope. On the technical side, correctly merging incoming requests into already-existing tasks proved tricky, and getting manual responses to reliably send back via email took significant debugging.

## Accomplishments We're Proud Of
We shipped a fully working product. The UI is clean, simple, and intuitive for all user tiers — and the system is flexible enough to work across completely different industries without changing the core product. For a hackathon timeline, we're proud of how far we got.

## What We Learned
We deepened our understanding of working with OpenAI's LLM, managing email systems programmatically, and several of us used FastAPI for the first time — picking it up under pressure and shipping with it.

## What's Next for caTASKtrophe
We're not done. Next up we'd like to integrate tax reporting and payroll systems, polish our import/export functionality, and expand input support to handle phone calls and video — making caTASKtrophe truly the operational backbone for any small business.


## Run Frontend

- cd front-end
- npm install
- npm run dev

## Run Backend
- cd backend
- docker build -t hackathon-backend .                            
- docker compose down -v #Remove old instances
- docker compose up --build


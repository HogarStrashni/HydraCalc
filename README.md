# HydraCalc

This small web application is a comprehensive tool designed to simplify hydraulic engineering tasks associated with water distribution networks and storm/sanitary sewage networks. 

#### Water Distribution Network:

- Pipe Flow Calculations: Determine the flow rates and velocities within the network, ensuring optimal distribution of water resources
- Pressure Drop Analysis: Evaluate pressure variations throughout the network

#### Storm/Sanitary Sewage Network:

- Sewer Flow Calculations: Accurately model sewer flow dynamics to predict system behavior under various conditions
- Pipe Sizing and Capacity Analysis: Determine optimal pipe sizes and capacities to accommodate expected flow rates and prevent overflow or blockages

HydraCalc's authentication system allows users to securely sign in and sign up using email/password credentials (with email verification) or Google OAuth.

## Technologies Used

- **Framework**: [SvelteKit](https://kit.svelte.dev)
- **Database**: [Turso](https://turso.tech) with [Drizzle ORM](https://orm.drizzle.team)
- **Authentication Library**: [Lucia](https://lucia-auth.com)
- **CSS**: [Tailwind CSS](https://tailwindcss.com/) with [shadcn-svelte](https://www.shadcn-svelte.com)
- **Form Validation**: [Zod](https://zod.dev)
- **Form Handling**: [SvelteKit Superforms](https://superforms.rocks)
- **Toast Notifications**: [Svoast](https://svoast.vercel.app)

## Learn More

Take a look at the following resources:

- [Learn Svelte](https://learn.svelte.dev/tutorial/welcome-to-svelte) - an interactive Svelte tutorial.
- [Learn SvelteKit](https://learn.svelte.dev/tutorial/introducing-sveltekit) - an interactive SvelteKit tutorial.
- [The Copenhagen Book](https://thecopenhagenbook.com) - General guideline on implementing auth in web applications.

## Setup

### Prerequisites

- Node.js and pnpm installed on your machine

Copy `env.example` to `.env` and replace the provide correct values for env variables.

### Getting Started

First, install dependencies 

```bash
pnpm i
```

and run the development server:

```bash
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) with your browser to see the result.

## Database migrations

- use `pnpm db:generate` to generate migration files
- use `pnpm db:drop` to undo a migration (select migration in next step)
- use `pnpm db:push` to apply migrations to the database

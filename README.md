# ImLazy app frontend

## Context

ImLazy was at the beggining only a Node.js bot using [Puppeteer](https://github.com/puppeteer/puppeteer) module to invite Workaway members in the area to meetup during my roadtrip in Spain and Portugal.

> **Workaway**: a woofing platform to find hosts and meet other workawayers, see [`workaway.info`](https://www.workaway.info/)

I chosed to make this peronal project evolve with a ReactJs UI in order to make it easier to set bot parameters.
Then I added a console working with websockets to see backend logs (to follow the bot steps).

In the begining of march, I migrated the frontend app to NextJs and Typescript. Currently setting the app up as a SaaS to learn different important aspects of a web app as roles navigation (with protected routes), authentication, OAuth2, SSR, CRUD, clean architecture...

> This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

- First, clone the repo :

```bash
git clone https://github.com/baptistesx/im-lazy-frontend-nextjs
```

- Move into the folder:

```bash
cd im-lazy-frontend-nextjs
```

- Install the dependencies:

```bash
npm install
```

- Dupplicate ".env.dist" file and rename it as ".env.local"
- Ask Baptiste for the environment variables and fill up ".env.local" with received data
- Run the development server:

```bash
npm run dev
```

or

```bash
yarn dev
```

- Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

To stop heroku dyno (app): heroku ps:scale web=0 -a im-lazy-front
To start it: heroku ps:scale web=1 -a im-lazy-front

## With Husky

https://www.codeheroes.fr/2021/10/11/git-lutilisation-des-hooks-avec-husky/
https://www.codeheroes.fr/2020/06/29/git-comment-nommer-ses-branches-et-ses-commits/

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.

- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

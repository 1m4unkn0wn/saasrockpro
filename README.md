# SaasRock Quick Start

- [Installation](#installation)
- [Deployment](#deployment)

### Installation

💿 1) Install the dependencies:

```
npm install
```

💿 2) Duplicate `.env.example` file to &rarr; `.env`.

```
cp .env.example .env
```

💿 3) Set up the minimum variables:

- **`APP_NAME`**: Your app name.
- **`SESSION_SECRET`**: A secret string.
- **`DATABASE_URL`**: This is tied to the database provider at `prisma/schema.prisma` (default is **PostgreSQL**).

💿 4) Create and seed the database:

```
npx prisma migrate dev --name init
🌱  The seed command has been executed.
```

If you get any issues, try pushing the database changes manually, and then seeding:

```
npx prisma db push
npx prisma db seed
```

If for any reason this also fails, run the following commands for a clean install:

```
npm cache clean --force
rm -rf package-lock.json node_modules
npm cache verify
npm install
```

---

By default, the codebase seeds the following data (see `prisma/seed.ts`):

- **1 Admin User**: Email is `admin@email.com` and password is `password`.
- **2 Tenants/Accounts**: _Acme Corp 1_, _Acme Corp 2_.
- **2 App Users**: _john.doe@company.com_ and _luna.davis@company.com_, both with password `password`.

💿 5) Start the application:

```
npm run dev
```

Open [localhost:3000](http://localhost:3000), you'll see the landing page:

![SaasRock Landing Page Hero](https://fkfpovvbvnwgmycklghu.supabase.co/storage/v1/object/public/novel/1734724591768-quickstart-landing-page.png)

## Deployment

- [Deploy to Fly.io](/guides/deploy-fly)
- [Deploy to Vercel](/guides/deploy-vercel)
- [Deploy to AWS Lightsail](/guides/deploy-aws-lightsail)

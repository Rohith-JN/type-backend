# Type - A Modern Typing Test

### Note: This repo contains code for the backend of the site, [frontend](https://github.com/Rohith-JN/type)

![Web 1920 – 1](https://github.com/Rohith-JN/type-backend/assets/78314165/de9a378a-8fee-4eef-9574-73c641879571)

Type is a full-stack web application for testing your typing speed and accuracy. With an intuitive and minimalistic interface, Type offers a natural typing experience, providing real-time feedback on your typing speed and accuracy. The application includes an account system for saving your typing speed history and user-configurable features such as themes.

## Project Structure

```
src
   |-- constants.ts
   |-- data-source.ts
   |-- entities
   |   |-- test.ts
   |   |-- user.ts
   |-- index.ts
   |-- migrations
   |   |-- 1684564075219-migration.ts
   |-- resolvers
   |   |-- test.ts
   |   |-- user.ts
   |-- types.ts
   |-- utils
   |   |-- InputTypes.ts
   |   |-- objectTypes.ts
   |   |-- validate.ts
.env.example
.env
.dockerignore
.gitignore
Dockerfile
README.md
docker-compose.yml
package-lock.json
package.json
tsconfig.json
```

## Setup Project Locally

If you want to test the site locally follow these steps:

**Frontend:**

1) Fork the repository to your GitHub account.
2) Git clone the repo
3) Setup a new project on Firebase
4) Enable authentication in Firebase
5) Enable Email/Password provider
6) Create a `.env.local` file 
7) Copy the variables from `.env.example` file onto `.env.local` file
8) Copy Firebase credentials onto the corresponding values in the `.env.local` file
9) Set the backend PORT of your choice in .env.local `NEXT_PUBLIC_BACKEND_URL` and in `codegen.ts` or stick with the default PORT `4000`
10) Run `npm install`
11) You have successfully setup the Frontend

**Backend**

1) Fork the repository to your GitHub account.
2) Git clone the repo
3) Create a `.env` file 
4) Copy the variables from `.env.example` file onto .env file
5) Set the backend PORT of your choice in .env PORT or stick with the default PORT `4000`
6) Setup PostgreSQL in your machine
7) Import migration: `migration1684564075219` into `src/data-source.ts` add it to `migrations` 
8) Run `npm run migration:run` this will setup the tables in postgres
9) Run `npm install`
10) You have successfully setup the Backend

## Technologies Used
Type is built using a range of modern web technologies, including:

## Frontend

1) React.js
2) Next.js
3) TypeScript
4) Redux
5) Apollo-Graphql
6) Firebase
  
## Backend

1) Node.js
2) Express.js
3) GraphQL
4) URQL
5) TypeORM
6) PostgreSQL
7) Docker
  
## Contributing

If you would like to contribute to Type, you can follow these steps:

1) Fork the repository to your GitHub account.
2) Create a new branch for your changes.
3) Make your changes and test them locally.
4) Push your changes to your forked repository.
5) Create a pull request with a detailed description of your changes and why they are necessary.

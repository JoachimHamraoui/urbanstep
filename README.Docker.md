# Docker Setup for UrbanStep

## Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=urbanstep
DATABASE_URL=postgresql://postgres:password@db:5432/urbanstep

# Next.js Configuration
NODE_ENV=development
```

## Building and running your application

When you're ready, start your application by running:
`docker compose up --build`.

The application will automatically:

1. Wait for the database to be ready
2. Generate the Prisma client
3. Run database migrations
4. Seed the database with initial data
5. Start the development server with hot reloading

## Development Features

- **Hot Reloading**: Changes to your source code in the `src/` directory will be automatically reflected
- **Database Migrations**: Automatically run on container startup
- **Database Seeding**: Automatically run on container startup with TypeScript support
- **Volume Mounting**: Source code, Prisma schema, and configuration files are mounted for live development

## Database Operations

The following npm scripts are available for database operations:

- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed the database
- `npm run db:setup` - Complete database setup (generate + migrate + seed)

## Deploying your application to the cloud

First, build your image, e.g.: `docker build -t myapp .`.
If your cloud uses a different CPU architecture than your development
machine (e.g., you are on a Mac M1 and your cloud provider is amd64),
you'll want to build the image for that platform, e.g.:
`docker build --platform=linux/amd64 -t myapp .`.

Then, push it to your registry, e.g. `docker push myregistry.com/myapp`.

Consult Docker's [getting started](https://docs.docker.com/go/get-started-sharing/)
docs for more detail on building and pushing.

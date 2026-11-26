import { config } from "dotenv";

// Same files Next.js reads, so scripts and the app share one DATABASE_URL.
config({ path: [".env.local", ".env"], quiet: true });

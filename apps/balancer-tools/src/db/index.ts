// import { sql } from "@vercel/postgres";
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from "./schema";

export const db = drizzle(postgres(process.env.DATABASE_URL, { max: 1}), { schema});

// export const db = drizzle(sql, );

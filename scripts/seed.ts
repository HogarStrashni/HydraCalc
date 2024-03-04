import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client/web';

import 'dotenv/config';

// import { pipeTypeTable, type PipeType } from '$lib/database/schema';

// const client = createClient({
// 	url: process.env.TURSO_DATABASE_URL!,
// 	authToken: process.env.TURSO_AUTH_TOKEN
// });

// const db = drizzle(client);

// const pipeData: Array<PipeType> = [
// 	{ material: 'concrete', roughness: 1.5 },
// 	{ material: 'hdpe', roughness: 0.1 }
// ];

// pipeData.forEach(async (pipe) => {
// 	await db.insert(pipeTypeTable).values(pipe);
// });

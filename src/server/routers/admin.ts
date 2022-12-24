import { adminProcedure, router } from '@server/trpc';
import { readFileSync } from 'fs';
import path from 'path';

import { rolesRouter } from './admin/roles';
import { usersRouter } from './admin/users';

const packageJson = JSON.parse(
	readFileSync(path.join(process.cwd(), 'package.json')).toString(),
) as { version: string };

export const adminRouter = router({
	application: adminProcedure.query(() => {
		return {
			version: packageJson.version,
			runtime: {
				name: 'Node.js',
				version: process.version,
				platform: process.platform,
				arch: process.arch,
			},
		};
	}),
	users: usersRouter,
	roles: rolesRouter,
});

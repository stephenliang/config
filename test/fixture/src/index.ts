import { resolvePath } from './paths.js';

export function describeCwd(): string {
  return resolvePath(process.cwd());
}

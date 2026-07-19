import { resolve } from 'node:path';

export function resolvePath(...segments: string[]): string {
  return resolve(...segments);
}

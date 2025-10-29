// Edge runtime entrypoint wrapper
// The runtime expects a predictable entrypoint file (e.g. main.ts).
// This file simply re-exports the default handler from index.ts
export { default } from './index.ts';

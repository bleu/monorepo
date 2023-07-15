/**
 * This configuration is following Rainbowkit Migration Guide to Viem
 * 3. Ensure bundler and polyfill compatibility
 * https://www.rainbowkit.com/docs/migration-guide
 */

import { Buffer } from "buffer";

window.global = window.global ?? window;
window.Buffer = window.Buffer ?? Buffer;
window.process = window.process ?? { env: {} }; // Minimal process polyfill

export {};

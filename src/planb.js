// Public entry for the PlanB library.
// This file intentionally stays tiny so that future multi-entry builds (e.g.,
// ESM + IIFE) can share the same source of truth for exports.
// Import has side-effect of defining the custom element (guarded inside file).
import './PlanB.jsx';

// Re-export the class to allow: import { PlanBWidget } from 'planb';
export { PlanBWidget } from './PlanB.jsx';

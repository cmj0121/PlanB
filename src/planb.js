/**
 * Library entry point.
 * - Keep minimal to simplify multi-build strategies (ESM + IIFE, etc.).
 * - Import side effects define the custom element once.
 */

import "./PlanB.jsx";

export { PlanBWidget } from "./PlanB.jsx";

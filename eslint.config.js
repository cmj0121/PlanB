/**
 * ESLint flat config for PlanB
 * Minimal, fast, framework-agnostic (Lit), modern ESM.
 */

import globals from "globals";
import js from "@eslint/js";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // skip lint the node_modules folder and artifacts
  {
    ignores: ["node_modules/**", "dist/**"],
  },
]);

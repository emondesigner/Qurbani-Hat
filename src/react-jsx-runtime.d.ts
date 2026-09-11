/**
 * Ambient declarations for the `react/jsx-runtime` module.
 *
 * React's own package.json maps `./jsx-runtime` straight to the plain
 * `jsx-runtime.js` file without a `types` / `exports.types` condition, so some
 * TypeScript versions (and IDE/`tsc` combinations) fail to find declarations for
 * it even when `@types/react` is installed. That surfaces as:
 *
 *   - `Could not find a declaration file for module 'react/jsx-runtime'`
 *   - `JSX element implicitly has type 'any' because no interface 'JSX.IntrinsicElements' exists`
 *
 * This shim mirrors `node_modules/@types/react/jsx-runtime.d.ts` so the automatic
 * JSX runtime import always resolves, while preserving full JSX type checking
 * (including `JSX.IntrinsicElements`).
 */
declare module 'react/jsx-runtime' {
  import * as React from 'react';

  export { Fragment, JSX } from 'react';

  /**
   * Create a React element.
   *
   * You should not use this function directly. Use JSX and a transpiler instead.
   */
  export function jsx(
    type: React.ElementType,
    props: unknown,
    key?: React.Key,
  ): React.ReactElement;

  /**
   * Create a React element (with children).
   *
   * You should not use this function directly. Use JSX and a transpiler instead.
   */
  export function jsxs(
    type: React.ElementType,
    props: unknown,
    key?: React.Key,
  ): React.ReactElement;
}
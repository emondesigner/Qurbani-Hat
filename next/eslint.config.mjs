import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

/**
 * ESLint flat configuration.
 *
 * eslint-config-next v16 ships ready-made flat config arrays, so they can be
 * spread directly (the legacy FlatCompat/`extends` route throws a circular
 * structure error with ESLint 9).
 *
 * @type {import("eslint").Linter.Config[]}
 */
const eslintConfig = [
  ...nextVitals,
  ...nextTypeScript,
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "next-env.d.ts",
      "build.log",
      "lint.log",
    ],
  },
];

export default eslintConfig;


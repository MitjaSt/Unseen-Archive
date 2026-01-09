import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import projectStructure from "eslint-plugin-project-structure";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    plugins: {
      "project-structure": projectStructure,
    },
    rules: {
      "project-structure/folder-structure": [
        "warn",
        {
          structure: {
            children: [
              {
                name: "app"
              },
              {
                name: "lib",
                children: [
                  {
                    name: "services"
                  },
                  {
                    name: "store"
                  }
                ]
              },
              {
                name: "public"
              },
              {
                name: ".claude"
              },
              {
                name: ".vscode"
              },
              {
                name: "node_modules"
              }
            ]
          }
        }
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;

# Adding Languages

To add a language to Code Explorer, follow these steps.

## Step 1: Add a logo

Add an SVG logo into the `public/languages/` directory.

## Step 2: Update `src/hooks/use-explorer.ts`

1. Update the `Language` type to contain an entry for the new language.
1. Create a new mode variable that defines the primary parsing mode (such as `jsonMode` or `cssMode`).
1. Update the `Code` type to include an entry for the new language.
1. Create a new options variable that defines the options for the new language (such as `JsonOptions` or `CssOptions`).
1. Update the `ExplorerState` type to include getters and setters for the new language's language options.
1. Update the `useExplorer` variable to include the default options for the new language.

## Step 3: Update `src/lib/const.ts`

1. Import the type for the new language options from `src/hooks/use-explorer.ts`.
1. Add an entry in the `languages` variable for the new language.
1. Export a new variable describing the available modes for the new language (such as `jsonModes` or `cssModes`).
1. Define the default code for the new language (such as `defaultJsonCode` or `defaultCssCode`).
1. Add an entry in the `defaultCode` variable for the new language's default code.
1. Export a variable containing the default options for the new language (such as `defaultJsonOptions` or `defaultCssOptions`).
1. Add an entry to the `esquerySelectorPlaceholder` constant for the new language(must match Language enum), using an appropriate example selector.

## Step 4: Update `src/hooks/use-explorer.ts` (yes, again)

Now import the default options for the new language from `src/lib/const.ts`.

## Step 5: Update `src/components/options.tsx`

1. Import the new language mode type from `src/hooks/use-explorer` (such as `JsonMode` or `CssMode`).
1. Import the available modes for the new language from `src/lib/const.ts` (such as `jsonModes` or `cssModes`).
1. Create an options panel for the new language (such as `JsonPanel` or `CssPanel`).
1. Update the `Panel` variable to use the new options panel.

## Step 6: Update `src/components/editor.tsx`

1. Install the appropriate CodeMirror plugin for the new language.
1. Update the `languageExtensions` variable to include the new language CodeMirror plugin.

## Step 7: Wire the AST

Add a parsing case in `src/hooks/use-ast.ts` for the new language that produces `{ ok: true, ast }`.

import StyleDictionary from 'style-dictionary';
import { register } from '@tokens-studio/sd-transforms';

await register(StyleDictionary, { excludeParentKeys: false });

StyleDictionary.registerFormat({
  name: 'tailwind/theme',
  format: ({ dictionary }) => {
    const theme = {};
    for (const token of dictionary.allTokens) {
      const path = token.path;
      let current = theme;
      for (let i = 0; i < path.length - 1; i++) {
        current[path[i]] = current[path[i]] ?? {};
        current = current[path[i]];
      }
      const lastKey = path[path.length - 1];
      current[lastKey] = token.$value ?? token.value;
    }
    return `// AUTO-GENERATED — do not edit manually
export const theme = ${JSON.stringify(theme, null, 2)} as const;

export type Theme = typeof theme;
`;
  },
});

StyleDictionary.registerFormat({
  name: 'typescript/tokens',
  format: ({ dictionary }) => {
    const tokens = dictionary.allTokens.map((token) => ({
      name: token.name,
      path: token.path.join('.'),
      value: token.$value ?? token.value,
      type: token.$type ?? token.type,
    }));
    return `// AUTO-GENERATED — do not edit manually
export const tokens = ${JSON.stringify(tokens, null, 2)} as const;

export type Token = (typeof tokens)[number];
`;
  },
});

const sd = new StyleDictionary({
  log: { verbosity: 'default' },
  source: ['src/**/*.json'],
  preprocessors: ['tokens-studio'],
  platforms: {
    css: {
      transformGroup: 'tokens-studio',
      transforms: ['name/kebab'],
      buildPath: 'dist/css/',
      files: [
        {
          destination: 'variables.css',
          format: 'css/variables',
          options: {
            outputReferences: true,
          },
        },
      ],
    },
    tailwind: {
      transformGroup: 'tokens-studio',
      transforms: ['name/kebab'],
      buildPath: 'dist/tailwind/',
      files: [
        {
          destination: 'theme.ts',
          format: 'tailwind/theme',
        },
      ],
    },
    ts: {
      transformGroup: 'tokens-studio',
      transforms: ['name/kebab'],
      buildPath: 'dist/ts/',
      files: [
        {
          destination: 'tokens.ts',
          format: 'typescript/tokens',
        },
      ],
    },
  },
});

await sd.buildAllPlatforms();

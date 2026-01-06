import type { StorybookConfig } from "@storybook/react-webpack5";
import path from "path";

const config: StorybookConfig = {
   stories: ["../stories/**/*.stories.@(js|jsx|ts|tsx|mdx)"],
   addons: [
      "@storybook/addon-links",
      "@storybook/addon-essentials",
      "@storybook/addon-interactions",
      {
         name: "@storybook/addon-postcss",
         options: {
            postcssLoaderOptions: {
               implementation: require("postcss"),
            },
         },
      },
   ],
   framework: {
      name: "@storybook/react-webpack5",
      options: {},
   },
   docs: {
      autodocs: "tag",
   },
   typescript: {
      check: false,
      reactDocgen: "react-docgen-typescript",
      reactDocgenTypescriptOptions: {
         shouldExtractLiteralValuesFromEnum: true,
         propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
      },
   },
   babel: async (options) => {
      return {
         ...options,
         presets: [
            ...options.presets,
            [
               "@babel/preset-typescript",
               { isTSX: true, allExtensions: true, onlyRemoveTypeImports: true },
            ],
         ],
      };
   },
   webpackFinal: async (config) => {
      // @repo/ui 패키지 resolve 설정
      config.resolve = config.resolve || {};

      // Alias 설정
      config.resolve.alias = {
         ...config.resolve.alias,
         "@repo/ui": path.resolve(__dirname, "../../packages/ui"),
      };

      // TypeScript 파일 확장자 추가
      config.resolve.extensions = [...(config.resolve.extensions || []), ".ts", ".tsx"];

      // modules에 packages 디렉토리 추가
      config.resolve.modules = [
         ...(config.resolve.modules || []),
         path.resolve(__dirname, "../../packages"),
         path.resolve(__dirname, "../../node_modules"),
      ];

      return config;
   },
};

export default config;

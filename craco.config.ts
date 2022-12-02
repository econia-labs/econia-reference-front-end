import deepMerge from "deepmerge";
import type HtmlWebpackPlugin from "html-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";
import type { Configuration } from "webpack";
import webpack from "webpack";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import WebpackBar from "webpackbar";

module.exports = {
  babel: {
    presets: [
      [
        "@babel/preset-react",
        { runtime: "automatic", importSource: "@emotion/react" },
      ],
    ],
    plugins: [
      "@emotion/babel-plugin",
    ],
  },
  webpack: {
    configure: (config: Configuration) => {
      if (!config.plugins) {
        throw new Error("Webpack config is missing plugins");
      } else if (!config.optimization) {
        throw new Error("Webpack config is missing optimization");
      } else if (!config.module?.rules) {
        throw new Error("Webpack config is missing module.rules");
      }

      const maybeHtmlWebpackPlugin = config.plugins.find(
        (plugin) => plugin.constructor.name === "HtmlWebpackPlugin"
      );
      if (!maybeHtmlWebpackPlugin) {
        throw new Error("Can't find HtmlWebpackPlugin");
      }
      const htmlWebpackPlugin = maybeHtmlWebpackPlugin as HtmlWebpackPlugin;

      config.ignoreWarnings = [/Failed to parse source map/];

      const appInfo = {
        "name": "Econia",
        "title": "Econia",
        "fullName": "Econia",
        "description": "Econia is a protocol that lets anyone in the world trade a digital asset with anyone else in the world, at whatever price they want. More specifically, Econia is an order book, a fundamental financial tool utilized by financial institutions like stock markets, except unlike the New York Stock Exchange or the NASDAQ, Econia is decentralized, open-source, and permissionless.",
        "url": "https://econia.dev",
        "image": "https://econia.dev/logo.png",
        "imageAlt": "Econia",
        "themeColor": "#ffffff",
        "socials": {
          "twitter": "EconiaLabs",
          "medium": "econialabs",
          "github": "econia-labs",
          "discord": "https://discord.com/invite/econia"
        },
        "favicon": "/images/favicon.png",
        "code": "https://github.com/econia-labs",
        "docs": "https://econia.dev"
      };

      config.plugins.unshift(
        new webpack.ProvidePlugin({
          Buffer: ["buffer", "Buffer"],
        })
      );

      config.plugins.unshift(new WebpackBar());

      config.module.rules.push({
        test: /\.m?js/,
        resolve: {
          fallback: { "stream": require.resolve("stream-browserify") },
          fullySpecified: false,
        },
      });

      // solana wallet adapter, ledger need to be transpiled
      config.module.rules.push({
        test: /\.js/,
        loader: require.resolve("babel-loader"),
        include: [/@solana\/wallet-adapter/, /@ledgerhq\/devices/],
      });

      htmlWebpackPlugin.userOptions = deepMerge(htmlWebpackPlugin.userOptions, {
        title: appInfo.title ?? appInfo.name,
        meta: {
          // viewport: "width=device-width, initial-scale=1",
          description: appInfo.description,

          "og:title": appInfo.name,
          "og:site_name": appInfo.name,
          "og:url": appInfo.url,
          "og:description": appInfo.description,
          "og:type": "website",
          "og:image": appInfo.image,

          "twitter:card": "summary_large_image",
          "twitter:site": `@${appInfo.socials.twitter}`,
          "twitter:url": appInfo.url,
          "twitter:title": appInfo.name,
          "twitter:description": appInfo.description,
          "twitter:image": appInfo.image,
          "twitter:image:alt": appInfo.imageAlt,
        },
      });

      // pushing here ensures that the dotenv is loaded
      if (process.env['ANALYZE']) {
        config.plugins.push(
          new BundleAnalyzerPlugin({ analyzerMode: "server" })
        );
      }

      if (process.env['NODE_ENV'] !== "development") {
        config.optimization.minimizer = [
          new TerserPlugin({ terserOptions: { keep_fnames: true } }),
        ];
      }

      return config;
    },
  },
  eslint: {
    enable: false,
  },
  typescript: { enableTypeChecking: false },
};

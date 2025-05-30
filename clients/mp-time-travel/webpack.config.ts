const path = require("path");
const webpack = require("webpack");
require("dotenv").config();

module.exports = {
  entry: "./src/index.tsx",

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    clean: true,
  },

  plugins: [
    new webpack.DefinePlugin({
      "process.env.REACT_APP_SESSION_DEBUGGER_KEY": JSON.stringify(
        process.env.REACT_APP_SESSION_DEBUGGER_KEY
      ),
      "process.env.REACT_APP_SESSION_DEBUGGER_API_BASE_URL": JSON.stringify(
        process.env.REACT_APP_SESSION_DEBUGGER_API_BASE_URL
      ),
      "process.env.REACT_APP_PLATFORM_ENV": JSON.stringify(
        process.env.REACT_APP_PLATFORM_ENV
      ),
      "process.env.REACT_APP_BASE_API_URL": JSON.stringify(
        process.env.REACT_APP_BASE_API_URL
      ),
      "process.env.BASE_API_URL": JSON.stringify(process.env.BASE_API_URL),
    }),
  ],

  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@components": path.resolve(__dirname, "src/components"),
    },
  },

  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              alias: {
                "@": path.resolve(__dirname, "src"),
              },
            },
          },
          {
            loader: "sass-loader",
            options: {
              sassOptions: {
                includePaths: [path.resolve(__dirname, "src")],
              },
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: "asset/resource",
      },
    ],
  },

  compilerOptions: {
    baseUrl: "src",
    paths: {
      "@components/*": ["components/*"],
      "@/*": ["*"],
    },
  },

  devServer: {
    static: path.resolve(__dirname, "dist"),
    port: 3000,
    hot: true,
    open: true,
    historyApiFallback: true,
  },
};

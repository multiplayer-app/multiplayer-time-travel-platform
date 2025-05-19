const path = require("path");
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
      "process.env.REACT_APP_API_BASE_URL": JSON.stringify(
        process.env.REACT_APP_API_BASE_URL
      ),
    }),
  ],

  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },

  module: {
    rules: [
      // TypeScript + JSX
      {
        test: /\.(ts|tsx)$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },

      {
        test: /\.s[ac]ss$/i,
        use: ["style-loader", "css-loader", "sass-loader"],
      },

      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: "asset/resource",
      },
    ],
  },

  devServer: {
    static: path.resolve(__dirname, "dist"),
    port: 3000,
    hot: true,
    open: true,
    historyApiFallback: true,
  },
};

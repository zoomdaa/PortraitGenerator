const { VueLoaderPlugin } = require("vue-loader");
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const autoprefixer = require("autoprefixer");
const htmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = (env) => {
  const isDevEnv = env.NODE_ENV === "development"
  return {
    entry: {
      main: "./src/main.js",
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "[name].[contenthash:8].js",
      chunkFilename: "[name].[contenthash:8].js",
      publicPath: "/"
    },
    target: isDevEnv ? "web" : "browserslist",
    devtool: isDevEnv ? "inline-source-map" : false,
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_module/,
          use: {
            loader: "babel-loader",
          },
        },
        {
          test: /\.vue$/,
          loader: "vue-loader",
        },
        {
          test: /\.(eot|ttf|woff|woff2)(\?\S*)?$/,
          loader: "file-loader",
          options: {
            name: "[name].[contenthash:8].[ext]",
            outputPath: "assets/font",
          },
        },
        {
          test: /\.(png|jpe?g|gif|webm|mp4|svg)$/,
          loader: "file-loader",
          options: {
            name: "[name][contenthash:8].[ext]",
            outputPath: "assets/img",
            esModule: false,
          },
        },
        {
          test: /\.s?css$/,
          use: [
            MiniCssExtractPlugin.loader,
            "css-loader",
            {
              loader: "postcss-loader",
              options: {
                postcssOptions: {
                  plugins: () => [autoprefixer()],
                },
              },
            },
            "sass-loader",
          ],
        },
      ],
    },
    plugins: [
      new VueLoaderPlugin(),
      new MiniCssExtractPlugin({
        filename: isDevEnv ? "[name].css" : "[name].[contenthash:8].css",
        chunkFilename: isDevEnv ? "[name].css" : "[name].[contenthash:8].css",
      }),
      new htmlWebpackPlugin({
        template: path.resolve(__dirname, "public", "index.html"),
        favicon: "./public/favicon.ico",
      }),
      new CleanWebpackPlugin(),
    ],
    resolve: {
      alias: {
        vue$: "vue/dist/vue.runtime.esm.js",
      },
      extensions: ["*", ".js", ".vue", ".json"],
    },
    optimization: {
      moduleIds: "deterministic",
      runtimeChunk: "single",
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            priority: -10,
            chunks: "all",
          },
        },
      },
    },
    devServer: {
      historyApiFallback: true,
      hot: true,
      // open: true,
    },
  };
};

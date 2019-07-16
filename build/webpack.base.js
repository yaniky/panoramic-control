// const path = require('path');
const webpack = require("webpack");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
// const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const env = require("../config");
const tools = require("../config/tools");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const appEnv = tools.filterAppEnv(env);

module.exports = {
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: "vue-loader"
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: "./css/"
                        }
                    },
                    "css-loader",
                    "postcss-loader",
                    "sass-loader"
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            limit: 5000,
                            name: "imgs/[name].[ext]"
                        }
                    },
                    {
                        loader: "image-webpack-loader",
                        options: {
                            mozjpeg: {
                                progressive: true,
                                quality: 65
                            },
                            optipng: {
                                enabled: false
                            },
                            pngquant: {
                                quality: "65-90",
                                speed: 4
                            },
                            gifsicle: {
                                interlaced: false
                            }
                        }
                    }
                ]
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|build|dist|public)/,
                use: {
                    loader: "babel-loader"
                }
            }
        ]
    },
    plugins: [
        new webpack.HashedModuleIdsPlugin(),
        new VueLoaderPlugin(),
        // new CleanWebpackPlugin(),
        new webpack.DefinePlugin(appEnv),
        new MiniCssExtractPlugin({
            filename: "css/[name].[hash].css",
            chunkFilename: "css/[id].[hash].css"
        })
    ]
};
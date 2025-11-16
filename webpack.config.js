const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: {
        main: './js/main.js',
        analytics: './js/analytics.js',
        shop: './js/shop.js',
    },
    output: {
        filename: 'js/[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'images/[name][ext]',
                },
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
            inject: true,
            chunks: ['main'],
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name].[contenthash].css',
        }),
        new CopyPlugin({
            patterns: [
                { from: 'images', to: 'images' },
                { from: 'behandlungen', to: 'behandlungen' },
                { from: 'ueber-uns', to: 'ueber-uns' },
                { from: 'js/env-loader.js', to: 'js/env-loader.js' },
                { from: 'js/supabase-client.js', to: 'js/supabase-client.js' },
                { from: 'js/carousel-fix.js', to: 'js/carousel-fix.js' },
                { from: 'js/menst-animations.js', to: 'js/menst-animations.js' },
                { from: 'js/menst-view-transitions.js', to: 'js/menst-view-transitions.js' },
                { from: 'js/password-gate.js', to: 'js/password-gate.js' },
                { from: 'js/ebook.js', to: 'js/ebook.js' },
            ],
        }),
    ],
    optimization: {
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    compress: {
                        drop_console: true,
                    },
                },
            }),
            new CssMinimizerPlugin(),
        ],
        splitChunks: {
            cacheGroups: {
                styles: {
                    name: 'styles',
                    type: 'css/mini-extract',
                    chunks: 'all',
                    enforce: true,
                },
            },
        },
    },
    performance: {
        hints: 'warning',
        maxEntrypointSize: 512000,
        maxAssetSize: 512000,
    },
};
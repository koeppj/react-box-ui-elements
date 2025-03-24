const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const { IgnorePlugin } = require('webpack');

module.exports = {
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /(node_modules)/,
            },
            {
                test: /\.s?css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css',
        }),
    ]
};
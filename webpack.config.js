const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const { IgnorePlugin } = require('webpack');

module.exports = {
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true
   },    
    resolve: {
        fullySpecified: false,
        extensions: ['.js', '.jsx', '.ts', '.tsx']
    },    
    module: {
        rules: [
            {
                test: /\.(ts|tsx|js|jsx)$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                type: 'asset/resource'
            },            
            {
                test: /\.m?js/,
                resolve: {
                  fullySpecified: false,
                },
            },    
            {
                test: /\.s?css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            sassOptions: {
                                quietDeps: true, // ✅ Suppresses @import deprecation warnings from node_modules
                                includePaths: ['./node_modules'],
                            },
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html'
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
            ignoreOrder: true,
        }),
        new IgnorePlugin({
            resourceRegExp: /moment$/, // Moment is optionally included by Pikaday, but is not needed in our bundle
        }),
    ],
    devServer: {
        static: './dist',
        hot: true,
        open: true,
        historyApiFallback: true,
        port: 3000
    }    
};
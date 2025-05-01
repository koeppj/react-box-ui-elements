const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
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
            // ✅ Handle the Box .ts file using ts-loader
            {
                test: /\.ts$/,
                include: path.resolve(__dirname, 'node_modules/@box/cldr-data'),
                use: {
                  loader: 'ts-loader',
                  options: {
                    allowTsInNodeModules: true,
                    transpileOnly: true,
                    configFile: path.resolve(__dirname, 'tsconfig.box-transpile.json') // ✅ use isolatedModules: false
                  }
                }
            },
            // ✅ Handle your source files with Babel
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
                                quietDeps: true,
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
            resourceRegExp: /moment$/,
        }),
    ],
    ignoreWarnings: [
        {
          module: /@box\/cldr-data/,
          message: /was not found in/
        }
      ],
    devServer: {
        static: './dist',
        hot: true,
        open: true,
        historyApiFallback: true,
        port: 3000
    }
};

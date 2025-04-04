const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true
    },    
    resolve: {
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
                test: /\.s?css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html'
        })        
    ],
    devServer: {
        static: './dist',
        hot: true,
        open: true,
        historyApiFallback: true,
        port: 3000
    }    
};
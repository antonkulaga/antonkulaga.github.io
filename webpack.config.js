const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
    entry: ['babel-polyfill', './src/index.tsx'],
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader'
            }
        },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|woff|woff2|eot|ttf|svg|mp3)$/,
                loader: 'url-loader'
            },
            { test: /\.tsx?$/,
                loader: "ts-loader"
            }
        ]
    },
    output: {
        path: path.resolve(__dirname),
        filename: 'index_bundle.js',
        publicPath: ''
    },
    resolve: {
        extensions: ['*', '.js', '.jsx', '.ts', '.tsx']
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
            favicon: './public/favicon.ico',
            minify: false
        })
    ],
    devServer: {
        port: 8081,
        hot: true,
        //inline: true,
        //quiet: false,
        //noInfo: true,
        //disableHostCheck: true,
        allowedHosts: "all",
        host: (process.env.HOST || '0.0.0.0'),
        open: true,
        static: [
            {
                directory: path.join(__dirname, 'graph'),
                publicPath: "/graph"
            },
            {
                directory: path.join(__dirname, 'media'),
                publicPath: "/media"
            },
            {
                directory: path.join(__dirname, 'public'),
                publicPath: "/public"
            }
        ],
        https: true
    },
};
const path = require("path");
const webpack = require("webpack");
module.exports = {
    entry: "./js/main.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "CLM.bundle.js"
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.$': 'jquery',
            'window.jQuery': 'jquery'
        })
    ]
}
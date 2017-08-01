module.exports = {
    entry:{ 'app': './js/app.jsx' },
    output: {
        filename: 'bundle.js'
    },
    resolve:{
       extensions: ["", ".js", ".jsx"]
    },
    devServer: {
        historyApiFallback: true
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: [/node_modules/],
                loader: "babel-loader",
                query: {
                    presets: ['es2015', 'react', 'stage-0', 'stage-1'],
                    compact: false
                }
            },
	    {
                test: /\.woff2?$|\.ttf$|\.eot$|\.svg$|\.png|\.jpe?g|\.gif$/,
                loader: 'file-loader'
            }
        ]
    }
};

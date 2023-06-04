const path = require('path')

module.exports = {
    mode: 'development',
    entry: {
        tiptapCollab: path.resolve(__dirname, 'src/tiptap-collab.js')
    },
    output: {
        path: path.resolve(__dirname, 'public/js'),
        filename: "bundle.js",
        clean: true
    },
    devServer: {
        static: {
            directory: path.resolve(__dirname, 'dist')
        },
        port: 3001,
        open: true,
        hot: true,
        compress: true,
        historyApiFallback: true,
    }
}
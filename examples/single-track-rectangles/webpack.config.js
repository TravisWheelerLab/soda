module.exports = {
    mode: "development",
    entry: {
        main: __dirname + '/main.js',
    },
    output: {
        filename: '[name].js',
        path: __dirname + '/build'
    }
};

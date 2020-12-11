module.exports = {
    mode: "development",
    entry: {
        main: __dirname + '/js/lines/main.js',
    },
    output: {
        filename: '[name].js',
        path: __dirname + '/build'
    }
};

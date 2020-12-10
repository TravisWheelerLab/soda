module.exports = {
    mode: "development",
    entry: {
        main: __dirname + '/js/main.js',
    },
    output: {
        filename: '[name].js',
        path: __dirname + '/build'
    }
};

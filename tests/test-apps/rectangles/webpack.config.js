module.exports = {
    mode: "development",
    entry: {
        main: __dirname + '/js/rectangles/main.js',
    },
    output: {
        filename: '[name].js',
        path: __dirname + '/build'
    }
};

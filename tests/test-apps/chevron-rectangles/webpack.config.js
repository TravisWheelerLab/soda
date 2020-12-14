module.exports = {
    mode: "development",
    entry: {
        main: __dirname + '/js/chevron-rectangles/main.js',
    },
    output: {
        filename: '[name].js',
        path: __dirname + '/build'
    }
};

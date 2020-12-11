import * as pf from "./puppeteer-functions";

(async () => {
    await pf.saveTrackChartSvgXml('http://http://127.0.0.1:8080/rectangles/', '../tmp/', 'rectangles');
    await pf.saveTrackChartSvgXml('http://http://127.0.0.1:8080/lines/', '../tmp/', 'lines');
})();


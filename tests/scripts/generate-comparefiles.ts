import * as pf from "./puppeteer-functions";

(async () => {
    await pf.saveTrackChartSvgXml('http://[::1]:8080/rectangles/', '../tmp/', 'rectangles');
    await pf.saveTrackChartSvgXml('http://[::1]:8080/lines/', '../tmp/', 'lines');
})();


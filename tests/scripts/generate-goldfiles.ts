import * as pf from './puppeteer-functions'

(async () => {
    await pf.saveTrackChartSvgXml('http://127.0.0.1:8080/rectangles/', '../goldfiles/', 'rectangles');
    await pf.saveTrackChartSvgXml('http://127.0.0.1:8080/lines/', '../goldfiles/', 'lines');
    await pf.saveTrackChartSvgXml('http://127.0.0.1:8080/chevron-rectangles/', '../goldfiles/', 'chevron-rectangles');
    await pf.saveTrackChartSvgXml('http://127.0.0.1:8080/chevron-lines/', '../goldfiles/', 'chevron-lines');
})();



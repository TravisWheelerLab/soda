// import {strict as assert} from 'assert';
import * as pf from './puppeteer-functions'

(async () => {
    await pf.saveTrackChartSvgXml('http://[::1]:8080/rectangles/', '../goldfiles/', 'rectangles');
    await pf.saveTrackChartSvgXml('http://[::1]:8080/lines/', '../goldfiles/', 'lines');
})();



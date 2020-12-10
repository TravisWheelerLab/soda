// import {strict as assert} from 'assert';
import * as puppeteer from 'puppeteer';
import * as fs from 'fs';

(async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    await Promise.all([
        page.goto('http://[::1]:8080/rectangles/index.html'),
        page.waitForNavigation(),
    ]);

    let svgInline= await page.evaluate(() => document.querySelector('div#track-chart>svg')!.outerHTML);
    fs.writeFile('chart-initial.svg', svgInline, ()=> console.log('writ') );

    await page.hover('div#track-chart>svg');
    await page.keyboard.down('Control');
    // @ts-ignore
    await page.mouse.wheel({ deltaY: -1000 });

    svgInline= await page.evaluate(() => document.querySelector('div#track-chart>svg')!.outerHTML);
    fs.writeFile('chart-zoomin.svg', svgInline, ()=> console.log('writ') );

    // @ts-ignore
    await page.mouse.wheel({ deltaY: 1000 });
    svgInline= await page.evaluate(() => document.querySelector('div#track-chart>svg')!.outerHTML);
    fs.writeFile('chart-zoomback.svg', svgInline, ()=> console.log('writ') );

    // await browser.close();
})();

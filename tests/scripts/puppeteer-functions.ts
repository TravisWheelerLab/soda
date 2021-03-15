import * as puppeteer from "puppeteer";
import * as fs from "fs";
import {installMouseHelper} from "./install-mouse-helper";

export async function saveTrackChartSvgXml(url: string, outpath: string, outname: string) {
    let pageX: number = 0;
    let pageY: number = 0;

    // const browser = await puppeteer.launch({headless: false, slowMo: 250});
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();

    await installMouseHelper(page);

    await Promise.all([
        page.goto(url),
        page.waitForNavigation(),
    ]);

    let svgInline = await page.evaluate(() => document.querySelector('div#track-chart>svg')!.outerHTML);
    fs.writeFile(`${outpath}/${outname}-initial.svg`, svgInline, ()=> console.log(`${outpath}/${outname}-initial.svg written`) );

    await page.hover('div#track-chart>svg');
    await page.keyboard.down('Control');
    await page.mouse.wheel({ deltaY: -1000 });

    svgInline= await page.evaluate(() => document.querySelector('div#track-chart>svg')!.outerHTML);
    fs.writeFile(`${outpath}/${outname}-zoomed-in.svg`, svgInline, ()=> console.log(`${outpath}/${outname}-zoomed-in.svg written`) );

    await page.mouse.wheel({ deltaY: 1000 });

    svgInline= await page.evaluate(() => document.querySelector('div#track-chart>svg')!.outerHTML);
    fs.writeFile(`${outpath}/${outname}-initial2.svg`, svgInline, ()=> console.log(`${outpath}/${outname}-initial2.svg written`) );

    await page.mouse.wheel({ deltaY: 1000 });

    svgInline= await page.evaluate(() => document.querySelector('div#track-chart>svg')!.outerHTML);
    fs.writeFile(`${outpath}/${outname}-zoomed-out.svg`, svgInline, ()=> console.log(`${outpath}/${outname}-zoomed-out.svg written`) );

    await page.mouse.wheel({ deltaY: -1000 });

    svgInline= await page.evaluate(() => document.querySelector('div#track-chart>svg')!.outerHTML);
    fs.writeFile(`${outpath}/${outname}-initial3.svg`, svgInline, ()=> console.log(`${outpath}/${outname}-initial3.svg written`) );

    await page.keyboard.up('Control');

    await page.mouse.move(70, 70);
    await page.mouse.down();
    await page.mouse.move(500, 70);

    svgInline= await page.evaluate(() => document.querySelector('div#track-chart>svg')!.outerHTML);
    fs.writeFile(`${outpath}/${outname}-scrolled.svg`, svgInline, ()=> console.log(`${outpath}/${outname}-scrolled.svg written`) );

    await page.mouse.move(70, 70);

    svgInline= await page.evaluate(() => document.querySelector('div#track-chart>svg')!.outerHTML);
    fs.writeFile(`${outpath}/${outname}-initial4.svg`, svgInline, ()=> console.log(`${outpath}/${outname}-initial4.svg written`) );

    await page.mouse.up();

    await browser.close();
}

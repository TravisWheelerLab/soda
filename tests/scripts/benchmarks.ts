import * as puppeteer from "puppeteer";

(async () => {
    const glyphs = ['rect', 'line', 'chevronrect', 'chevronline'];
    const glyphToNum = new Map<string, string>([['rect', '0'], ['line', '1'], ['chevronrect', '3'], ['chevronline', '4']]);
    const glyphCounts = ['100', '1000', '2500', '5000'];

    const browser = await puppeteer.launch({
        headless: false,
        devtools: true,
    });

    for (const glyph of glyphs) {
        for (const n of glyphCounts) {
            const glyphNum = glyphToNum.get(glyph)!;
            const page = await browser.newPage();
            const devtoolsProtocolClient = await page.target().createCDPSession();
            await devtoolsProtocolClient.send('Overlay.setShowFPSCounter', {show: true});
            await Promise.all([
                page.goto('http://[::1]:8080/'),
                page.waitForNavigation(),
            ]);

            await page.evaluate((v) => document.querySelector<HTMLInputElement>('input#n')!.value = v, n);
            await page.evaluate((v) => document.querySelector<HTMLInputElement>('select#glyph')!.value = v, glyphNum);

            await page.click('button#submit');
            await page.waitForSelector('div#done');
            await page.hover('div#track-chart>svg');
            await page.keyboard.down('Control');
            await page.tracing.start({path: `./benchmark-results/${glyph}-${n}.json`, screenshots: true});
            for (let i = 0; i < 500; i++) {
                if (i < 250) {
                    await page.mouse.wheel({deltaY: -10});
                } else {
                    await page.mouse.wheel({deltaY: 10});
                }
            }
            await page.screenshot({path: `./benchmark-results/${glyph}-${n}.png`, type: 'png'});
            await page.tracing.stop();

            await page.close();
        }
    }
    await browser.close();
})();


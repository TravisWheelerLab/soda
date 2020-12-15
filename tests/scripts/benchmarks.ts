import * as puppeteer from "puppeteer";
import {installMouseHelper} from "./install-mouse-helper";

(async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    await installMouseHelper(page);

    await Promise.all([
        page.goto('http://[::1]:8080/'),
        page.waitForNavigation(),
    ]);

    await page.evaluate( () => document.querySelector<HTMLInputElement>('input#n')!.value = '1000');
    await page.click('button#submit');
    await page.waitForSelector('div#done');
    await page.hover('div#track-chart>svg');
    await page.keyboard.down('Control');
    await page.tracing.start({path: 'trace.json', screenshots: true});
    for (let i = 0; i < 100; i++) {
        if (i % 2) {
            await page.mouse.wheel({ deltaY: -1000 });
        }
        else {
            await page.mouse.wheel({ deltaY: 1000 });
        }
    }
    await page.tracing.stop();
    await browser.close();
})();

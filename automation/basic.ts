import {strict as assert} from 'assert';
import * as puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    await Promise.all([
        page.goto('https://wheelerlab.org'),
        page.waitForNavigation(),
    ]);

    await Promise.all([
        page.click('a[href="/people.html"]'),
        page.waitForNavigation(),
    ]);

    let pageTitle = await page.$eval("h1", e => e.innerHTML);
    assert(pageTitle === "Folks in the Wheeler lab");

    await browser.close();
})();

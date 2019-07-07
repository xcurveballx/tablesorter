// UI testing
const assert = require("chai").assert;
const puppeteer = require("puppeteer");
let browser, page,
url = "file:///C:/Users/mine/Desktop/projects/tablesorter/example.html";

// puppeteer options
const opts = {
  headless: false,
  slowMo: 250
};

before(async () => {
  browser = await puppeteer.launch();
  page = await browser.newPage();
});

describe("Tests the table sorting on the page", function() {
    describe("Checks numeric data sorting", function() {
        it("Numeric data sorting in DESC order", async () => {
            await page.goto(url);
            await page.waitForSelector(".example2 .tsTitles .sortable");
            await page.click(".example2 .tsTitles .sortable:nth-of-type(1)");
            await page.waitFor(500);
            let nums = await page.evaluate(() => Array.from(document.querySelectorAll(".example2 .tsGroup tr td:nth-of-type(1)"), td => +td.textContent));
            assert.sameOrderedMembers([8,2,1,16,15,14,13,12,11,10,9,7,6,5,4,3], nums);
        });

        it("Numeric data sorting in ASC order", async () => {
            await page.goto(url);
            await page.waitForSelector(".example2 .tsTitles .sortable");
            await page.click(".example2 .tsTitles .sortable:nth-of-type(1)");
            await page.waitFor(500);
            await page.click(".example2 .tsTitles .sortable:nth-of-type(1)");
            await page.waitFor(500);
            let nums = await page.evaluate(() => Array.from(document.querySelectorAll(".example2 .tsGroup tr td:nth-of-type(1)"), td => +td.textContent));
            assert.sameOrderedMembers([1,2,8,3,4,5,6,7,9,10,11,12,13,14,15,16], nums);
        });
    });

    describe("Checks string data sorting", function() {
        it("String data sorting in DESC order", async () => {
            await page.goto(url);
            await page.waitForSelector(".example2 .tsTitles .sortable");
            await page.click(".example2 .tsTitles .sortable:nth-of-type(2)");
            await page.waitFor(500);
            let strs = await page.evaluate(() => Array.from(document.querySelectorAll(".example2 .tsGroup tr td:nth-of-type(2)"), td => td.textContent));
            assert.sameOrderedMembers(["Spartak","Lokomotiv","CSKA","Zenit","Ural","Ufa","Tom","Terek","Rubin","Rostov","Orenburg","Krylia Sovetov","Krasnodar","Arsenal","Anzhi","Amkar"], strs);
        });

        it("String data sorting in ASC order", async () => {
            await page.goto(url);
            await page.waitForSelector(".example2 .tsTitles .sortable");
            await page.click(".example2 .tsTitles .sortable:nth-of-type(2)");
            await page.waitFor(500);
            await page.click(".example2 .tsTitles .sortable:nth-of-type(2)");
            await page.waitFor(500);
            let strs = await page.evaluate(() => Array.from(document.querySelectorAll(".example2 .tsGroup tr td:nth-of-type(2)"), td => td.textContent));
            assert.sameOrderedMembers(["CSKA","Lokomotiv","Spartak","Amkar","Anzhi","Arsenal","Krasnodar","Krylia Sovetov","Orenburg","Rostov","Rubin","Terek","Tom","Ufa","Ural","Zenit"], strs);
        });
    });
});

after(async () => {
  await browser.close();
});

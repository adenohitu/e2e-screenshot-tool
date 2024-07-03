/**
 * ページスクリーンショットツール
 * 2024/07/03 adenohitu
 * E2E Playwright
 *
 * npm run shot
 * で実行
 * ファイルが/screenshot/commitID/devicenameに保存
 */

import { test, expect } from "@playwright/test";
import path from "path";

interface LinkListType {
  // (文字型のキー):  string
  [index: string]: { name: string };
}

const testRootURL = "http://localhost:8080";

const LinkList: LinkListType = {
  "/": { name: "サイトトップ" },
  "/demopage/demo.html": { name: "デモページ" },
};

const gitID: string = require("child_process")
  .execSync("git rev-parse HEAD")
  .toString()
  .trim();
// const date = new Date()
//   .toJSON()
//   .slice(0, 19)
//   .replace(/-/g, "")
//   .replace(/:/g, "");

const getdata = `${gitID.slice(0, 7)}`;

Object.keys(LinkList).forEach(function (key) {
  test(`get ${LinkList[key].name}`, async ({ page }, testInfo) => {
    const createURL = new URL(key, testRootURL).href;

    const createSavePath = path.join(
      __dirname,
      "../screenshot",
      getdata,
      test.info().project.name,
      key
    );
    // flontのページに移動
    await page.goto(createURL);

    // await page.waitForSelector("body.isAppear");
    await page.evaluate(() => document.fonts.ready);

    const fullImagePath = path.join(
      createSavePath,
      `${LinkList[key].name}.png`
    );
    console.log(`Screenshot:${fullImagePath}`);
    // // fullサイズで画面をスクショ
    await page.emulateMedia({ media: "screen" });
    await page.screenshot({
      path: fullImagePath,
      fullPage: true,
    });
    const pdfPath = path.join(createSavePath, `${LinkList[key].name}.pdf`);
    console.log(`Screenshot:${pdfPath}`);
    if (test.info().project.name == "chromium") {
      // PDFで保存
      await page.emulateMedia({ media: "print" });
      await page.pdf({
        path: pdfPath,
        format: "A4",
        printBackground: true,
        tagged: true,
      });
    }
  });
});

import puppeteer from "puppeteer";
import { getFilingDate } from "./getFilingDate.js";

const getTextFromElement = async (element, page) => {
  var text = await page.evaluate((el) => el.textContent.trim(), element);
  return text;
};

const getCase = async (caseNumber, caseType, caseYear) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  try {
    await page.goto("https://delhihighcourt.nic.in/app/get-case-type-status");
    await page.select("#case_type", caseType.toString());
    await page.waitForSelector("#case_number", { timeout: 2000 });
    await page.type("#case_number", caseNumber.toString());
    await page.select("#case_year", caseYear.toString());
    await page.waitForSelector(".captcha-code", { timeout: 2000 });
    const captcha = await page.evaluate(() => {
      const el = document.querySelector(".captcha-code");
      return el ? el.innerText.trim() : null;
    });
    await page.type("#captchaInput", captcha);
    await page.click("#search");
    const table = await page.waitForSelector("#caseTable");
    const petitionerElement = await page.waitForSelector(
      '::-p-xpath(//*[@id="caseTable"]/tbody/tr/td[3]/text()[1])',
      { timeout: 2000 }
    );
    const respondentElement = await page.waitForSelector(
      '::-p-xpath(//*[@id="caseTable"]/tbody/tr/td[3]/text()[3])',
      { timeout: 2000 }
    );
    if (petitionerElement) {
      var petitioner = await getTextFromElement(petitionerElement, page);
    } else {
    }
    if (respondentElement) {
      var respondent = await getTextFromElement(respondentElement, page);
    } else {
      var respondent = "";
    }
    const nextHearingDateElement = await page.waitForSelector(
      '::-p-xpath(//*[@id="caseTable"]/tbody/tr/td[4]/text()[1])',
      { timeout: 2000 }
    );
    if (nextHearingDateElement) {
      var nextDate = await getTextFromElement(nextHearingDateElement, page);
      nextDate = nextDate.match(/\d{2}\/\d{2}\/\d{4}/)?.[0];
    } else {
      var nextDate = "";
    }
    const lastHearingDateElement = await page.waitForSelector(
      '::-p-xpath(//*[@id="caseTable"]/tbody/tr/td[4]/text()[2])',
      { timeout: 2000 }
    );
    if (lastHearingDateElement) {
      var lastHearingDate = await getTextFromElement(
        lastHearingDateElement,
        page
      );
      lastHearingDate = lastHearingDate.match(/\d{2}\/\d{2}\/\d{4}/)?.[0];
    } else {
      var lastHearingDate = "";
    }
    const ordersPage = await await page.$eval(
      'xpath=//*[@id="caseTable"]/tbody/tr/td[2]/a[2]',
      (el) => el.href
    );
    const page2 = await browser.newPage();
    await page2.goto(ordersPage);

    await page2.waitForSelector("#caseTable", { timeout: 2000 });
    await page2.waitForFunction(
      () => {
        const rows = document.querySelectorAll("#caseTable tbody tr");
        const isDataPresent =
          rows.length > 0 && rows[0].querySelectorAll("td").length > 1;
        const isEmptyMessage =
          (rows.length === 1 && rows[0].textContent.includes("No data")) ||
          rows[0].textContent.includes("No records");

        return isDataPresent || isEmptyMessage;
      },
      { timeout: 2000 }
    );

    const orders = await page2.evaluate(() => {
      const rows = document.querySelectorAll("#caseTable tbody tr");
      const data = [];

      rows.forEach((row) => {
        const linkElement = row.querySelector("td:nth-child(2) a");
        const dateElement = row.querySelector("td:nth-child(3)");

        if (linkElement && dateElement) {
          const href = linkElement.href.trim();
          const date = dateElement.textContent.trim();
          data.push({ orderLink: href, orderDate: date });
        }
      });

      return data;
    });
    await browser.close();
    return {
      petitioner,
      respondent,
      nextDate,
      lastHearingDate,
      orders,
    };
  } catch (err) {
    await browser.close();
    console.error("Puppeteer error:", err.message);
    return { error: "No information found for the given case." };
  }
};

export { getCase };

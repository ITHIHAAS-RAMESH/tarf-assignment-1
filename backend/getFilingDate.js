import axios from "axios";
import * as cheerio from "cheerio";
import qs from "qs";

const getFilingDate = async (caseNumber, caseType, caseYear) => {
  const res = await axios.post(
    "https://dhcmisc.nic.in/pcase/case_history.php",
    qs.stringify({
      ctype: caseType.toString(),
      regno: caseNumber.toString(),
      regyr: caseYear.toString(),
      captcha_code: "5198",
      randomid: "5198",
      Submit: "Submit",
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  console.log(res.data);
  const $ = cheerio.load(res.data);

  const value = $(
    "form > table:nth-of-type(1) tr:nth-of-type(1) td:nth-of-type(5) font"
  )
    .text()
    .trim();
  console.log(value);
  return value;
};

export { getFilingDate };

import puppeteer from "puppeteer-core"; // Update the import

export default async function constructMultiGG(url) {
  const accountNames = await getAccountNames(url);
  if (!Array.isArray(accountNames)) {
    throw new Error("accountNames should be an array of strings");
  }

  if (accountNames.some((name) => typeof name !== "string")) {
    throw new Error("accountNames should be an array of strings");
  }

  if (accountNames.length === 0) {
    throw new Error("accountNames should have at least one element");
  }

  try {
    const multiSearchUrl = `https://www.op.gg/multisearch/euw?summoners=${accountNames.map((name) => encodeURIComponent(name.replace(/ /g, "+"))).join(",")}`;

    if (!multiSearchUrl || typeof multiSearchUrl !== "string") {
      throw new Error("Failed to construct multi search URL");
    }

    return multiSearchUrl;
  } catch (error) {
    throw new Error(`Failed to construct multi search URL: ${error.message}`);
  }
}

async function getAccountNames(url) {
  if (!url) {
    throw new Error("URL is required");
  }

  // Launch a headless browser
  const API_KEY = "2SZrooI5RhwJzkDc61bf60cbe0a435267304b0a5777d875d3";
  const browser = await puppeteer.connect({
    browserWSEndpoint: `wss://chrome.browserless.io?token=${API_KEY}&stealth&proxy=residential&headless=false`,
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  try {
    // Navigate to the URL and wait for the content to load
    await page.goto(url, { waitUntil: "domcontentloaded" });

    // Select elements containing account names
    const accountNameElements = await page.$$(".account.--selected .summoner-name");

    if (!accountNameElements || accountNameElements.length === 0) {
      throw new Error("No account names found on the page");
    }

    // Extract text content from each element
    const names = await Promise.all(accountNameElements.map((nameElement) => nameElement.evaluate((el) => el.textContent)));

    return names;
  } catch (error) {
    throw new Error(`Failed to get account names: ${error.message}`);
  } finally {
    // Close the browser
    await browser.close();
  }
}

// const { url } = await inquirer.prompt([
//     {
//       type: 'input',
//       name: 'url',
//       message: 'Enter LolPros URL:',
//       validate: function(input) {
//         // Optional URL validation
//         return input ? true : 'URL cannot be empty';
//       }
//     }
// ]);

// const accounts = getAccountNames(url).then(names => {
//     constructMultiGG(names);
// });

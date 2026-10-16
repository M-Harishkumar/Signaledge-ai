import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

async function capture() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const executablePath = fs.existsSync(chromePath) ? chromePath : edgePath;

  const outputDir = path.resolve('..', 'SignalEdge_Evidence', 'Screenshots');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log(`Launching browser using: ${executablePath}`);
  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    defaultViewport: { width: 1440, height: 960, deviceScaleFactor: 1.5 },
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();

  async function clickButtonWithText(text: string) {
    const success = await page.evaluate((targetText) => {
      const elements = Array.from(document.querySelectorAll('button, a'));
      const found = elements.find((el) => el.textContent && el.textContent.includes(targetText));
      if (found) {
        (found as HTMLElement).click();
        return true;
      }
      return false;
    }, text);
    return success;
  }

  try {
    console.log('Navigating to root workstation...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 2000));

    // 1. Click Verify-First Research in Sidebar
    console.log('Navigating to Verify-First Research via sidebar...');
    const clickedVF = await clickButtonWithText('Verify-First Research');
    console.log(`Clicked Verify-First Research: ${clickedVF}`);
    await new Promise((r) => setTimeout(r, 2000));
    await page.screenshot({ path: path.join(outputDir, '16_Verify_First_Research.png') });
    console.log('Captured 16_Verify_First_Research.png');

    // 2. Click Settings & Security in Sidebar
    console.log('Navigating to Settings via sidebar...');
    const clickedSettings = await clickButtonWithText('Settings & Security');
    console.log(`Clicked Settings & Security: ${clickedSettings}`);
    await new Promise((r) => setTimeout(r, 1500));

    // Click Academic & Patent Connection Tab
    console.log('Switching to Academic & Patent Connection tab...');
    const clickedPatentTab = await clickButtonWithText('Academic & Patent Connection');
    console.log(`Clicked Academic & Patent Connection tab: ${clickedPatentTab}`);
    await new Promise((r) => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(outputDir, '17_Academic_and_Patent_Disclosure_Settings.png') });
    console.log('Captured 17_Academic_and_Patent_Disclosure_Settings.png');

    // 3. Click Research Company in Sidebar to open Pre-Buy Gate
    console.log('Navigating to Research Company...');
    const clickedResearch = await clickButtonWithText('Research Company');
    console.log(`Clicked Research Company: ${clickedResearch}`);
    await new Promise((r) => setTimeout(r, 2000));

    // Find and click the "Before You Invest Check" button
    console.log('Clicking Before You Invest Check...');
    const clickedGate = await clickButtonWithText('Before You Invest Check');
    console.log(`Clicked Before You Invest Check: ${clickedGate}`);
    await new Promise((r) => setTimeout(r, 2000));
    await page.screenshot({ path: path.join(outputDir, '18_Verify_First_PreBuy_Gate.png') });
    console.log('Captured 18_Verify_First_PreBuy_Gate.png');

    console.log('All Verify-First screenshots successfully updated!');
  } catch (err) {
    console.error('Error during screenshot capture:', err);
  } finally {
    await browser.close();
  }
}

capture().catch(console.error);

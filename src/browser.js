/**
 * Browser Management - Playwright browser instance management
 */

import { chromium } from 'playwright';
import config from '../config.js';

let browser = null;
let context = null;
let page = null;

/**
 * Initialize browser with persistent context (saves login state)
 */
export async function initBrowser() {
  if (browser && context && page) {
    return { browser, context, page };
  }

  console.log('[Browser] Initializing browser...');

  // Use persistent context to save login state
  context = await chromium.launchPersistentContext(config.browser.userDataDir, {
    headless: config.browser.headless,
    viewport: config.browser.viewport,
    args: ['--disable-blink-features=AutomationControlled']
  });

  browser = context;
  page = await context.newPage();

  console.log('[Browser] Browser initialized');
  return { browser, context, page };
}

/**
 * Get current page, create if needed
 */
export async function getPage() {
  if (!page) {
    await initBrowser();
  }
  return page;
}

/**
 * Navigate to Suno create page
 */
export async function navigateToCreate() {
  const p = await getPage();
  console.log('[Browser] Navigating to', config.suno.createUrl);
  await p.goto(config.suno.createUrl, { waitUntil: 'networkidle', timeout: config.timeouts.pageLoad });
  await p.waitForTimeout(2000); // Wait for React to render
  return p;
}

/**
 * Check if logged in (look for user-specific elements)
 */
export async function checkLogin() {
  const p = await getPage();
  await p.goto(config.suno.baseUrl, { waitUntil: 'networkidle', timeout: 30000 });

  // Wait a bit for page to load
  await p.waitForTimeout(2000);

  // Check if we're on login page or create page
  const url = p.url();
  console.log('[Browser] Current URL:', url);

  // If redirected to login page, not logged in
  if (url.includes('/login') || url.includes('/signin') || url.includes('/auth')) {
    return { loggedIn: false, url, reason: 'Redirected to login page' };
  }

  // Check for user-specific elements (profile button, credits, create button, etc.)
  // Suno shows these elements only when logged in
  const selectors = [
    '[data-testid="profile-menu"]',
    '[data-testid="create-button"]',
    'button:has-text("Create")',
    '[class*="credits"]',
    'button:has(img)[class*="avatar"]',
    '[class*="user-menu"]',
    'a[href="/create"]'
  ];

  for (const selector of selectors) {
    try {
      const element = await p.$(selector);
      if (element) {
        console.log('[Browser] Found logged-in element:', selector);
        return { loggedIn: true, url };
      }
    } catch (e) {
      // Continue checking other selectors
    }
  }

  // Check if we can access the create page (requires login)
  await p.goto(config.suno.createUrl, { waitUntil: 'networkidle', timeout: 15000 });
  await p.waitForTimeout(2000);

  const createUrl = p.url();
  if (createUrl.includes('/create') && !createUrl.includes('/login')) {
    console.log('[Browser] Can access create page, logged in');
    return { loggedIn: true, url: createUrl };
  }

  return { loggedIn: false, url: createUrl, reason: 'Cannot access create page' };
}

/**
 * Open login page for manual login
 */
export async function openLoginPage() {
  const p = await getPage();
  console.log('[Browser] Opening login page for manual login...');
  await p.goto(config.suno.baseUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  console.log('[Browser] Please login manually in the browser window');
  console.log('[Browser] Login state will be saved automatically');
  return p;
}

/**
 * Close browser
 */
export async function closeBrowser() {
  if (context) {
    await context.close();
    browser = null;
    context = null;
    page = null;
    console.log('[Browser] Browser closed');
  }
}

export default {
  initBrowser,
  getPage,
  navigateToCreate,
  checkLogin,
  openLoginPage,
  closeBrowser
};
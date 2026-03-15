/**
 * Suno Automation Core - Form filling and song generation logic
 * Ported from suno-copilot/content.js
 */

import { getPage, navigateToCreate } from './browser.js';
import config from '../config.js';
import { createWriteStream, mkdirSync, existsSync } from 'fs';
import { join, basename } from 'path';
import { request } from 'https';

/**
 * Sleep utility
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Set React input value properly (triggers React state updates)
 */
async function setReactInputValue(page, selector, value) {
  await page.evaluate(({ selector, value }) => {
    const element = document.querySelector(selector);
    if (!element) return false;

    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype || window.HTMLTextAreaElement.prototype,
      'value'
    )?.set;

    const nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype,
      'value'
    )?.set;

    const setter = nativeInputValueSetter || nativeTextAreaValueSetter;

    if (setter) {
      setter.call(element, value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
    } else {
      element.value = value;
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }
    return true;
  }, { selector, value });
}

/**
 * Expand More options to reveal all controls
 * IMPORTANT: This is required to enable the Create button
 */
async function expandMoreOptions(page) {
  console.log('[Automation] Expanding More options...');

  // Find and click the "More" button in the create form
  const moreButton = await page.locator('button:has-text("More")').first();

  if (moreButton) {
    try {
      // Check if already expanded by looking for Male/Female buttons
      const genderButtons = await page.locator('button:has-text("Male"), button:has-text("Female")').count();

      if (genderButtons === 0) {
        await moreButton.click();
        await sleep(500);
        console.log('[Automation] More options expanded');
      } else {
        console.log('[Automation] More options already expanded');
      }
      return true;
    } catch (e) {
      console.log('[Automation] Could not expand More options:', e.message);
    }
  }
  return false;
}

/**
 * Select gender for vocals
 * @param {Page} page - Playwright page
 * @param {string} gender - 'male' or 'female'
 */
async function selectGender(page, gender) {
  if (!gender) return true;

  console.log('[Automation] Selecting gender:', gender);

  const genderButton = await page.locator(`button:has-text("${gender.charAt(0).toUpperCase() + gender.slice(1)}")`).first();

  if (genderButton) {
    await genderButton.click();
    await sleep(300);
    console.log('[Automation] Gender selected:', gender);
    return true;
  }

  console.log('[Automation] Gender button not found');
  return false;
}

/**
 * Set slider value
 * @param {Page} page - Playwright page
 * @param {string} sliderName - Name of slider (e.g., 'Style Influence', 'Weirdness')
 * @param {number} value - Value between 0-100
 */
async function setSlider(page, sliderName, value) {
  if (value === undefined || value === null) return true;

  console.log(`[Automation] Setting ${sliderName} slider to ${value}`);

  const slider = await page.locator(`[role="slider"][aria-label="${sliderName}"]`);

  if (slider) {
    // Calculate position (slider width is typically 100%)
    const box = await slider.boundingBox();
    if (box) {
      const x = box.x + (box.width * value / 100);
      const y = box.y + box.height / 2;

      await page.mouse.click(x, y);
      await sleep(300);
      console.log(`[Automation] ${sliderName} set to ${value}`);
      return true;
    }
  }

  console.log(`[Automation] ${sliderName} slider not found`);
  return false;
}

/**
 * Switch to Advanced mode
 */
async function switchToAdvancedMode(page) {
  const advancedButton = await page.$('button:has-text("Advanced"):not([disabled])');
  if (advancedButton) {
    const isActive = await advancedButton.getAttribute('class');
    if (!isActive?.includes('active')) {
      console.log('[Automation] Switching to Advanced mode...');
      await advancedButton.click();
      await sleep(1000);
    } else {
      console.log('[Automation] Already in Advanced mode');
    }
  }
}

/**
 * Fill lyrics textarea
 */
async function fillLyrics(page, lyrics) {
  console.log('[Automation] Filling lyrics...');

  // Try multiple selectors for lyrics input
  const selectors = [
    'textarea[placeholder*="lyrics" i]',
    'textarea[placeholder*="prompt" i]',
    'textarea[placeholder*="instrumental" i]',
    '[data-testid="lyrics-textarea"]'
  ];

  let filled = false;
  for (const selector of selectors) {
    const element = await page.$(selector);
    if (element) {
      await element.click();
      await sleep(200);
      await element.fill(lyrics);
      await sleep(300);
      filled = true;
      console.log('[Automation] Lyrics filled with selector:', selector);
      break;
    }
  }

  if (!filled) {
    // Fallback: find by evaluating all textareas
    const textareaInfo = await page.evaluate(() => {
      const textareas = document.querySelectorAll('textarea');
      return Array.from(textareas).map((ta, i) => ({
        index: i,
        placeholder: ta.placeholder,
        visible: ta.offsetParent !== null
      }));
    });

    console.log('[Automation] Found textareas:', textareaInfo);

    // Find lyrics textarea (usually the one with lyrics-related placeholder)
    const lyricsTextarea = textareaInfo.find(t =>
      t.placeholder?.toLowerCase().includes('lyrics') ||
      t.placeholder?.toLowerCase().includes('prompt') ||
      t.placeholder?.toLowerCase().includes('instrumental')
    );

    if (lyricsTextarea) {
      await page.evaluate((idx) => {
        const ta = document.querySelectorAll('textarea')[idx];
        if (ta) {
          ta.value = arguments[1];
          ta.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }, lyricsTextarea.index, lyrics);
      filled = true;
    }
  }

  return filled;
}

/**
 * Fill style input
 */
async function fillStyle(page, style) {
  console.log('[Automation] Filling style...');

  // Style input is usually the second visible textarea in Advanced mode
  // or a separate input field
  const styleSelectors = [
    'textarea[placeholder*="style" i]',
    '[data-testid="style-input"]',
    'input[placeholder*="style" i]'
  ];

  let filled = false;

  // Try direct selectors first
  for (const selector of styleSelectors) {
    const element = await page.$(selector);
    if (element) {
      await element.click();
      await element.fill(style);
      await sleep(300);
      filled = true;
      console.log('[Automation] Style filled with selector:', selector);
      break;
    }
  }

  if (!filled) {
    // Fallback: find style textarea by position (usually second textarea after lyrics)
    const result = await page.evaluate((styleText) => {
      const textareas = Array.from(document.querySelectorAll('textarea')).filter(t => t.offsetParent !== null);

      // Style is usually the second textarea, and its placeholder doesn't contain "lyrics"
      const styleTextarea = textareas.find(t => {
        const placeholder = t.placeholder?.toLowerCase() || '';
        return !placeholder.includes('lyrics') && !placeholder.includes('prompt') && !placeholder.includes('instrumental');
      });

      if (styleTextarea) {
        styleTextarea.value = styleText;
        styleTextarea.dispatchEvent(new Event('input', { bubbles: true }));
        styleTextarea.dispatchEvent(new Event('change', { bubbles: true }));
        return { success: true, placeholder: styleTextarea.placeholder };
      }
      return { success: false };
    }, style);

    if (result.success) {
      filled = true;
      console.log('[Automation] Style filled, placeholder:', result.placeholder);
    }
  }

  return filled;
}

/**
 * Fill title input
 */
async function fillTitle(page, title) {
  console.log('[Automation] Filling title...');

  const titleSelectors = [
    'input[placeholder*="Song Title" i]',
    'input[placeholder*="Title" i]',
    'input[placeholder*="Optional"]',
    '[data-testid="title-input"]'
  ];

  for (const selector of titleSelectors) {
    const element = await page.$(selector);
    if (element) {
      await element.click();
      await element.fill(title);
      await sleep(300);
      console.log('[Automation] Title filled with selector:', selector);
      return true;
    }
  }

  console.log('[Automation] Title input not found (may be optional)');
  return false;
}

/**
 * Click Create button
 */
async function clickCreateButton(page) {
  console.log('[Automation] Looking for Create button...');

  // Wait for button to become enabled
  let button = null;
  const maxWait = config.timeouts.buttonClick;
  const startTime = Date.now();

  while (!button && Date.now() - startTime < maxWait) {
    const buttons = await page.$$('button');
    for (const btn of buttons) {
      const text = await btn.textContent();
      const isDisabled = await btn.getAttribute('disabled');

      if (text && (text.trim() === 'Create' || text.includes('Create song') || text.includes('Create'))) {
        if (!isDisabled) {
          button = btn;
          break;
        } else {
          console.log('[Automation] Create button found but disabled, waiting...');
        }
      }
    }

    if (!button) {
      await sleep(500);
    }
  }

  if (button) {
    console.log('[Automation] Clicking Create button...');
    await button.click();
    await sleep(1000);
    console.log('[Automation] Create button clicked!');
    return true;
  } else {
    console.error('[Automation] Create button not found or still disabled');
    return false;
  }
}

/**
 * Main function: Generate a song
 * @param {Object} params
 * @param {string} params.lyrics - Lyrics text
 * @param {string} params.style - Style/genre description
 * @param {string} params.title - Song title (optional)
 * @param {boolean} params.autoCreate - Whether to auto-click Create button (default: true)
 * @param {string} params.gender - Vocal gender: 'male' or 'female' (optional)
 * @param {number} params.styleInfluence - Style Influence slider value 0-100 (optional)
 * @param {number} params.weirdness - Weirdness slider value 0-100 (optional)
 * @param {boolean} params.instrumental - Enable instrumental mode (optional)
 */
export async function generateSong({ lyrics, style, title, autoCreate = true, gender, styleInfluence, weirdness, instrumental }) {
  console.log('[Automation] ========== Starting song generation ==========');
  console.log('[Automation] Lyrics length:', lyrics?.length || 0);
  console.log('[Automation] Style:', style);
  console.log('[Automation] Title:', title);
  console.log('[Automation] Auto Create:', autoCreate);
  console.log('[Automation] Gender:', gender);
  console.log('[Automation] Style Influence:', styleInfluence);
  console.log('[Automation] Weirdness:', weirdness);
  console.log('[Automation] Instrumental:', instrumental);

  if (!lyrics || !style) {
    return {
      success: false,
      error: 'Missing required parameters: lyrics and style are required'
    };
  }

  try {
    // Navigate to create page
    const page = await navigateToCreate();
    await sleep(2000);

    // Switch to Advanced mode
    await switchToAdvancedMode(page);
    await sleep(500);

    // IMPORTANT: Expand More options to enable Create button
    await expandMoreOptions(page);
    await sleep(500);

    // Select gender if specified
    if (gender) {
      await selectGender(page, gender);
      await sleep(300);
    }

    // Set sliders if specified
    if (styleInfluence !== undefined) {
      await setSlider(page, 'Style Influence', styleInfluence);
    }
    if (weirdness !== undefined) {
      await setSlider(page, 'Weirdness', weirdness);
    }

    // Enable instrumental mode if specified
    if (instrumental) {
      const instrumentalBtn = await page.locator('button[aria-label="Enable instrumental mode"]');
      if (instrumentalBtn) {
        await instrumentalBtn.click();
        await sleep(300);
        console.log('[Automation] Instrumental mode enabled');
      }
    }

    // Fill form
    const lyricsResult = await fillLyrics(page, lyrics);
    if (!lyricsResult) {
      return { success: false, error: 'Failed to fill lyrics' };
    }

    const styleResult = await fillStyle(page, style);
    if (!styleResult) {
      return { success: false, error: 'Failed to fill style' };
    }

    if (title) {
      await fillTitle(page, title);
    }

    await sleep(500);

    // Click Create if requested
    if (autoCreate) {
      const createResult = await clickCreateButton(page);
      if (!createResult) {
        return { success: false, error: 'Failed to click Create button' };
      }
    }

    console.log('[Automation] ========== Generation complete ==========');

    return {
      success: true,
      message: autoCreate
        ? 'Song generation started! Check the browser for progress.'
        : 'Form filled successfully. Click Create manually to generate.',
      data: { lyrics, style, title, gender, styleInfluence, weirdness, instrumental }
    };

  } catch (error) {
    console.error('[Automation] Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Check current status
 */
export async function getStatus() {
  try {
    const page = await getPage();
    const url = page.url();

    // Check if on create page
    const isCreatePage = url.includes('/create');

    // Check for any active generation
    const generatingIndicator = await page.$('[data-testid="generating"], .generating, [class*="loading"]');

    return {
      success: true,
      status: generatingIndicator ? 'generating' : 'ready',
      currentUrl: url,
      isCreatePage
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

// ============== Batch Processing ==============

/**
 * Batch queue state
 */
let batchQueue = [];
let batchRunning = false;
let batchAbortController = null;

/**
 * Add items to batch queue
 * @param {Object} options
 * @param {Array} options.items - Array of { lyrics, title } - minimal, only what's different
 * @param {Object} options.defaults - Shared config for all items (style, gender, etc.)
 *
 * @example
 * addToQueue({
 *   items: [
 *     { lyrics: "歌词1", title: "歌曲1" },
 *     { lyrics: "歌词2", title: "歌曲2" },
 *     // ... 100首，只需要歌词和标题
 *   ],
 *   defaults: {
 *     style: "Mandopop, male vocals",
 *     gender: "male",
 *     styleInfluence: 50
 *   }
 * })
 */
export function addToQueue({ items, defaults = {} }) {
  const newItems = items.map((item, index) => ({
    id: Date.now() + index,
    lyrics: item.lyrics,
    // 优先使用item自己的配置，没有则用defaults
    style: item.style || defaults.style,
    title: item.title || '',
    autoCreate: item.autoCreate ?? defaults.autoCreate ?? true,
    gender: item.gender ?? defaults.gender,
    styleInfluence: item.styleInfluence ?? defaults.styleInfluence,
    weirdness: item.weirdness ?? defaults.weirdness,
    instrumental: item.instrumental ?? defaults.instrumental,
    status: 'pending',
    addedAt: new Date().toISOString()
  }));

  batchQueue.push(...newItems);
  console.log(`[Batch] Added ${newItems.length} items. Queue size: ${batchQueue.length}`);

  return {
    added: newItems.length,
    queueSize: batchQueue.length,
    items: newItems
  };
}

/**
 * Get queue status
 */
export function getQueueStatus() {
  return {
    total: batchQueue.length,
    pending: batchQueue.filter(i => i.status === 'pending').length,
    completed: batchQueue.filter(i => i.status === 'completed').length,
    failed: batchQueue.filter(i => i.status === 'failed').length,
    running: batchRunning,
    items: batchQueue
  };
}

/**
 * Clear queue
 */
export function clearQueue() {
  batchQueue = [];
  console.log('[Batch] Queue cleared');
  return { success: true, message: 'Queue cleared' };
}

/**
 * Process batch queue
 * @param {Object} options
 * @param {number} options.delaySeconds - Delay between items (default from config)
 * @param {Function} options.onProgress - Callback for progress updates
 */
export async function processBatch({ delaySeconds, onProgress } = {}) {
  if (batchRunning) {
    return { success: false, error: 'Batch already running' };
  }

  const pendingItems = batchQueue.filter(i => i.status === 'pending');
  if (pendingItems.length === 0) {
    return { success: false, error: 'No pending items in queue' };
  }

  batchRunning = true;
  batchAbortController = { aborted: false };
  const delay = delaySeconds || config.batch.defaultDelay;

  console.log(`[Batch] Starting batch processing. ${pendingItems.length} items, ${delay}s delay`);

  let processed = 0;
  let completed = 0;
  let failed = 0;

  for (let i = 0; i < batchQueue.length; i++) {
    // Check for abort
    if (batchAbortController.aborted) {
      console.log('[Batch] Batch aborted by user');
      break;
    }

    const item = batchQueue[i];
    if (item.status !== 'pending') continue;

    console.log(`[Batch] Processing item ${processed + 1}/${pendingItems.length}`);
    item.status = 'processing';

    // Notify progress
    if (onProgress) {
      onProgress({
        current: processed + 1,
        total: pendingItems.length,
        item: item,
        status: 'processing'
      });
    }

    try {
      const result = await generateSong({
        lyrics: item.lyrics,
        style: item.style,
        title: item.title,
        autoCreate: item.autoCreate,
        gender: item.gender,
        styleInfluence: item.styleInfluence,
        weirdness: item.weirdness,
        instrumental: item.instrumental
      });

      if (result.success) {
        item.status = 'completed';
        completed++;
        console.log(`[Batch] Item ${processed + 1} completed`);
      } else {
        item.status = 'failed';
        item.error = result.error;
        failed++;
        console.error(`[Batch] Item ${processed + 1} failed:`, result.error);
      }
    } catch (error) {
      item.status = 'failed';
      item.error = error.message;
      failed++;
      console.error(`[Batch] Item ${processed + 1} error:`, error);
    }

    processed++;

    // Notify completion
    if (onProgress) {
      onProgress({
        current: processed,
        total: pendingItems.length,
        item: item,
        status: item.status
      });
    }

    // Wait before next item (except for last item)
    if (processed < pendingItems.length && !batchAbortController.aborted) {
      console.log(`[Batch] Waiting ${delay} seconds before next item...`);
      await sleep(delay * 1000);
    }
  }

  batchRunning = false;
  batchAbortController = null;

  console.log(`[Batch] Batch complete. Processed: ${processed}, Completed: ${completed}, Failed: ${failed}`);

  return {
    success: true,
    processed,
    completed,
    failed,
    queue: batchQueue
  };
}

/**
 * Stop batch processing
 */
export function stopBatch() {
  if (!batchRunning) {
    return { success: false, error: 'No batch running' };
  }

  batchAbortController.aborted = true;
  console.log('[Batch] Stop requested');
  return { success: true, message: 'Batch stop requested' };
}

// ============== Download Functions ==============

/**
 * Download a single song
 * @param {Object} options
 * @param {string} options.uuid - Song UUID
 * @param {string} options.format - 'mp3' or 'wav' (wav requires premium)
 * @param {string} options.outputDir - Output directory (optional, uses config default)
 * @param {string} options.title - Song title for filename (optional)
 * @returns {Promise<{success: boolean, path?: string, error?: string}>}
 */
export async function downloadSong({ uuid, format = 'mp3', outputDir, title }) {
  if (!uuid) {
    return { success: false, error: 'Song UUID is required' };
  }

  const actualFormat = format || config.download.defaultFormat;
  const actualOutputDir = outputDir || config.download.outputDir;

  // Create output directory if not exists
  if (!existsSync(actualOutputDir)) {
    mkdirSync(actualOutputDir, { recursive: true });
  }

  // Build CDN URL
  const cdnUrl = `${config.download.cdnBaseUrl}/${uuid}.${actualFormat}`;

  // Build filename
  const safeTitle = title ? title.replace(/[^a-zA-Z0-9\u4e00-\u9fa5_-]/g, '_') : uuid;
  const filename = `${safeTitle}.${actualFormat}`;
  const filePath = join(actualOutputDir, filename);

  console.log(`[Download] Downloading song ${uuid} as ${actualFormat}...`);
  console.log(`[Download] URL: ${cdnUrl}`);
  console.log(`[Download] Output: ${filePath}`);

  return new Promise((resolve) => {
    const file = createWriteStream(filePath);

    request(cdnUrl, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`[Download] Successfully downloaded: ${filePath}`);
          resolve({ success: true, path: filePath, uuid, format: actualFormat });
        });
      } else if (response.statusCode === 403) {
        file.close();
        // Delete empty file
        require('fs').unlinkSync(filePath);
        console.log(`[Download] 403 Forbidden - format may require premium: ${actualFormat}`);
        resolve({
          success: false,
          error: `Format '${actualFormat}' requires premium membership (403 Forbidden)`,
          uuid
        });
      } else {
        file.close();
        require('fs').unlinkSync(filePath);
        console.log(`[Download] Failed with status ${response.statusCode}`);
        resolve({
          success: false,
          error: `Download failed with status ${response.statusCode}`,
          uuid
        });
      }
    }).on('error', (err) => {
      file.close();
      require('fs').unlinkSync(filePath);
      console.error(`[Download] Error:`, err.message);
      resolve({ success: false, error: err.message, uuid });
    }).end();
  });
}

/**
 * Download multiple songs
 * @param {Object} options
 * @param {Array<{uuid: string, title?: string}>} options.items - Array of songs to download
 * @param {string} options.format - 'mp3' or 'wav'
 * @param {string} options.outputDir - Output directory
 * @param {Function} options.onProgress - Progress callback
 * @param {number} options.concurrency - Number of concurrent downloads (default: 3)
 * @returns {Promise<{success: boolean, results: Array, completed: number, failed: number}>}
 */
export async function downloadBatch({ items, format = 'mp3', outputDir, onProgress, concurrency = 3 }) {
  if (!items || !Array.isArray(items) || items.length === 0) {
    return { success: false, error: 'No items to download', results: [], completed: 0, failed: 0 };
  }

  console.log(`[Download] Starting batch download. ${items.length} items, concurrency: ${concurrency}`);

  const results = [];
  let completed = 0;
  let failed = 0;

  // Process in batches with concurrency control
  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, Math.min(i + concurrency, items.length));

    const batchResults = await Promise.all(
      batch.map(async (item, batchIndex) => {
        const index = i + batchIndex;
        const result = await downloadSong({
          uuid: item.uuid,
          format,
          outputDir,
          title: item.title
        });

        if (onProgress) {
          onProgress({
            current: index + 1,
            total: items.length,
            item,
            result
          });
        }

        return result;
      })
    );

    results.push(...batchResults);

    // Count results
    for (const result of batchResults) {
      if (result.success) {
        completed++;
      } else {
        failed++;
      }
    }
  }

  console.log(`[Download] Batch complete. Completed: ${completed}, Failed: ${failed}`);

  return {
    success: true,
    results,
    completed,
    failed,
    total: items.length
  };
}

/**
 * Download song with image (cover art)
 * @param {Object} options
 * @param {string} options.uuid - Song UUID
 * @param {string} options.format - Audio format
 * @param {string} options.outputDir - Output directory
 * @param {string} options.title - Song title for filename
 * @param {boolean} options.includeImage - Whether to download cover image
 * @returns {Promise<{success: boolean, audioPath?: string, imagePath?: string, error?: string}>}
 */
export async function downloadSongWithImage({ uuid, format = 'mp3', outputDir, title, includeImage = true }) {
  const audioResult = await downloadSong({ uuid, format, outputDir, title });

  if (!audioResult.success || !includeImage) {
    return audioResult;
  }

  // Download image
  const actualOutputDir = outputDir || config.download.outputDir;
  const safeTitle = title ? title.replace(/[^a-zA-Z0-9\u4e00-\u9fa5_-]/g, '_') : uuid;
  const imageFilename = `${safeTitle}.jpeg`;
  const imagePath = join(actualOutputDir, imageFilename);
  const imageUrl = `${config.download.imageCdnBaseUrl}/image_large_${uuid}.jpeg`;

  console.log(`[Download] Downloading image: ${imageUrl}`);

  return new Promise((resolve) => {
    const imageFile = createWriteStream(imagePath);

    request(imageUrl, (response) => {
      if (response.statusCode === 200) {
        response.pipe(imageFile);
        imageFile.on('finish', () => {
          imageFile.close();
          console.log(`[Download] Image downloaded: ${imagePath}`);
          resolve({
            success: true,
            audioPath: audioResult.path,
            imagePath,
            uuid,
            format
          });
        });
      } else {
        imageFile.close();
        require('fs').unlinkSync(imagePath);
        console.log(`[Download] Image download failed, but audio succeeded`);
        resolve({
          success: true,
          audioPath: audioResult.path,
          imagePath: null,
          uuid,
          format
        });
      }
    }).on('error', () => {
      imageFile.close();
      require('fs').unlinkSync(imagePath);
      resolve({
        success: true,
        audioPath: audioResult.path,
        imagePath: null,
        uuid,
        format
      });
    }).end();
  });
}

/**
 * Get download queue status (for batch downloads)
 */
let downloadQueue = [];
let downloadRunning = false;
let downloadAbortController = null;

export function addToDownloadQueue({ items, format = 'mp3', outputDir }) {
  const newItems = items.map((item, index) => ({
    id: Date.now() + index,
    uuid: item.uuid,
    title: item.title || '',
    format: item.format || format,
    outputDir: item.outputDir || outputDir || config.download.outputDir,
    status: 'pending',
    addedAt: new Date().toISOString()
  }));

  downloadQueue.push(...newItems);
  console.log(`[Download] Added ${newItems.length} items. Queue size: ${downloadQueue.length}`);

  return {
    added: newItems.length,
    queueSize: downloadQueue.length,
    items: newItems
  };
}

export function getDownloadQueueStatus() {
  return {
    total: downloadQueue.length,
    pending: downloadQueue.filter(i => i.status === 'pending').length,
    completed: downloadQueue.filter(i => i.status === 'completed').length,
    failed: downloadQueue.filter(i => i.status === 'failed').length,
    running: downloadRunning,
    items: downloadQueue
  };
}

export function clearDownloadQueue() {
  downloadQueue = [];
  console.log('[Download] Queue cleared');
  return { success: true, message: 'Download queue cleared' };
}

export async function processDownloadBatch({ concurrency, onProgress } = {}) {
  if (downloadRunning) {
    return { success: false, error: 'Download batch already running' };
  }

  const pendingItems = downloadQueue.filter(i => i.status === 'pending');
  if (pendingItems.length === 0) {
    return { success: false, error: 'No pending items in download queue' };
  }

  downloadRunning = true;
  downloadAbortController = { aborted: false };

  console.log(`[Download] Starting batch download processing. ${pendingItems.length} items`);

  let processed = 0;
  let completed = 0;
  let failed = 0;

  for (let i = 0; i < downloadQueue.length; i++) {
    if (downloadAbortController.aborted) {
      console.log('[Download] Batch aborted by user');
      break;
    }

    const item = downloadQueue[i];
    if (item.status !== 'pending') continue;

    item.status = 'processing';

    if (onProgress) {
      onProgress({
        current: processed + 1,
        total: pendingItems.length,
        item,
        status: 'processing'
      });
    }

    const result = await downloadSong({
      uuid: item.uuid,
      format: item.format,
      outputDir: item.outputDir,
      title: item.title
    });

    if (result.success) {
      item.status = 'completed';
      item.path = result.path;
      completed++;
    } else {
      item.status = 'failed';
      item.error = result.error;
      failed++;
    }

    processed++;

    if (onProgress) {
      onProgress({
        current: processed,
        total: pendingItems.length,
        item,
        status: item.status
      });
    }
  }

  downloadRunning = false;
  downloadAbortController = null;

  console.log(`[Download] Batch complete. Processed: ${processed}, Completed: ${completed}, Failed: ${failed}`);

  return {
    success: true,
    processed,
    completed,
    failed,
    queue: downloadQueue
  };
}

export function stopDownloadBatch() {
  if (!downloadRunning) {
    return { success: false, error: 'No download batch running' };
  }

  downloadAbortController.aborted = true;
  console.log('[Download] Stop requested');
  return { success: true, message: 'Download batch stop requested' };
}

export default {
  generateSong,
  getStatus,
  addToQueue,
  getQueueStatus,
  clearQueue,
  processBatch,
  stopBatch,
  // Download functions
  downloadSong,
  downloadBatch,
  downloadSongWithImage,
  addToDownloadQueue,
  getDownloadQueueStatus,
  clearDownloadQueue,
  processDownloadBatch,
  stopDownloadBatch
};
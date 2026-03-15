/**
 * HTTP Server Implementation
 * REST API for Suno automation
 */

import express from 'express';
import { generateSong, getStatus, addToQueue, getQueueStatus, clearQueue, processBatch, stopBatch, downloadSong, downloadBatch, downloadSongWithImage, addToDownloadQueue, getDownloadQueueStatus, clearDownloadQueue, processDownloadBatch, stopDownloadBatch } from './suno-automation.js';
import { checkLogin, openLoginPage, closeBrowser } from './browser.js';
import config from '../config.js';

const app = express();
app.use(express.json());

/**
 * POST /generate
 * Generate a song with lyrics, style, and optional title
 */
app.post('/generate', async (req, res) => {
  console.log('[HTTP] POST /generate');
  console.log('[HTTP] Body:', JSON.stringify(req.body, null, 2));

  const { lyrics, style, title, autoCreate = true } = req.body;

  if (!lyrics || !style) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: lyrics and style are required'
    });
  }

  const result = await generateSong({ lyrics, style, title, autoCreate });
  res.json(result);
});

/**
 * GET /status
 * Check current status
 */
app.get('/status', async (req, res) => {
  console.log('[HTTP] GET /status');

  const loginStatus = await checkLogin();
  const status = await getStatus();

  res.json({
    success: true,
    login: loginStatus,
    automation: status
  });
});

/**
 * POST /login
 * Open login page for manual login
 */
app.post('/login', async (req, res) => {
  console.log('[HTTP] POST /login');

  await openLoginPage();

  res.json({
    success: true,
    message: 'Browser opened. Please login manually. Login state will be saved automatically.'
  });
});

/**
 * POST /close
 * Close browser
 */
app.post('/close', async (req, res) => {
  console.log('[HTTP] POST /close');

  await closeBrowser();

  res.json({
    success: true,
    message: 'Browser closed'
  });
});

/**
 * Health check
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============== Batch Endpoints ==============

/**
 * POST /batch/add
 * Add items to batch queue
 */
app.post('/batch/add', (req, res) => {
  console.log('[HTTP] POST /batch/add');
  console.log('[HTTP] Body:', JSON.stringify(req.body, null, 2));

  const { items, defaults = {} } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Missing required field: items (array with at least 1 item)'
    });
  }

  const result = addToQueue({ items, defaults });
  res.json({ success: true, ...result });
});

/**
 * GET /batch/status
 * Get batch queue status
 */
app.get('/batch/status', (req, res) => {
  console.log('[HTTP] GET /batch/status');
  const result = getQueueStatus();
  res.json({ success: true, ...result });
});

/**
 * POST /batch/start
 * Start batch processing
 */
app.post('/batch/start', async (req, res) => {
  console.log('[HTTP] POST /batch/start');

  const { delaySeconds } = req.body;
  const status = getQueueStatus();

  if (status.running) {
    return res.status(400).json({
      success: false,
      error: 'Batch already running'
    });
  }

  if (status.pending === 0) {
    return res.status(400).json({
      success: false,
      error: 'No pending items in queue'
    });
  }

  // Run batch in background
  processBatch({ delaySeconds }).then(result => {
    console.log('[HTTP] Batch completed:', result);
  }).catch(error => {
    console.error('[HTTP] Batch error:', error);
  });

  res.json({
    success: true,
    message: `Batch started. ${status.pending} items in queue.`,
    delaySeconds: delaySeconds || config.batch.defaultDelay
  });
});

/**
 * POST /batch/stop
 * Stop batch processing
 */
app.post('/batch/stop', (req, res) => {
  console.log('[HTTP] POST /batch/stop');
  const result = stopBatch();
  res.json(result);
});

/**
 * POST /batch/clear
 * Clear batch queue
 */
app.post('/batch/clear', (req, res) => {
  console.log('[HTTP] POST /batch/clear');
  const result = clearQueue();
  res.json(result);
});

// ============== Download Endpoints ==============

/**
 * POST /download
 * Download a single song by UUID
 */
app.post('/download', async (req, res) => {
  console.log('[HTTP] POST /download');
  console.log('[HTTP] Body:', JSON.stringify(req.body, null, 2));

  const { uuid, format, title, outputDir, includeImage } = req.body;

  if (!uuid) {
    return res.status(400).json({
      success: false,
      error: 'Missing required field: uuid'
    });
  }

  let result;
  if (includeImage) {
    result = await downloadSongWithImage({ uuid, format, outputDir, title, includeImage: true });
  } else {
    result = await downloadSong({ uuid, format, outputDir, title });
  }

  res.json(result);
});

/**
 * POST /download/batch
 * Download multiple songs at once
 */
app.post('/download/batch', async (req, res) => {
  console.log('[HTTP] POST /download/batch');
  console.log('[HTTP] Body:', JSON.stringify(req.body, null, 2));

  const { items, format, outputDir, concurrency } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Missing required field: items (array with at least 1 item, each with uuid)'
    });
  }

  // Validate all items have uuid
  const missingUuid = items.find(item => !item.uuid);
  if (missingUuid) {
    return res.status(400).json({
      success: false,
      error: 'Each item must have a uuid'
    });
  }

  const result = await downloadBatch({ items, format, outputDir, concurrency });
  res.json(result);
});

/**
 * POST /download/queue/add
 * Add items to download queue
 */
app.post('/download/queue/add', (req, res) => {
  console.log('[HTTP] POST /download/queue/add');
  console.log('[HTTP] Body:', JSON.stringify(req.body, null, 2));

  const { items, format, outputDir } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Missing required field: items (array with at least 1 item, each with uuid)'
    });
  }

  const result = addToDownloadQueue({ items, format, outputDir });
  res.json({ success: true, ...result });
});

/**
 * GET /download/queue/status
 * Get download queue status
 */
app.get('/download/queue/status', (req, res) => {
  console.log('[HTTP] GET /download/queue/status');
  const result = getDownloadQueueStatus();
  res.json({ success: true, ...result });
});

/**
 * POST /download/queue/start
 * Start download queue processing
 */
app.post('/download/queue/start', (req, res) => {
  console.log('[HTTP] POST /download/queue/start');

  const { concurrency } = req.body;
  const status = getDownloadQueueStatus();

  if (status.running) {
    return res.status(400).json({
      success: false,
      error: 'Download queue already running'
    });
  }

  if (status.pending === 0) {
    return res.status(400).json({
      success: false,
      error: 'No pending items in download queue'
    });
  }

  // Run download batch in background
  processDownloadBatch({ concurrency }).then(result => {
    console.log('[HTTP] Download batch completed:', result);
  }).catch(error => {
    console.error('[HTTP] Download batch error:', error);
  });

  res.json({
    success: true,
    message: `Download batch started. ${status.pending} items in queue.`,
    concurrency: concurrency || 3
  });
});

/**
 * POST /download/queue/stop
 * Stop download queue processing
 */
app.post('/download/queue/stop', (req, res) => {
  console.log('[HTTP] POST /download/queue/stop');
  const result = stopDownloadBatch();
  res.json(result);
});

/**
 * POST /download/queue/clear
 * Clear download queue
 */
app.post('/download/queue/clear', (req, res) => {
  console.log('[HTTP] POST /download/queue/clear');
  const result = clearDownloadQueue();
  res.json(result);
});

/**
 * Start HTTP server
 */
export function startHttpServer() {
  const { port, host } = config.server;

  app.listen(port, host, () => {
    console.log(`[HTTP] Server running at http://${host}:${port}`);
    console.log('[HTTP] Available endpoints:');
    console.log('  POST /generate     - Generate a song');
    console.log('  GET  /status       - Check status');
    console.log('  POST /login        - Open login page');
    console.log('  POST /close        - Close browser');
    console.log('  GET  /health       - Health check');
    console.log('');
    console.log('  Batch endpoints:');
    console.log('  POST /batch/add    - Add items to queue');
    console.log('  GET  /batch/status - Get queue status');
    console.log('  POST /batch/start  - Start batch processing');
    console.log('  POST /batch/stop   - Stop batch processing');
    console.log('  POST /batch/clear  - Clear queue');
    console.log('');
    console.log('  Download endpoints:');
    console.log('  POST /download             - Download single song by UUID');
    console.log('  POST /download/batch       - Batch download multiple songs');
    console.log('  POST /download/queue/add   - Add to download queue');
    console.log('  GET  /download/queue/status - Get download queue status');
    console.log('  POST /download/queue/start - Start download queue processing');
    console.log('  POST /download/queue/stop  - Stop download queue processing');
    console.log('  POST /download/queue/clear - Clear download queue');
  });
}

export default { startHttpServer };
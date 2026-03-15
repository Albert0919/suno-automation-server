/**
 * Suno Automation Server Configuration
 */

export const config = {
  // Suno URLs
  suno: {
    baseUrl: 'https://suno.com',
    createUrl: 'https://suno.com/create',
    loginUrl: 'https://suno.com/login'
  },

  // Browser settings
  browser: {
    headless: false, // Set to true after login is saved
    userDataDir: './browser-data', // Persist cookies and login state
    viewport: { width: 1280, height: 800 }
  },

  // HTTP Server settings
  server: {
    port: 3456,
    host: 'localhost'
  },

  // Timeouts (in ms)
  timeouts: {
    pageLoad: 30000,
    elementWait: 10000,
    formFill: 5000,
    buttonClick: 5000
  },

  // Batch settings
  batch: {
    defaultDelay: 60, // seconds between items
    minDelay: 5,
    maxDelay: 300
  },

  // Download settings
  download: {
    outputDir: './downloads', // Default download directory
    formats: ['mp3', 'wav'], // Supported formats (wav requires premium)
    defaultFormat: 'mp3',
    cdnBaseUrl: 'https://cdn1.suno.ai',
    imageCdnBaseUrl: 'https://cdn2.suno.ai'
  }
};

export default config;
/**
 * Suno Automation Server - Entry Point
 *
 * Supports two modes:
 * 1. MCP Server (default) - For Claude Code integration
 * 2. HTTP Server - For general API access
 *
 * Usage:
 *   node src/index.js          # Start MCP server (default)
 *   node src/index.js --mcp    # Start MCP server
 *   node src/index.js --http   # Start HTTP server
 *   node src/index.js --login  # Open login page only
 */

import { startMcpServer } from './mcp-server.js';
import { startHttpServer } from './http-server.js';
import { openLoginPage, closeBrowser } from './browser.js';

const args = process.argv.slice(2);

async function main() {
  console.log('='.repeat(50));
  console.log('Suno Automation Server v1.0.0');
  console.log('='.repeat(50));

  // Parse arguments
  const mode = args[0] || '--mcp';

  switch (mode) {
    case '--mcp':
      console.log('[Main] Starting in MCP mode...');
      console.log('[Main] This server will be called by Claude Code');
      await startMcpServer();
      break;

    case '--http':
      console.log('[Main] Starting in HTTP mode...');
      startHttpServer();
      // Keep process alive
      process.on('SIGINT', async () => {
        console.log('\n[Main] Shutting down...');
        await closeBrowser();
        process.exit(0);
      });
      break;

    case '--login':
      console.log('[Main] Opening login page...');
      await openLoginPage();
      console.log('[Main] Please login in the browser window');
      console.log('[Main] Press Ctrl+C when done');
      // Keep process alive
      process.on('SIGINT', async () => {
        console.log('\n[Main] Closing browser...');
        await closeBrowser();
        process.exit(0);
      });
      break;

    case '--help':
    case '-h':
      console.log(`
Usage:
  node src/index.js [options]

Options:
  --mcp     Start as MCP server (default, for Claude Code)
  --http    Start as HTTP server (localhost:3456)
  --login   Open login page for manual login
  --help    Show this help

Examples:
  # Start MCP server (for Claude Code)
  node src/index.js

  # Start HTTP server
  node src/index.js --http

  # Login to Suno
  node src/index.js --login
`);
      break;

    default:
      console.error(`Unknown option: ${mode}`);
      console.error('Use --help for usage information');
      process.exit(1);
  }
}

main().catch(console.error);
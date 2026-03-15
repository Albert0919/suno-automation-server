/**
 * MCP Server Implementation
 * Enables Claude Code to call Suno automation directly
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { generateSong, getStatus, addToQueue, getQueueStatus, clearQueue, processBatch, stopBatch, downloadSong, downloadBatch, downloadSongWithImage, addToDownloadQueue, getDownloadQueueStatus, clearDownloadQueue, processDownloadBatch, stopDownloadBatch } from './suno-automation.js';
import { checkLogin, openLoginPage, closeBrowser } from './browser.js';

// Create MCP server
const server = new Server(
  {
    name: 'suno-automation',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'suno_generate',
        description: 'Generate a song on Suno AI. Fill lyrics, style, and optionally click Create button. Use this when user wants to create music on Suno.',
        inputSchema: {
          type: 'object',
          properties: {
            lyrics: {
              type: 'string',
              description: 'The lyrics for the song. Can include structure markers like [Verse], [Chorus], etc.'
            },
            style: {
              type: 'string',
              description: 'The musical style/genre. Examples: "pop, upbeat, electronic", "jazz, smooth, piano", "rock, energetic, electric guitar"'
            },
            title: {
              type: 'string',
              description: 'Optional song title'
            },
            autoCreate: {
              type: 'boolean',
              description: 'Whether to automatically click the Create button after filling the form. Default: true',
              default: true
            },
            gender: {
              type: 'string',
              description: 'Vocal gender for the song. Options: "male" or "female". If not specified, uses default.',
              enum: ['male', 'female']
            },
            styleInfluence: {
              type: 'number',
              description: 'Style Influence slider value (0-100). Higher values make the style more pronounced. Default: 50.',
              minimum: 0,
              maximum: 100
            },
            weirdness: {
              type: 'number',
              description: 'Weirdness slider value (0-100). Higher values produce more unexpected/creative outputs. Default: 50.',
              minimum: 0,
              maximum: 100
            },
            instrumental: {
              type: 'boolean',
              description: 'Enable instrumental mode (no vocals). Default: false.',
              default: false
            }
          },
          required: ['lyrics', 'style']
        }
      },
      {
        name: 'suno_status',
        description: 'Check the current status of Suno automation - whether logged in, on create page, etc.',
        inputSchema: {
          type: 'object',
          properties: {}
        }
      },
      {
        name: 'suno_login',
        description: 'Open Suno login page for manual login. Use this when user needs to login to Suno. Login state will be saved automatically.',
        inputSchema: {
          type: 'object',
          properties: {}
        }
      },
      // Batch tools
      {
        name: 'suno_batch_add',
        description: 'Add multiple songs to the batch queue. Use "defaults" for shared config (style, gender, etc.) so you only set them once. Each item only needs lyrics and title.',
        inputSchema: {
          type: 'object',
          properties: {
            items: {
              type: 'array',
              description: 'Array of song items. Each item only needs "lyrics" (required) and "title" (optional). Other settings will use defaults.',
              items: {
                type: 'object',
                properties: {
                  lyrics: { type: 'string', description: 'Song lyrics (required)' },
                  title: { type: 'string', description: 'Song title (optional)' },
                  // Per-item overrides (optional, will use defaults if not specified)
                  style: { type: 'string', description: 'Override: Musical style for this specific song' },
                  gender: { type: 'string', description: 'Override: Vocal gender for this song', enum: ['male', 'female'] },
                  autoCreate: { type: 'boolean', description: 'Override: Auto-click Create' },
                  styleInfluence: { type: 'number', description: 'Override: Style Influence 0-100', minimum: 0, maximum: 100 },
                  weirdness: { type: 'number', description: 'Override: Weirdness 0-100', minimum: 0, maximum: 100 },
                  instrumental: { type: 'boolean', description: 'Override: Instrumental mode' }
                },
                required: ['lyrics']
              }
            },
            defaults: {
              type: 'object',
              description: 'Shared default config for ALL items. Set style, gender, etc. once here instead of repeating for each song.',
              properties: {
                style: { type: 'string', description: 'Musical style/genre (required in defaults OR each item)' },
                autoCreate: { type: 'boolean', description: 'Auto-click Create button (default: true)' },
                gender: { type: 'string', description: 'Vocal gender: "male" or "female"', enum: ['male', 'female'] },
                styleInfluence: { type: 'number', description: 'Style Influence 0-100', minimum: 0, maximum: 100 },
                weirdness: { type: 'number', description: 'Weirdness 0-100', minimum: 0, maximum: 100 },
                instrumental: { type: 'boolean', description: 'Enable instrumental mode (default: false)' }
              }
            }
          },
          required: ['items']
        }
      },
      {
        name: 'suno_batch_status',
        description: 'Check the batch queue status - how many items pending, completed, failed, etc.',
        inputSchema: {
          type: 'object',
          properties: {}
        }
      },
      {
        name: 'suno_batch_start',
        description: 'Start processing the batch queue. Songs will be generated sequentially with delay between each.',
        inputSchema: {
          type: 'object',
          properties: {
            delaySeconds: {
              type: 'number',
              description: 'Delay in seconds between songs (default: 60, min: 5, max: 300)'
            }
          }
        }
      },
      {
        name: 'suno_batch_stop',
        description: 'Stop the current batch processing.',
        inputSchema: {
          type: 'object',
          properties: {}
        }
      },
      {
        name: 'suno_batch_clear',
        description: 'Clear the batch queue. All pending items will be removed.',
        inputSchema: {
          type: 'object',
          properties: {}
        }
      },
      // Download tools
      {
        name: 'suno_download',
        description: 'Download a single song from Suno by UUID. Use this when user wants to download a specific song.',
        inputSchema: {
          type: 'object',
          properties: {
            uuid: {
              type: 'string',
              description: 'Song UUID (required). Can be found in the song URL or API response.'
            },
            format: {
              type: 'string',
              description: 'Audio format: "mp3" (default, free) or "wav" (requires premium)',
              enum: ['mp3', 'wav'],
              default: 'mp3'
            },
            title: {
              type: 'string',
              description: 'Song title for the filename (optional)'
            },
            outputDir: {
              type: 'string',
              description: 'Output directory path (optional, uses default from config)'
            },
            includeImage: {
              type: 'boolean',
              description: 'Whether to also download the cover image (default: false)',
              default: false
            }
          },
          required: ['uuid']
        }
      },
      {
        name: 'suno_download_batch',
        description: 'Download multiple songs at once with concurrency control. Pass array of {uuid, title} objects.',
        inputSchema: {
          type: 'object',
          properties: {
            items: {
              type: 'array',
              description: 'Array of songs to download. Each item needs "uuid" (required) and "title" (optional).',
              items: {
                type: 'object',
                properties: {
                  uuid: { type: 'string', description: 'Song UUID (required)' },
                  title: { type: 'string', description: 'Song title for filename (optional)' }
                },
                required: ['uuid']
              }
            },
            format: {
              type: 'string',
              description: 'Audio format for all songs: "mp3" (default) or "wav" (requires premium)',
              enum: ['mp3', 'wav'],
              default: 'mp3'
            },
            outputDir: {
              type: 'string',
              description: 'Output directory path (optional, uses default from config)'
            },
            concurrency: {
              type: 'number',
              description: 'Number of concurrent downloads (default: 3, max: 10)',
              minimum: 1,
              maximum: 10,
              default: 3
            }
          },
          required: ['items']
        }
      },
      {
        name: 'suno_download_queue_add',
        description: 'Add songs to the download queue for background processing.',
        inputSchema: {
          type: 'object',
          properties: {
            items: {
              type: 'array',
              description: 'Array of songs to add to download queue. Each item needs "uuid" (required) and "title" (optional).',
              items: {
                type: 'object',
                properties: {
                  uuid: { type: 'string', description: 'Song UUID (required)' },
                  title: { type: 'string', description: 'Song title for filename (optional)' },
                  format: { type: 'string', description: 'Override format for this song', enum: ['mp3', 'wav'] }
                },
                required: ['uuid']
              }
            },
            format: {
              type: 'string',
              description: 'Default audio format: "mp3" or "wav"',
              enum: ['mp3', 'wav'],
              default: 'mp3'
            },
            outputDir: {
              type: 'string',
              description: 'Output directory path (optional)'
            }
          },
          required: ['items']
        }
      },
      {
        name: 'suno_download_queue_status',
        description: 'Check the download queue status - how many items pending, completed, failed, etc.',
        inputSchema: {
          type: 'object',
          properties: {}
        }
      },
      {
        name: 'suno_download_queue_start',
        description: 'Start processing the download queue. Downloads will run sequentially.',
        inputSchema: {
          type: 'object',
          properties: {
            concurrency: {
              type: 'number',
              description: 'Number of concurrent downloads (default: 3)',
              minimum: 1,
              maximum: 10
            }
          }
        }
      },
      {
        name: 'suno_download_queue_stop',
        description: 'Stop the current download batch processing.',
        inputSchema: {
          type: 'object',
          properties: {}
        }
      },
      {
        name: 'suno_download_queue_clear',
        description: 'Clear the download queue. All pending items will be removed.',
        inputSchema: {
          type: 'object',
          properties: {}
        }
      }
    ]
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  console.error(`[MCP] Tool called: ${name}`);
  console.error(`[MCP] Arguments:`, JSON.stringify(args, null, 2));

  try {
    switch (name) {
      case 'suno_generate': {
        const result = await generateSong(args);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2)
            }
          ]
        };
      }

      case 'suno_status': {
        const loginStatus = await checkLogin();
        const status = await getStatus();
        const result = {
          success: true,
          login: loginStatus,
          automation: status
        };
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2)
            }
          ]
        };
      }

      case 'suno_login': {
        await openLoginPage();
        return {
          content: [
            {
              type: 'text',
              text: 'Browser opened. Please login manually in the browser window. Login state will be saved automatically. After logging in, you can use suno_generate to create songs.'
            }
          ]
        };
      }

      // ============== Batch Tools ==============

      case 'suno_batch_add': {
        const { items, defaults = {} } = args;
        if (!items || !Array.isArray(items) || items.length === 0) {
          return {
            content: [{ type: 'text', text: 'Error: items array is required. Each item needs lyrics (style can be in defaults).' }],
            isError: true
          };
        }
        // Check if style is provided either in defaults or in all items
        if (!defaults.style) {
          const missingStyle = items.find(item => !item.style);
          if (missingStyle) {
            return {
              content: [{ type: 'text', text: 'Error: style is required. Set it in "defaults" for all songs, or in each item individually.' }],
              isError: true
            };
          }
        }
        const result = addToQueue({ items, defaults });
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
        };
      }

      case 'suno_batch_status': {
        const result = getQueueStatus();
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
        };
      }

      case 'suno_batch_start': {
        const { delaySeconds } = args;
        // Run batch in background
        processBatch({ delaySeconds }).then(result => {
          console.error('[MCP] Batch completed:', result);
        }).catch(error => {
          console.error('[MCP] Batch error:', error);
        });
        return {
          content: [{ type: 'text', text: `Batch started. ${getQueueStatus().pending} items in queue. Use suno_batch_status to check progress.` }]
        };
      }

      case 'suno_batch_stop': {
        const result = stopBatch();
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
        };
      }

      case 'suno_batch_clear': {
        const result = clearQueue();
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
        };
      }

      // ============== Download Tools ==============

      case 'suno_download': {
        const { uuid, format, title, outputDir, includeImage } = args;

        if (!uuid) {
          return {
            content: [{ type: 'text', text: 'Error: uuid is required' }],
            isError: true
          };
        }

        let result;
        if (includeImage) {
          result = await downloadSongWithImage({ uuid, format, outputDir, title, includeImage: true });
        } else {
          result = await downloadSong({ uuid, format, outputDir, title });
        }

        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
        };
      }

      case 'suno_download_batch': {
        const { items, format, outputDir, concurrency } = args;

        if (!items || !Array.isArray(items) || items.length === 0) {
          return {
            content: [{ type: 'text', text: 'Error: items array is required with at least one {uuid, title?} object' }],
            isError: true
          };
        }

        // Validate all items have uuid
        const missingUuid = items.find(item => !item.uuid);
        if (missingUuid) {
          return {
            content: [{ type: 'text', text: 'Error: each item must have a uuid' }],
            isError: true
          };
        }

        const result = await downloadBatch({ items, format, outputDir, concurrency });
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
        };
      }

      case 'suno_download_queue_add': {
        const { items, format, outputDir } = args;

        if (!items || !Array.isArray(items) || items.length === 0) {
          return {
            content: [{ type: 'text', text: 'Error: items array is required' }],
            isError: true
          };
        }

        const result = addToDownloadQueue({ items, format, outputDir });
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
        };
      }

      case 'suno_download_queue_status': {
        const result = getDownloadQueueStatus();
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
        };
      }

      case 'suno_download_queue_start': {
        const { concurrency } = args;

        // Run download batch in background
        processDownloadBatch({ concurrency }).then(result => {
          console.error('[MCP] Download batch completed:', result);
        }).catch(error => {
          console.error('[MCP] Download batch error:', error);
        });

        return {
          content: [{ type: 'text', text: `Download batch started. ${getDownloadQueueStatus().pending} items in queue. Use suno_download_queue_status to check progress.` }]
        };
      }

      case 'suno_download_queue_stop': {
        const result = stopDownloadBatch();
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
        };
      }

      case 'suno_download_queue_clear': {
        const result = clearDownloadQueue();
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
        };
      }

      default:
        return {
          content: [
            {
              type: 'text',
              text: `Unknown tool: ${name}`
            }
          ],
          isError: true
        };
    }
  } catch (error) {
    console.error(`[MCP] Error:`, error);
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error.message}`
        }
      ],
      isError: true
    };
  }
});

/**
 * Start MCP server
 */
export async function startMcpServer() {
  console.error('[MCP] Starting Suno Automation MCP Server...');
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('[MCP] Server connected and ready');
}

export default { startMcpServer };
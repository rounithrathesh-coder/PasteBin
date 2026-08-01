export const openApiDocument = {
  openapi: '3.0.3',
  info: {
    title: 'PasteBin API',
    version: '1.0.0',
    description: 'REST API for managing code snippets and platform integrations.'
  },
  servers: [{ url: '/api', description: 'Current deployment' }],
  paths: {
    '/health': {
      get: { summary: 'Get service health', responses: { 200: { description: 'Service status' } } }
    },
    '/pastes': {
      get: {
        summary: 'List snippets',
        parameters: [
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'lang', in: 'query', schema: { type: 'string' } },
          { name: 'vis', in: 'query', schema: { type: 'string', enum: ['Public', 'Private', 'Unlisted'] } }
        ],
        responses: { 200: { description: 'Snippet collection' } }
      },
      post: {
        summary: 'Create a snippet',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/CreatePaste' } } }
        },
        responses: { 201: { description: 'Created snippet' }, 400: { description: 'Invalid request' } }
      }
    },
    '/pastes/{id}': {
      delete: {
        summary: 'Move a snippet to trash',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Snippet moved to trash' }, 404: { description: 'Snippet not found' } }
      }
    },
    '/trash': {
      get: { summary: 'List trashed snippets', responses: { 200: { description: 'Trashed snippets' } } },
      delete: { summary: 'Permanently empty trash', responses: { 200: { description: 'Trash emptied' } } }
    },
    '/trash/restore/{id}': {
      post: {
        summary: 'Restore a snippet from trash',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Snippet restored' }, 404: { description: 'Snippet not found' } }
      }
    },
    '/ai/detect-language': {
      post: {
        summary: 'Detect a snippet language and category',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['code'], properties: { code: { type: 'string' } } } } } },
        responses: { 200: { description: 'Detected language and category' } }
      }
    }
  },
  components: {
    schemas: {
      CreatePaste: {
        type: 'object',
        required: ['title', 'code'],
        properties: {
          title: { type: 'string', maxLength: 160 },
          code: { type: 'string', maxLength: 100000 },
          language: { type: 'string' },
          visibility: { type: 'string', enum: ['Public', 'Private', 'Unlisted'] },
          folder: { type: 'string', maxLength: 80 },
          description: { type: 'string', maxLength: 500 }
        }
      }
    }
  }
};

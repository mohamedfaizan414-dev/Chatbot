/**
 * @typedef {'user' | 'assistant' | 'system'} MessageRole
 *
 * @typedef {Object} Message
 * @property {string} id
 * @property {MessageRole} role
 * @property {string} content
 * @property {Date} timestamp
 * @property {boolean} [streaming]
 * @property {boolean} [error]
 *
 * @typedef {Object} ChatSession
 * @property {string} sessionId
 * @property {Message[]} messages
 *
 * @typedef {Object} ApiHealth
 * @property {string} status
 * @property {string} model
 * @property {string} environment
 */

export {};

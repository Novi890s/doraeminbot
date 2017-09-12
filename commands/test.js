const GlassBot = require('../bot.js')

GlassBot.registerCommand('test', 'dm', (message) => {
  return '**Test successful!**'
}, [], 'Test Command', '[]')

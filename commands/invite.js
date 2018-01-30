const GlassBot = require('../bot.js')
const config = GlassBot.config

GlassBot.registerCommand('invite', 'default', (message) => {
  return 'Invite Link: https://discordapp.com/oauth2/authorize?client_id=' + config.botID + '&scope=bot'
}, ['invitelink'], 'Get invite link to invite GlassBot to your server', '[]')

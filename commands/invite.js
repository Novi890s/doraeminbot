const GlassBot = require('../bot.js')

GlassBot.registerCommand('invite', 'default', (message) => {
  return 'Invite Link: https://discordapp.com/oauth2/authorize?client_id=335165457005019136&scope=bot'
}, ['invitelink'], 'Get invite link to invite GlassBot to your server', '[]')

const GlassBot = require('../bot.js')
const fs = require('fs')

GlassBot.bot.on('guildCreate', (guild) => {
  var guildID = guild.id
  var path = './glassBotfiles/' + guildID + '.yml'
  fs.writeFileSync(path, defaultConfig)
  guild.owner.send('Thank you for adding GlassBot to your guild named **' + guild.name + '**.\n\nGlassBot will use the default configuration.')
})

GlassBot.bot.on('guildDelete', (guild) => {
  var guildID = guild.id
  var path = './glassBotfiles/' + guildID + '.yml'
  try { fs.unlinkSync(path) } catch (error) { console.log('An error occurred: ' + error.stack) }
  console.log('Deleted guild config file for ' + guild + '(' + path + ')')
})

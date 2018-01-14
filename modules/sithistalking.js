
const Confax = require('../bot.js')
const bot = Confax.bot

// Lets begin
bot.on('message', message => {
  if (message.author.id === '211892062700830720') { // The Sith id
    return 'Hi Sith, I will reply to everything you say'
  }
})

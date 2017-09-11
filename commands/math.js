const Confax = require('../bot.js')
const math = require('mathjs')

Confax.registerCommand('math', 'default', (message, bot) => {
  let result
  try {
    result = math.eval(message.content)
  } catch (error) {
    console.log('Failed math calculation ' + message.content + '\nError: ' + error.stack)
    return 'Error while evaluating the math expression.'
  } finally {
    if (isNaN(parseFloat(result))) {
      message.channel.send('Invalid Calculation Expression')
    } else {
      message.channel.send('**Result:** ' + result)
    }
  }
}, ['calculate', 'calc', 'calculator'], 'Calculate a math expression', '<expression>')

const GlassBot = require('../bot.js')

GlassBot.registerCommand('help', 'default', (message, bot) => {
  let commands = GlassBot.commands
  let cmds = {
    master: [],
    moderator: [],
    default: [],
    dm: []
  }

  for (let loopCmdType in commands) {
    for (let loopCmd in commands[loopCmdType]) {
      cmds[loopCmdType].push(loopCmd)
    }
  }

  for (let loopCmdType in cmds) { cmds[loopCmdType].sort() }

  let mastercmds = Object.keys(cmds['master']).length
  let modcmds = Object.keys(cmds['moderator']).length
  let defaultcmds = Object.keys(cmds['default']).length
  let dmcmds = Object.keys(cmds['dm']).length

  return 'Default Commands **(' + defaultcmds + ')** ```' + cmds['default'].join(' \n') + ' ```\n' +
         'DM Commands **(' + dmcmds + ')** ```' + cmds['dm'].join('-\n') + ' ```\n' +
         'Moderator Commands **(' + modcmds + ')** ```' + cmds['moderator'].join(' \n') + ' ```\n' +
         'Master Commands **(' + mastercmds + ')** ```' + cmds['master'].join(' \n') + ' ```\n' +
         'All Commands - **(' + (defaultcmds + dmcmds + modcmds + mastercmds) + ')**' +
         '```Use advancedhelp to get an advanced list of all commands or cmdhelp to get a detailed description of one. ```'
}, ['cmds', 'commands', 'commandlist'], 'List all commands', '[]')

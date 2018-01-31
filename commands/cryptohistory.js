/*  cryptohistory.js by @GlassToeStudio - GlassToeStudio@gmail.com

    16 September, 2017
    https://github.com/GlassToeStudio
    http://glasstoestudio.weebly.com/
    https://twitter.com/GlassToeStudio

    ------------------------------------------------------------------------
    Return current price of a given crypto-currency in $US

    The command uses the API from: http://www.coincap.io/
    The API can be found here: https://github.com/CoinCapDev/CoinCap.io
    The API request can be found here: http://coincap.io/history/1day/<coin>
*/

const GlassBot = require('../bot.js')
const request = require('request')
const username = process.env.PLOTLY_USER_NAME
const plotlyapikey = process.env.PLOTLY_API_KEY
const plotly = require('plotly')(username, plotlyapikey)

GlassBot.registerCommand('cryptohistory', 'default', (message, bot) => {
  let histories = [365, 180, 90, 30, 7, 1]
  let xAxis = []
  let yAxis = []
  let historyData
  let msg = (message.content.toUpperCase()).split(' ')
  let coin = msg[0]
  let hist = msg[1]

  // console.log('_____________')
  // console.log('Coin : ' + coin)
  // console.log('History : ' + hist)

  // No history argument was provided
  if (hist === undefined) hist = 1

  hist = parseInt(hist)
  // Check that history is an integer if not, create a temp var to see if history arg was privded first.
  if (isNaN(hist)) {
    let tempCoin = parseInt(coin)
    if (isNaN(tempCoin)) {
      console.log('TempCoin is not an int : ' + tempCoin)
      hist = '1'
    } else {
      coin = msg[1]
      hist = tempCoin
    }
  }

  for (let i = 0; i < histories.length; i++) {
    if (hist >= histories[i]) {
      hist = histories[i]
      break
    }
  }

  let address = 'http://www.coincap.io/history/' + hist + 'day/' + coin
  request(address, function (error, response, body) {
    if (error) { return ('Something went wrong ¯\\_(ツ)_/¯ ') }
    try {
      historyData = JSON.parse(body)
      let price = historyData.price
      for (let i = 0; i < price.length; i++) {
        xAxis.push(UnixToDate(historyData.price[i][0], hist))
        yAxis.push(historyData.price[i][1])
      }
    } catch (error) { return ('<:doggo:328259712963313665>' + ' Not a valid crypto-currency, try BTC, ETH, or LTC.') }

    let yMin = Math.min(...yAxis)
    let yMax = (Math.max(...yAxis) * 1.01)

    let trace1 = GlassBot.chartConfig.trace1
    let lay = GlassBot.chartConfig.lay

    trace1.x = xAxis
    trace1.y = yAxis
    trace1.name = coin
    // Create the chart layout and axis names
    lay.title = '<b>' + coin + ' ' + hist + ' Day History</b>'
    lay.yaxis.range[0] = yMin
    lay.yaxis.range[1] = yMax

    // Set our data and graph options
    let graphOptions = {layout: lay, fileopt: 'overwrite', filename: 'Crytpo_History'}

    // Create the chart and plot our data (delete the last plot created, with its data)
    plotly.plot([trace1], graphOptions, function (err, msg) {
      if (err) {
        console.log(err)
        return
      }
      let graphLocation = msg.url + '.png'

      message.channel.send({ embed: {
        'title': coin + ' ' + hist + ' Day History',
        'color': 9636912,
        'file': graphLocation
      }})
    })
  })
}, ['hist', 'history'], 'Show latest trend for the past day.', '<crypto-currency ticker> Example: Bitcoin = BTC')

/**
 * Takes a UNIX time stamp (in milliseconds) and converts to
 * yyyy mm dd hh mm AM/PM
 * @param  {number} unixTimeStamp
 * @param  {number} history in days
 */
function UnixToDate (timestamp, hist) {
  let d = new Date(timestamp) // Convert the passed timestamp to milliseconds
  // let yyyy = d.getFullYear()
  let mm = ('0' + (d.getMonth() + 1)).slice(-2)  // Months are zero based. Add leading 0.
  let dd = ('0' + d.getDate()).slice(-2) // Add leading 0.
  let hh = d.getHours()
  let h = hh
  let min = ('0' + d.getMinutes()).slice(-2) // Add leading 0.
  let ampm = 'AM'
  let time

  if (hh > 12) {
    h = hh - 12
    ampm = 'PM'
  } else if (hh === 12) {
    h = 12
    ampm = 'PM'
  } else if (hh === 0) {
    h = 12
  }

  if (hist !== 1) time = mm + '-' + dd + ', ' + h + ':' + min + ' ' + ampm
  else time = h + ':' + min + ' ' + ampm
  return time
}

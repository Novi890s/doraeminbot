
/*  cryptohistory.js by David Jerome @GlassToeStudio - GlassToeStudio@gmail.com

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
const Discord = require('discord.js')
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

  console.log('_____________')
  console.log('Coin : ' + coin)
  console.log('History : ' + hist)

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

  console.log('_____________')
  console.log('Coin : ' + coin)
  console.log('History : ' + hist)
  let address = 'http://www.coincap.io/history/' + hist + 'day/' + coin
  let graphLocation = ''
  request(address, function (error, response, body) {
    if (error) { return ('Something went wrong ¯\\_(ツ)_/¯ ') }
    try {
      historyData = JSON.parse(body)
      let price = historyData.price
      for (let i = 0; i < price.length; i++) {
        xAxis.push(UnixToDate(historyData.price[i][0]))
        yAxis.push(historyData.price[i][1])
      }
    } catch (error) { return ('<:doggo:328259712963313665>' + ' Not a valid crypto-currency, try BTC, ETH, or LTC.') }

    // Create the json object for our data and chart-type
    let trace1 = {
      type: 'scatter',
      x: xAxis,
      y: yAxis,
      mode: 'lines',
      name: coin,
      line: {
        color: 'rgb(219, 64, 82)',
        width: 3
      }
    }

    // Create the chart layout and axis names
    var lay = {
      title: coin + ' ' + hist + ' Day History',
      xaxis: {
        title: 'Time'
      },
      yaxis: {
        title: 'Price $USD',
        tickprefix: '$'
      }
    }

    // Set our data and graph options
    var data = [trace1]
    var graphOptions = {layout: lay, fileopt: 'overwrite', filename: 'Crytpo_' + coin + ' ' + hist + ' History'}

    // Create the chart and plot our data (delete the last plot created, with its data)
    plotly.plot(data, graphOptions, function (err, msg) {
      if (err) { return }
      let deleteID = parseInt(msg.url.slice(-2))
      let deletPlotID = (deleteID - 2).toString()
      let delegeGridId = (deleteID - 1).toString()
      graphLocation = msg.url + '.png'

      console.log(graphLocation)

      plotly.deletePlot(delegeGridId, function (err, plot) {
        if (err) { // console.log(err)
        } else { console.log('deleted an old graph') }
      })

      plotly.deletePlot(deletPlotID, function (err, plot) {
        if (err) { // console.log(err)
        } else { console.log('deleted an old graph') }
      })

      message.channel.send('Here is the last ' + hist + ' day trend for ' + coin, { embed: {
        'title': coin + ' ' + hist + ' history',
        'description': 'Created using [CryptoCompare API](https://discordapp.com)',
        'url': graphLocation,
        'color': 9636912,
        'image': {
          'url': graphLocation
        },
        'file': graphLocation,
        'thumbnail': {
          'url': 'https://www.cryptocompare.com/media/20567/cc-logo-vert.png'
        }
      }})
    })
  })
}, ['hist', 'history'], 'Show latest trend for the past day.', '<crypto-currency ticker> Example: Bitcoin = BTC')

/**
 * Takes a UNIX time stamp (in milliseconds) and converts to
 * yyyy mm dd hh mm AM/PM
 * @param  {number} unixTimeStamp
 */
function UnixToDate (timestamp) {
  let d = new Date(timestamp) // Convert the passed timestamp to milliseconds
  let yyyy = d.getFullYear()
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

  // ie: 2013-02-18, 8:35 AM
  time = yyyy + '-' + mm + '-' + dd + ', ' + h + ':' + min + ' ' + ampm
  return time
}

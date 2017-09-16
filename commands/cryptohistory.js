
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
const plotly = require('plotly')('GlassToeStudio', 'nGL4zndcjmaKYjRK8TzC')

GlassBot.registerCommand('cryptohistory', 'default', (message, bot) => {
  let xAxis = []
  let yAxis = []
  let historyData
  let coin = message.content.toUpperCase()
  let address = 'http://www.coincap.io/history/1day/' + coin

  request(address, function (error, response, body) {
    if (error) { message.channel.send('Not a valied crypto currency, try BTC or ETH.') }
    try {
      historyData = JSON.parse(body)
      let price = historyData.price
      for (let i = 0; i < price.length; i++) {
        xAxis.push(UnixToDate(historyData.price[i][0]))
        yAxis.push(historyData.price[i][1])
      }
    } catch (error) { message.channel.send('<:doggo:328259712963313665>' + ' Not a valid crypto-currency, try BTC or ETH.') }

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
      title: coin + ' 1 Day History',
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
    var graphOptions = {layout: lay, fileopt: 'overwrite', filename: 'Crytpo_' + coin}

    // Create the chart and plot our data
    plotly.plot(data, graphOptions, function (err, msg) {
      if (err) { return }
      let deleteID = parseInt(msg.url.slice(-2))
      let deletPlotID = (deleteID - 2).toString()
      let delegeGridId = (deleteID - 1).toString()
      message.channel.send('Here is the last 24 hour trend for ' + coin, {
        file: msg.url + '.png'})
        .then(plotly.deletePlot(delegeGridId, function (err, plot) {
          if (err) { // console.log(err)
          } else { console.log('deleted an old graph') }
        }))
      .then(plotly.deletePlot(deletPlotID, function (err, plot) {
        if (err) { // console.log(err)
        } else { console.log('deleted an old graph') }
      }))
    })
  })
}, ['hist', 'history'], 'Show latest trend for the past day.', '<crypto-currency ticker> Example: Bitcoin = BTC')

/**
 * Takes a UNIX time stamp (in milliseconds) and converts to
 * hour, minute, second.
 * @param  {number} unixTimeStamp
 */
function UnixToDate (unixTimeStamp) {
  let days = {1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thur', 5: 'Fri', 6: 'Sat', 7: 'Sun'}
  let date = new Date(unixTimeStamp)
  let day = date.getDay()
  let hours = date.getHours()
  let minutes = '0' + date.getMinutes()
  let seconds = '0' + date.getSeconds()
  let formattedTime = days[day] + ':' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2)
  return formattedTime
}

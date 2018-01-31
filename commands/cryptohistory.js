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

  // console.log('_____________')
  // console.log('Coin : ' + coin)
  // console.log('History : ' + hist)
  let address = 'http://www.coincap.io/history/' + hist + 'day/' + coin
  let graphLocation = ''
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

    let yMin = ((Math.min(...yAxis)) * 1.01)
    let yMax = ((Math.max(...yAxis)) * 1.01)
    // console.log('Y Min: ' + yMin)
    // console.log('Y Max: ' + yMax)

    // Create the json object for our data and chart-type
    let trace1 = {
      fill: 'tonexty',
      type: 'line',
      line: {
        color: 'rgb(0, 217, 255)'
      },
      marker: {
        line: {
          width: 0.01
        }
      },
      fillcolor: 'rgba(0, 231, 255, 0.28)',
      x: xAxis,
      y: yAxis,
      name: coin
    }

    // Create the chart layout and axis names
    var lay = {
      title: '<b>' + coin + ' ' + hist + ' Day History</b>',
      titlefont: {
        family: 'Droid Serif',
        size: 18,
        color: 'rgb(0, 217, 255)'
      },
      height: 1080,
      width: 1920,
      autosize: true,
      bargap: 0,
      boxmode: 'group',
      paper_bgcolor: 'rgba(0, 0, 0, 0)',
      margin: {
        l: 70,
        r: 70,
        t: 40,
        b: 20,
        pad: 0,
        autoexpand: true
      },
      plot_bgcolor: 'rgba(58, 58, 58, 0)',
      scene: {
        aspectratio: {
          y: 1,
          x: 1,
          z: 1
        },
        aspectmode: 'auto'
      },
      // ////////////////////////////////////////////////////////////
      yaxis: {
        domain: [
          0.09,
          1
        ],
        range: [
          yMin,
          yMax
        ],
        type: 'linear',
        showticklabels: true,
        gridcolor: 'rgb(142, 142, 142)',
        linecolor: 'rgb(0, 217, 255)',
        mirror: true,
        nticks: 15,
        linewidth: 2,
        autorange: false,
        tickprefix: '$',
        tickmode: 'auto',
        ticks: 'inside',
        tickwidth: 6,
        ticklen: 14,
        zeroline: true,
        zerolinewidth: 5,
        zerolinecolor: 'rgb(0, 217, 255)',
        showgrid: true,
        rangeslider: {
          visible: false
        },
        showline: true,
        tickfont: {
          color: 'rgb(0, 217, 255)',
          family: 'Droid Serif',
          size: 18
        },
        exponentformat: 'B'
      },
      // ///////////////////////////////////////////////////////
      xaxis: {
        domain: [
          0.00,
          1.01
        ],
        type: 'category',
        showticklabels: true,
        gridcolor: 'rgb(142, 142, 142)',
        linecolor: 'rgb(0, 217, 255)',
        mirror: true,
        nticks: 15,
        linewidth: 2,
        autorange: true,
        tickprefix: '',
        tickmode: 'auto',
        ticks: 'inside',
        ticklen: 14,
        zeroline: true,
        zerolinewidth: 5,
        zerolinecolor: 'rgb(0, 217, 255)',
        showgrid: true,
        rangeslider: {
          visible: false,
          autorange: true
        },
        showline: true,
        tickfont: {
          color: 'rgb(0, 217, 255)',
          family: 'Droid Serif',
          size: 9
        },
        tickwidth: 6,
        tickangle: 45,
        side: 'bottom',
        position: 0,
        anchor: 'y',
        exponentformat: 'none'
      },
      hovermode: 'closest'
    }

    // Set our data and graph options
    var data = [trace1]
    var graphOptions = {layout: lay, fileopt: 'overwrite', filename: 'Crytpo_History'}

    // Create the chart and plot our data (delete the last plot created, with its data)
    plotly.plot(data, graphOptions, function (err, msg) {
      if (err) {
        console.log(err)
        return
      }
      // let deleteID = parseInt(msg.url.slice(-3))
      // let deletePlotID = (deleteID - 2).toString()
      // let deleteGridId = (deleteID - 1).toString()
      // console.log(deletePlotID)
      // console.log(deleteGridId)
      graphLocation = msg.url + '.png'

      // console.log(graphLocation)

      // plotly.deletePlot(deleteGridId, function (err, plot) {
      //   if (err) { // console.log(err)
      //   } else { console.log('deleted an old graph') }
      // })

      // plotly.deletePlot(deletePlotID, function (err, plot) {
      //   if (err) { // console.log(err)
      //   } else { console.log('deleted an old graph') }
      // })

      message.channel.send({ embed: {
        'title': coin + ' ' + hist + ' Day History',
        // 'description': '[Graph Link](' + graphLocation + ')',
        // 'url': 'https://www.cryptocompare.com/api/',
        'color': 9636912,
        // 'image': {
        //   'url': graphLocation
        // },
        'file': graphLocation
        // 'thumbnail': {
        //   'url': 'https://www.cryptocompare.com/media/20567/cc-logo-vert.png'
        // }
      }})
    })
  })
}, ['hist', 'history'], 'Show latest trend for the past day.', '<crypto-currency ticker> Example: Bitcoin = BTC')

/**
 * Takes a UNIX time stamp (in milliseconds) and converts to
 * yyyy mm dd hh mm AM/PM
 * @param  {number} unixTimeStamp
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

  // ie: 2013-02-18, 8:35 AM
  if (hist !== 1) time = mm + '-' + dd + ', ' + h + ':' + min + ' ' + ampm
  else time = h + ':' + min + ' ' + ampm
  return time
}

const GlassBot = require('../bot.js')
const MongoClient = require('mongodb').MongoClient
const assert = require('assert')
const url = process.env.MONGOURL

var currencies = ['BTC', 'ETH', 'LTC']
GlassBot.registerCommand('sendcurrency', 'default', (message) => {
  //  Parse message
  let args = message.content.split(' ')
  console.log('Args: ' + args.length + ' ' + args)
    //  Get user that is sending coin (message.author)
  let sender = message.author
  console.log('Sender: ' + sender.username)
    //  Get user that is to recieve coin (message.mentions.users.first())
  let receiver = message.mentions.users.first()
  console.log('Receiver: ' + receiver.username)
      //  Error is no user mentioned - Notify author
  if (!receiver) {
    return ('Please mention a user')
  }
    //  Get CryptoCurrency type (BTC, LTC, etc)
      //  Error is not a valid currency (should limit currency type?) - Notify Author
  let currency = args[2].toUpperCase()
  if (currencies.indexOf(currency) < 0) {
    console.log('Currency Type (?): ' + currency)
    return ('Please enter a valid currency (BTC, ETH, LTC)')
  }
  console.log('Currency Type: ' + currency)
    //  Get currency amount in USD (or in amount of coin?) (or in users native currency? idk this part is hard.)
        //  Error is not a valid float - Notify author
  let currencyAmt = parseFloat(args[1])
  if (isNaN(currencyAmt)) {
    console.log('Currency amount (?): ' + args[2])
    return ('Please enter a valid amount (float)')
  }
  console.log('Currency amount: ' + currencyAmt)
      //  Convert dollar amount to proper currency amount (based on current rate?) - will need to get rate...

  // Connect to the db
  let connection = MongoClient.connect(url, function (err, db) {
    assert.equal(null, err)
    console.log('Connected correctly to server')
  })

  let wallet = GetSenderWallet(connection)
  console.log('Wallet: ' + wallet)
  //  Check User Data
    //  Check that sender has a valid wallet on file for the given currency
        //  Error is no wallet on file - notify author on how to create a wallet for this currency
      //  Check that sender has enough to cover the amount send
        //  Error if not enough in wallet - notify author
    //  Check that receiver has as a valid wallet on file for the given currency
        //  Error is no wallet on file - notify user on how to create a wallet for this currency

  //  Perform exchange
    //  Transfer the given amount from sender to receiver
      //  Verify transaction succeeded

  // try {
  //   db.products.insertOne( { item: "card", qty: 15 } )
  // } catch (e) {
  //   print (e)
  // };

  //  Output message
  message.channel.send('Here is some ' + currency + message.mentions.users.first())

  function GetSenderWallet (connection, callback) {
    let collection = connection.collection('GlassToeWallet')
    let found = collection.find()
    callback(console.log(found))
    return found
  }

  //  Update database with amount sent from who to whom?
}, ['send', 'tip'], 'Send BTC to a User', '[]')
// iJW40zvNeqIAXWTA

const express = require('express')
const app = express()
const rp = require('request-promise')
const xml2js = require('xml2js')
const fs = require('fs')

let mockData
let mlsIds = []

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/agents', (req, res) => {
  res.send(`<pre>${mlsIds.join('\n')}</pre>`)
})

app.get('/listings', (req, res) => {
  res.send('Please supply an id, like /listings/BA7919258')
})

app.get('/listings/:id', (req, res) => {
  if (mockData) {
    const mlsId = req.params.id.toUpperCase()
    const listings = mockData[mlsId]
    if (listings) {
      res.send(`<pre>${JSON.stringify(listings, null, 2)}</pre>`)
    } else {
      res.send('No listings found for that ID!')
    }
  } else {
    res.send('Data is still processing. Please try again in 1 minute.')
  }
})

app.get('/photos/:id', (req, res) => {
  if (mockData) {
    const mlsId = req.params.id.toUpperCase()
    const listings = mockData[mlsId]
    if (listings) {
      let response = ''
      listings.forEach(listing => {
        listing.photos.forEach(photo => {
          response += `<img src="${photo}" /><br>`
        })
      })
      res.send(response)
    } else {
      res.send('No photos found for that ID!')
    }
  } else {
    res.send('Data is still processing. Please try again in 1 minute.')
  }
})

const server = app.listen(8080, () => {
  const host = server.address().address
  const port = server.address().port
  console.log(`Server listening at http://${host}:${port}`)
})

const parser = new xml2js.Parser({ async: true })
fs.readFile(__dirname + '/bjl.xml', (err, xmlData) => {
  parser.parseString(xmlData, (err, jsonData) => {
    if (err) console.log(err)
    console.log('parsed xml data')

    // find all photos
    const agents = {}
    jsonData.Listings.Listing.forEach((listing, i) => {
      const listingObj = {}
      if (listing.Photos) {
        const photos = listing.Photos[0].Photo.map(photo => photo.MediaURL[0])
        listingObj.photos = photos
      }
      if (listing.MlsNumber) {
        const mlsId = listing.MlsNumber[0]
        if (!agents[mlsId]) {
          agents[mlsId] = []
        }
        agents[mlsId].push(listingObj)
      }
    })
    mockData = agents
    Object.getOwnPropertyNames(agents).forEach(id => {
      mlsIds.push(id)
    })
  })
})

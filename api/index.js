const express = require('express')
const app = express()
const rp = require('request-promise')
const xml2js = require('xml2js')
const fs = require('fs')

// json database
const JsonDB = require('node-json-db')
const db = new JsonDB('data/data.json', true, false)

let mockData

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/listings', (req, res) => {
  res.send('Please supply an id, like /listings/27')
})

app.get('/listings/:id', (req, res) => {
  const listing = db.getData(`/Listings/Listing/${req.params.id}`)
  res.send(`<pre>${JSON.stringify(listing, null, 2)}</pre>`)

})

const server = app.listen(8080, () => {
  const host = server.address().address
  const port = server.address().port
  console.log(`Server listening at http://${host}:${port}`)
  console.log('latest :)')
})
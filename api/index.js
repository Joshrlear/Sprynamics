const xml2js = require('xml2js-expat')
const firebase = require('./firebase')
const request = require('request')
const zlib = require('zlib')
const parser = new xml2js.Parser()
const csvStringify = require('csv-stringify-as-promised')
const fs = require('fs')
const express = require('express')
const app = express()
const path = require('path')
const schedule = require('node-schedule')
const serveIndex = require('serve-index')

function fetchListhubFeed() {
  return new Promise((resolve, reject) => {
    const gunzip = zlib.createGunzip()
    request
      .get('https://feeds.listhub.com/pickup/spry/spry.xml.gz', {
        auth: {
          user: 'spry',
          pass: 'Jhd413vQ',
          sendImmediately: true
        }
      })
      .pipe(gunzip)
      .pipe(parser)
      .on('end', result => {
        resolve(result)
      })
      .on('error', err => {
        console.error(err)
        reject(err)
      })
  })
}

function processData(jsonData) {
  return new Promise((resolve, reject) => {
    // find all photos
    const listings = []
    jsonData.Listing.forEach((listing, listingIndex) => {
      // if (listingIndex > 5) return
      const Address = listing.Address
      const Brokerage = listing.Brokerage
      // const Location = listing.Location[0]

      const listingObj = {
        id: listing.MlsNumber,
        agentId: listing.ListingParticipants.Participant.ParticipantId,
        fullStreetAddress: Address['commons:FullStreetAddress'],
        unitNumber: Address['commons:UnitNumber'],
        city: Address['commons:City'],
        stateOrProvince: Address['commons:StateOrProvince'],
        postalCode: Address['commons:PostalCode'],
        bedrooms: listing.Bedrooms,
        bathrooms: listing.Bathrooms,
        listPrice: listing.ListPrice['#'],
        brokerageName: Brokerage.Name,
        brokerageNumber: Brokerage.Phone,
        // listing: listing,
        // latitude: Location.Latitude[0],
        // longitude: Location.Longitude[0],
        listingStatus: listing.ListingStatus,
        livingArea: listing.LivingArea,
        listingKey: listing.ListingKey,
        listingURL: listing.ListingURL,
        mlsNumber: listing.MlsNumber
      }

      Object.getOwnPropertyNames(listingObj).forEach(name => {
        if (listingObj[name] === undefined) {
          listingObj[name] = null
        }
      })

      if (listing.Photos) {
        let photos
        // listing.Photos.Photo is either an array, or an Object if there's only one
        if (listing.Photos.Photo instanceof Array) {
          photos = listing.Photos.Photo.map(photo => photo.MediaURL)
        } else {
          photos = [listing.Photos.Photo.MediaURL]
        }
        // console.log(photos)
        listingObj.photos = photos
      }

      listings.push(listingObj)
    })

    resolve(listings)
  })
}

function getCurrentCSVFilename() {
  const date = new Date()
  const year = date.getFullYear()
  const month = ('0' + (date.getMonth() + 1)).slice(-2)
  const day = ('0' + date.getDate()).slice(-2)
  return `listing_status_${year}-${month}-${day}.csv`
}

async function uploadAll(listings, listingIndex = 0, photoIndex = 0) {
  try {
    if (listingIndex >= listings.length) {
      console.log('Finished looping over listings')
      return
    }
    const listing = listings[listingIndex]
    if (!listing.photos) {
      uploadAll(listings, listingIndex + 1)
      return
    }
    if (photoIndex >= listing.photos.length) {
      uploadAll(listings, listingIndex + 1)
      return
    }
    const photo = listing.photos[photoIndex]
    const uploadPath = `listingPhotos/${listing.id}/photo-${photoIndex}.jpg`
    await firebase.upload(photo, uploadPath, { contentType: 'image/jpg' })
    const downloadUrl = await firebase.bucket.file(uploadPath).getSignedUrl({
      action: 'read',
      expires: '03-01-2500'
    })
    if (downloadUrl) {
      listings[listingIndex].photos[photoIndex] = downloadUrl[0]
      if (photoIndex >= listings[listingIndex].photos.length - 1) {
        // all photos are finished, set this listing in firestore
        await firebase.doc(`listings/${listing.id}`).set(listing)
        uploadAll(listings, listingIndex + 1)
      } else {
        // continue uploading photos for this listing
        uploadAll(listings, listingIndex, photoIndex + 1)
      }
    } else {
      // skip photos for this listing if it has no photos
      await firebase.doc(`listings/${listing.id}`).set(listing)
      uploadAll(listings, listingIndex + 1)
    }
  } catch (err) {
    console.error(err)
  }
}

async function runSyndication() {
  try {
    /* Fetch ListHub feed */
    console.log('Fetching feed from ListHub...')
    const data = await fetchListhubFeed()

    /* Process ListHub data */
    console.log('Processing ListHub data...')
    const listings = await processData(data)

    /* Create status CSV file */
    console.log('Creating listing status file... ' + getCurrentCSVFilename())
    const csvData = [['ListingKey', 'Status', 'URL', 'Message', 'Timestamp']]
    listings.forEach(listing => {
      csvData.push([
        listing.listingKey,
        'SUCCESS',
        `https://sprynamics.now.sh/designer?product=postcard&size=9x6&agent=${listing.agentId}&listing=${listing.id}`,
        'Successfully imported',
        ''
      ])
    })
    const csvString = await csvStringify(csvData)
    const filePath = path.join('status', getCurrentCSVFilename())
    fs.writeFile(filePath, csvString)

    /* Upload data to Firebase */
    console.log('Uploading data to firebase...')
    console.log('Listing amount: ' + listings.length)
    uploadAll(listings)
  } catch (err) {
    console.error(err)
  }
}

runSyndication()

/* Run every 6 hours */
schedule.scheduleJob('0 */6 * * *', async () => {
  console.log('Running syndication at ' + new Date())
  try {
    await runSyndication()
  } catch (err) {
    console.error('An error occured during syndication', err)
  }
})

app.use('/status', express.static('status'), serveIndex('status'))

app.listen(8080, () => console.log('Server listening on port 8080'))

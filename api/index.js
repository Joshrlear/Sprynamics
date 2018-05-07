const xml2js = require('xml2js-expat')
const firebase = require('./firebase')
const request = require('request')
const zlib = require('zlib')
const parser = new xml2js.Parser()
const csvStringify = require('csv-stringify')
const fs = require('fs')
const express = require('express')
const app = express()
const path = require('path')
const schedule = require('node-schedule')

function fetchListhubFeed() {
  return new Promise((resolve, reject) => {
    const gunzip = zlib.createGunzip()
    request
      .get('https://feeds.listhub.com/pickup/spry/spry.xml.gz', {
        auth: {
          user: 'spry',
          pass: 'Jhd413vQ',
          sendImmediately: true,
        },
      })
      .pipe(gunzip)
      .pipe(parser)
      .on('end', (result) => {
        resolve(result)
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

      Object.getOwnPropertyNames(listingObj).forEach((name) => {
        if (listingObj[name] === undefined) {
          listingObj[name] = null
        }
      })

      if (listing.Photos) {
        let photos
        // listing.Photos.Photo is either an array, or an Object if there's only one
        if (listing.Photos.Photo instanceof Array) {
          photos = listing.Photos.Photo.map((photo) => photo.MediaURL)
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

let csvData = [['ListingKey', 'Status', 'URL', 'Message', 'Timestamp']]

function uploadAll(listings, listingIndex = 0, photoIndex = 0) {
  if (listingIndex >= listings.length) {
    console.log('Finished looping over listings')
    csvStringify(csvData, (err, output) => {
      if (err) {
        console.error(err)
      } else {
        const date = new Date()
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()
        console.log(`${year}-${month}-${day}`)
        fs.writeFile(`listing_status_${year}-${month}-${day}.csv`, output)
        csvData = [['ListingKey', 'Status', 'URL', 'Message', 'Timestamp']]
      }
    })
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
  firebase.upload(photo, uploadPath, { contentType: 'image/jpg' })
    .then((res) => {
      return null
      // console.log(`Finished uploading ${uploadPath}`)
      // return firebase.bucket.file(uploadPath).getSignedUrl({
      //   action: 'read',
      //   expires: '03-01-2500'
      // })
    })
    .catch((err) => {
      console.error(err)
    })
    .then((downloadUrl) => {
      if (listing.photos && downloadUrl) {
        listings[listingIndex].photos[photoIndex] = downloadUrl[0]
        if (photoIndex >= listings[listingIndex].photos.length - 1) {
          // all photos are finished, set this listing in firestore
          firebase.doc(`listings/${listing.id}`).set(listing)
            .then(() => {
              uploadAll(listings, listingIndex + 1)
            })
            .catch((err) => {
              console.error(err)
            })
        } else {
          // continue uploading photos for this listing
          uploadAll(listings, listingIndex, photoIndex + 1)
        }
      } else {
        // skip photos for this listing if it has no photos
        if (!downloadUrl) {
          console.log(`Download URL not found for ${uploadPath}`)
        }
        firebase.doc(`listings/${listing.id}`).set(listing)
          .then(() => {
            csvData.push([
              listing.listingKey,
              'SUCCESS',
              `https://sprynamics.now.sh/designer?product=postcard&size=9x6&agent=${listing.agentId}&listing=${listing.id}`,
              'Successfully imported',
              ''
            ])
            uploadAll(listings, listingIndex + 1)
          })
          .catch((err) => {
            console.error(err)
          })
      }
    })
    .catch((err) => {
      console.error(err)
    })
}

// function batchUpload(listings) {
//   const batch = firebase.batch()
//   listings.forEach((listing) => {
//     const doc = firebase.doc(`listings/${listing.id}`)
//     batch.set(doc, listing)
//   })
//   console.log('Committing updates...')
//   batch.commit()
//     .then(() => {
//       console.log('Completed batch operation.')
//     })
//     .catch((err) => {
//       console.log(err)
//     })
// }

function runSyndication() {
  console.log('Fetching feed from ListHub...')
  fetchListhubFeed()
    .then((data) => {
      console.log('Processing data...')
      return processData(data)
    })
    .catch((err) => {
      console.error(err)
    })
    .then((listings) => {
      console.log('Creating listing status file...')
      // const csvData = [ ['ListingKey', 'Status', 'URL', 'Message', 'Timestamp'] ]
      // listings.forEach((listing) => {
      //   csvData.push([
      //     listing.listingKey,
      //     'SUCCESS',
      //     `https://sprynamics.now.sh/designer?product=postcard&size=9x6&agent=${listing.agentId}&listing=${listing.id}`,
      //     'Successfully imported',
      //     ''
      //   ])
      // })
      // csvStringify(csvData, (err, output) => {
      //   if (err) {
      //     console.error(err)
      //   } else {
      //     const date = new Date()
      //     const year = date.getFullYear()
      //     const month = date.getMonth() + 1
      //     const day = date.getDate()
      //     console.log(`${year}-${month}-${day}`)
      //     fs.writeFile(`listing_status_${year}-${month}-${day}.csv`, output)
      //   }
      // })
      console.log('Uploading data to firebase...')
      // batchUpload(listings)
      uploadAll(listings)
    })
    .catch((err) => {
      console.error(err)
    })
}

runSyndication()

// Schedule jobs for 4:00am and 4:00pm every day
schedule.scheduleJob('0 4 * * *', () => {
  console.log('Running syndication at ' + new Date())
  runSyndication()
})
schedule.scheduleJob('0 16 * * *', () => {
  console.log('Running syndication at ' + new Date())
  runSyndication()
})

app.get('/status', (req, res) => {
  const date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  console.log(`${year}-${month}-${day}`)
  res.download(path.resolve(__dirname, `listing_status_${year}-${month}-${day}.csv`))
})

app.listen(8080, () => console.log('Server listening on port 8080'))
const xml2js = require('xml2js-expat')
const fs = require('fs')
const firebase = require('./firebase')
const request = require('request')
const zlib = require('zlib')

const parser = new xml2js.Parser()

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
      if (listingIndex > 2) return

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


// function uploadAll(listingPhotos, index = 0) {
//   if (index >= listingPhotos.length) {
//     console.log('Finished uploading all photos.')
//     return
//   }
//   const photo = listingPhotos[index]
//   const uploadPath = 'listingPhotos/' + photo.id + '-' + photo.index + '.jpg'
// const task = firebase.upload(photo.url, uploadPath, { contentType: 'image/jpg' })
// task.then((res) => {
//   console.log(`Finished uploading photo #${index}`)
//   firebase.bucket.file(uploadPath).getSignedUrl({
//     action: 'read',
//     expires: '03-01-2500'
//   }).then((downloadUrl) => {
//     mockData[photo.agentId][photo.listingIndex].photos[photo.index] = downloadUrl[0]
//   })
//   uploadAll(listingPhotos, index + 1)
// }).catch((err) => {
//   console.error(err)
// })
// }


function uploadAll(listings, listingIndex = 0, photoIndex = 0) {
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
  firebase.upload(photo, uploadPath, { contentType: 'image/jpg' })
    .then((res) => {
      console.log(`Finished uploading photo #${photoIndex + 1}`)
      return firebase.bucket.file(uploadPath).getSignedUrl({
        action: 'read',
        expires: '03-01-2500'
      })
    })
    .then((downloadUrl) => {
      listings[listingIndex].photos[photoIndex] = downloadUrl[0]
      if (photoIndex >= listings[listingIndex].photos.length - 1) {
        firebase.doc(`listings/${listing.id}`).update({ photos: listing.photos })
          .then(() => {
            uploadAll(listings, listingIndex + 1)
          })
      } else {
        uploadAll(listings, listingIndex, photoIndex + 1)
      }
    })
    .catch((err) => {
      console.error(err)
    })
}

function batchUpload(listings) {
  const batch = firebase.batch()
  listings.forEach((listing) => {
    const doc = firebase.doc(`listings/${listing.id}`)
    batch.set(doc, listing)
  })
  console.log('Committing updates...')
  batch.commit()
    .then(() => {
      console.log('Completed batch operation.')
    })
    .catch((err) => {
      console.log(err)
    })
}

fetchListhubFeed()
  .then((data) => {
    return processData(data)
  })
  .then((listings) => {
    batchUpload(listings)
    // const photos = []
    // listings.forEach((listing, listingIndex) => {
    //   if (listing.photos) {
    //     listing.photos.forEach((photo, photoIndex) => {
    //       console.log('photo: ' + photo)
    //       photos.push({
    //         listingId: listing.id,
    //         listingIndex,
    //         photoIndex,
    //         url: photo
    //       })
    //     })
    //   }
    // })
    // console.log(photos[0])
    uploadAll(listings)
  })
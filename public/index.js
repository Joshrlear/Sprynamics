const path = require('path')

const express = require('express')
const app = express()
const basicAuth = require('express-basic-auth')

app.use(basicAuth({
  users: { 'admin': '$pry87@2+1' },
  challenge: true
}))

app.use(express.static('dist'))

app.get('*', (req, res) => {
  res.sendFile(path.resolve('dist', 'index.html'))
})

app.get('/')

const server = app.listen(3000, () => {
  console.log(`listening on port ${server.address().port}`)
})

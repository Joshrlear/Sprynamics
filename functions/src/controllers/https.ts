import * as corsModule from 'cors'
import * as functions from 'firebase-functions'

/**
 * Initialize CORS
 */
const whitelist = ['https://sprynamics.com']
// const cors = corsModule({
//   origin: (origin, callback) => {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Domain not whitelisted for CORS'))
//     }
//   },
//   optionsSuccessStatus: 200
// })

const cors = corsModule({ origin: true }) // testing only

/**
 * Creates a new HTTPS function to handle a given route and method
 * @param method The HTTPS request method to handle with this function (GET, POST, etc)
 * @param callback The function to handle this route (req, res)
 */
export function route(method: string, callback) {
  return functions.https.onRequest((req, res) => {
    return cors(req, res, (err?: any) => {
      if (err) {
        return res.status(500).json({ error: err.message })
      }
      if (req.method !== method) {
        return res.status(404).send({ error: `${req.method} is not supported for this route!` })
      }
      return callback(req, res)
    })
  })
}

const Router = require('restify-router').Router
const paginate = require('express-paginate')
// Utils
const log = require('../services/logger')
const errors = require('../services/errors')

/**
 * Create Routers
 */
const router = new Router() // api/v1 route wrapper
const routerResources = new Router() // router for every resource

/**
 * Middleware for pagination
 */
router.use(function (req, res, next) {
  if (req.query.limit <= 10) req.query.limit = 10
  res.locals = {}
  next()
}, paginate.middleware(10, 100))

// ===============================
// Resource routes
// ===============================

routerResources.add('/users', require('./users'))
// router_v1.add('/settings', require('./settings'))
// router_v1.add('/posts', require('./posts'))

// Add everything to route wrapper
router.add('/api/v1', routerResources)

module.exports = router

// const express = require('express')
// const paginate = require('express-paginate')
// const errors = require('../main/errors')
// const { log } = require('../main/logger')
// const router = express.Router()

// // Apply paginate middleware to API routes

// // API routes
// router.use('/users', require('../users/api/users'))
// router.use('/settings', require('../cms/api/settings'))
// router.use('/reaction-rule', require('../reactions/api/reaction-rule'))
// router.use('/reaction-instance', require('../reactions/api/reaction-instance'))
// router.use('/reaction-vote', require('../reactions/api/reaction-vote'))
// router.use('/posts', require('../cms/api/posts'))
// router.use('/services/reactions', require('../services/reactions'))

// // Catch 404 and forward to error handler.
// router.use((req, res, next) => {
//   next(errors.ErrNotFound)
// })

// // General api error handler. Respond with the message and error if we have it
// // while returning a status code that makes sense.
// router.use((err, req, res, next) => {
//   log.error(err)

//   if (err instanceof errors.APIError) {
//     res.status(err.status).json({
//       message: res.locals.t(`error/${err.translationKey}`),
//       error: err
//     })
//   } else {
//     res.status(500).json({})
//   }
// })

// module.exports = router

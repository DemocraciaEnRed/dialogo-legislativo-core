const {
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  BAD_REQUEST,
  FORBIDDEN
} = require('http-status')

class APIError extends Error {
  constructor (
    message,
    {
      status = INTERNAL_SERVER_ERROR,
      translationKey = null
    },
    metadata = {}
  ) {
    super(message)

    Error.captureStackTrace(this, this.constructor)

    this.status = status || 500
    this.translationKey = translationKey
    this.metadata = metadata
  }
}

const ErrNotFound = (message) => new APIError(message, {
  translationKey: 'NOT_FOUND',
  status: NOT_FOUND
})

const ErrBadRequest = (message, meta) => new APIError(message, {
  translationKey: 'BAD_REQUEST',
  status: BAD_REQUEST
}, meta)

const ErrMissingQuerystring = (fields) => new APIError('Missing querystring values', {
  translationKey: 'MISSING_PARAM',
  status: BAD_REQUEST
}, {
  fields: fields.join(', ')
})

const ErrMissingParam = (field) => new APIError('Missing required paramether', {
  translationKey: 'MISSING_PARAM',
  status: BAD_REQUEST
}, {
  field: field
})

const ErrInvalidParam = (field) => new APIError('Invalid paramether', {
  translationKey: 'INVALID_PARAM',
  status: BAD_REQUEST
}, {
  field: field
})

const ErrParamTooLong = (field) => new APIError('Paramether is too long', {
  translationKey: 'PARAM_LENGTH',
  status: BAD_REQUEST
}, {
  field: field
})

const ErrCommunitysNotInit = new APIError('The community have not been initialized', {
  translationKey: 'COMMUNITY_NOT_INIT',
  status: INTERNAL_SERVER_ERROR
})

const ErrCommunityInit = new APIError('The community is already initialized', {
  translationKey: 'COMMUNITYINIT',
  status: BAD_REQUEST
})

const ErrForbidden = new APIError('Resource not available', {
  translationKey: 'RESOURCE_NOT_AVAILABLE',
  status: FORBIDDEN
})

const ErrClosed = new APIError('The document is closed', {
  translationKey: 'DOCUMENT_CLOSED',
  status: FORBIDDEN
})

const ErrNotAuthorized = (message) => new APIError(message, {
  translationKey: 'NOT_AUTHORIZED',
  status: FORBIDDEN
})

const ErrUserNotLoggedIn = new APIError('User is not logged in', {
  translationKey: 'USER_NOT_LOGGED_IN',
  status: FORBIDDEN
})

const ErrNotAdmin = new APIError('User needs to be an admin', {
  translationKey: 'USER_NOT_ADMIN',
  status: FORBIDDEN
})

const ErrNotAdminNorOwner = new APIError('User don\'t have permission', {
  translationKey: 'USER_NOT_ADMIN_NOR_OWNER',
  status: FORBIDDEN
})

const ErrInvalidJSONSchema = (metadata) => new APIError('JSON Schema is not valid. Probably because of bad format', {
  translationKey: 'INVALID_JSON_SCHEMA',
  status: BAD_REQUEST
}, { errors: metadata })

const ErrInvalidData = (metadata) => new APIError('Data doesn\'t follow the specified JSON Schema.', {
  translationKey: 'INVALID_DATA_FOR_JSON_SCHEMA',
  status: BAD_REQUEST
}, { errors: metadata })

const ErrClosedComments = new APIError('The document does not allow comments', {
  translationKey: 'DOCUMENT_CLOSED_COMMENTS',
  status: FORBIDDEN
})

module.exports = {
  APIError,
  ErrNotFound,
  ErrBadRequest,
  ErrNotAuthorized,
  ErrMissingQuerystring,
  ErrMissingParam,
  ErrInvalidParam,
  ErrParamTooLong,
  ErrCommunitysNotInit,
  ErrCommunityInit,
  ErrUserNotLoggedIn,
  ErrNotAdmin,
  ErrNotAdminNorOwner,
  ErrForbidden,
  ErrClosed,
  ErrInvalidJSONSchema,
  ErrInvalidData,
  ErrClosedComments
}

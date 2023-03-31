const { Types: { ObjectId } } = require('mongoose')
const { merge } = require('lodash/object')
const Document = require('../models/document')
const DocumentVersion = require('../models/documentVersion')
const dbUser = require('../db-api/user')
const validator = require('../services/jsonSchemaValidator')
const errors = require('../services/errors')

exports.countAuthorDocuments = async function countAuthorDocuments (author) {
  return Document.count({ author: author })
}

exports.isAuthor = async function isAuthor (id, author) {
  let count = await Document.countDocuments({ _id: id, author: author })
  return count
}

// Create document
exports.create = async function create (documentData, customForm) {
  // Check if the data is valid
  validator.isDataValid(
    customForm.fields,
    documentData.content
  )
  // Create a new document
  let documentToSave = {
    author: documentData.author,
    customForm: customForm._id,
    published: documentData.published,
    acceptComments: documentData.acceptComments
  }
  // Save the document, to get the id
  let theDocument = await (new Document(documentToSave)).save()
  // Create a new version
  let versionToSave = {
    document: theDocument._id,
    version: 1,
    content: documentData.content,
    contributions: []
  }
  // Save the documentVersion
  let theVersion = await (new DocumentVersion(versionToSave)).save()
  // Refer the currentVersion of the document to the saved version.
  theDocument.currentVersion = theVersion._id
  // Save on DB
  await theDocument.save()
  theDocument.content = theVersion.content
  return theDocument
}

// Get document (with its last version)
exports.get = async function get (query) {
  let document = await Document.findOne(query).populate({ path: 'author', select: dbUser.exposeAll(false) }).populate('currentVersion').lean({ virtuals: true })
  // remove the following fields:
  // - emoteLike
  // - emoteDislike
  // - emoteLove
  // - emoteImprove
  delete document.emoteLike
  delete document.emoteDislike
  delete document.emoteLove
  delete document.emoteImprove
  return document
}

exports.retrieve = async function retrieve (query, sort) {
  let theSort = sort || {}
  console.log(theSort)
  let document = await Document.find(query).populate({ path: 'author', select: dbUser.exposeAll(false) }).populate('currentVersion').sort(theSort).lean({ virtuals: true })
  // for every document we need to remove the following fields:
  // - emoteLike
  // - emoteDislike
  // - emoteLove
  // - emoteImprove
  document.forEach((doc) => {
    doc.userReaction = null
    delete doc.emoteLike
    delete doc.emoteDislike
    delete doc.emoteLove
    delete doc.emoteImprove
  })
  return document
}

exports.retrieveWithUserReaction = async function retrieveWithUserReaction (query, sort, userId) {
  let theSort = sort || {}
  console.log(theSort)
  let document = await Document.find(query).populate({ path: 'author', select: dbUser.exposeAll(false) }).populate('currentVersion').sort(theSort).lean({ virtuals: true })
  // make a copy
  // for every document we need to check if the user has reacted to it
  // if so, add the reaction to the document
  document.forEach((doc) => {
    doc.userReaction = null
    if (doc.emoteLike.some((id) => id.equals(userId))) {
      doc.userReaction = 'like'
    } else if (doc.emoteDislike.some((id) => id.equals(userId))) {
      doc.userReaction = 'dislike'
    } else if (doc.emoteLove.some((id) => id.equals(userId))) {
      doc.userReaction = 'love'
    } else if (doc.emoteImprove.some((id) => id.equals(userId))) {
      doc.userReaction = 'improve'
    }

    // remove the following fields:
    // - emoteLike
    // - emoteDislike
    // - emoteLove
    // - emoteImprove
    delete doc.emoteLike
    delete doc.emoteDislike
    delete doc.emoteLove
    delete doc.emoteImprove
  })
  return document
}

// List documents
exports.list = async function list (query, { limit, page, sort }) {
  let optionsPaginate = {}
  optionsPaginate.limit = limit
  optionsPaginate.page = page
  optionsPaginate.lean = true
  optionsPaginate.populate = [{ path: 'author', select: dbUser.exposeAll(false) }, { path: 'currentVersion' }]
  if (sort) {
    optionsPaginate.sort = sort
  }
  let documentList = await Document.paginate(query, optionsPaginate)
  // let promisesPopulate = documentList.docs.map(async (doc) => {
  //   let theVersion = await DocumentVersion.findOne({
  //     document: doc._id,
  //     version: doc.lastVersion
  //   }).lean()
  //   let aux = doc
  //   aux.content = theVersion.content
  //   return aux
  // })
  // let populatedDocs = await Promise.all(promisesPopulate)
  // documentList.docs = populatedDocs
  return documentList
}

// Update document
exports.update = async function update (id, document) {
  // First, find if the document exists
  return Document.findOne({ _id: id })
    .then((_document) => {
      // Founded?
      if (!_document) throw errors.ErrNotFound('Document to update not found')
      // Deep merge the change(s) with the document
      let documentToSave = merge(_document, document)
      // Save!
      return documentToSave.save()
    })
}

// Update document
exports.addComment = async function addComment (id) {
  // First, find if the document exists
  return Document.findOne({ _id: id })
    .then((_document) => {
      // Founded?
      if (!_document) throw errors.ErrNotFound('Document to update not found')
      // Deep merge the change(s) with the document
      _document.commentsCount = _document.commentsCount + 1
      // Save!
      return _document.save()
    })
}

// Update document
exports.subtractComment = async function subtractComment (id) {
  // First, find if the document exists
  return Document.findOne({ _id: id })
    .then((_document) => {
      // Founded?
      if (!_document) throw errors.ErrNotFound('Document to update not found')
      // Deep merge the change(s) with the document
      _document.commentsCount = _document.commentsCount - 1
      // Save!
      return _document.save()
    })
}

exports.remove = function remove (id) {
  return Document.findOne({ _id: id })
    .then((document) => {
      if (!document) throw errors.ErrNotFound('Document to remove not found')
      document.remove()
    })
}

exports.apoyar = async function apoyar (documentId, userId) {
  // primero vemos si ya apoyó
  let documentApoyado = await Document.findOne({ _id: documentId, 'apoyos.userId': userId })
  if (!documentApoyado) { return Document.updateOne({ _id: documentId }, { '$push': { apoyos: { userId: userId } } }) } else { return documentApoyado }
}

exports.apoyarAnon = async function apoyarAnon (apoyoToken) {
  // primero vemos si ya apoyó
  let documentApoyado = await Document.findOne({ _id: apoyoToken.document._id, 'apoyos.email': apoyoToken.email })
  if (!documentApoyado) {
    await Document.updateOne({ _id: apoyoToken.document._id }, {
      '$push': {
        apoyos: {
          email: apoyoToken.email,
          nombreApellido: apoyoToken.nombreApellido
        }
      }
    })
  }
}

exports.react = async function react (documentId, userId, reaction) {
  // we have 4 arrays of User IDs,
  // first we need to check if the userID is in one of this arrays:
  // - emoteLike
  // - emoteLove
  // - emoteDislike
  // - emoteImprove
  let document = await Document.findOne({ _id: documentId })
  if (!document) throw errors.ErrNotFound('Document not found')
  let emoteLike = document.emoteLike || []
  let emoteLove = document.emoteLove || []
  let emoteDislike = document.emoteDislike || []
  let emoteImprove = document.emoteImprove || []
  let emoteLikeIndex = emoteLike.indexOf(userId)
  let emoteLoveIndex = emoteLove.indexOf(userId)
  let emoteDislikeIndex = emoteDislike.indexOf(userId)
  let emoteImproveIndex = emoteImprove.indexOf(userId)

  // if the user reacted in the same way, we need to remove the reaction
  if (emoteLikeIndex > -1 && reaction === 'like') {
    emoteLike.splice(emoteLikeIndex, 1)
    document.emoteLike = emoteLike
    return document.save()
  }
  if (emoteLoveIndex > -1 && reaction === 'love') {
    emoteLove.splice(emoteLoveIndex, 1)
    document.emoteLove = emoteLove
    return document.save()
  }
  if (emoteDislikeIndex > -1 && reaction === 'dislike') {
    emoteDislike.splice(emoteDislikeIndex, 1)
    document.emoteDislike = emoteDislike
    return document.save()
  }
  if (emoteImproveIndex > -1 && reaction === 'improve') {
    emoteImprove.splice(emoteImproveIndex, 1)
    document.emoteImprove = emoteImprove
    return document.save()
  }

  // if the user reacted in a different way, we need to remove the reaction
  if (emoteLikeIndex > -1 && reaction !== 'like') {
    emoteLike.splice(emoteLikeIndex, 1)
  }
  if (emoteLoveIndex > -1 && reaction !== 'love') {
    emoteLove.splice(emoteLoveIndex, 1)
  }
  if (emoteDislikeIndex > -1 && reaction !== 'dislike') {
    emoteDislike.splice(emoteDislikeIndex, 1)
  }
  if (emoteImproveIndex > -1 && reaction !== 'improve') {
    emoteImprove.splice(emoteImproveIndex, 1)
  }

  // now we need to add the user to the array that corresponds to the reaction
  switch (reaction) {
    case 'like':
      emoteLike.push(userId)
      break
    case 'love':
      emoteLove.push(userId)
      break
    case 'dislike':
      emoteDislike.push(userId)
      break
    case 'improve':
      emoteImprove.push(userId)
      break
  }
  // now we need to save the document
  document.emoteLike = emoteLike
  document.emoteLove = emoteLove
  document.emoteDislike = emoteDislike
  document.emoteImprove = emoteImprove
  return document.save()
}

exports.checkIfUserHasReacted = async function checkIfUserHasReacted (documentId, userId) {
  // we have 4 arrays of User IDs,
  // first we need to check if the userID is in one of this arrays:
  // - emoteLike
  // - emoteLove
  // - emoteDislike
  // - emoteImprove
  let document = await Document.findOne({ _id: documentId })
  if (!document) throw errors.ErrNotFound('Document not found')
  let emoteLike = document.emoteLike
  let emoteLove = document.emoteLove
  let emoteDislike = document.emoteDislike
  let emoteImprove = document.emoteImprove
  let emoteLikeIndex = emoteLike.indexOf(userId)
  let emoteLoveIndex = emoteLove.indexOf(userId)
  let emoteDislikeIndex = emoteDislike.indexOf(userId)
  let emoteImproveIndex = emoteImprove.indexOf(userId)
  // if the user is in one of the arrays, we need to remove it
  if (emoteLikeIndex > -1) {
    return 'like'
  }
  if (emoteLoveIndex > -1) {
    return 'love'
  }
  if (emoteDislikeIndex > -1) {
    return 'dislike'
  }
  if (emoteImproveIndex > -1) {
    return 'improve'
  }
  return null
}

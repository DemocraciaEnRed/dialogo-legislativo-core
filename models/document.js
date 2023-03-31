const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')
const mongooseLeanVirtuals = require('mongoose-lean-virtuals');

const ApoyoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  email: { type: String },
  nombreApellido: String,
  fecha: { type: Date, default: Date.now }
})

// Define `Document` Schema
const Document = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  customForm: { type: mongoose.Schema.Types.ObjectId, ref: 'CustomForm' },
  currentVersion: { type: mongoose.Schema.Types.ObjectId, ref: 'DocumentVersion' },
  published: { type: Boolean, required: true, default: false },
  acceptComments: { type: Boolean, required: true, default: false },
  publishedMailSent: { type: Boolean },
  commentsCount: { type: Number, default: 0 },
  apoyos: [ApoyoSchema],
  emoteLike: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
  emoteLove: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
  emoteImprove: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
  emoteDislike: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }]
}, {
  timestamps: true
})

Document.virtual('apoyosCount').get(function () { return this.apoyos && this.apoyos.length || 0 })

Document.virtual('emoteCount').get(function () {
  return {
    likes: (this.emoteLike && this.emoteLike.length) || 0,
    loves: (this.emoteLove && this.emoteLove.length) || 0,
    improve: (this.emoteImprove && this.emoteImprove.length) || 0,
    dislike: (this.emoteDislike && this.emoteDislike.length) || 0,
    total: ((this.emoteLike && this.emoteLike.length) || 0) + ((this.emoteLove && this.emoteLove.length) || 0) + ((this.emoteImprove && this.emoteImprove.length) || 0) + ((this.emoteDislike && this.emoteDislike.length) || 0)
  }
})

// Model's Plugin Extensions
Document.plugin(mongoosePaginate)
Document.plugin(mongooseLeanVirtuals);

// Expose Model
module.exports = mongoose.model('Document', Document)

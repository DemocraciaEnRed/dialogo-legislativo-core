const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')

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

// Model's Plugin Extensions
Document.plugin(mongoosePaginate)

Document.virtual('apoyosCount').get(() => this.apoyos && this.apoyos.length || 0)

Document.virtual('emotesCount').get(() => {
  return {
    likes: (this.emoteLike && this.emoteLike.length) || 0,
    loves: (this.emoteLove && this.emoteLove.length) || 0,
    improve: (this.emoteImprove && this.emoteImprove.length) || 0,
    dislike: (this.emoteDislike && this.emoteDislike.length) || 0,
    total: ((this.emoteLike && this.emoteLike.length) || 0) + ((this.emoteLove && this.emoteLove.length) || 0) + ((this.emoteImprove && this.emoteImprove.length) || 0) + ((this.emoteDislike && this.emoteDislike.length) || 0)
  }
})

// Expose Model
module.exports = mongoose.model('Document', Document)

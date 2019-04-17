const states = [
  'ARCHIVED',
  'PUBLISHED',
  'DELETED'
]

module.exports = {
  '@state': {
    type: String,
    required: true,
    enum: states
  },
  '@lastModified': {
    type: Date,
    required: true
  },
  '@lastCommitted': {
    type: Date,
    required: true
  },
  '@version': {
    type: Number,
    required: true
  },
  '@collection': {
    type: String,
    required: true
  }
}
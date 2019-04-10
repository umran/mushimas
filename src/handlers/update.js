const { filterUpdates } = require('./handlerUtils')

const updateOptions = {
  runValidators: true,
  new: true
}

module.exports = async ({model, collection, ackTime, args}) => {
  const { _id } = args
  const updates = filterUpdates(args)

  const matchCondition = { _id, '@lastModified': { $lte: ackTime }, '@status': { $not: 'DELETED' } }

  let document = await model.findOneAndUpdate(matchCondition, {
    ...updates,
    '@lastModified': ackTime,
    '@lastCommitted': new Date(),
    $inc: {
      '@version': 1
    }
  }, updateOptions)

  return _id
}

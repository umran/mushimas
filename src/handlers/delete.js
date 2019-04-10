const deleteOptions = {
  new: true
}

module.exports = async ({model, ackTime, args}) => {
  const { _id } = args
  const updates = filterUpdates(args)

  const matchCondition = { _id, '@lastModified': { $lte: ackTime }, '@status': { $not: 'DELETED' } }

  let document = await model.findOneAndUpdate(matchCondition, {
    '@status': 'DELETED',
    '@lastModified': ackTime,
    '@lastCommitted': new Date(),
    $inc: {
      '@version': 1
    }
  }, deleteOptions)

  return _id
}
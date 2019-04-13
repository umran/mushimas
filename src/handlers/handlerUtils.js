const { generateHash } = require('../crypto')

const handleObject = obj => {
  return Object.keys(obj)
    .sort()
    .reduce((output, key) => {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        if (Array.isArray(obj[key])) {
          output = output.concat(key).concat(handleArray(obj[key]))
        } else {
          output = output.concat(key).concat(handleObject(obj[key]))
        }
      } else {
        output = output.concat(key).concat(obj[key].toString())
      }

      return output
    }, "")
}

const handleArray = arr => {
  return arr.map((item, index) => {
    if (typeof item === 'object' && item !== null) {
      return handleObject(item)
    }

    return item.toString()
  })
    .sort()
    .join()
}

exports.generateKey = ({collection, args, method}) => {
  let material = handleObject(args)
  let hash = generateHash(material)

  return `${method}${collection}${hash}`
}

exports.formatResult = (result) => {
  if (Array.isArray(result)) {
    result = result.map(res => {
      res._id = res._id.toString()
      return res
    })
  } else if (result) {
    result._id = result._id.toString()
  }

  return result
}

exports.deriveArgs = args => {
  return Object.keys(args).filter(argKey => argKey !== '_options').reduce((accumulator, argKey) => {
    accumulator[argKey] = args[argKey]

    return accumulator
  }, {})
}

exports.filterUpdates = args => {
  return Object.keys(args).filter(key => (key !== '_id')).reduce((filtered, key) => {
    filtered[key] = args[key]
    return filtered
  }, {})
}

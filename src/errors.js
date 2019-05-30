class GenericError extends Error {
  constructor(code, message) {
    super()
    this.message = `${code}: ${message}`
  }
}

class SchemaError extends GenericError {}
class OptionsError extends GenericError {}
class BuildError extends GenericError {}

module.exports = {
  GenericError,
  SchemaError,
  OptionsError,
  BuildError
}

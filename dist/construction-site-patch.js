const defineProperty = require("./define-property")
const utils = require("./utils")

Object.defineProperty(
  ConstructionSite.prototype,
  "status",
  defineProperty({
    get: function() {
      if (!this._status) {
        this._status = `Construction site for ${this.structureType} is ${utils.percentage(
          this.progress,
          this.progressTotal
        )} complete`
      }

      return this._status
    }
  })
)

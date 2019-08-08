const defineProperty = require("./define-property")

Object.defineProperty(
  ConstructionSite.prototype,
  "status",
  defineProperty({
    get: function() {
      if (!this._status) {
        this._status = `Construction site for ${this.structureType} is ${Math.floor(
          (this.progress / this.progressTotal) * 100
        )}% complete`
      }

      return this._status
    }
  })
)

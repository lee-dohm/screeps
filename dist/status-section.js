class StatusSection {
  constructor(name) {
    this.name = name
    this.subsections = []
    this.entries = []
  }

  addEntry(entry) {
    this.entries.push(entry)
  }

  addSubsection(subsection) {
    this.subsections.push(subsection)
  }

  log() {
    this.logHeader()

    this.logEntries()
    this.logSpacer()

    if (this.subsections.length > 0) {
      this.logSubsections()
      this.logSpacer()
    }
  }

  logEntries() {
    this.entries.forEach(entry => console.log(entry))
  }

  logHeader() {
    console.log(`{bold}===== ${this.name} ====={/bold}`)
  }

  logSpacer() {
    console.log(" ")
  }

  logSubsections() {
    this.subsections.forEach(subsection => subsection.log())
  }
}

module.exports = StatusSection

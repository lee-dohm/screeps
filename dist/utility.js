function humanize(text) {
  let newText = text.split(/(?=[A-Z])/).join(" ")

  return newText.charAt(0).toUpperCase() + newText.slice(1)
}

module.exports = {
  humanize
}

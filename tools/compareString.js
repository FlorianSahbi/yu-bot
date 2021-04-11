function compareString(given, expected) {
  if (!given || !expected) {
    return "Missing something..."
  }
  if (given.length !== expected.length) {
    return "letter missing or too much";
  }
  if (given === expected) {
    return "100% Critical";
  }
  if (given !== expected) {
    if (given.toLowerCase() === expected.toLowerCase()) {
      return "Good !"
    }
    if (given.replace(/\s+/g, '') === expected.replace(/\s+/g, '')) {
      return "Good ! But too much space.s";
    }
    if (given.replace(/\s+/g, '').toLowerCase() === expected.replace(/\s+/g, '').toLowerCase()) {
      return "Good ! But too much space.s and miss ponctu";
    }
  }

  return "Euuh..."
}

exports.compareString = compareString;

function random(minimum, maximum) {
  return Math.floor(Math.random() * (maximum - minimum + 1) + minimum);
}

module.exports = {
  random,
};

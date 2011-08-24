var EmissionEstimate = module.exports = function() {};

EmissionEstimate.prototype.value = function() {
  if(this.data) {
    return this.data.emission;
  } else {
    return 'No data';
  }
};

EmissionEstimate.prototype.methodology = function() {
  if(this.data) {
    return this.data.methodology;
  } else {
    return 'No data';
  }
};

EmissionEstimate.prototype.toString = function() {
  return this.value().toString();
};

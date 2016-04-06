var VuduxData = function() {
  var data = {};

  var set = function(key, value) {
    data[key] = value;
  }

  var get = function(key) {
    return data[key];
  }

  return {
    get:get,
    set:set
  }
}

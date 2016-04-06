var VuduxReducer = function(vudux_data) {
  return function(state, action) {
    if(state === undefined)
      return vudux_data.get("state");

    var compositor = vudux_data.get("compositor");

    if(typeof(compositor) == "undefined") {
      console.warn("[COMPOSITOR IS NOT DEFINED]");
      console.warn("You should consider to define your own compositor class.");
      console.warn("For you safety, the default reducer will not work without a compositor.");
      return state;
    }

    if(typeof(compositor[action.type]) == "undefined") {
      console.warn("[ACTION " + action.type + " IS NOT DEFINED]");
      console.warn("You should consider double check your compositors.");
      return state;
    }

    var action_type = compositor[action.type];
    return action_type(state, action);

    return state;
  }
}

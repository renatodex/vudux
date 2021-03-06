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
// HOW TO USE:
//
// var view = new Vudux(".product-color");
// view.set("state", window.initialPageStore);
// view.set("compositor", window.Compositors);
// view.set("render", window.PageRender);
// view.set("methods", {
//   open_color_dropdown: function() {
//     view.dispatch(Actions.toggleColorDropdown());
//   },
//   dropdown_select_color: function(color) {
//     console.log('selecting');
//     view.dispatch(Actions.selectColor(color))
//   }
// })
// basicoview.start();

window.Vudux = function(element) {
  var element = element;
  var store;
  var vudux_data = new VuduxData();
  var vudux_reducer = new VuduxReducer(vudux_data);

  var start = function() {
    vudux_reducer = new VuduxReducer(vudux_data);

    if(typeof(vudux_data.get("state")) == "undefined") {
      console.warn("[INITIAL STATE NOT DEFINED]")
      console.warn("As a precaution, to avoid exceptions, an initial state of {} (empty object) was automaticaly declared for you.");
      console.warn("Consider to set your own initial state!");
      vudux_data.set("state", {});
    }

    if(typeof(vudux_data.get("render")) == "undefined") {
      console.warn("[RENDER METHOD NOT DEFINED]")
      console.warn("As a precaution, to avoid exceptions, an empty function was defined as your render method.");
      console.warn("Consider to declare your own render method!");
      vudux_data.set("render", function(){});
    }

    if(vudux_data.get("reducer") != undefined) {
      store = Redux.createStore(vudux_data.get("reducer"), vudux_data.get("state"), (
        window.devToolsExtension ? window.devToolsExtension() : function (f) {
          return f;
        }
      ));
    } else {
      store = Redux.createStore(vudux_reducer, vudux_data.get("state"), (
        window.devToolsExtension ? window.devToolsExtension() : function (f) {
          return f;
        }
      ));
      vudux_data.set("reducer", vudux_reducer);
    }

    store.subscribe(function() {
      subscribe_flow();
    });

    vudux_data.set("view", new Vue({
      el: element,
      data: {},
      methods: vudux_data.get("methods")
    }))

    subscribe_flow();
  }

  var subscribe_flow = function() {
    console.log("Starting Subscribe Flow");

    // 1. Syncing Vue State with Redux State
    _.each(store.getState(), function(v,k) {
      if(typeof(v) == "object") {
        vudux_data.get("view").$set(k, _.assign({}, v));
      } else {
        vudux_data.get("view").$set(k, v);
      }
    })

    // 2. Calling external render method, passing actual state
    vudux_data.get("render")(store.getState());

    // 3. Syncing Vudux State var with Redux State
    vudux_data.set('state', _.assign({}, store.getState()));
  }

  return {
    set:vudux_data.set,
    get:vudux_data.get,
    getStore: function() {
      return store;
    },
    getView: function() {
      return this.get("view");
    },
    getViewData: function() {
      return vudux_data;
    },
    default_reducer:vudux_reducer,
    start:start
  }
}

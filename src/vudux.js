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

    if(typeof(vudux_data.get("computed")) == "undefined") {
      vudux_data.set("computed", {});
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
      subscribe_flow(vudux_data, store);
    });

    vudux_data.set("view", new Vue({
      el: element,
      data: vudux_data.get("state"),
      methods: vudux_data.get("methods"),
      computed: vudux_data.get("computed")
    }))

    subscribe_flow(vudux_data, store);
  }

  var subscribe_flow = function(vudux_data, store) {
    console.log("Starting Subscribe Flow");

    // 1. Syncing Vue State with Redux State
    _.each(store.getState(), function(v,k) {
      // vudux_data.get("view").$delete(k);

      if(_.isPlainObject(v)) {
        vudux_data.get("view").$set(k, _.assign({}, v));
      } else if(_.isArray(v)) {
        vudux_data.get("view").$set(k, _.assign([], v));
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

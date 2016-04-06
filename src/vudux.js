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
      store = Redux.createStore(vudux_data.get("reducer"));
    } else {
      store = Redux.createStore(vudux_reducer);
      vudux_data.set("reducer", vudux_reducer);
    }

    store.subscribe(function() {
      vudux_data.get("render")(store.getState());
    });

    vudux_data.set("view", new Vue({
      el: element,
      data: {},
      methods: vudux_data.get("methods")
    }))

    vudux_data.get("render")(store.getState());
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

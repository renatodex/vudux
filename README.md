# Vudux

Vudux is a Wrapper that puts together Vue and Redux, syncronizing Vue's Data with Redux States, and allowing a complete rendering flow.

## Installation

To install, you need download and require the Vudux library on your code:

https://github.com/renatodex/vudux/blob/master/dist/vudux-0.2.0.js

There are 2 basic Dependencies for Vudux:
- Vue (https://vuejs.org/)
- Redux (http://redux.js.org/)

You must download and require the dependencies before Vudux Script.

## How to Use

Vudux is composed of 4 modules:

- State
The State represents the global State of your application. A Syncornization of Vue Data and Redux State.

- Methods
Methods are only an alias to Vue Methods.

- Compositors
Compositors is an abstraction of Redux Reducers.

- Render
The Render method is the Redux subscribed Render function. 

```javascript
 var state = {
    todo_input_label: "",
    todos: [
      { label: "Task 1", state: "undone" },
      { label: "Task 2", state: "undone" },
      { label: "Task 3", state: "undone" },
    ],
  };

  var view = new Vudux(".todos");
  view.set("state", state)

  view.set("methods", {
    add_todo: function() {
      view.getStore().dispatch({ type: "ADD_TODO", todo: {
        label: this.todo_input_label,
        state: "undone"
      }})
    },
    toggle_todo: function(todo) {
      view.getStore().dispatch({ type: "TOGGLE_TODO", todo: todo });
    },
  });

  view.set("compositor", {
    "TOGGLE_TODO": function(state, action) {
      return _.assign({}, state, {
        todos: state.todos.map(function(t) {
          if(t.label != action.todo.label) {
            return t;
          }

          return _.assign({}, t, {
            state: (t.state == "undone" ? "done" : "undone")
          })
        })
      })
    },

    "ADD_TODO": function(state, action) {
      var state = _.assign({}, state, {
        todos: _.concat(state.todos, [{
          label: action.todo.label,
          state: action.todo.state,
        }])
      })

      return state;
    },
  })

  view.set("render", function(state) {
    view.getView().$set("todos", _.assign({}, state.todos));
  })

  view.start();
```

## Author

Renato Alves (renatodex@gmail.com)

## Contribution

Feel free to Fork or send Pull Requests to contribute.

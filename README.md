# Ulmen Snabbdom

> [Snabbdom](https://github.com/snabbdom/snabbdom) bindings for [Ulmen](https://github.com/icechair/ulmen)

```sh
npm install ulmen-snabbdom
```

## Usage

```js
import { init, h } from 'snabbdom'
import { snabbUlm, display } from 'ulmen-snabbdom'
import { ulmen } from 'ulmen'

const patch = init(['with snabbdom modules'])
const render = display('div#root', patch)

const helloUlm = {
  init: { model: 'hello world' },
  update: (msg, model) => ({ state }),
  view: (model, dispatch) => h('p', model)
}

const ulm = snabbUlm(render, () => helloUlm)

ulmen(ulm).start()
```

## Documentation

```js
snabbUlm(render, () => Ulm): Ulm
```

- `render: (view: VNode) => void` render function which handles the virtual dom interaction
- `init: [state, effect?]` initial State and optional effect
- `update: (message, state) => [state,effect?]` update function which returns new state and optional effect
- `view: (state, dispatch) => VNode` return the snabbdom view representation

`snbbUlm` takes a render function and a function which returns a ulm `{init, update, view}` and returns a new ulm, which updates the virtual dom when `view` is called

```js
display(selector, patch): (view: VNode) => void
```

- `selector` the dom selector of the root element (for example `'div#root'`)
- `patch` a patch function created by `snabbdom.init()`

`display` is an example implementation of a function which creates a render function. it holds internally the reference to `oldNode`

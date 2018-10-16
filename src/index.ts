import { h } from 'snabbdom/h'
import { VNode } from 'snabbdom/vnode'
import { Program } from 'ulmen/dist/runtime'

export type Patcher = (oldNode: VNode | Element, vNode: VNode) => VNode
export type Render = (next: string | VNode | VNode[]) => void

export const display = (selector: string, patch: Patcher): Render => {
  let root = document.querySelector(selector) as Element | VNode
  return next => {
    root = patch(root, h(selector, next))
  }
}

export const program = <TState, TMessage>(
  render: Render,
  createApp: () => Program<TState, TMessage, VNode>
): Program<TState, TMessage, void> => {
  const app = createApp()
  const { view, done } = app
  return {
    ...app,
    view: (state, dispatch) => render(view(state, dispatch)),
    done: state => {
      if (done) {
        done(state)
      }
      render('')
    }
  }
}

module.exports = { display, program }

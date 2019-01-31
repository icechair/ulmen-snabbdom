import { h, VNodeChildren } from 'snabbdom/h'
import { VNode } from 'snabbdom/vnode'
import { toVNode } from 'snabbdom/tovnode'
import { Ulm } from 'ulmen/lib/ulm'

export type Patcher = (oldNode: VNode | Element, vNode: VNode) => VNode
export type Render = (next: VNodeChildren) => VNode

export const display = (selector: string, patch: Patcher): Render => {
  let root = h(selector)
  if (typeof document !== 'undefined') {
    root = toVNode(document.querySelector(selector) as Node)
  }
  return next => {
    root = patch(root, h(selector, next))
    return root
  }
}

export const snabbUlm = <TState, TMessage>(
  render: Render,
  createApp: () => Ulm<TState, TMessage, VNodeChildren>
): Ulm<TState, TMessage, void> => {
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

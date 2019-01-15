import test from 'tape'
import { JSDOM } from 'jsdom'
import { init, h } from 'snabbdom'
import { display, snabbUlm } from './index'
const dom = new JSDOM(`<html><body><div id="root"></div></body></html>`)
const { document } = dom.window
const patch = init([])

const id = <T>(x: T) => x
// @ts-ignore
global.document = document

test('display() test', t => {
  const render = display('div#root', patch)
  const root = document.querySelector('#root')
  if (!root) {
    return t.fail('jsdom failed')
  }
  const result = render('hello world')
  t.equal(root.innerHTML, 'hello world', 'render should work with strings')
  t.equal(typeof result, 'object', 'render should return the new VNode')
  render(h('p', 'hello world'))
  const p = root.children[0]
  t.equal(p.tagName.toLowerCase(), 'p', 'should have rendered a <p/>')
  t.equal(p.innerHTML, 'hello world', 'render should work with VNode')

  render([h('h1', 'hello'), h('h2', 'world')])
  t.equal(root.children.length, 2, 'should have rendered 2 elements')

  const h1 = root.children[0]
  t.equal(h1.tagName.toLowerCase(), 'h1', 'should have rendered a <h1/>')
  t.equal(h1.innerHTML, 'hello', `h1.innerHTML should be 'hello'`)

  const h2 = root.children[1]
  t.equal(h2.tagName.toLowerCase(), 'h2', 'should have rendered a <h2/>')
  t.equal(h2.innerHTML, 'world', `h2.innerHTML should be 'world'`)

  render('')
  t.equal(root.innerHTML, '', `render('') should clear the dom`)
  t.end()
})

test('snabbUlm() test', t => {
  const render = display('div#root', patch)
  const prog = snabbUlm(render, () => ({
    init: { state: 0 },
    update: (_msg, state) => ({ state }),
    view: (state, signal) => h('p', state)
  }))
  const root = document.querySelector('#root')
  if (!root) {
    return t.fail('jsdom failed')
  }
  prog.view(1, id)
  t.equal(root.children.length, 1, 'view should have modified the dom')
  const p = root.children[0]
  t.equal(p.innerHTML, '1', 'the state should be rendered')
  if (!prog.done) {
    return t.fail('prog should have a done function')
  }
  prog.done(0)
  t.equal(root.innerHTML, '', 'done should unmount the VNodes')
  const timer = setTimeout(() => t.fail('done was not called'), 10)
  const progWithDone = snabbUlm(render, () => ({
    init: { state: 0 },
    update: (_msg, state) => ({ state }),
    view: state => h('p', state),
    done: _ => clearTimeout(timer)
  }))
  if (!progWithDone.done) {
    return t.fail('prog should have a done function')
  }
  progWithDone.done(0)
  t.end()
})

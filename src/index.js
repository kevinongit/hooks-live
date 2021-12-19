import './styles.css'
import {createElement, render, fetchApi} from './utils'

const React = (function () {
  let hooks = []
  let idx = 0

  function workLoop() {
    idx = 0
    render(hooks)()
    setTimeout(workLoop, 300)
  }
  setTimeout(workLoop, 300)

  function useState(initVal) {
    const state = hooks[idx] || initVal
    const _idx = idx
    const setState = newVal => {
      hooks[_idx] = newVal
    }
    idx++

    return [state, setState]
  }

  function useEffect(cb, deps) {
    let hasChanged = true
    const oldDeps = hooks[idx]
    ///detect change
    if (oldDeps) {
      hasChanged = deps.some((dep, i) => !Object.is(dep, oldDeps[i]))
    }

    if (hasChanged) {
      cb()
    }
    hooks[idx++] = deps
  }

  // function render(Component) {
  //   idx = 0
  //   const C = Component()
  //   C.render()
  //   return C
  // }

  return {useState, useEffect, render: render(hooks), createElement}
})()

function useDogs(count) {
  const [list, setList] = React.useState([])

  React.useEffect(() => {
    fetchApi(count).then(data => setList(data))
  }, [count])
  return list
}

function Component() {
  const [count, setCount] = React.useState(0)
  const list = useDogs(count)

  return (
    <main>
      <h1>
        This is <i>NOT</i> React!!
      </h1>
      <button onClick={() => setCount(count + 1)}>Click Me!! : {count}</button>
      {list.map(item => (
        <img src={item} />
      ))}
    </main>
  )
}

const root = document.getElementById('root')
React.render(<Component />, root)

// let App = React.render(Component)
// App.click()
// App = React.render(Component)
// App.type('🍌')
// App = React.render(Component)

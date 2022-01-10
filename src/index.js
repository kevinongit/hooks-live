import './styles.css'
import {render, createElement} from './utils'

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

    if (oldDeps) {
      hasChanged = deps.some((dep, i) => !Object.is(dep, oldDeps[i]))
    }

    if (hasChanged) {
      cb()
    }
    hooks[idx++] = deps
  }

  return {useState, useEffect, createElement, render: render(hooks)}
})()

function Component() {
  const [count, setCount] = React.useState(0)
  const list = useFaces(count)

  return (
    <main>
      <h1>
        This is <i>Not</i> REACT.
      </h1>
      <button onClick={() => setCount(count + 1)}>Click Me!! : {count}</button>
      {list.map(item => (
        <img src={item} alt="" />
      ))}
    </main>
  )
}

function useFaces(count) {
  const [list, setList] = React.useState([])

  React.useEffect(() => {
    if (count > 0) {
      fetch(`http://localhost:8080/api/faces/${count}`)
        .then(data => data.json())
        .then(data => setList(data))
    }
  }, [count])

  return list
}

const root = document.getElementById('root')
React.render(<Component />, root)

const ui = ( function() {
  const LONG_TICK = 10000
  const CELL_SIZE = 40

  const $ = {
    controls: {
      run: document.querySelector('.controls__run'),
      stop: document.querySelector('.controls__stop'),
      reset: document.querySelector('.controls__reset'),
      speed: document.querySelector('.controls__speed'),
    },
    state: {
      name: document.querySelector('.state__name'),
      tape: document.querySelector('.state__tape'),
      head: document.querySelector('.state__head')
    },
    editor: {
      initialState: document.querySelector('.editor__initial-state'),
      config: document.querySelector('.editor__config')
    },
  }

  // flags
  let forceStop = false
  let keep = false
  let currentSpeed = 20
  let machine = new TuringMachine()

  const displayState = state => {
    $.state.name.textContent = state.name
    $.state.head.style.transform = `translateX(${CELL_SIZE * state.head}px)`

    state.tape.split('').forEach((char, idx) => {
      let $cell = $.state.tape.children[idx + 1]
      
      if( ! $cell) {
        $cell = document.createElement('div')
        $cell.classList.add('state__tape__cell')
        $.state.tape.appendChild($cell)
      }

      $cell.textContent = char
    })
  }

  const run = () => {
    if(!forceStop && keep) {
      keep = machine.tick()
      setTimeout(run, LONG_TICK / currentSpeed)
    }

  }

  const reset = () => {
    //1st is head
    while($.state.tape.children.length > 1) {
      $.state.tape.children[1].remove()
    }

    const stateStr =  $.editor.initialState.value
    const configStr = $.editor.config.value

    const state = parse.state(stateStr)
    const config = parse.config(configStr)

    machine = new TuringMachine(config, state)

    machine.addEventListener('update', displayState)
  }

  $.controls.run.addEventListener('click', e => {
    if( ! forceStop && ! keep) reset()
    
    forceStop = false
    keep = true
    run()
  })

  $.controls.reset.addEventListener('click', reset)

  $.controls.stop.addEventListener('click', e => {
    forceStop = true
  })

}() )
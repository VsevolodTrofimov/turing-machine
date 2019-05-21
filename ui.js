const ui = (function () {
  const LONG_TICK = 10000
  const CELL_SIZE = 40

  const $ = {
    controls: {
      run: document.querySelector('.controls__run'),
      stop: document.querySelector('.controls__stop'),
      reset: document.querySelector('.controls__reset'),
      speed: document.querySelector('.controls__speed'),
      save: document.querySelector('.controls__save'),
    },
    state: {
      name: document.querySelector('.state__name'),
      tape: document.querySelector('.state__tape'),
      head: document.querySelector('.state__head'),
      ticks: document.querySelector('.state__ticks')
    },
    editor: {
      initialState: document.querySelector('.editor__initial-state'),
      config: document.querySelector('.editor__config')
    },
  }

  // flags
  let forceStop = false
  let keep = false
  let currentSpeed = 40
  let machine = new TuringMachine()
  let ticks = 0


  const updateTransition = () => {
    const easeDuration = 200

    const duration = Math.min(LONG_TICK / currentSpeed, easeDuration)
    let ease = 'ease'

    if (duration < easeDuration) {
      ease = 'linear'
    }

    if (duration < 40) {
      $.state.head.style.transition = 'none'
      return
    }

    $.state.head.style.transition = `${Math.ceil(duration)}ms ${ease}`;
  }

  const displayState = state => {
    $.state.name.textContent = state.name
    $.state.head.style.transform = `translateX(${CELL_SIZE * state.head}px)`

    state.tape.split('').forEach((char, idx) => {
      let $cell = $.state.tape.children[idx + 1]

      if (!$cell) {
        $cell = document.createElement('div')
        $cell.classList.add('state__tape__cell')
        $.state.tape.appendChild($cell)
      }

      $cell.textContent = char
    })

    $.state.ticks.innerHTML = ticks
  }

  const run = () => {
    $.state.head.classList.add('state__head--inactive')

    if (!forceStop && keep) {
      $.state.head.classList.remove('state__head--inactive')
      keep = machine.tick()
      ticks += 1
      setTimeout(run, LONG_TICK / currentSpeed)
    }
  }

  const reset = () => {
    //1st is head
    while ($.state.tape.children.length > 1) {
      $.state.tape.children[1].remove()
    }

    const stateStr = $.editor.initialState.value
    const configStr = $.editor.config.value

    const state = parse.state(stateStr)
    const config = parse.config(configStr)

    machine = new TuringMachine(config, state)
    ticks = 0

    machine.addEventListener('update', displayState)
  }

  $.controls.run.addEventListener('click', () => {
    if (!forceStop && !keep) reset()

    if (forceStop || !keep) {
      setTimeout(run, LONG_TICK / currentSpeed)
      $.state.head.classList.remove('state__head--inactive')
    }

    forceStop = false
    keep = true
  })

  $.controls.reset.addEventListener('click', reset)

  $.controls.stop.addEventListener('click', () => {
    forceStop = true
  })

  $.controls.speed.value = currentSpeed
  $.controls.speed.addEventListener('change', () => {
    currentSpeed = $.controls.speed.value
    updateTransition()
  })

  $.controls.save.addEventListener('click', () => {
    const state = LZString.compressToEncodedURIComponent($.editor.initialState.value)
    const config = LZString.compressToEncodedURIComponent($.editor.config.value)
    window.location.search = `state=${state}&config=${config}`
  })

  // on run
  window.addEventListener('load', () => {
    const query = window.location.search
    if (!query) return

    const KVpairs = query.substr(1).split("&").map(kv => kv.split("="))
    for (const [key, value] of KVpairs) {
      if (key === 'state') {
        $.editor.initialState.value = LZString.decompressFromEncodedURIComponent(value)
      }
      if (key === 'config') {
        $.editor.config.value = LZString.decompressFromEncodedURIComponent(value)
      }
    }

    updateTransition()
    reset()
  })
}())

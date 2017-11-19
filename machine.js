const TuringMachine = ( function() {
  const replaceByIdx = (str, idx, newChar) => str.substring(0, idx) + newChar + str.substring(idx + 1)
  
  const machineMoves = {
    'S': () => {},
    'R': state => {
      state.head++
      if(state.head === state.tape.length) state.tape += '0'
    },
    'L': state => {
      if(state.head === 0) state.tape = '0' + state.tape
      else state.head--
    }
  }

  class TuringMachine {
    constructor(transitions, state) {
      this.state = state

      this.transitions = transitions
      this.tick = this.tick.bind(this)
    
      this.on = {
        update: []
      }

      setTimeout(() => this.update(), 0)
    }

    tick() {
      const current = `q(${this.state.name})${this.state.tape[this.state.head]}`
      const next = this.transitions[current]
      if(typeof next === 'undefined') return false

      this.state.name = next.name
      this.state.tape = replaceByIdx(this.state.tape, this.state.head, next.value)

      machineMoves[next.direction](this.state)

      this.update()

      return true
    }

    update() {
      this.on.update.forEach(f => f(this.state))
    }

    addEventListener(e, cb) {
      this.on[e].push(cb)
    }
  }

  return TuringMachine
}() )

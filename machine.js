const TuringMachine = ( function() {
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
    constructor(transitions) {
      this.state = {
        current: '',
        tape: '',
        head: 0
      },

      this.transitions = transitions
      this.tick = this.tick.bind(this)
    
      this.on = {
        update: []
      }
    }

    tick() {
      const next = transitions[`q(${this.state.current})${this.tape[this.head]}`]
      if(typeof next === 'undefiend') return false

      this.state.current = next.state
      this.state.tape[this.state.head] = next.value

      machineMoves[next.direction](this.state)

      this.on.update.forEach(f => f(this.state))
    }
  }

  return TuringMachine
}() )

const parse = ( function() {
  const unfoldExpression = (str, expressionStart) => {
    let tape = ''
    
    for(i = expressionStart; i < str.length; i++) {
      if(str[i] === '[') {
        const unfolded = unfoldExpression(str, i + 1)
        tape += unfolded.tape
        i = unfolded.cursor

      } else if(str[i] === ']') {
        const endIdx = str.indexOf(')', i)
        const repeats = parseInt(str.substring(i + 2, endIdx), 10)

        tape = tape.repeat(repeats)
        i = endIdx
        break

      } else if(str[i] === '(') {
        const endIdx = str.indexOf(')', i)
        const repeats = parseInt(str.substring(i + 1, endIdx), 10)
        const lastChar = tape[tape.length - 1]

        tape += lastChar.repeat(repeats - 1)
        i = endIdx

      } else tape += str[i] 
    }

    return {
      tape,
      cursor: i
    }
  }
  
  const parseState = str => {
    const state = {
      current: '0',
      tape: '',
      head: 0
    }
    let i = 0

    for(i; i < str.length; i++) {
      if(str[i] === '[') {
        const unfolded = unfoldExpression(str, i + 1)
        state.tape += unfolded.tape
        i = unfolded.cursor
      
      } else if(str[i] === 'q' && str[i + 1] === '(') { 
        const endIdx = str.indexOf(')', i)
        state.current = str.substring(i + 2, endIdx)
        i = endIdx
        state.head = state.tape.length

      } else if(str[i] === '(') {
        const endIdx = str.indexOf(')', i)
        const repeats = parseInt(str.substring(i + 1, endIdx), 10)
        const lastChar = state.tape[state.tape.length - 1]

        state.tape += lastChar.repeat(repeats - 1)
        i = endIdx
     
      } else state.tape += str[i] 
    }

    return state
  }

  const parseConfig = str => {
    const transitions = {}
    const expressions = str.split('\n')

    expressions.forEach(expression => {
      expression = expression.replace(/\/\/.*$/g, '')
      if(!expression) return
      
      const [from, to, direction] = expression.split('-').map(s => s.trim())

      const toValueIdx = to.indexOf(')') + 1
      const next = {
        state: to.substring(2, toValueIdx - 1),
        value: to.substring(toValueIdx),
        direction
      }
      transitions[from] = next
    })

    return transitions
  }

  return {
    state: parseState,
    config: parseConfig
  }
}() )
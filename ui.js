const ui = ( function() {
  document.querySelector('.controls__run').addEventListener('click', e => {
    const stateStr = document.querySelector('.editor__initial-state').value
    const configStr = document.querySelector('.editor__config').value
    
    console.log('state', parse.state(stateStr))
    console.log('config', parse.config(configStr))
  })
}() )
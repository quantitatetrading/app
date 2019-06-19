onload = () => {

  var ide = document.getElementById('IDE')

  require('electron').ipcRenderer.on('url', (event, url) => {

    document.getElementById('loading').style.display = 'none'
    document.getElementById('IDE').style.display = 'flex'

    console.log(url)

    ide.src = url

  })

}

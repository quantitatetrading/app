// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const { exec, spawn } = require('child_process');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow (error, stdout, stderr) {

  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      nodeIntegration: true,
      webviewTag: true,
    }
  })

  mainWindow.loadFile('index.html')

  startJupyter().then((url) => {

    console.log("HEY", url)

    mainWindow.webContents.send('url', url)

    mainWindow.on('closed', function () {

      removeContainers()

      mainWindow = null
    })

  })

}

function removeContainers(callback){
  exec('docker stop quantitate && docker rm quantitate', (error, stdout, stderr) => {callback() || console.log(error, stdout, stderr)})
}

function startJupyter(){

  return new Promise((resolve, reject) => {

    exec('docker pull quantitate/notebook:latest', (error, stdout, stderr) => {

      console.log(error, stdout, stderr)

      removeContainers(()=> {

        const docker = spawn('docker', ['run', '-p', '8888:8888', '--name', 'quantitate', 'quantitate/notebook:latest'])


        docker.stderr.on('data', (data) => {

          var out = data.toString('utf8')

          console.log(out)

          if(out.indexOf('token') > -1){


            var token = out.substring(out.indexOf('=') + 1, out.indexOf('=') + 50)

            resolve('http://127.0.0.1:8888/?token=' + token)
          }
        })
      })
    })
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {

  if (process.platform !== 'darwin') app.quit()

})

app.on('activate', function () {

  if (mainWindow === null) createWindow()

})

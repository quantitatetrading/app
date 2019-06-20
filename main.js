// Modules to control application life and create native browser window
const {app, BrowserWindow, BrowserView} = require('electron')
const { exec, spawn } = require('child_process');
const commandExists = require('command-exists').sync;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

if (commandExists('docker')) {
    console.log('Docker is present on your system')
} else {
    console.log('Docker is not installed. Please install Docker or Docker Toolbox.')
    app.quit();
}

function createWindow(error, stdout, stderr) {
  const { width, height } = require('electron').screen.getPrimaryDisplay().workAreaSize
  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    webPreferences: {
      nodeIntegration: true,
      webviewTag: true,
      }
  })
    console.log("MADE WINDOW");
    mainWindow.loadFile('index.html');

  startJupyter().then((url) => {

      // mainWindow.webContents.send('url', url);

    mainWindow.on('closed', function () {

        removeContainers();

        mainWindow = null;
    })

    let view = new BrowserView()
    mainWindow.setBrowserView(view)
    view.setBounds({ x: 0, y: 0, width: width, height: height })
    view.setAutoResize({width:true, height: true})
    view.webContents.loadURL(url)

  })

}

function removeContainers(callback){
  exec('docker stop quantitate && docker rm quantitate', (error, stdout, stderr) => {callback() || console.log(error, stdout, stderr)})

}

function getDockerIPv4() {
    return new Promise ((resolve, reject) => {
      if(process.platform == "win32"){
        exec("docker-machine ip", (error, stdout, stderr) => {
            resolve(stdout);
        })
      } else {
        resolve("127.0.0.1")
      }
  })
}

function startJupyter(){

  return new Promise((resolve, reject) => {

    exec('docker pull quantitate/notebook:latest', (error, stdout, stderr) => {

        console.log(error, stdout, stderr);

      removeContainers(()=> {

        const docker = spawn('docker', ['run', '-p', '8888:8888', '--name', 'quantitate', 'quantitate/notebook:latest'])
          

        docker.stderr.on('data', (data) => {

            var out = data.toString('utf8');

            console.log(out);

            if(out.indexOf('token') > -1){

                var token = out.substring(out.indexOf('=') + 1, out.indexOf('=') + 50);

                getDockerIPv4().then((ip) => {
                console.log("This is the IP:", ip);
              
                resolve('http://' + ip + ':8888/?token=' + token);
              })
          }
        })
      })
    })
  })
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {

    if (process.platform !== 'darwin') app.quit();

})

app.on('activate', function () {

    if (mainWindow === null) createWindow();

})


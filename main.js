const { app, BrowserWindow, ipcMain } = require('electron');
const axios = require('axios');
var fs = require('fs');
const os = require('os');
const storage = require('electron-json-storage');
 storage.setDataPath(os.tmpdir());


let win;
function createWindow () {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
          nodeIntegration: true
        }
      })
      storage.clear(function(error) {
        if (error) throw error;
      });
    win.loadFile('index.html')

  win.webContents.openDevTools()
  const dataPath = storage.getDataPath();
   
}



ipcMain.on('form-submission', function (event, email,password) {
    fetchData(email,password);
    console.log("data form ->", email,password)

});
var email='';
function fetchData(email,password) {
    //axios.defaults.headers.post['Content-Type'] = 'application/json';
    axios.post('http://localhost:3000/api/v1/match', {email:email,password:password})
    .then((res) => {
        if(res.data.length == 1){
        newWindow('loggedin.html') 
        storage.set('email',  { 'email': res.data }, function(error) {
            if (error) throw error;
          });

        }
        
    })
    .catch((error) => {
      console.error(error);
    });
  }

//new window
 function newWindow (fn){
    win.loadFile(fn)
  }




  ipcMain.on('stop', function (event) {
    stop() ;
    });

  function stop() {
    storage.get('email', function(error, data) {

    axios.post('http://localhost:3000/api/v1/toggle', data)
    .then((res) => {
    })
    .catch((error) => {
      console.error(error);
    });
  });
}


app.on('ready', createWindow)
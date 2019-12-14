const { app, BrowserWindow, ipcMain} = require('electron');
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
        else{

          const { dialog } = require('electron')
          const options = {
            type: 'question',
            buttons: ['OK'],
            defaultId: 2,
            title: 'error message',
            message: 'Email or password not matched',
            
          };
          dialog.showMessageBox(null, options, (response) => {
            
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


app.on('before-quit', () => 

    storage.get('email', function(error, data) {
      axios.post('http://localhost:3000/api/v1/logout', data)
    })
 
);


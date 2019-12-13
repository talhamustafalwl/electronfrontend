const ipcRenderer = require('electron').ipcRenderer;

function sendForm(event) {
    event.preventDefault() 
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    ipcRenderer.send('form-submission', email,password)
}


function stop() {
    ipcRenderer.send('stop')
}
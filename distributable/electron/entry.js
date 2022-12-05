/*
 * 2022 Tarpeeksi Hyvae Soft
 *
 * Software: lintulista-electron
 * 
 */

const {app, BrowserWindow} = require("electron");

app.whenReady().then(()=>{
    try {
        start_server();
        start_client();
    }
    catch (error) {
        console.error("Lintulista crashed!", error);
        process.exit();
    }
});

function start_server() {
    const http = require("http");
    const {LL_ProcessRequest} = require("../server/process-request.js");
    http.createServer(LL_ProcessRequest).listen(8080, "127.0.0.1");
}

function start_client() {
    const mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        show: false,
    });

    if (!process.env.LL_DEV) {
        mainWindow.setMenu(null);
    }

    mainWindow.loadFile("../client/index.html", {hash: process.argv[2]});

    mainWindow.on("ready-to-show", ()=>{
        mainWindow.show();
        mainWindow.focus();
    });
}

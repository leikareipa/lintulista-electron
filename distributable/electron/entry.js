/*
 * 2022 Tarpeeksi Hyvae Soft
 *
 * Software: lintulista-electron
 * 
 */

const appName = "Lintulista";
const listKey = process.argv?.[2];

if (typeof listKey !== "string") {
    console.error("No list key specified.");
    process.exit();
}
else if (!/^[a-z0-9]{9}$/.test(listKey)) {
    console.error("Malformed list key.");
    process.exit();
}

const Electron = require("electron");
Electron.app.enableSandbox();
Electron.app.whenReady().then(()=>{
    try {
        set_web_request_handler();
        start_server();
        start_client();
    }
    catch (error) {
        console.error(`${appName} crashed!`, error);
        process.exit();
    }
    
    function set_web_request_handler()
    {
        Electron.session.defaultSession.webRequest.onBeforeRequest({urls: ["*://*/*"]}, (details, callback)=>{
            const URL = require('url').URL;
            const parsedTargetUrl = new URL(details.url);

            switch (parsedTargetUrl.host + parsedTargetUrl.pathname) {
                // The user interacting with the list by adding/removing/modifying observations.
                case "localhost:8080/": {
                    if (
                        (parsedTargetUrl.search !== `?list=${listKey}`) ||
                        !["GET", "PUT", "DELETE"].includes(details.method)
                    ){
                        break;
                    }

                    return callback({});
                }
                // The user logging in (POST) or out (DELETE).
                case "localhost:8080/login": {
                    if (!["POST"].includes(details.method)) {
                        break;
                    }

                    return callback({});
                }
                default: break;
            }
            
            console.log(`${appName}: Ignoring ${details.method} request to ${parsedTargetUrl.toString()}`);
        });
    }

    function start_server() {
        const http = require("http");
        const {LL_ProcessRequest} = require("../server/process-request.js");

        http.createServer(LL_ProcessRequest).listen(8080, "127.0.0.1"); 
    }

    function start_client() {
        const mainWindow = new Electron.BrowserWindow({
            width: 1280,
            height: 720,
            show: false,
        });

        if (!process.env.LL_DEV) {
            mainWindow.setMenu(null);
        }

        mainWindow.loadFile("../client/index.html", {hash: listKey});
        
        // The app isn't expected to open any new windows.
        mainWindow.webContents.setWindowOpenHandler(()=>({action: "deny"}));

        mainWindow.on("ready-to-show", ()=>{
            mainWindow.show();
            mainWindow.focus();
        });
    }
});

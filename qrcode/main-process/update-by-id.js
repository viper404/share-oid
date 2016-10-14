const ipc = require('electron').ipcMain
const fs = require('fs')
const path = require('path')
const storage = require('electron-json-storage')

ipc.on('UpdateById-message', function (event, arg) {
  let output = new Object()
  let arr = `${arg}`.split(';')
  let target = arr.shift()
  storage.get('data', function (err, obj) {
    if (err) {
      throw err
    }
    for (let oid in obj) {
      output[oid] = [].concat(obj[oid])
    }
    let str = target+' Not Found!'
    if (output.hasOwnProperty(target)) {
      output[target] = [].concat(arr)
      str = target+','+output[target].toString()
    }
    storage.set('data', output, function (err) {
      if (err) {
        throw err
      }
      event.sender.send('UpdateById-reply', str)
    })
  })
})

const os = require('os')
const electron = require('electron')
const BrowserWindow = electron.BrowserWindow
const shell = electron.shell

ipc.on('UpdateById-pdf', function (event) {
  let pdfPath = path.join(os.tmpdir(), 'print.pdf')
  let win = BrowserWindow.fromWebContents(event.sender)
  win.webContents.printToPDF({pageSize: 'A3'}, function (error, data) {
    if (error) {
      throw error
    }
    fs.writeFile(pdfPath, data, function (error) {
      if (error) {
        throw error
      }
      shell.openExternal('file://'+pdfPath)
    })
  })
})

ipc.on('UpdateByIdShow-message', function (event, arg) {
  let output = new Object()
  storage.get('data', function (err, obj) {
    if (err) {
      throw err
    }
    let str = ''
    for (let oid in obj) {
      output[oid] = [].concat(obj[oid])
      str = str+oid+','+output[oid].toString()+'<br>'
    }
    storage.set('data', output, function (err) {
      if (err) {
        throw err
      }
      event.sender.send('UpdateByIdShow-reply', str)
    })
  })
})

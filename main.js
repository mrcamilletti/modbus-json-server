var objArgs = {};

if (process.env.PORT) objArgs["port"]=parseInt(process.env.PORT);
if (process.env.SERIAL) objArgs["serial"]=process.env.SERIAL;
if (process.env.BAUD) objArgs["baud"]=parseInt(process.env.BAUD);

process.argv.slice(2).forEach(function (item, index) {
  var arg = item.split("=");
  objArgs[arg[0].trim()]=arg[1].trim();
});


for( var key in objArgs ) {
  console.log(key + ": " + objArgs[key]);
}

// create an empty modbus client
var ModbusRTU = require("modbus-serial");
var client = new ModbusRTU();

var TaskQueue = require('./taskQueue');
var conector = new TaskQueue(1);

const Net = require('net');
//const server = new Net.Server();
var sockets = [];
const port = parseInt(objArgs["port"]) || 5502;
const host = '127.0.0.1';
const server = new Net.Server();

// open connection to a serial port
const serial = objArgs["serial"] || "/dev/ttyRS485";
const baud = parseInt(objArgs["baud"]) || 19200;

console.log(port);
console.log(serial);
console.log(baud);

client.connectRTUBuffered(serial, { baudRate: baud }, ready);
client.setTimeout(50);

function sendTelegram (telegram) {
  client.setTimeout(telegram.timeout || 100);
  client.setID(telegram.id || 1);
  if (telegram.hasOwnProperty('read')) {
    // Check all the vars...
    if (telegram.hasOwnProperty('from') && telegram.hasOwnProperty('to')) {
      // TODO: Check if diference is greater or equal to zero
      telegram.addr = telegram.from;
      telegram.quantity = telegram.to - telegram.from + 1;
    }
    // And run task!!
    switch(telegram.read) {
      case 'coil':
          return new Promise(function(resolve, reject) {
            client.readCoils(telegram.addr, telegram.quantity || 1)
            .then( function(r){
              telegram.result = r;
              return resolve(telegram);
            })
            .catch( function(e){
              telegram.error = e;
              return reject(telegram);
            })
          });
      case 'discrete':
          return new Promise(function(resolve, reject) {
            client.readDiscreteInputs(telegram.addr, telegram.quantity || 1)
            .then( function(r){
              telegram.result = r;
              return resolve(telegram);
            })
            .catch( function(e){
              telegram.error = e;
              return reject(telegram);
            })
          });
      case 'holding':
          return new Promise(function(resolve, reject) {
            client.readHoldingRegisters(telegram.addr, telegram.quantity || 1)
            .then( function(r){
              telegram.result = r;
              return resolve(telegram);
            })
            .catch( function(e){
              telegram.error = e;
              return reject(telegram);
            })
          });
      case 'input':
          return new Promise(function(resolve, reject) {
            client.readInputRegisters(telegram.addr, telegram.quantity || 1)
            .then( function(r){
              telegram.result = r;
              return resolve(telegram);
            })
            .catch( function(e){
              telegram.error = e;
              return reject(telegram);
            })
          });
    }
  } else if (telegram.hasOwnProperty('write')) {
    switch(telegram.write) {
      case 'coil':
        if (Array.isArray(telegram.value)) {
          return new Promise(function(resolve, reject) {
            client.writeCoils(telegram.addr, telegram.value)
            .then( function(r){
              telegram.result = r;
              return resolve(telegram);
            })
            .catch( function(e){
              telegram.error = e;
              return reject(telegram);
            })
          });
        } else {
          return new Promise(function(resolve, reject) {
            client.writeCoil(telegram.addr, telegram.value)
            .then( function(r){
              telegram.result = r;
              return resolve(telegram);
            })
            .catch( function(e){
              telegram.error = e;
              return reject(telegram);
            })
          });
        }
      case 'holding':
        if (Array.isArray(telegram.value)) {
          return new Promise(function(resolve, reject) {
            client.writeRegisters(telegram.addr, telegram.value)
            .then( function(r){
              telegram.result = r;
              return resolve(telegram);
            })
            .catch( function(e){
              telegram.error = e;
              return reject(telegram);
            })
          });
        } else {
          return new Promise(function(resolve, reject) {
            client.writeRegister(telegram.addr, telegram.value)
            .then( function(r){
              telegram.result = r;
              return resolve(telegram);
            })
            .catch( function(e){
              telegram.error = e;
              return reject(telegram);
            })
          });
        }
    }
  }
}



function sendTelegram2 (telegram) {
  p = new Promise(function(resolve, reject) {
    client.setTimeout(telegram.timeout || 100);
    client.setID(telegram.id || 1);

    if (telegram.hasOwnProperty('read')) {
      // Check all the vars...
      if (telegram.hasOwnProperty('from') && telegram.hasOwnProperty('to')) {
        // TODO: Check if diference is greater or equal to zero
        telegram.addr = telegram.from;
        telegram.quantity = telegram.to - telegram.from + 1;
      }
      // And run task!!
      switch(telegram.read) {
        case 'coil':
          client.readCoils(telegram.addr, telegram.quantity || 1)
          .then( function(r){
            telegram.result = r;
            resolve(telegram);
          })
          .catch( function(e){
            telegram.error = e;
            reject(telegram);
          })
          break;
        case 'discrete':
          client.readDiscreteInputs(telegram.addr, telegram.quantity || 1)
          .then( function(r){
            telegram.result = r;
            resolve(telegram);
          })
          .catch( function(e){
            telegram.error = e;
            reject(telegram);
          })
          break;
        case 'holding':
          client.readHoldingRegisters(telegram.addr, telegram.quantity || 1)
          .then( function(r){
            telegram.result = r;
            resolve(telegram);
          })
          .catch( function(e){
            telegram.error = e;
            reject(telegram);
          })
          break;
        case 'input':
          client.readInputRegisters(telegram.addr, telegram.quantity || 1)
          .then( function(r){
            telegram.result = r;
            resolve(telegram);
          })
          .catch( function(e){
            telegram.error = e;
            reject(telegram);
          })
          break;
      }
    } else if (telegram.hasOwnProperty('write')) {
      switch(telegram.write) {
        case 'coil':
          if (Array.isArray(telegram.value)) {
              client.writeCoils(telegram.addr, telegram.value)
              .then( function(r){
                telegram.result = r;
                resolve(telegram);
              })
              .catch( function(e){
                telegram.error = e;
                reject(telegram);
              })
          } else {
              client.writeCoil(telegram.addr, telegram.value)
              .then( function(r){
                telegram.result = r;
                resolve(telegram);
              })
              .catch( function(e){
                telegram.error = e;
                reject(telegram);
              })
          }
          break;
        case 'holding':
          if (Array.isArray(telegram.value)) {
              client.writeRegisters(telegram.addr, telegram.value)
              .then( function(r){
                telegram.result = r;
                resolve(telegram);
              })
              .catch( function(e){
                telegram.error = e;
                reject(telegram);
              })
          } else {
              client.writeRegister(telegram.addr, telegram.value)
              .then( function(r){
                telegram.result = r;
                resolve(telegram);
              })
              .catch( function(e){
                telegram.error = e;
                reject(telegram);
              })
          }
          break;
      }
    }
  });

  return p;
}




function ready() {
  console.log("Service ready!");

  server.listen(port, function() {
    console.log(`Server listening for connection requests on socket localhost:${port}`);
  });
}





server.on('connection', function(sock) {
  console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort );
  sockets.push(sock);
  console.log('Clients connected: ' + sockets.length);
  sock.write("{\"status\": \"connected\"}" + '\n');

  sock.on('data', function(data) {
      console.log('DATA ' + sock.remoteAddress + ': ' + data);
      // Write the data back to all the connected, the client will receive it as data from the server
      try {
          var consulta = JSON.parse( data.toString() );
      } catch(e) {
          // console.log("Parse error!");
          // console.log(data.toString());
          sock.write(JSON.stringify({error: e})+'\r\n');
          return;
      }


      if (!Array.isArray(consulta.id)) {
        conector.pushTask( function(done) {
          sendTelegram2(consulta)
          .then (function(r) {
            sock.write(JSON.stringify(r) + '\r\n');
            //console.log(r);
            done();
          })
          .catch( function(e) {
            sock.write(JSON.stringify(e) + '\r\n');
            console.log(e);
            done();
          });
        });
      } else {
        var consultas = [];
        for (let id of consulta.id) {
          var subquery = {};
          Object.assign(subquery, consulta);
          subquery.id = id;
          consultas.push(subquery);
        }

        consultas.forEach( function(subquery) {
          conector.pushTask( function(done) {
              sendTelegram2(subquery)
              .then( function(r) {
                sock.write(JSON.stringify(r)+ '\r\n');
                //console.log(r);
                done();
              })
              .catch( function(e) {
                sock.write(JSON.stringify(e) + '\r\n');
                console.log(e);
                done();
              });
            })
        });
      }
  });

  sock.on('end', function () {
    sockets.splice(sockets.indexOf(sock), 1);
    console.log('Clients connected: ' + sockets.length);
  });

});

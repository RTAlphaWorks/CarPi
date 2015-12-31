var gpsd = require('node-gpsd');
var awsIot = require('aws-iot-device-sdk');

//Setup AWS IoT Device
var device = awsIot.device({
	"host": "A1JC199LCKMUI9.iot.us-east-1.amazonaws.com",
	"port": 8883,
	"clientId": "Tutorial",
	"thingName": "Tutorial",
	"caCert": "./certs/root-CA.pem",
	"clientCert": "./certs/b917b43485-certificate.pem.crt",
	"privateKey": "./certs/b917b43485-private.pem.key"
});

//Setup GPSD
var daemon = new gpsd.Daemon({
  program: 'gpsd',
  device: '/dev/ttyAMA0',
  port: 2947,
  pid: '/tmpgpsd.pid',
  logger: {
    info: function() {},
    warn: console.warn,
    error: console.error
    }
});

//Setup GPS client
var listner = new gpsd.Listener({
  port: 2947,
  hostname: 'localhost',
  logger: {
    info: function() {},
    warn: console.warn,
    error: console.error
    },
    parse: true
});

//Look for TPV strings from GPS
listner.on('TPV', function(tpv) {
  //console.log(tpv);
  console.log('GPS Mode: ',tpv.mode);
  var devUp = '{\"state\":{\"reported\":' + JSON.stringify(tpv) + '}}'; 
  console.log(devUp);
  device.publish('$aws/things/Tutorial/shadow/update', devUp);
    
});

//Start GPSD Daemon & Listen for events
daemon.start(function() {
  console.log('Started GPSD');
  listner.connect(function() {
    if (listner.isConnected()) {
      console.log('GPS Client Connected');
    };
    listner.watch();
  });
});




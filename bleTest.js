var bleno = require('bleno');

var name = 'DKTest';
var serviceUuids = ['fffffffffffffffffffffffffffffff0'];

console.log('Starting...');
//bleno.startAdvertising(name, serviceUuids);

bleno.on('stateChange', function(state) {
  console.log('on -> stateChange: ' + state);

  if (state === 'poweredOn') {
    bleno.startAdvertising(name, serviceUuids);
  } else {
    bleno.stopAdvertising();
  }
});


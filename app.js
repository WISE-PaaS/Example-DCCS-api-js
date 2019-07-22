const mqtt = require('mqtt');
const fetch = require('node-fetch');

require('./key.txt');
const DCCSKEY = SERVICE_KEY;
const DCCSUrl = 'https://api-dccs.wise-paas.io/v1/serviceCredentials/'+DCCSKEY;

async function createMockTemp(){
    //await the response of the fetch call
    let response = await fetch(DCCSUrl)
    //proceed once the first promise is resolved.
    let data = await response.json();
    //proceed only when the second promise is resolved
    let uri = data.credential.protocols.mqtt.uri
    let correctUri = uri.replace(data.credential.hostname, data.credential.externalHosts)
    return correctUri;
}

createMockTemp()
  .then(function(mqttUri){
    console.log('=*=*=*=*=*=URI=*=*=*=*=*=');
    console.log(mqttUri);
    console.log('=*=*=*=*=*=URI=*=*=*=*=*=');
    const client = mqtt.connect(mqttUri);

    // Use mqttUri or connectOpts
    client.on('connect', (connack) => {
      setInterval(() => {
        publishMockHumi();
      }, 3000);
    });
    // Publish mock random humidity periodically
    function publishMockHumi() {
      const humi = Math.floor((Math.random() * 6) + 50);
      
      client.publish('livingroom/humidity', humi.toString(), { qos: 2 }, (err, packet) => {
        if (!err) console.log('Data sent to livingroom/humidity -- ' + humi);
      });
    }
  })
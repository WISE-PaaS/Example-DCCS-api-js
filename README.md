# DCCS-API-js

This git hub shows how an edge device to connect to WISE-PaaS IoT Hub service remotely and securely via DCCS api.

## A secure method

Normally, if we are a developer of a WISE-PaaS application, we may have access to all the service credentials on the WISE-PaaS Management Portal. However, if we are now providing a service, we won't want our users to hard-code the uri in the code, because this may lead to privacy issues and security breaches. Therefore, as a service provider, we give out **service keys**. These keys are genuinely confidential and only authorized personnel could have access to it.

## Step-by-step

Once we have the key, we may retreive service credentials via DCCS API. See more [DCCS Documentation](http://bit.ly/wisepaas-apis-dccs).


#### STEP1 Install node modules

    npm install

**NOTE**: If you want to add any other packages during your development, 

use the command **`npm install --save {nodeModuleName}`**

#### STEP2 Create a key file

This file could by a txt file or whatever file you prefer, but remember that the format must be like how you define a string type variable: 

```js
variableName = 'key'
```

#### STEP3 Require the file in your code

For example:

```js
require('./fileName');
const codeVariable = variableName;
```

Now, you have access to the key in the code.

## Code Description

```js
const DCCSUrl = 'https://api-dccs.wise-paas.io/v1/serviceCredentials/' + DCCSKEY;
```

**NOTE**: This is the api url to retreive credentials of the service. If you wish to come up with other functions, see [DCCS Documentation](http://bit.ly/wisepaas-apis-dccs).

```js
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
```

**NOTE**: This is the most tricky part of the code is that Javascript is an asynchronous language, which means that it does not execute the code in order. However, the **`node-fetch`** package we use, would need some time to retreive data from the internet and may not be done before other commands in the code. Therefore we need to use an **`async function`** in our code.

```js
createMockHumi()
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
```

**NOTE**: In the async function above, it has a return of the uri we require to connect to the IoT Hub service. We need to make sure we get the uri before we start publishing data. So, we need a **`promise function`** to make sure that the codes are fully executed and we get the parameter, **`.then()`** execute the code in this promise function.

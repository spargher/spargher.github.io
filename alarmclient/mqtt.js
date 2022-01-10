
var passphrase ="Secret Passphrase";

var payload = "U2FsdGVkX1+btGA+ewOIRZlOlt+L6EhZRiMLSd8lF4Rv+J/n/U/AbmjCi058cjzMNuRjayZp4OWz2tPfrolcvw==";

function MQTTconnect() {
    console.log("Connecting");
    client = new Paho.MQTT.Client("wss://io.adafruit.com", 443, "", "");
    // set callback handlers
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;

    // connect the client
    var decrypted = CryptoJS.AES.decrypt(payload, passphrase).toString(CryptoJS.enc.Utf8);
    client.connect({ onSuccess: onConnect, userName: "spargher", password: decrypted });
}

// called when the client connects
function onConnect() {
    // Once a connection has been made, make a subscription and send a message.
    console.log("onConnect");
    client.subscribe("spargher/feeds/alarm.zones");
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:" + responseObject.errorMessage);
    }
}

// called when a message arrives
function onMessageArrived(message) {
    console.log("onMessageArrived:" + message.payloadString);
    setFields(JSON.parse(message.payloadString));
}

function startApi() {
    let pass = prompt("Enter your passphrase", "");
    if (pass)
    {
        passphrase = pass;
    }
    MQTTconnect();
}
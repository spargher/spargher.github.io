
var passphrase ="Secret Passphrase";

var payload = "U2FsdGVkX1+btGA+ewOIRZlOlt+L6EhZRiMLSd8lF4Rv+J/n/U/AbmjCi058cjzMNuRjayZp4OWz2tPfrolcvw==";
var results = [];
function MQTTconnect() {
    console.log("Connecting");
    client = new Paho.MQTT.Client("io.adafruit.com", 443, "", "");
    
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;

    // connect the client
    var decrypted = CryptoJS.AES.decrypt(payload, passphrase).toString(CryptoJS.enc.Utf8);
    client.connect({ onSuccess: onConnect, useSSL: true, userName: "spargher", password: decrypted });
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

function getJsonAsync(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", url);
      xhr.setRequestHeader("X-AIO-Key", CryptoJS.AES.decrypt(payload, passphrase).toString(CryptoJS.enc.Utf8));
      xhr.responseType = "json";
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr);
          
        } else {
          reject(`Error: ${xhr.status} - ${xhr.statusText}`);
        }
      };
      xhr.onerror = () => {
        reject("Error: Network Error");
      };
      xhr.send();
    });
  }

function mergezonedata(data, zone){

    for (i=0; i < data.length; i++)
    {
        var time = data[i].created_at;
        var values = JSON.parse(data[i].value);
        for (j=0; j < values.length; j++)
        {
            if (values[j].name == zone && values[j].state == true)
            {
                results.push(time);
                break;
            }
        }
    }
    
}

function buildlink(endtime)
{
    return "https://io.adafruit.com/api/v2/spargher/feeds/alarm.zones/data?end_time=" + endtime + "&limit=1000";
}

function getGarage()
{
    getzones("Garage");
}
function getGiorno()
{
    getzones("Giorno");
}
function getNotte()
{
    getzones("Notte");
}
function getScale()
{
    getzones("Scale");
}

function getzones(zone) {
    results = [];    
    var dc = new Date();
    var s = dc.toISOString();
    process(s, 2000, zone);
}

function process(endtime, counter, zone){
    getJsonAsync(buildlink(endtime))
    .then((xhr) => {
        mergezonedata(xhr.response, zone);
        var limit = parseInt(xhr.getResponseHeader("x-pagination-limit"))
        var count = parseInt(xhr.getResponseHeader("x-pagination-count"));
        counter -= count;
        if (limit <= count && counter > 0)
        {
            var newtime = xhr.response.slice(-1)[0].created_at;
            process(newtime, counter, zone);
        }
        else
        {
            window.sessionStorage['response'] = results;
            window.sessionStorage['zone'] = zone;
            window.open("showdata.html");
        }
    })
    .catch((error) => {
        console.error(error);
    });
}
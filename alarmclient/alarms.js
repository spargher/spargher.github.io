var memory = [false, false, false, false];

var permission = false;

var crypted = "U2FsdGVkX18R6b2m7V0s387Bcze1QrPZ2E6/kr9maa3M2y6m5m4ozX/6GqrSH6PNsjhCYA8J8i+R8ijWJ+JCxQ==";
var chat_id = "5171498371";

function setFields(data) {
  var length = data.length;
  var i;
  for (i = 0; i < length; i++) {
    var state = data[i].state;
    var ele = document.getElementById("btn" + i);
    var text = document.getElementById("memo" + i)
    var check = document.getElementById("not" + i);
    var telegram = document.getElementById("telegram");
    if (state) {

      // Non l'ho memorizzato, prima volta
      if (!memory[i]) {
        text.innerHTML = (new Date()).toLocaleTimeString();
        if (check.checked)
        {

          if (telegram.checked)
          {
          sendMessage(ele.innerText);
          }
          if (permission)
          {
            // If it's okay let's create a notification
            var notification = new Notification("Alarm " + ele.innerText + " " +  (new Date()).toLocaleTimeString());
          }
          else
          {
            //alert(ele.innerText);
          }
        }

      }
      memory[i] = true;
      ele.classList.remove("buttonmemory");
      ele.classList.add("buttonalarm");
    };
    if (!state) {
      ele.classList.remove("buttonalarm");
      if (memory[i]) {
        ele.classList.add("buttonmemory");
      }
      else {
        ele.classList.remove("buttonmemory");
      }
    };
  }
  document.getElementById("updated").innerHTML = "Last update: " + (new Date()).toLocaleTimeString();
}

function sendMessage(message) {
  var bot_id = CryptoJS.AES.decrypt(crypted, passphrase).toString(CryptoJS.enc.Utf8);
  
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (xhttp.readyState == XMLHttpRequest.DONE) {
      console.log(xhttp.responseText);
    }
  };  
  xhttp.open("POST", "https://api.telegram.org/bot" + bot_id + "/sendMessage", true);
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.send( JSON.stringify({
      "chat_id": chat_id,
      "text": "Alarm triggered: " + message
    }));
}

function clickHandler(event) {
  for (var i = 0; i < 4; i++) {
    document.getElementById("memo" + i).innerHTML = "";
    memory[i] = false;
    document.getElementById("btn" + i).classList.remove("buttonmemory");
  }
}

function startup() {
  document.getElementById("btnmemo").addEventListener("click", clickHandler);
  try
  {
    // This works in MQTT html only
    document.getElementById("btndatagarage").addEventListener("click", getGarage);
    document.getElementById("btndatagiorno").addEventListener("click", getGiorno);
    document.getElementById("btndatanotte").addEventListener("click", getNotte);
    document.getElementById("btndatascale").addEventListener("click", getScale);
  }
  catch
  {}
  Notification.requestPermission().then(function (perm) {
    // If the user accepts, let's create a notification
    permission  = (perm === "granted")});
  startApi();
}



window.addEventListener('load', startup);
var passphrase ="Secret Passphrase";

function loadState() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        setFields(JSON.parse(xhttp.responseText).sensors);
      }
    };
    xhttp.open("GET", "http://192.168.1.169/api/sensors", true);
    xhttp.send();
  }

  function startApi()
  {
    let pass = prompt("Enter your passphrase", "");
    if (pass)
    {
        passphrase = pass;
    }
    setInterval(loadState, 2000);
  }
  

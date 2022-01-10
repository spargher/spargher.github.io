function loadState() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        setFields(JSON.parse(this.responseText).sensors);
      }
    };
    xhttp.open("GET", "http://192.168.1.169/api/sensors", true);
    xhttp.send();
  }

  function startApi()
  {
    setInterval(loadState, 1000);
  }
  

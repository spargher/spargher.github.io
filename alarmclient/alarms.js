var memory = [false, false, false, false];

function setFields(data) {
  var length = data.length;
  var i;
  for (i = 0; i < length; i++) {
    var state = data[i].state;
    var ele = document.getElementById("btn" + i);
    var text = document.getElementById("memo" + i)
    var check = document.getElementById("not" + i);
    if (state) {

      // Non l'ho memorizzato, prima volta
      if (!memory[i]) {
        text.innerHTML = (new Date()).toLocaleTimeString();
        if (check.checked)
        {
          // manda la notifica
          alert(ele.innerText);
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

function clickHandler(event) {
  for (var i = 0; i < 4; i++) {
    document.getElementById("memo" + i).innerHTML = "";
    memory[i] = false;
    document.getElementById("btn" + i).classList.remove("buttonmemory");
  }
}

function startup() {
  document.getElementById("btnmemo").addEventListener("click", clickHandler);
  startApi();
}

window.addEventListener('load', startup);
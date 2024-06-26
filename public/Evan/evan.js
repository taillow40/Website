let leftBox = document.getElementById('left-box');
let rightBox = document.getElementById('right-box');
let buttonBox = document.getElementById('button-box');
let positionY = 0;
let positionX = 0;
let lengthX = 2;
let lengthY = 0;

function addCell(box, text = '') {
  let newArea = document.createElement('textarea');
  newArea.className = 'text-area';
  let y = lengthY; 
  newArea.oninput = function() {
    newArea.style.height = ""; /* Reset the height*/
    leftArea = leftBox.children[y];
    rightArea = rightBox.children[y];
    buttonArea = buttonBox.children[y];
    leftArea.style.height = Math.max(leftArea.scrollHeight,rightArea.scrollHeight) + "px";
    rightArea.style.height = Math.max(leftArea.scrollHeight,rightArea.scrollHeight) + "px";
    buttonArea.style.height = Math.max(leftArea.scrollHeight,rightArea.scrollHeight) + "px";
  };
  newArea.value = text;
  addFocusListener(newArea);
  box.appendChild(newArea);
}

function addFocusListener(area) {
  area.addEventListener('focus', function () {
    positionY = Array.from(area.parentNode.children).indexOf(area);
    positionX = area.parentNode.id === 'left-box' ? 0 : 1;
  });
}

document.addEventListener('keydown', function (event) {
  if (event.key == "Tab") {
    event.preventDefault();
    if (positionX == 0) {
      positionX = 1;
    } else {
      positionX = 0;
      if (positionY < lengthY - 1) {
        positionY++;
      } else {
        addCell(leftBox);
        addCell(rightBox);
        addButtons(lengthY);
        positionY = lengthY;
        lengthY++;
      }
    }
    refocus();
  }
  if(event.key === "Enter") {
    let leftTextAreas = leftBox.getElementsByClassName('text-area');
    let rightTextAreas = rightBox.getElementsByClassName('text-area');
    leftText = leftTextAreas[positionY].value;
    rightText = rightTextAreas[positionY].value;
    if (positionX == 0) {
      cursorPosition = leftTextAreas[positionY].selectionStart;
      enters = leftText.substring(0,cursorPosition).split('\n').length - 1
      insertIndex = nthIndex(rightText, '\n', enters + 1);
      if(insertIndex == -1) {
        insertIndex = leftText.length;
      }
      newText = rightText.slice(0, insertIndex) + "\n" + rightText.slice(insertIndex);
      rightTextAreas[positionY].value = newText;
    } else {
      cursorPosition = rightTextAreas[positionY].selectionStart;
      enters = rightText.substring(0,cursorPosition).split('\n').length - 1
      insertIndex = nthIndex(leftText, '\n', enters + 1);
      if(insertIndex == -1) {
        insertIndex = leftText.length;
      }
      newText = leftText.slice(0, insertIndex) + "\n" + leftText.slice(insertIndex);
      leftTextAreas[positionY].value = newText;
    }
  }
  if (event.getModifierState("Control")) {
    if (event.key === 'ArrowDown') {
      if (positionY < lengthY) {
        positionY++;
      }
    }
    if (event.key === 'ArrowLeft') {
      if (positionX > 0) {
        positionX--;
      }
    }
    if (event.key === 'ArrowRight') {
      if (positionX < lengthX) {
        positionX++;
      }
    }
    if (event.key === 'ArrowUp') {
      if (positionY > 0) {
        positionY--;
      }
    }
    if (event.key === "Enter") {
      addCell(leftBox);
      addCell(rightBox);
      addButtons(lengthY);
      positionY = lengthY;
      lengthY++;
    }
    refocus();
  }
});

function refocus() {
  let leftTextAreas = leftBox.getElementsByClassName('text-area');
  let rightTextAreas = rightBox.getElementsByClassName('text-area');
  if (positionX == 0) {
    leftTextAreas[positionY].focus();
  } else {
    rightTextAreas[positionY].focus();
  }
}

function nthIndex(str, pat, n){
  var L= str.length, i= -1;
  while(n-- && i++<L){
      i= str.indexOf(pat, i);
      if (i < 0) break;
  }
  return i;
}

function deleteRow(currentDiv) {
  let leftTextAreas = leftBox.getElementsByClassName('text-area');
  let rightTextAreas = rightBox.getElementsByClassName('text-area');

  let index = Array.from(buttonBox.children).indexOf(currentDiv);

  leftBox.removeChild(leftTextAreas[index]);
  rightBox.removeChild(rightTextAreas[index]);
  buttonBox.removeChild(currentDiv);
  lengthY--;
  if (positionY > lengthY - 1) {
    positionY = lengthY - 1;
  }
  refocus();
}

function insertRow(currentDiv) {
  let leftTextAreas = leftBox.getElementsByClassName('text-area');
  let rightTextAreas = rightBox.getElementsByClassName('text-area');
  let newAreaLeft = document.createElement('textarea');
  newAreaLeft.className = 'text-area';
  newAreaLeft.oninput = function() {
    newAreaLeft.style.height = ""; /* Reset the height*/
    leftArea = leftBox.children[y];
    rightArea = rightBox.children[y];
    buttonArea = buttonBox.children[y];
    leftArea.style.height = Math.max(leftArea.scrollHeight,rightArea.scrollHeight) + "px";
    rightArea.style.height = Math.max(leftArea.scrollHeight,rightArea.scrollHeight) + "px";
    buttonArea.style.height = Math.max(leftArea.scrollHeight,rightArea.scrollHeight) + "px";
  };
  addFocusListener(newAreaLeft);

  let newAreaRight = document.createElement('textarea');
  newAreaRight.className = 'text-area';
  
  addFocusListener(newAreaRight);

  let index = Array.from(buttonBox.children).indexOf(currentDiv);
  newAreaLeft.oninput = function() {
    newAreaLeft.style.height = ""; /* Reset the height*/
    leftArea = leftBox.children[index + 1];
    rightArea = rightBox.children[index + 1];
    buttonArea = buttonBox.children[index + 1];
    leftArea.style.height = Math.max(leftArea.scrollHeight,rightArea.scrollHeight) + "px";
    rightArea.style.height = Math.max(leftArea.scrollHeight,rightArea.scrollHeight) + "px";
    buttonArea.style.height = Math.max(leftArea.scrollHeight,rightArea.scrollHeight) + "px";
  };

  newAreaRight.oninput = function() {
    newAreaRight.style.height = ""; /* Reset the height*/
    leftArea = leftBox.children[index + 1];
    rightArea = rightBox.children[index + 1];
    buttonArea = buttonBox.children[index + 1];
    leftArea.style.height = Math.max(leftArea.scrollHeight,rightArea.scrollHeight) + "px";
    rightArea.style.height = Math.max(leftArea.scrollHeight,rightArea.scrollHeight) + "px";
    buttonArea.style.height = Math.max(leftArea.scrollHeight,rightArea.scrollHeight) + "px";
  };

  leftBox.insertBefore(newAreaLeft, leftTextAreas[index + 1]);
  rightBox.insertBefore(newAreaRight, rightTextAreas[index + 1]);
  addButtons(index);
  if (positionY == index) {
    positionY++;
  }
  lengthY++;
  refocus();
}

function addButtons(index) {
  let newDiv = document.createElement('div');
  newDiv.className = 'button-container';
  let deleteButton = document.createElement('button');
  deleteButton.innerHTML = 'Delete';
  deleteButton.onclick = function () {
    deleteRow(newDiv);
  }
  let insertButton = document.createElement('button');
  insertButton.innerHTML = 'Insert';
  insertButton.onclick = function () {
    insertRow(newDiv);
  }
  newDiv.appendChild(deleteButton);
  newDiv.appendChild(insertButton);
  buttonBox.insertBefore(newDiv, buttonBox.children[index + 1]);
}

function init() {
  addCell(leftBox);
  addCell(rightBox);
  addButtons(lengthY);
  positionY = lengthY;
  lengthY++;
}
init();
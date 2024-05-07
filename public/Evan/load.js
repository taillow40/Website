document.getElementById('upload').addEventListener('change', function(event) {
    var reader = new FileReader();
    reader.onload = function(event) {
        var arrayBuffer = reader.result;

        mammoth.convertToHtml({arrayBuffer: arrayBuffer})
            .then(displayResult)
            .catch(handleError);
    };

    reader.readAsArrayBuffer(this.files[0]);

    function displayResult(result) {
        
        arr = parseTableTo2DArray(result.value);
        displayData(arr);
    }

    function handleError(err) {
        console.log(err);
    }
});

function parseTableTo2DArray(tableString) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(tableString, "text/html");
    var table = doc.querySelector('table');
    var rows = table.getElementsByTagName('tr');
    var array2D = [];

    for (var i = 0; i < rows.length; i++) {
        var cells = rows[i].getElementsByTagName('td');
        var rowArray = [];

        for (var j = 0; j < cells.length; j++) {
            var cellText = cells[j].textContent.trim(); // Gets the text inside each <td>
            rowArray.push(cellText);
        }

        array2D.push(rowArray);
    }

    return array2D;
}

function displayData(arr) {
    document.getElementById('left-box').innerHTML = '';
    document.getElementById('right-box').innerHTML = '';
    document.getElementById('button-box').innerHTML = '';
    lengthY = 0;
    positionY = 0;
    positionX = 0;
    for (let i = 0; i < arr.length; i++) {
        addCell(leftBox, arr[i][0]);
        addCell(rightBox, arr[i][1]);
        addButtons(lengthY);
        lengthY++;
    }
}
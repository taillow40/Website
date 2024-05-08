function saveAsWord() {
    const doc = new docx.Document({
        sections: [{
            properties: {},
            children: [
                buildTable(),
            ],
        }],
    });

    
    docx.Packer.toBlob(doc).then(blob => {
        fileName = document.getElementById('file-name').value;
        if (fileName === '') {
            fileName = 'document';
        }
        if (fileName.substring(fileName.length - 5).toLowerCase() !== '.docx') {
            fileName += '.docx';
        }
        saveAs(blob, fileName); 
    });
}

function buildTable() {
    return new docx.Table({
        rows: buildRows(),
        width: {
            size: 100,
            type: docx.WidthType.PERCENTAGE
        },
        layout: docx.TableLayoutType.FIXED
    });
}


function buildRows(){
    let borders = {
        top: {
            style: docx.BorderStyle.DOUBLE,
            size: 3,
            color: "FFFFFF",
        },
        bottom: {
            style: docx.BorderStyle.DOUBLE,
            size: 3,
            color: "FFFFFF",
        },
        left: {
            style: docx.BorderStyle.DOUBLE,
            size: 3,
            color: "FFFFFF",
        },
        right: {
            style: docx.BorderStyle.DOUBLE,
            size: 3,
            color: "#FFFFFF",
        },
    }
    let rows = [];
    let leftTextAreas = leftBox.getElementsByClassName('text-area');
    let rightTextAreas = rightBox.getElementsByClassName('text-area');
    for (let i = 0; i < lengthY; i++) {
        rows.push(new docx.TableRow({
            children: [
                new docx.TableCell({
                    width: {
                        size: 50,
                        type: docx.WidthType.PERCENTAGE
                    },
                    shading: {
                        fill: i % 2 == 0 ? "e0e0e0" : "f0f0f0",
                        type: docx.ShadingType.CLEAR,
                        color: "auto",
                    },
                    borders: borders,
                    children: [new docx.Paragraph(leftTextAreas[i].value)],
                }),
                new docx.TableCell({
                    width: {
                        size: 50,
                        type: docx.WidthType.PERCENTAGE
                    },
                    shading: {
                        fill: i % 2 == 0 ? "e0e0e0" : "f0f0f0",
                        type: docx.ShadingType.CLEAR,
                        color: "auto",
                    },
                    borders: borders,
                    children: [new docx.Paragraph(rightTextAreas[i].value)],
                })
            ],
        }));
    }
    return rows;
}
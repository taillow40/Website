
currentGraph = 'Total Timesteps';
graph_options = ['Total Timesteps', 'Accuracy', 'Negative %', 'Reward', 'Profit', 'Weighted Proft', 'Next Weight', 'Performance']
colors = ['#E6194B', '#3CB44B', '#FFE119', '#4363D8', '#F58231', '#911EB4', '#46F0F0', '#F032E6', '#BCF60C', '#FABEBE']
show_optimals = false;
show_snp = false;
selected_graphs = [];
chart = null;
cache = {};
function graphData(x, y, labels) {
    var unifiedX = [...new Set(x.flat())].sort((a, b) => a - b);
    var datasets = y.map(function(dataArray, index) {
        var interpolatedData = interpolateData(x[index], dataArray, unifiedX);
        return {
            label: labels[index], // Use the corresponding label
            data: interpolatedData,
            backgroundColor: colors[index], // Customize as needed
            borderColor: colors[index], // Customize as needed
            borderWidth: 1,
            fill: false, // Set to false to make the line chart without filling under the line
        };
    });
     
    const canvas = document.getElementById("graph_canvas");
    canvas.width = canvas.parentElement.getBoundingClientRect().width;
    canvas.height = canvas.parentElement.getBoundingClientRect().height;
    var ctx = canvas.getContext('2d');
    if(chart){
        chart.destroy();
    }
    if(selected_graphs.length <= 0){
        return;
    }
    chart = new Chart(ctx, {
        type: 'line', 
        data: {
            labels: unifiedX,
            datasets: datasets
        },
        options: {
            responsive: false, 
            maintainAspectRatio: false, 
            animation: false,
            scales: {
                y: {
                    beginAtZero: true 
                }
            },
            plugins: {
                legend: {
                    display: true 
                },
            },
        }
    });
}

function interpolateData(datasetX, datasetY, unifiedX) {
    let interpolatedData = [];
    let lastKnownIndex = -1;

    for (let i = 0; i < unifiedX.length; i++) {
        let xVal = unifiedX[i];
        let dataIndex = datasetX.indexOf(xVal);

        if (dataIndex !== -1) {
            // If the current x value exists in the dataset, use the corresponding y value
            interpolatedData.push({ x: xVal, y: datasetY[dataIndex] });
            lastKnownIndex = i; // Update the last known index
        } else if (lastKnownIndex !== -1 && lastKnownIndex < i) {
            // If the current x value is missing and we have a previous known value, interpolate
            let nextKnownIndex = datasetX.findIndex((val, index) => index > dataIndex && xVal < unifiedX[i]);
            if (nextKnownIndex !== -1) {
                let nextXVal = unifiedX[nextKnownIndex];
                let lastXVal = unifiedX[lastKnownIndex];
                let nextYVal = datasetY[nextKnownIndex];
                let lastYVal = interpolatedData[lastKnownIndex].y;

                // Linear interpolation formula
                let interpolatedY = lastYVal + (nextYVal - lastYVal) * (xVal - lastXVal) / (nextXVal - lastXVal);
                interpolatedData.push({ x: xVal, y: interpolatedY });
            }
        } else {
            // If there's no last known value yet (missing values at the start), push null or an appropriate placeholder
            interpolatedData.push({ x: xVal, y: null });
        }
    }

    return interpolatedData;
}

function graphNext(x, y, names, labels){
    x = x.map(subArray => subArray.slice(-10));
    for (let i = 0; i < y.length; i++) {
        y[i] = y[i].slice(-10); 
        names[i] = names[i].slice(-10);
    }
    console.log(x)
    var unifiedX = [...new Set(x.flat())].sort((a, b) => a - b);

    var datasets = y.map(function(dataArray, index) {
        var interpolatedData = interpolateData(x[index], dataArray, unifiedX);
        return {
            label: labels[index], // Use the corresponding label
            data: interpolatedData,
            backgroundColor: colors[index], // Customize as needed
            borderColor: colors[index], // Customize as needed
            borderWidth: 1,
            fill: false, // Set to false to make the line chart without filling under the line
        };
    });
     
    const canvas = document.getElementById("graph_canvas");
    canvas.width = canvas.parentElement.getBoundingClientRect().width;
    canvas.height = canvas.parentElement.getBoundingClientRect().height;
    var ctx = canvas.getContext('2d');
    if(chart){
        chart.destroy();
    }
    if(selected_graphs.length <= 0){
        return;
    }
    chart = new Chart(ctx, {
        type: 'line', 
        data: {
            labels: unifiedX,
            datasets: datasets
        },
        options: {
            responsive: false, 
            maintainAspectRatio: false, 
            scales: {
                
                y: {
                    beginAtZero: true 
                }
            },
            animation: false,
            plugins: {
                datalabels: {
                    color: '#36A2EB',
                    display: true,
                    font: {
                        weight: 'bold'
                    },
                    formatter: function(value, context) {
                        return names[context.datasetIndex][context.dataIndex];;
                    },
                    anchor: 'end',
                    align: 'top',
                    offset: 10,
                },
                legend: {
                    display: false // This will hide the legend
                }
            },
            layout: {
                padding: {
                    top: 50
                }
            },
        },
        plugins: [ChartDataLabels]
    });
}

//(dates, optimals, percents, labels);
function graphPerformance(x, y, names, labels){
    
    
    x = x.slice(-10);
    x = x.map(function(date, index){
        myDate = new Date(date);
        return (myDate.getMonth() + 1) + '/' + myDate.getDate();
    });

    for (let i = 0; i < y.length; i++) {
        y[i] = y[i].slice(-10); 
        names[i] = names[i].slice(-10);
    }
    
    var datasets = y.map(function(dataArray, index) {
        return {
            label: labels[index], // Use the corresponding label
            data: dataArray, // The data for this line
            backgroundColor: colors[index], // Customize as needed
            borderColor: colors[index], // Customize as needed
            borderWidth: 1
        };
    });
    const canvas = document.getElementById("graph_canvas");
    canvas.width = canvas.parentElement.getBoundingClientRect().width;
    canvas.height = canvas.parentElement.getBoundingClientRect().height;
    var ctx = canvas.getContext('2d');
    if(chart){
        chart.destroy();
    }
    chart = new Chart(ctx, {
        type: 'line', 
        data: {
            labels: x, 
            datasets: datasets
        },
        options: {
            responsive: false, 
            maintainAspectRatio: false, 
            scales: {
                y: {
                    beginAtZero: true 
                },
                x: {
                    offset: true
                }
            },
            animation: false,
            plugins: {
                datalabels: {
                    color: '#36A2EB',
                    display: true,
                    font: {
                        weight: 'bold'
                    },
                    formatter: function(value, context) {
                        return names[context.datasetIndex][context.dataIndex];
                    },
                    anchor: 'end',
                    align: 'top',
                    offset: 10,
                },
                legend: {
                    display: true // This will hide the legend
                }
            },
            layout: {
                padding: {
                    top: 20,
                }
            },
        },
        plugins: [ChartDataLabels]
    });
}




function parseCSV(data) {
    const rows = data.split('\n');

    const headers = rows[0].split(',');

    let returnData = {};
    
    for (let i = 0; i < headers.length; i++) {
        for (let j = 1; j < rows.length; j++) {
            if (returnData[headers[i].trim()] === undefined) {
                returnData[headers[i].trim()] = [];
            }
            returnData[headers[i].trim()].push(rows[j].split(',')[i]);
        }
    }
    return returnData;
}
//fetch('StockGraphs/data.csv')

function fetchNames(){
    fetch('stocks/get-csvs')
    .then(response => response.text())
    .then(text => {
        let fileNames = JSON.parse(text);
        fileNames = fileNames.map((name) => {
            return name.split('_')[0];
        });
        const container = document.getElementById('names-container');
        for(let i = 0; i < fileNames.length; i++){
            const button = document.createElement('button');
            button.innerHTML = fileNames[i];
            button.classList.add('select-button');
            button.id = `select_button${i}`;
            button.onclick = function(){
            
                if(selected_graphs.includes(fileNames[i])){
                    selected_graphs = selected_graphs.filter((name) => name != fileNames[i]);
                    button.style.backgroundColor = '#8085a2';
                } else {
                    selected_graphs.push(fileNames[i]);
                    button.style.backgroundColor = '#cbfaff';
                }
                fetchCSV();
            }
            container.appendChild(button);
        }
    })
    .catch(error => console.error('Error fetching or parsing CSV:', error));
}

async function fetchCSV() {

    promises = [];
    for(let i = 0; i < selected_graphs.length; i++){
        let promise = fetch('stocks/get-csv/' + selected_graphs[i] + '_history.csv')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(text => {
                const data = parseCSV(text);
                processData(data, selected_graphs[i]);
            })
            .catch(error => console.error('Error fetching or parsing CSV:', error));

        promises.push(promise);
    }

    await Promise.all(promises);
    genericGraph();

}

function buildButtons(){
    gridContainer = document.getElementById('buttons_container');
    optimals_button = document.getElementById('display_optimals');
    snp_button = document.getElementById('display_snp');
    for(let i = 0; i < graph_options.length; i++){
        const button = document.createElement('button');
        button.innerHTML = graph_options[i];
        button.id = `button${i}`;
        button.classList.add('graph_button');
        if(i == 0){
            button.style.backgroundColor = '#cbfaff';
            currentGraph = graph_options[i];
        }

        button.onclick = function() {
            const buttons = gridContainer.querySelectorAll('.graph_button');
            buttons.forEach(button => {
                button.style.backgroundColor = '#8085a2';
            });
            

        
            button.style.backgroundColor = '#cbfaff';

            currentGraph = graph_options[i];
            if(currentGraph == 'Performance'){
                optimals_button.style.display = 'block';
                snp_button.style.display = 'block';
            } else {
                optimals_button.style.display = 'none';
                snp_button.style.display = 'none';
            }
            genericGraph();
            
            
            
        }




        gridContainer.appendChild(button);
    }
    
    optimals_button.onclick = function(){
        if(!show_optimals){ 
            optimals_button.style.backgroundColor = '#cbfaff';
        } else {
            optimals_button.style.backgroundColor = '#8085a2';
        }
        show_optimals = !show_optimals;
        genericGraph();
    }
    snp_button.onclick = function(){
        if(!show_snp){ 
            snp_button.style.backgroundColor = '#cbfaff';
        } else {
            snp_button.style.backgroundColor = '#8085a2';
        }
        show_snp = !show_snp;
        genericGraph();
    }
}

function processData(data, fileName){
    delete data['Time'];  
    delete data['Current Session'];
    cache[fileName.trim()] = data;
}



function genericGraph() {
    y = [];
    labels = []
    timesteps = [];
    for(const graph of selected_graphs){
        y.push(cache[graph][currentGraph.trim()]);
        labels.push(graph);
        timesteps.push(cache[graph]['Total Timesteps']);
    }
    if(currentGraph.trim() == "Next Weight"){
        names = [];
        for(const graph of selected_graphs){
            names.push(cache[graph]['Next']);
       }

        graphNext(timesteps, y, names, labels);
    } else if (currentGraph.trim() == "Performance"){
        displayHistory();
    } else {
        graphData(timesteps, y, labels);
    }
}

function setupInterval(){
    setInterval(() => {
        fetchCSV();
    }, 5 * 60 * 1000);
}

function displayHistory(){
    fetch('stocks/get-csv/history.csv')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(text => {
                const data = parseCSV(text);
                processHistoryData(data);
            })
            .catch(error => console.error('Error fetching or parsing CSV:', error));
}

function processHistoryData(data){
    dates = data['days'];
    //dates = dates.slice(0, dates.length - 1);
    optimals = data['optimals'];
    //optimals = optimals.slice(0, optimals.length - 1);
    percents = [];
    names = [];
    labels = [];
    y = [];
    if(show_optimals){
        optimal_names = [];
        for(i = 0; i < data['optimals'].length; i++){
            optimal_names.push("");
        }
        names.push(optimal_names);
        labels.push("optimals");
        y.push(optimals);
    }
    if(show_snp){
        snp_names = [];
        for(i = 0; i < data['snp'].length; i++){
            snp_names.push("");
        }
        names.push(snp_names);
        labels.push("snp");
        y.push(data['snp']);
    }
    

    
    for(i = 0; i < selected_graphs.length; i++){
        if(data[`${selected_graphs[i]}_percent`]) {
            percents.push(data[`${selected_graphs[i]}_percent`]);
            labels.push(selected_graphs[i]);
            new_names = [];
            for(j = 0; j < data[`${selected_graphs[i]}_stock`].length; j++){
                new_names.push(data[`${selected_graphs[i]}_stock`][j].trim() + "," + data[`${selected_graphs[i]}_weight`][j]);
            }
            names.push(new_names);
        }
        
    }

    
    for(let i = 0; i < percents.length; i++){
        y.push(percents[i]);
    }
    
    if(labels.length > 0){
        graphPerformance(dates, y, names, labels);
    } else {
        if(chart != null){
            chart.destroy();
        }
    }
    
}

buildButtons();
fetchNames();
setupInterval();
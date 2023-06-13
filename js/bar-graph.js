let labels = [];
let bars = {};
let graphWrapper;

// these are the colors of our bars
//let colors = ['#E67701', '#D84C6F', '#794AEF', '#1291D0'];
let colors = ['#D84C6F', '#1291D0', '#E67701', '#794AEF'];
//let lightColors = ['#FFECE2', '#FFE9EC', '#F1F0FF', '#E2F5FF'];
let lightColors = ['#FFE9EC', '#E2F5FF', '#FFECE2', '#F1F0FF'];

// This function makes the bar graph
// it takes in a URL to a teachable machine model,
// so we can retrieve the labels of our classes for the bars
export async function setupBarGraph(URL) {
    // the metatadata json file contains the text labels of your model
    const metadataURL = `${URL}metadata.json`;
    // get the metadata from the file URL
    const response = await fetch(metadataURL);
    const json = await response.json();
    // get the names of the labels from the metadata of the model
    labels = json.labels;
    // get the area of the webpage we want to build the bar graph
    graphWrapper = document.getElementById('graph-wrapper');
    // make a bar in the graph for each label in the metadata
    labels.forEach((label, index) => makeBar(label, index));
}

// This function makes a bar in the graph
function makeBar(label, index) {
    // make the elements of the bar
    let barWrapper = document.createElement('div');
    let barEl = document.createElement('progress');
    let percentEl = document.createElement('span');
    let labelEl = document.createElement('span');
    labelEl.innerText = label;

    // assemble the elements
    barWrapper.appendChild(labelEl);
    barWrapper.appendChild(barEl);
    barWrapper.appendChild(percentEl);
    let graphWrapper = document.getElementById('graph-wrapper');
    graphWrapper.appendChild(barWrapper);

    // style the elements
    let color = colors[index % colors.length];
    let lightColor = lightColors[index % colors.length];
    barWrapper.style.color = color;
    barWrapper.style.setProperty('--color', color);
    barWrapper.style.setProperty('--color-light', lightColor);

    // save references to each element, so we can update them later
    bars[label] = {
        bar: barEl,
        percent: percentEl
    };
}

// This function takes data (retrieved in the model.js file)
// The data is in the form of an array of objects like this:
// [{ className:class1, probability:0.75 }, { className:class2, probability:0.25 }, ... ]
// it uses this data to update the progress and labels of of each bar in the graph
export function updateBarGraph(data) {
    // iterate through each element in the data
    data.forEach(({ className, probability }) => {
        // get the HTML elements that we stored in the makeBar function
        let barElements = bars[className];
        let barElement = barElements.bar;
        let percentElement = barElements.percent;
        // set the progress on the bar
        barElement.value = probability;
        //console.log(className + " " + probability + " " + convertToPercent(probability));
        // set the percent value on the label
        let oldPrediction = percentElement.innerText;
        let newPrediction = convertToPercent(probability.toFixed(2));

        if (parseInt(oldPrediction) != parseInt(newPrediction)) {
            console.log(className + ": " + newPrediction);

            percentElement.innerText = newPrediction;

            if (parseInt(newPrediction) == 100) {
                console.log("Cambiar color: " + className);
                if (className == "Duende") {
                    const COLOR_ROJO = 65262;
                    changeColor(COLOR_ROJO);
                } else if (className == "Dash") {
                    const COLOR_AZUL = 47125;
                    changeColor(COLOR_AZUL);
                } else if (className == "Normal") {
                    const COLOR_BLANCO = 34290;
                    changeColor(COLOR_BLANCO);
                }
            }
        }
    });
}

// This function converts a decimal number (between 0 and 1)
// to an integer percent (between 0% and 100%)
function convertToPercent(num) {
    num *= 100;
    num = Math.round(num);
    return `${num}%`;
}

function changeColor(color) {
    var hue = color;
    fetch("http://192.168.1.100/api/yoihozikFD3cyzL5pb6HxiV1koYLZmkpDW9hro0A/lights/3/state", {
        //mode: "no-cors",
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        //body: JSON.stringify({ "on": true, "sat": 254, "bri": 254, "hue": hue }),
        body: JSON.stringify({ "on": true, "hue": hue }),
    }).then(function (response) {
        return response.json();
    }).then(function (myJson) {
        //console.log("response:" + JSON.stringify(myJson[0].success["/lights/2/state/on"]));
        console.log(JSON.stringify(myJson));
    }).catch(function (error) {
        console.log("Error: " + error);
    });
}

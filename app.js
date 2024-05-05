window.onload = function() {
    loadModel();
};

let classifier;

function loadModel() {
    classifier = ml5.imageClassifier('MobileNet', modelLoaded);
}

function modelLoaded() {
    console.log('Model geladen!');
}

function classifyImage() {
    const image = document.getElementById('imageUpload').files[0];
    const imageUrl = URL.createObjectURL(image);
    document.getElementById('userImageContainer').innerHTML = `<img src="${imageUrl}" id="inputImage">`;

    classifier.classify(document.getElementById('inputImage'), (error, results) => {
        if (error) {
            console.error(error);
            return;
        }
        displayResults(results, 'userResultContainer');
    });
}

function displayResults(results, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    const chartData = {
        x: results.map(result => result.label),
        y: results.map(result => result.confidence),
        type: 'bar'
    };
    Plotly.newPlot(container, [chartData]);
}

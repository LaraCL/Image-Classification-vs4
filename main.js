let classifier;
let imageElement;

function setup() {
    noCanvas();
    classifier = ml5.imageClassifier('MobileNet', modelLoaded);
    const dropArea = select('#dropArea');
    dropArea.dragOver(() => dropArea.style('background-color', '#ccc'));
    dropArea.dragLeave(() => dropArea.style('background-color', '#fff'));
    dropArea.drop(handleFile, () => dropArea.style('background-color', '#fff'));
}

function modelLoaded() {
    console.log('Model geladen!');
}

function handleFile(file) {
    if (file.type === 'image') {
        if (imageElement) {
            imageElement.remove();
        }
        imageElement = createImg(file.data, '').parent('dropArea');
        imageElement.style('max-width', '100%');
        imageElement.style('max-height', '100%');
    } else {
        console.log('Nicht unterstützter Dateityp');
    }
}

function classifyImage() {
    if (imageElement) {
        classifier.classify(imageElement, gotResult);
    }
}

function gotResult(error, results) {
    if (error) {
        console.error(error);
    } else {
        console.log(results);
        const resultContainer = select('#resultContainer');
        resultContainer.html('');
        const labels = results.map(result => result.label);
        const confidences = results.map(result => result.confidence * 100);
        const data = {
            type: 'bar',
            x: confidences,
            y: labels,
            orientation: 'h',
            text: confidences.map(String),
            textposition: 'auto',
            hoverinfo: 'none',
            marker: {
                color: 'blue',
                line: {
                    color: 'blue',
                    width: 1.5
                }
            }
        };
        const layout = {
            title: 'Klassifikationsergebnisse',
            barmode: 'stack',
            xaxis: {
                title: 'Confidence in %'
            },
            yaxis: {
                title: 'Labels'
            }
        };
        Plotly.newPlot('resultContainer', [data], layout);
    }
}

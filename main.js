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
        imageElement = createImg(file.data, '').hide();
        imageElement.size(100, 100); // Resize the image to create a thumbnail
        const dropArea = select('#dropArea');
        dropArea.html('');
        imageElement.parent(dropArea);
        imageElement.show();
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
        const label = results[0].label;
        const confidence = nf(results[0].confidence * 100, 0, 0); // Rounded to no decimal places
        const data = {
            type: 'bar',
            x: [confidence],
            y: [label],
            orientation: 'h',
            text: [`${confidence}%`],
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
            title: 'Klassifikationsergebnis',
            barmode: 'stack',
            xaxis: {
                title: 'Confidence in %'
            },
            yaxis: {
                title: 'Label'
            },
            width: 400, // Fixed width
            height: 50 // Fixed height
        };
        Plotly.newPlot(resultContainer.elt, [data], layout);
    }
}

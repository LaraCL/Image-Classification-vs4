let classifier;

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
        const img = createImg(file.data, '').hide();
        image(img, 0, 0, width, height);
        classifier.classify(img, gotResult);
    } else {
        console.log('Nicht unterstützter Dateityp');
    }
}

function gotResult(error, results) {
    if (error) {
        console.error(error);
    } else {
        console.log(results);
        const resultContainer = document.getElementById('resultContainer');
        resultContainer.innerHTML = `
            <p>Label: ${results[0].label}</p>
            <p>Confidence: ${nf(results[0].confidence, 0, 2)}</p>
        `;
    }
}

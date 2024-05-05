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
        resetDropArea();
    }
}

function resetDropArea() {
    const dropArea = select('#dropArea');
    dropArea.html('Ziehen Sie ein Bild hierher oder klicken Sie, um auszuwählen.');
}

function gotResult(error, results) {
    if (error) {
        console.error(error);
    } else {
        console.log(results);
        const confidence = results[0].confidence * 100;
        const imageSection = select('#imageSection');
        imageSection.html('');
        imageElement.size(100, 100);
        imageElement.parent(imageSection);

        const resultContainer = select('#resultContainer');
        resultContainer.html('<div class="custom-bar"><div class="confidence-bar" style="width:' + confidence * 4 + 'px"></div><div class="confidence-text">' + nf(confidence, 0, 0) + '%</div></div>');
    }
}

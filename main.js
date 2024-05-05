let classifier;
let imageElement;
let imageThumbnail;

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
        if (imageThumbnail) {
            imageThumbnail.remove();  // Entfernt das vorherige Thumbnail, wenn ein neues Bild geladen wird
        }
        imageElement = createImg(file.data, '').hide();
        imageThumbnail = createImg(file.data, '').hide();
        imageThumbnail.size(100, 100); // Resize the image to create a thumbnail
        imageThumbnail.parent('imageSection'); // Hält das Thumbnail im Ergebnisbereich
        imageThumbnail.show();
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
        const confidence = results[0].confidence * 100;
        const label = results[0].label;

        const imageSection = select('#imageSection');
        imageThumbnail.size(100, 100); // Stellt sicher, dass das Thumbnail weiterhin angezeigt wird

        const resultContainer = select('#resultContainer');
        resultContainer.html(`
            <div class="custom-bar">
                <div class="confidence-bar" style="width:${confidence * 4}px"></div>
                <div class="confidence-text">${nf(confidence, 0, 0)}%</div>
            </div>
            <p class="label-text">${label}</p>
        `);
    }
}

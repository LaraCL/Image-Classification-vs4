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
            imageThumbnail.remove(); // Removes old thumbnail from the result area when new image is loaded
        }
        imageElement = createImg(file.data, '').hide();
        imageElement.size(400, 400); // Resize image to fit drop area
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
        imageElement.hide(); // Hide image in drop area after classification
    }
}

function gotResult(error, results) {
    if (error) {
        console.error(error);
    } else {
        console.log(results);
        const confidence = results[0].confidence * 100;
        const label = results[0].label;

        // Creating a thumbnail for the result section after classification
        imageThumbnail = createImg(imageElement.elt.src, '').parent('imageSection');
        imageThumbnail.size(100, 100);
        imageThumbnail.show();

        const resultContainer = select('#resultContainer');
        resultContainer.html(`
            <div class="custom-bar">
                <div class="confidence-bar" style="width:${confidence * 4}px"></div>
                <div class="confidence-text">${Math.round(confidence)}%</div>
            </div>
            <p class="label-text" style="text-align: center;">${label}</p>
        `);
    }
}

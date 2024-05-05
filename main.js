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
            imageThumbnail.remove();  // Remove old thumbnail from the results area
        }
        imageElement = createImg(file.data, '').hide();
        imageThumbnail = createImg(file.data, '').hide();
        imageThumbnail.size(200, 200); // Resize the image to fit the drop area
        const dropArea = select('#dropArea');
        dropArea.html('');
        imageElement.parent(dropArea);
        imageElement.size(200, 200); // Ensure image fits within the drop area
        imageElement.show();
    } else {
        console.log('Nicht unterstützter Dateityp');
    }
}

function classifyImage() {
    if (imageElement) {
        classifier.classify(imageElement, gotResult);
        imageElement.hide(); // Hide image in the drop area after classification
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
        imageThumbnail.size(100, 100); // Maintain thumbnail size in results
        imageThumbnail.parent(imageSection);
        imageThumbnail.show();

        const resultContainer = select('#resultContainer');
        resultContainer.html(`
            <div class="custom-bar">
                <div class="confidence-bar" style="width:${confidence * 4}px"></div>
                <div class="confidence-text">${nf(confidence, 0, 0)}%</div>
            </div>
            <p class="label-text" style="text-align: center;">${label}</p>
        `);
    }
}

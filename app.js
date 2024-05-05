let classifier;
let imageElement;
let previousThumbnail; // Globale Variable zum Speichern des vorherigen Thumbnails

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
        imageElement = createImg(file.data, '').hide();
        imageElement.size(400, 400); // Resize image to fit drop area
        const dropArea = select('#dropArea');
        dropArea.html('');
        imageElement.parent(dropArea);
        imageElement.show();

        if (previousThumbnail) {
            // Display the previous thumbnail in the image section if exists
            const imageSection = select('#imageSection');
            imageSection.html(''); // Clear previous content
            previousThumbnail.size(100, 100);
            previousThumbnail.parent(imageSection);
            previousThumbnail.show();
        }
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

        // Prepare new thumbnail for the result section
        previousThumbnail = createImg(imageElement.elt.src, '').hide();
        const resultContainer = select('#resultContainer');
        resultContainer.html(`
            <div class="custom-bar">
                <div class="confidence-bar" style="width:${confidence * 4}px"></div>
                <div class="confidence-text">${Math.round(confidence)}%</div>
            </div>
            <p class="label-text" style="text-align: center;">${label}</p>
        `);
        previousThumbnail.show(); // Show new thumbnail in result section
    }
}

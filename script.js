const deviceDimensions = {
    '69': { width: 1290, height: 2796, name: 'Pantalla 6.9"' },
    '65': { width: 1284, height: 2778, name: 'Pantalla 6.5"' }
};

document.getElementById('imageInput').addEventListener('change', handleImageUpload);
document.getElementById('deviceSelect').addEventListener('change', () => {
    const imageInput = document.getElementById('imageInput');
    if (imageInput.files.length > 0) {
        handleImageUpload({ target: imageInput });
    }
});

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const img = new Image();
        img.onload = function () {
            validateImageDimensions(this.width, this.height);
            displayImagePreview(e.target.result);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function validateImageDimensions(width, height) {
    const selectedDevice = document.getElementById('deviceSelect').value;
    const expectedDimensions = deviceDimensions[selectedDevice];
    const resultSection = document.getElementById('result');
    const dimensionsResult = document.getElementById('dimensionsResult');
    const validationMessage = document.getElementById('validationMessage');

    resultSection.classList.remove('hidden');

    // Mostrar dimensiones actuales
    dimensionsResult.innerHTML = `Dimensiones de tu imagen: ${width} x ${height} píxeles`;

    // Validar dimensiones
    if (width === expectedDimensions.width && height === expectedDimensions.height) {
        validationMessage.innerHTML = `✅ ¡Las dimensiones son correctas para ${expectedDimensions.name}!`;
        validationMessage.className = 'success';
    } else {
        validationMessage.innerHTML = `❌ Las dimensiones no coinciden. Para ${expectedDimensions.name}, la imagen debería ser de ${expectedDimensions.width} x ${expectedDimensions.height} píxeles.`;
        validationMessage.className = 'error';
    }
}

function displayImagePreview(src) {
    const previewSection = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');

    previewSection.classList.remove('hidden');
    previewImg.src = src;
} 
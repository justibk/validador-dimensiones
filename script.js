const deviceDimensions = {
    '69': {
        name: 'Pantalla 6.9"',
        dimensions: [
            { width: 1290, height: 2796 },
            { width: 2796, height: 1290 },
            { width: 1320, height: 2868 },
            { width: 2868, height: 1320 }
        ]
    },
    '65': {
        name: 'Pantalla 6.5"',
        dimensions: [
            { width: 1284, height: 2778 },
            { width: 2778, height: 1284 },
            { width: 1242, height: 2688 },
            { width: 2688, height: 1242 }
        ]
    }
};

document.getElementById('imageInput').addEventListener('change', handleImageUpload);
document.getElementById('deviceSelect').addEventListener('change', handleDeviceChange);

// Mostrar las dimensiones del dispositivo seleccionado inicialmente
handleDeviceChange();

function handleDeviceChange() {
    const selectedDevice = document.getElementById('deviceSelect').value;
    document.getElementById('dimensions69').style.display = selectedDevice === '69' ? 'block' : 'none';
    document.getElementById('dimensions65').style.display = selectedDevice === '65' ? 'block' : 'none';

    const imageInput = document.getElementById('imageInput');
    if (imageInput.files.length > 0) {
        handleImageUpload({ target: imageInput });
    }
}

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
    const deviceInfo = deviceDimensions[selectedDevice];
    const resultSection = document.getElementById('result');
    const dimensionsResult = document.getElementById('dimensionsResult');
    const validationMessage = document.getElementById('validationMessage');

    resultSection.classList.remove('hidden');

    // Mostrar dimensiones actuales
    dimensionsResult.innerHTML = `Dimensiones de tu imagen: <span class="dimensions">${width} × ${height}</span> píxeles`;

    // Validar dimensiones
    const isValid = deviceInfo.dimensions.some(dim =>
        (width === dim.width && height === dim.height)
    );

    if (isValid) {
        validationMessage.innerHTML = `✅ ¡Las dimensiones son correctas para ${deviceInfo.name}!`;
        validationMessage.className = 'success';
    } else {
        const dimensionsText = deviceInfo.dimensions
            .map(dim => `<span class="dimensions">${dim.width} × ${dim.height}</span>`)
            .join(' o ');
        validationMessage.innerHTML = `❌ Las dimensiones no coinciden. Para ${deviceInfo.name}, la imagen debería ser de ${dimensionsText} píxeles.`;
        validationMessage.className = 'error';
    }
}

function displayImagePreview(src) {
    const previewSection = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');

    previewSection.classList.remove('hidden');
    previewImg.src = src;
} 
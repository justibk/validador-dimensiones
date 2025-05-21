import React, { useState } from 'react';
import './ImageValidator.css';

interface DeviceDimensions {
    name: string;
    dimensions: { width: number; height: number }[];
}

interface Dimensions {
    width: number;
    height: number;
}

const deviceDimensions: Record<'69' | '65', DeviceDimensions> = {
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

export const ImageValidator: React.FC = () => {
    const [selectedDevice, setSelectedDevice] = useState<'69' | '65'>('69');
    const [imageDimensions, setImageDimensions] = useState<Dimensions | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isValid, setIsValid] = useState<boolean | null>(null);

    const handleDeviceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const device = event.target.value as '69' | '65';
        setSelectedDevice(device);
        if (imageDimensions) {
            validateDimensions(imageDimensions.width, imageDimensions.height, device);
        }
    };

    const validateDimensions = (width: number, height: number, device: '69' | '65' = selectedDevice) => {
        const isValidSize = deviceDimensions[device].dimensions.some(
            dim => (width === dim.width && height === dim.height) || (width === dim.height && height === dim.width)
        );
        setIsValid(isValidSize);
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result;
            if (result && typeof result === 'string') {
                const img = new Image();
                img.onload = () => {
                    setImageDimensions({ width: img.width, height: img.height });
                    validateDimensions(img.width, img.height);
                };
                img.src = result;
                setPreviewUrl(result);
            }
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="container">
            <h1>Validador de Dimensiones de Pantalla</h1>

            <div className="device-selector">
                <label htmlFor="deviceSelect">Selecciona el tamaño de pantalla:</label>
                <select id="deviceSelect" value={selectedDevice} onChange={handleDeviceChange}>
                    {Object.entries(deviceDimensions).map(([key, device]) => (
                        <option key={key} value={key}>{device.name}</option>
                    ))}
                </select>
            </div>

            <div className="device-dimensions">
                <div className="dimensions-info">
                    <h3>Dimensiones permitidas para {deviceDimensions[selectedDevice].name}:</h3>
                    <ul>
                        {deviceDimensions[selectedDevice].dimensions.map((dim, index) => (
                            <li key={index}>
                                <span className="dimensions">{dim.width} × {dim.height}</span> píxeles
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="upload-section">
                <label htmlFor="imageInput" className="upload-label">
                    <span>Seleccionar imagen</span>
                    <input
                        type="file"
                        id="imageInput"
                        accept="image/*"
                        onChange={handleImageUpload}
                    />
                </label>
            </div>

            {imageDimensions && (
                <div className="result-section">
                    <h2>Resultado:</h2>
                    <div className="result-content">
                        <p>Dimensiones de tu imagen: <span className="dimensions">{imageDimensions.width} × {imageDimensions.height}</span> píxeles</p>
                        {isValid !== null && (
                            <p className={isValid ? 'success' : 'error'}>
                                {isValid
                                    ? `✅ ¡Las dimensiones son correctas para ${deviceDimensions[selectedDevice].name}!`
                                    : `❌ Las dimensiones no coinciden. Para ${deviceDimensions[selectedDevice].name}, la imagen debería ser de ${deviceDimensions[selectedDevice].dimensions
                                        .map(dim => `${dim.width} × ${dim.height}`)
                                        .join(' o ')
                                    } píxeles.`}
                            </p>
                        )}
                    </div>
                </div>
            )}

            {previewUrl && (
                <div className="image-preview">
                    <h3>Vista previa:</h3>
                    <img src={previewUrl} alt="Vista previa de la imagen" />
                </div>
            )}
        </div>
    );
}; 
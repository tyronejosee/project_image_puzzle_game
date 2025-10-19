import { useState, useCallback } from "react";
import { Upload } from "lucide-react";
import Cropper from "react-easy-crop";
import { Modal } from "./Modal";
import { useImageCrop } from "../hooks/useImageCrop";
import { CropArea, resizeImage } from "../utils/image-utils";

type ImageUploaderProps = {
  onImageCropped: (imageUrl: string) => void;
};

export function ImageUploader({ onImageCropped }: ImageUploaderProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { cropImage, isCropping } = useImageCrop();

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      const reader = new FileReader();
      reader.onload = async () => {
        const imageUrl = reader.result as string;
        const resized = await resizeImage(imageUrl, 1200);
        setSelectedImage(resized);
        setIsModalOpen(true);
      };
      reader.readAsDataURL(file);
    },
    []
  );

  const onCropComplete = useCallback((_: any, croppedAreaPixels: CropArea) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCrop = useCallback(async () => {
    if (!selectedImage || !croppedAreaPixels) return;

    await cropImage(selectedImage, croppedAreaPixels);
    const croppedImg = await getCroppedImageInternal(
      selectedImage,
      croppedAreaPixels
    );
    onImageCropped(croppedImg);
    setIsModalOpen(false);
    setSelectedImage(null);
  }, [selectedImage, croppedAreaPixels, cropImage, onImageCropped]);

  const getCroppedImageInternal = async (
    imageSrc: string,
    crop: CropArea
  ): Promise<string> => {
    const image = await createImageElement(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) throw new Error("No 2d context");

    canvas.width = crop.width;
    canvas.height = crop.height;

    ctx.drawImage(
      image,
      crop.x,
      crop.y,
      crop.width,
      crop.height,
      0,
      0,
      crop.width,
      crop.height
    );

    return canvas.toDataURL("image/jpeg", 0.9);
  };

  const createImageElement = (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", reject);
      image.src = url;
    });
  };

  return (
    <>
      <div className="w-full">
        <label
          htmlFor="image-upload"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors group"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <div className="p-4 bg-white rounded-full mb-4">
              <Upload className="w-8 h-8 text-gray-600" />
            </div>
            <p className="mb-2 text-sm text-gray-700 font-medium">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG, or JPEG (Max 10MB)
            </p>
          </div>
          <input
            id="image-upload"
            type="file"
            className="hidden"
            accept="image/jpeg,image/png,image/jpg"
            onChange={handleFileSelect}
            aria-label="Upload image file"
          />
        </label>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Crop Your Image"
        closeOnOverlayClick={false}
      >
        <div className="space-y-6">
          <div className="relative w-full h-96 bg-gray-900 rounded-lg overflow-hidden">
            {selectedImage && (
              <Cropper
                image={selectedImage}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="zoom-slider"
              className="block text-sm font-medium text-gray-700"
            >
              Zoom: {zoom.toFixed(1)}x
            </label>
            <input
              id="zoom-slider"
              type="range"
              min="1"
              max="3"
              step="0.1"
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              aria-label="Zoom level"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setIsModalOpen(false)}
              className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              disabled={isCropping}
            >
              Cancel
            </button>
            <button
              onClick={handleCrop}
              disabled={isCropping}
              className="flex-1 px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCropping ? "Processing..." : "Create Puzzle"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

import { useState, useCallback } from "react";
import { getCroppedImg, CropArea } from "../utils/image-utils";

export type UseImageCropResult = {
  croppedImage: string | null;
  isCropping: boolean;
  error: string | null;
  cropImage: (
    imageSrc: string,
    croppedAreaPixels: CropArea,
    rotation?: number
  ) => Promise<void>;
  reset: () => void;
};

export function useImageCrop(): UseImageCropResult {
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cropImage = useCallback(
    async (imageSrc: string, croppedAreaPixels: CropArea, rotation = 0) => {
      setIsCropping(true);
      setError(null);
      try {
        const croppedImg = await getCroppedImg(
          imageSrc,
          croppedAreaPixels,
          rotation
        );
        setCroppedImage(croppedImg);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to crop image");
        console.error("Error cropping image:", err);
      } finally {
        setIsCropping(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setCroppedImage(null);
    setError(null);
    setIsCropping(false);
  }, []);

  return {
    croppedImage,
    isCropping,
    error,
    cropImage,
    reset,
  };
}

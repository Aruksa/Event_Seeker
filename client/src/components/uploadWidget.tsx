import { Button } from "@chakra-ui/react";
import { useEffect, useRef } from "react";

type Cloudinary = {
  createUploadWidget: (
    options: object,
    callback: (error: any, result: any) => void
  ) => { open: () => void } | undefined;
};

type UploadWidgetProps = {
  onUpload: (url: string) => void;
};

const UploadWidget = ({ onUpload }: UploadWidgetProps) => {
  const cloudinaryRef = useRef<Cloudinary | null>(null);
  const widgetRef = useRef<{ open: () => void } | null | undefined>(null);

  useEffect(() => {
    cloudinaryRef.current = window.cloudinary;
    widgetRef.current = cloudinaryRef.current?.createUploadWidget(
      {
        cloudName: "dn6nsa6e0",
        uploadPreset: "jjimfxko",
      },
      (error: any, result: any) => {
        if (result.event === "success") {
          onUpload(result.info.secure_url); // Pass the image URL back to EventPost
        }
      }
    );
  }, [onUpload]);

  return <Button onClick={() => widgetRef.current?.open()}>Upload</Button>;
};

export default UploadWidget;

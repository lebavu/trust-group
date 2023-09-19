import React, { useEffect, useState, CSSProperties } from "react";
import ErrorImage from "@/assets/error.png";

interface ImageComponentProps {
  src: string | null | undefined;
  alt: string;
  classNames?: string | undefined ;
  style?: CSSProperties | undefined;
}

const ImageComponent: React.FC<ImageComponentProps> = ({ src, alt, classNames, style }) => {
  const [imageSrc, setImageSrc] = useState<string>(ErrorImage);

  useEffect(() => {
    if (!src || src === "string") {
      setImageSrc(ErrorImage);
    } else {
      setImageSrc(src);
    }
  }, [src]);

  return <img src={imageSrc} alt={alt} className={classNames} style={style} />;
};

export default ImageComponent;

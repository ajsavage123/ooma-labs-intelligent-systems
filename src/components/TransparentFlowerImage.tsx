import React, { useRef, useEffect, useState } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface TransparentFlowerImageProps extends HTMLMotionProps<"canvas"> {
  src: string;
  alt?: string;
  className?: string;
}

export const TransparentFlowerImage = ({ src, alt, className, animate, transition, ...props }: TransparentFlowerImageProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    // Handle cross-origin if necessary
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;
      
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // Remove the dark background pixels to make it transparent
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i+1];
        const b = data[i+2];
        
        // If the pixel is very dark (close to black background), make it transparent
        const threshold = 35; // Adjust this if some bg is still visible
        if (r < threshold && g < threshold && b < threshold) {
           data[i+3] = 0; // alpha = 0 (fully transparent)
        } else {
           // Smooth edge blending for near-black pixels
           const maxVal = Math.max(r, g, b);
           if (maxVal < 80) {
               data[i+3] = (maxVal / 80) * 255;
           }
        }
      }
      ctx.putImageData(imageData, 0, 0);
      setImageLoaded(true);
    };
    img.src = src;
  }, [src]);

  return (
    <motion.canvas 
      ref={canvasRef} 
      className={className} 
      style={{ opacity: imageLoaded ? 1 : 0, transition: 'opacity 0.5s' }}
      aria-label={alt}
      animate={animate}
      transition={transition}
      {...props}
    />
  );
};

export default TransparentFlowerImage;

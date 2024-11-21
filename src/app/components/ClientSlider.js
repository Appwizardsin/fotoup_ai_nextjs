'use client';

import Slider from "react-slick";
import Image from "next/image";
import Link from "next/link";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function ClientSlider({ items, settings, type }) {
  const renderItem = (model) => {
    if (type === 'featured') {
      return (
        <div key={model.modelId} className="px-1 md:px-2">
          <Link href={`/model/${model.modelId}`}>
            <div className="flex flex-col">
              <div className="aspect-square rounded-lg overflow-hidden relative group transition-all duration-300 bg-gray-800">
                <Image
                  src={model.imageUrl}
                  alt={model.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-opacity duration-300 opacity-0 hover:opacity-90 group-hover:opacity-90"
                  onLoad={(e) => e.target.classList.remove('opacity-0')}
                />
              </div>
              <h3 className="text-white text-[11px] md:text-lg font-semibold mt-1 md:mt-2 text-left truncate">
                {model.title}
              </h3>
            </div>
          </Link>
        </div>
      );
    }
    
    return (
      <div key={model.modelId} className="px-1 md:px-2">
        <Link href={`/model/${model.modelId}`}>
          <div className="flex flex-col">
            <div className="bg-gray-800 rounded-lg overflow-hidden aspect-[2/4] relative group transition-all duration-300">
              <Image
                src={model.imageUrl}
                alt={model.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-opacity duration-300 opacity-0 hover:opacity-90 group-hover:opacity-90"
                onLoad={(e) => e.target.classList.remove('opacity-0')}
              />
            </div>
          </div>
        </Link>
      </div>
    );
  };

  return (
    <Slider {...settings}>
      {items.map(renderItem)}
    </Slider>
  );
} 
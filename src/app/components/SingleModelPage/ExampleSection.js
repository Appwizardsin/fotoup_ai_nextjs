'use client';

import Image from 'next/image';

const ExampleSection = ({ model }) => {
  if (!model.exampleOutputs?.length) return null;
  return (
    <div className="mb-8 p-2 sm:p-4 bg-gray-800 rounded-lg">
      <h3 className="text-sm sm:text-base font-semibold sm:font-bold mb-2 sm:mb-4 text-white">
        Example Results
      </h3>
      <div className="flex flex-nowrap gap-2 sm:gap-4 overflow-x-auto">
        {model.exampleOutputs.map((imageUrl, index) => (
          <div 
            key={index}
            className="relative w-[100px] sm:w-[150px] md:w-[200px] h-[70px] sm:h-[100px] md:h-[140px] flex-none"
          >
            <Image
              src={imageUrl}
              alt={`Example ${index + 1}`}
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 768px) 100px, (max-width: 1024px) 150px, 200px"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExampleSection; 
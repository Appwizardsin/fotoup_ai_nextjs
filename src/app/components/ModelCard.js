"use client";

import Image from "next/image";
import Link from "next/link";

export default function ModelCard({
  modelId,
  title,
  description,
  imageUrl,
  runCount = 0,
}) {
  return (
    <Link href={`/model/${modelId}`}>
      <div className="bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer">
        <div className="relative" style={{ paddingBottom: "177.78%" }}>
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-opacity duration-300 opacity-0"
            onLoad={(e) => e.target.classList.remove("opacity-0")}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
        {/* <div className="pt-2 pb-0 pl-2 pr-2">
          <h3 className="text-xs md:text-lg font-semibold text-white mb-2 truncate">
            {title || "Untitled"}
          </h3>
          {runCount > 0 && (
            <div className="flex items-center text-sm text-gray-500">
              <span>{runCount.toLocaleString()} runs</span>
            </div>
          )}
        </div> */}
      </div>
    </Link>
  );
}

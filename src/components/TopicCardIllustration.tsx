"use client";

import Image from "next/image";
import { useState } from "react";
import { TopicCardArt } from "@/components/TopicCardArt";

interface TopicCardIllustrationProps {
  branchId: string;
  imageSrc?: string;
  title: string;
  locked?: boolean;
}

export function TopicCardIllustration({
  branchId,
  imageSrc,
  title,
  locked,
}: TopicCardIllustrationProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const showImage = Boolean(imageSrc) && !imgFailed;

  return (
    <div
      className={`relative mx-auto flex h-full w-full items-end justify-center ${
        locked ? "opacity-60 saturate-50" : ""
      }`}
    >
      {showImage ? (
        <Image
          src={imageSrc!}
          alt=""
          width={200}
          height={180}
          className="max-h-[128px] w-full max-w-[200px] bg-transparent object-contain object-bottom transition duration-200 group-hover:scale-[1.03] sm:max-h-[140px]"
          onError={() => setImgFailed(true)}
          unoptimized
        />
      ) : (
        <TopicCardArt
          branchId={branchId}
          className="h-full w-full max-w-[168px] drop-shadow-sm transition duration-200 group-hover:scale-[1.03]"
        />
      )}
      <span className="sr-only">{title}</span>
    </div>
  );
}

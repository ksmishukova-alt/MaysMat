import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  className?: string;
}

export function Logo({ className = "" }: LogoProps) {
  return (
    <Link
      href="/"
      className={`block text-center ${className}`}
      aria-label="МышМат — на главную"
    >
      <Image
        src="/logo-mysmat.png"
        alt=""
        width={800}
        height={800}
        unoptimized
        className="mx-auto h-auto w-[85%] max-w-[200px] object-contain"
        priority
        aria-hidden
      />
      <div className="mt-0.5">
        <div className="text-bubble-brand font-black">МышМат</div>
        <div className="text-bubble-tagline mt-0.5 text-[11px] font-bold text-brand-purple-light">
          ✦ учимся думать ✦
        </div>
      </div>
    </Link>
  );
}

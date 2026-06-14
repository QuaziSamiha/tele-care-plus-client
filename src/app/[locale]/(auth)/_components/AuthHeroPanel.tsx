import Image from "next/image";
import { Link } from "@/i18n/navigation";
import LogoIcon from "@/components/shared/logo/LogoIcon";
import { APP_NAME } from "@/constants/common.constants";

export default function AuthHeroPanel() {
  return (
    <div className="relative w-1/2 max-lg:hidden">
      <Image
        src="/images/common/login.png"
        fill
        alt={`${APP_NAME} Authentication`}
        priority
        quality={90}
        sizes="50vw"
        className="object-cover"
      />
      <div className="absolute top-8 left-8">
        <Link href="/">
          <LogoIcon className="w-16 h-16 text-mauve-800" />
        </Link>
      </div>
      <div className="absolute bottom-12 left-12 text-mauve-800 drop-shadow-lg">
        <h1 className="text-3xl font-medium mb-2">{APP_NAME}</h1>
        <p className="text-base opacity-90 leading-relaxed">
          A Whisper of Fragrance,
          <br />A Lasting Impression.
        </p>
      </div>
    </div>
  );
}

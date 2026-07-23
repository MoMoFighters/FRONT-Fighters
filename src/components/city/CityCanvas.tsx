import Image from "next/image";
import city from "@/app/assets/img/cityImg.png";

export default function CityCanvas({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="scrollbar-hidden relative flex h-full w-full items-center justify-center overflow-auto [container-type:size]">
            <div className="relative aspect-video w-[max(100cqw,177.777cqh)] shrink-0 [container-type:inline-size]">
                <Image
                    src={city}
                    alt="도시배경"
                    fill
                    quality={80}
                    priority
                    className="object-cover"
                    sizes="100vw"
                />
                {children}
            </div>
        </div>
    );
}

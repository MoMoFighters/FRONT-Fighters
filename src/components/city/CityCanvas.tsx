import Image from "next/image";
import city from "@/app/assets/img/cityImg.png";

export default function CityCanvas({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="relative h-full w-full overflow-hidden [container-type:size]">
            <div className="absolute left-1/2 top-1/2 aspect-video w-[max(100cqw,177.777cqh)] -translate-x-1/2 -translate-y-1/2 [container-type:inline-size]">
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

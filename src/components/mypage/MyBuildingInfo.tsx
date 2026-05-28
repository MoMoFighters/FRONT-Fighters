export default function MyBuildingInfo({ data }: {
    data: {
        name: string;
        nickname: string;
        createdAt: number;
        issueDate: string;
        email: string;
        points: number
        buildings: number;
    }
}) {

    const categoryBgColors: Record<string, string> = {
        health: 'bg-cyan-100 border-cyan-600',
        beauty: 'bg-fuchsia-100 border-fuchsia-600',
        cook: 'bg-orange-100 border-orange-600',
        study: 'bg-emerald-100 border-emerald-600',
        art: 'bg-violet-100 border-violet-600',
    };

    const categoryTextColors: Record<string, string> = {
        health: 'text-cyan-600',
        beauty: 'text-fuchsia-600',
        cook: 'text-orange-600',
        study: 'text-emerald-600',
        art: 'text-violet-600',
    }

    return (
        <div className="flex flex-row justify-between mt-4">
            <div className={`${categoryBgColors.health} flex flex-col gap-4 justify-center items-center border rounded-xl h-23 w-23`}>
                <p className={`text-xl font-bold ${categoryTextColors.health}`}>1</p>
                <p className={`text-md font-bold ${categoryTextColors.health}`}>HEALTH</p>
            </div>
            <div className={`${categoryBgColors.beauty} flex flex-col gap-4 justify-center items-center border rounded-xl h-23 w-23`}>
                <p className={`text-xl font-bold ${categoryTextColors.beauty}`}>4</p>
                <p className={`text-md font-bold ${categoryTextColors.beauty}`}>BEAUTY</p>
            </div>
            <div className={`${categoryBgColors.cook} flex flex-col gap-4 justify-center items-center border rounded-xl h-23 w-23`}>
                <p className={`text-xl font-bold ${categoryTextColors.cook}`}>5</p>
                <p className={`text-md font-bold ${categoryTextColors.cook}`}>COOK</p>
            </div>
            <div className={`${categoryBgColors.study} flex flex-col gap-4 justify-center items-center border rounded-xl h-23 w-23`}>
                <p className={`text-xl font-bold ${categoryTextColors.study}`}>3</p>
                <p className={`text-md font-bold ${categoryTextColors.study}`}>STUDY</p>
            </div>
            <div className={`${categoryBgColors.art} flex flex-col gap-4 justify-center items-center border rounded-xl h-23 w-23`}>
                <p className={`text-xl font-bold ${categoryTextColors.art}`}>2</p>
                <p className={`text-md font-bold ${categoryTextColors.art}`}>ART</p>
            </div>
        </div>
    );
}
import { cn } from "@/lib/util";

type Props = {
    className?: string;
    text: string;
}

export default function RowTitle({ className, text }: Props) {
    return (
        <div className={cn("rounded-sm w-8 flex justify-center items-center text-base h-full font-medium text-gray-500 bg-gray-200", className)}>
            {text}
        </div>
    );
}


import { cn } from "@/lib/util";

type Props = {
    className?: string;
    text: string;
}



export default function ColumnTitle( { className, text }: Props) {
    return (
        <div className={cn(" text-gray-500 bg-gray-200 rounded-sm h-7 w-full flex justify-center items-center text-base  font-medium", className)}>
            {text}
        </div>
    );
}
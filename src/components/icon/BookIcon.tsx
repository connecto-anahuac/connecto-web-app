import { cn } from "@/shared/lib/util";
import { ComponentProps } from "react";

type Props = ComponentProps<'svg'> & {};

export default function BookIcon({ className, strokeWidth, ...props }: Props) {
  return (
    <svg
      viewBox="0 0 13 13"
      fill="none"
      className={cn("w-6 h-6 aspect-square", className)}
      {...props}
    >
      <path
        d="M6.5 3.9917V11.575"
        stroke="currentColor"
        strokeWidth={strokeWidth ?? 1.08333}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1.6237 9.9502C1.48004 9.9502 1.34226 9.89313 1.24068 9.79155C1.1391 9.68996 1.08203 9.55219 1.08203 9.40853V2.36686C1.08203 2.2232 1.1391 2.08543 1.24068 1.98385C1.34226 1.88226 1.48004 1.8252 1.6237 1.8252H4.33203C4.90667 1.8252 5.45777 2.05347 5.8641 2.4598C6.27043 2.86613 6.4987 3.41723 6.4987 3.99186C6.4987 3.41723 6.72697 2.86613 7.1333 2.4598C7.53963 2.05347 8.09073 1.8252 8.66536 1.8252H11.3737C11.5174 1.8252 11.6551 1.88226 11.7567 1.98385C11.8583 2.08543 11.9154 2.2232 11.9154 2.36686V9.40853C11.9154 9.55219 11.8583 9.68996 11.7567 9.79155C11.6551 9.89313 11.5174 9.9502 11.3737 9.9502H8.1237C7.69272 9.9502 7.2794 10.1214 6.97465 10.4261C6.6699 10.7309 6.4987 11.1442 6.4987 11.5752C6.4987 11.1442 6.32749 10.7309 6.02275 10.4261C5.718 10.1214 5.30467 9.9502 4.8737 9.9502H1.6237Z"
        stroke="currentColor"
        strokeWidth={strokeWidth ?? 1.08333}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

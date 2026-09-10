import type { ComponentProps, ReactNode } from "react";
import { InformationLine, type InformationLineProps } from "../infoline/InformationLine";
import { cn } from "@/shared/lib/util";

type Props = ComponentProps<"div"> & {
  name: string;
  information?: InformationLineProps[];
  contactInformation?: InformationLineProps[];
  avatar?: ReactNode;
  status?: ReactNode;
};

/** Domain-neutral profile header. Student keeps its specialized legacy component. */
export function CommonProfileSummary({ name, information = [], contactInformation = [], avatar, status, className, ...props }: Props) {
  return <div className={cn("flex w-40 flex-col gap-5", className)} {...props}>
    <div className="flex items-center gap-3">
      {avatar ? <div className="relative size-fit">{avatar}{status ? <div className="absolute bottom-0 right-0">{status}</div> : null}</div> : status}
      <span className="w-full text-sm font-medium text-OnSurface">{name}</span>
    </div>
    {information.length ? <div className="flex flex-col gap-3">{information.map((line, index) => <InformationLine key={`${line.label}-${index}`} {...line} />)}</div> : null}
    {contactInformation.length ? <div className="flex flex-col gap-3">{contactInformation.map((line, index) => <InformationLine key={`${line.label}-${index}`} intent={line.intent ?? "tertiary"} {...line} />)}</div> : null}
  </div>;
}

export default CommonProfileSummary;

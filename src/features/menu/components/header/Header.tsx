import type { ComponentProps } from "react";
import Avator from "@/components/Avator";

import NavigationItem from "@/components/NavigationItem";
import type { IconName } from "@/components/icon";
import { cn } from "@/shared/lib/util";
import IconButtonOLD from "@/components/button/IconButton2";
import SearchBar from "@/components/search/SearchBar";
import ConnectoLogo from "@/components/icon/logo/Connecto";

type RootNavigationEntry = {
  label: string;
  icon: IconName;
};

type Props = ComponentProps<"div">;

const ROOT_NAVIGATION_ITEMS: RootNavigationEntry[] = [
  { label: "Alumnos", icon: "twoPersons" },
  { label: "Profesores", icon: "professor" },
  { label: "Materias", icon: "class" },
  { label: "Plan de estudios", icon: "curriculum" },
  { label: "Schedule builder", icon: "schedule" },
];

export default function Header({ className, ...props }: Props) {
  return (
    <div
      className={cn("flex items-center px-body-x h-10", className)}
      {...props}
    >
      {/* logosection */}
      <div className="flex items-center gap-2.5  pl-header-logo-left">
        <ConnectoLogo className="size-header-logo" />
        <span className="text-OnSurfaceVariant text-xs font-semibold">
          Connecto
        </span>
        <IconButtonOLD icon="panelToLeft" className="size-6" />
      </div>

      {/* navigation */}
      <div className="flex items-center gap-0 ml-8 mr-auto text-OnSurface">
        <IconButtonOLD icon="arrow" className="size-6" />
        <IconButtonOLD icon="arrow" className="size-6 transform rotate-180 text-OnSurface/40" />
        <span className="ml-5 font-semibold text-OnSurfaceVariant text-xs">
          alumnos
        </span>
      </div>

      <SearchBar className="w-80" placeholder="buscar en todo el workspace" />

      {/* notification & avatar */}
      <div className="flex items-center gap-2 text-OnSurface ml-4">
        <IconButtonOLD icon="bell" className="size-6" />
        <button className="relative p-0 rounded-full size-fit overflow-hidden group">
          <Avator
            fullName="Jose Perez"
            size="medium"
            className="bg-(--ADM-strong)"
          />
          <span className="absolute inset-0 rounded-full bg-black/20 opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100 pointer-events-none" />
        </button>
      </div>
    </div>
  );
}

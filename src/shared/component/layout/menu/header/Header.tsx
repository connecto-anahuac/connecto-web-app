"use client";

import type { ComponentProps } from "react";
import { useRouter } from "next/navigation";
import Avator from "@/shared/component/primitive/Avator";

import { cn } from "@/shared/lib/util";
import SearchBar from "@/shared/component/primitive/searchbar/SearchBar";
import ConnectoLogo from "@/shared/component/primitive/icon/logo/Connecto";
import IconButton from "@/shared/component/primitive/button/IconButton";
import PanelControllButton from "@/shared/component/primitive/button/PanelControllButton";
import { useMenu } from "../useMenu";
import ToolTipWrapper from "@/shared/component/primitive/ToolTipWrapper";
import { useNavigationAvailability } from "./useNavigationAvailability";

type Props = ComponentProps<"div">;

export default function Header({ className, ...props }: Props) {
  const router = useRouter();
  const { canGoBack, canGoForward } = useNavigationAvailability();
  const isSidebarOpen = useMenu((state) => state.isSidebarOpen);
  const toggleSidebar = useMenu((state) => state.toggleSidebar);

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
        {/* <IconButton icon="panelToLeft" size="lg" /> */}
        <ToolTipWrapper hint={isSidebarOpen ? "Contraer sidebar" : "Expandir sidebar"}>
        <PanelControllButton
          size="lg"
          appearance="text"
          intent="lightInk"
          isOpen={isSidebarOpen}
          onClick={toggleSidebar}
        />

        </ToolTipWrapper>
      </div>

      {/* navigation */}
      <div className="flex items-center gap-0 ml-8 mr-auto text-OnSurface">
        <ToolTipWrapper hint="Atrás">
          <IconButton
            type="button"
            aria-label="戻る"
            icon="arrow"
            size="lg"
            disabled={!canGoBack}
            onClick={() => router.back()}
          />
        </ToolTipWrapper>
        <ToolTipWrapper hint="Adelante">
          <IconButton
            type="button"
            aria-label="進む"
            icon="arrow"
            size="lg"
            disabled={!canGoForward}
            className="transform rotate-180 "
            onClick={() => router.forward()}
          />
        </ToolTipWrapper>

        <span className="ml-5 font-semibold text-OnSurfaceVariant text-xs">
          alumnos
        </span>
      </div>

      <SearchBar className="w-80" placeholder="buscar en todo el workspace" />

      {/* notification & avatar */}
      <div className="flex items-center gap-2 text-OnSurface ml-4">
        <IconButton size="lg" intent="lightInk" appearance="text" icon="bell" />
        <button className="relative p-0 rounded-full size-fit overflow-hidden group">
          <Avator
            fullName="Jose Perez"
            size="medium"
            className="bg-(--ADM-strong)"
          />
          <span className="absolute inset-0 rounded-full bg-black/20 opacity-0 transition-opacity duration-150 group-hover:opacity-40 group-focus-visible:opacity-40 pointer-events-none" />
        </button>
      </div>
    </div>
  );
}

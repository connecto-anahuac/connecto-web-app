/* 
color

bg
border
foreground
divider
container
oncontainer

*/

import { cn } from "@/shared/lib/util";
import Menu from "./Menu";
import TopBar from "./TopBar";
import ControllPanelRight from "./ControllPanelRight";

type Props = { className?: string };

export default function Header({ className }: Props) {
  return (
    <div 
          className={cn(
            "relative  ",
            className
          )}>
        <header
          className={cn(
            "flex items-center justify-between gap-7 w-full px-body-frame pt-body-frame h-fit",
            // className
          )}
          >
        
              <Menu />
              <TopBar className={cn("flex-1 h-full")} />
          </header>
          
          {/* <ControllPanelRight className="  absolute -bottom-2 right-body-frame  translate-y-full"/> */}
    </div>
  );
}

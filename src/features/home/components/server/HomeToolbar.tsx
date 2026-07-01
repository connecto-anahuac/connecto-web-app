import { FilterIcon, ListViewIcon, PlanViewIcon, SearchIcon, SortIcon } from "@/features/home/components/server/icons";

type HomeToolbarProps = {
  filterTags: string[];
};

export function HomeToolbar({ filterTags }: HomeToolbarProps) {
  return (
    <div className="flex flex-col gap-3.5">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap items-center gap-3.5">
          <div className="home-search-w flex min-h-[49px] flex-1 items-center gap-3.5 rounded-full border-2 border-connecto-divider bg-connecto-muted-panel px-6 py-2.5 text-connecto-muted xl:flex-none">
            <SearchIcon />
            <span className="min-w-0 flex-1 truncate text-base font-semibold sm:text-xl lg:text-2xl">
              search + class name, code, NRC
            </span>
            <FilterIcon />
          </div>
          <button type="button" className="flex size-8 items-center justify-center" aria-label="Sort courses">
            <SortIcon />
          </button>
        </div>

        <div className="inline-flex items-center self-start overflow-hidden rounded-full">
          <button
            type="button"
            className="flex items-center gap-1.5 bg-connecto-muted-panel px-5 py-2.5 text-base text-connecto-muted"
          >
            <span>plan</span>
            <PlanViewIcon />
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 bg-connecto-muted px-5 py-2.5 text-base text-white"
          >
            <span>list</span>
            <ListViewIcon />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-5">
        {filterTags.map((tag) => (
          <button
            key={tag}
            type="button"
            className="rounded-full bg-connecto-muted-panel px-3.5 py-1.5 text-xs text-connecto-ink"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
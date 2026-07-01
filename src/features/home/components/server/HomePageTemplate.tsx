import { filterTags, navigationItems, records, studentProfile } from "@/features/home/lib/home-page-data";
import { CourseRecordsTable } from "./CourseRecordsTable";
import { HomeSidebar } from "./HomeSidebar";
import { HomeToolbar } from "./HomeToolbar";
import { StudentProfileSummary } from "./StudentProfileSummary";

export function HomePageTemplate() {
  return (
    <main className="min-h-screen bg-white text-connecto-ink">
      <div className="home-shell-max mx-auto flex min-h-screen flex-col lg:flex-row">
        <HomeSidebar items={navigationItems} />
        <section className="flex min-w-0 flex-1 flex-col gap-7 px-4 py-6 sm:px-6 lg:px-12 lg:py-8">
          <StudentProfileSummary profile={studentProfile} />

          <section className="rounded-home-panel flex min-h-0 flex-1 flex-col gap-5 overflow-hidden bg-connecto-surface px-5 py-5">
            <HomeToolbar filterTags={filterTags} />

            <div className="h-0.5 w-full bg-connecto-divider" />
            <CourseRecordsTable records={records} />
          </section>
        </section>
      </div>
    </main>
  );
}
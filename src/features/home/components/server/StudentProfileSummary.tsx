import type { StudentProfile } from "@/features/home/types";
import { ContactIcon, ProfileAvatarIcon } from "@/features/home/components/server/icons";

type StudentProfileSummaryProps = {
  profile: StudentProfile;
};

export function StudentProfileSummary({ profile }: StudentProfileSummaryProps) {
  return (
    <header className="flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-2.5">
        <div className="flex flex-col items-center">
          <div className="home-avatar-size flex items-center justify-center rounded-home-avatar bg-connecto-muted-panel text-connecto-sidebar shadow-[inset_0_0_0_1px_var(--color-connecto-divider)]">
            <ProfileAvatarIcon />
          </div>
          <div className="mt-1.5 flex items-center gap-1.5 text-base font-medium text-connecto-ink">
            <span className="size-2.5 rounded-full bg-connecto-success" />
            {profile.status}
          </div>
        </div>

        <div className="flex min-w-0 flex-col justify-between gap-5 pt-3 md:h-[180px]">
          <div className="flex flex-wrap items-center gap-3 text-base text-connecto-ink">
            <span>{profile.program}</span>
            <span className="rounded bg-connecto-muted-panel px-2.5 py-1 text-sm text-connecto-muted">
              {profile.planLabel}
            </span>
          </div>

          <h1 className="text-3xl font-normal tracking-[-0.03em] sm:text-4xl">
            {profile.name}
          </h1>

          <div className="flex flex-wrap gap-5 md:gap-[34px]">
            {profile.summaryItems.map((item, index) => (
              <div key={item.label} className="flex items-center gap-5">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-0.5 text-base">
                    <span>{item.label}</span>
                    <span>:</span>
                  </div>
                  <span className="text-2xl">{item.value}</span>
                </div>
                {index < profile.summaryItems.length - 1 ? <span className="hidden h-[34px] w-px bg-connecto-divider md:block" /> : null}
              </div>
            ))}

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-0.5 text-base">
                <span>contacto</span>
                <span>:</span>
              </div>
              <div className="flex items-center gap-[17px]">
                {profile.contactActions.map((action) => (
                  <ContactIcon key={action} type={action} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="home-progress-size flex shrink-0 flex-col items-center justify-center rounded-full border-home-progress border-connecto-ink bg-white text-connecto-ink">
        <div className="flex items-end justify-center leading-none">
          <span className="text-4xl">{profile.progressValue}</span>
          <span className="mb-1 text-2xl">{profile.progressSuffix}</span>
        </div>
        <span className="text-2xl">{profile.progressLabel}</span>
      </div>
    </header>
  );
}
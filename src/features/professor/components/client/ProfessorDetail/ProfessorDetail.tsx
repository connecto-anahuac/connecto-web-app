"use client";

import { useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import ContentTitleSection from "@/shared/component/primitive/ContentTitleSection";
import TabBadge from "@/shared/component/primitive/TabBadge";
import { Icons } from "@/shared/component/primitive/icon";
import CommonProfileSummary from "@/shared/component/composite/profileSummary/summary/CommonProfileSummary";
import { cn } from "@/shared/lib/util";
import type { ProfessorDetailTab } from "../../../types/professor";
import { PeriodControl } from "../ProfessorsPage/PeriodControl";
import { useProfessorNavigation } from "../ProfessorsPage/useProfessorNavigation";
import { ProfessorDataSection } from "./ProfessorDataSection";
import { ASSIGNED_SUBJECTS_VIEW_CONFIG, AVAILABILITY_VIEW_CONFIG, getProfessorAvailabilityRowId } from "./professorDetailViewConfig";
import { useProfessorDetail } from "./useProfessorDetail";

type Props = { professorId: string; period?: string; className?: string };

export function ProfessorDetail({ professorId, period, className }: Props) {
  const { detail, errorMessage, loading } = useProfessorDetail(professorId, period);
  const { setPeriod } = useProfessorNavigation();
  const [selectedTab, setSelectedTab] = useState<ProfessorDetailTab>("overview");

  if (loading) return <div role="status">Cargando profesor...</div>;
  if (errorMessage) return <div role="alert">{errorMessage}</div>;
  if (!detail) return <div>No se encontró el profesor.</div>;

  const active = detail.status.toLowerCase() === "active" || detail.status.toLowerCase() === "activo";
  return (
    <div className={cn("flex h-full w-full flex-col gap-3 pb-0 @container", className)}>
      <ContentTitleSection title="Profesor" />
      <PeriodControl period={period} resolvedPeriod={detail.period} onChange={setPeriod} />
      <div className="flex min-h-0 flex-1 gap-3 @max-4xl:flex-col @min-4xl:flex-row">
        <CommonProfileSummary
          className="w-52"
          name={detail.name}
          avatar={<div className="flex size-20 items-center justify-center rounded-full bg-Primary text-xl font-semibold text-OnPrimary">{initials(detail.name)}</div>}
          status={<span aria-label={detail.status} className={cn("block size-4 rounded-full border-[3px] border-SurfaceContainerLowest bg-DividerMiddle", active && "bg-StatusGood")} />}
          information={[
            { iconName: "hashmark", label: "ID", value: detail.id || "--" },
            { iconName: "schoolHat", label: "Carrera", value: detail.career || "--" },
            { iconName: "admin", label: "Puesto", value: detail.job || "--" },
          ]}
          contactInformation={[
            { iconName: "schoolEmail", label: "Correo institucional", value: detail.email1 || "--" },
            { iconName: "email", label: "Correo alternativo", value: detail.email2 || "--" },
            { iconName: "whatsapp", label: "Teléfono", value: detail.phone || "--" },
          ]}
        />
        <Tabs.Root className="flex min-w-0 flex-1 flex-col" value={selectedTab} onValueChange={(value) => setSelectedTab(value as ProfessorDetailTab)}>
          <Tabs.List className="flex gap-2">
            <Tabs.Trigger value="overview" asChild><TabBadge label="Generales" selected={selectedTab === "overview"} icon={<Icons.list />} /></Tabs.Trigger>
            <Tabs.Trigger value="assigned-subjects" asChild><TabBadge label="Materias asignadas" selected={selectedTab === "assigned-subjects"} icon={<Icons.class />} /></Tabs.Trigger>
            <Tabs.Trigger value="available-hours" asChild><TabBadge label="Horas disponibles" selected={selectedTab === "available-hours"} icon={<Icons.schedule />} /></Tabs.Trigger>
          </Tabs.List>
          <div className="my-3 h-px w-full bg-DividerMiddle" />
          <Tabs.Content className="min-h-0 flex-1" value="overview"><Overview assigned={detail.assigned} assignable={detail.assignableSubjects} hours={detail.assignedHours} /></Tabs.Content>
          <Tabs.Content className="min-h-0 flex-1" value="assigned-subjects"><ProfessorDataSection data={detail.assignedSubjects} config={ASSIGNED_SUBJECTS_VIEW_CONFIG} getRowId={(item) => `${item.courseId}-${item.timeSlot}-${item.classroom}`} scopeId={`professor:${detail.id}:${detail.period}:assigned`} emptyMessage="No hay materias asignadas." /></Tabs.Content>
          <Tabs.Content className="min-h-0 flex-1" value="available-hours"><ProfessorDataSection data={detail.availability} config={AVAILABILITY_VIEW_CONFIG} getRowId={getProfessorAvailabilityRowId} scopeId={`professor:${detail.id}:${detail.period}:availability`} emptyMessage="No hay horarios disponibles." /></Tabs.Content>
        </Tabs.Root>
      </div>
    </div>
  );
}

function initials(name: string) { return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase(); }

function Overview({ assigned, assignable, hours }: { assigned: number; assignable: number; hours: number }) {
  const cards = [["Materias asignadas", assigned], ["Materias asignables", assignable], ["Horas asignadas", hours]] as const;
  return <div className="grid gap-3 md:grid-cols-3">{cards.map(([label, value]) => <div className="rounded-xl border border-DividerMiddle bg-PrimaryContainerLowest p-4" key={label}><p className="text-xs text-OnSurfaceVariant">{label}</p><p className="mt-2 text-2xl font-bold text-OnSurface">{value}</p></div>)}<div className="rounded-xl border border-DividerMiddle bg-PrimaryContainerLowest p-4 md:col-span-3"><p className="text-xs text-OnSurfaceVariant">Advertencias</p><p className="mt-2 text-sm text-OnSurface">Sin advertencias.</p></div></div>;
}

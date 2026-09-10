"use client";

import { useLiveQuery } from "dexie-react-hooks";
import CommonProfileSummary from "@/shared/component/composite/profileSummary/summary/CommonProfileSummary";
import ContentTitleSection from "@/shared/component/primitive/ContentTitleSection";
import { fetchClassroomDetail } from "@/external/handler/classrooms/query.client";
import { cn } from "@/shared/lib/util";

type Props = { classroomId: string; className?: string };

export function ClassroomDetail({ classroomId, className }: Props) {
  const snapshot = useLiveQuery(async () => {
    try {
      return { data: await fetchClassroomDetail(classroomId) } as const;
    } catch (error) {
      console.error("Failed loading classroom detail", error);
      return { error: true } as const;
    }
  }, [classroomId]);

  if (!snapshot) return <div role="status">Cargando aula...</div>;
  if ("error" in snapshot) return <div role="alert">No se pudo cargar el aula.</div>;
  if (!snapshot.data) return <div role="alert">No se encontró el aula.</div>;
  const classroom = snapshot.data;

  return <div className={cn("flex h-full w-full flex-col gap-3", className)}>
    <ContentTitleSection title="Aula" />
    <CommonProfileSummary
      className="w-full max-w-sm"
      name={classroom.name}
      information={[
        { iconName: "hashmark", label: "ID", value: classroom.id },
        { iconName: "door", label: "Ubicación", value: classroom.place || "--" },
        { iconName: "toolOutline", label: "Equipamiento", value: classroom.equipments.join(", ") || "--" },
        { iconName: "admin", label: "Administrador", value: classroom.admin || "--" },
        { iconName: "book", label: "Nota", value: classroom.note || "--" },
      ]}
    />
  </div>;
}

"use client";

import { useLiveQuery } from "dexie-react-hooks";
import type { ProfessorDetailDto } from "@/external/dto/professor/professor.dto";
import { fetchProfessorDetail } from "@/external/handler/professors/query.client";

type Snapshot =
  | { status: "success"; data?: ProfessorDetailDto }
  | { status: "error" };

export function useProfessorDetail(id: string, period?: string) {
  const snapshot = useLiveQuery<Snapshot>(async () => {
    try {
      return { status: "success", data: await fetchProfessorDetail(id, period) };
    } catch (error) {
      console.error("Failed loading professor detail", error);
      return { status: "error" };
    }
  }, [id, period]);

  return {
    detail: snapshot?.status === "success" ? snapshot.data : undefined,
    errorMessage: snapshot?.status === "error" ? "No se pudo cargar el profesor." : undefined,
    loading: snapshot === undefined,
  };
}

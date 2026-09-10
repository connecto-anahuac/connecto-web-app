"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { fetchProfessorCollection } from "@/external/handler/professors/query.client";
import type { ProfessorCollectionItem } from "../../../types/professor";

type Snapshot =
  | { status: "success"; data: ProfessorCollectionItem[] }
  | { status: "error" };

export function useProfessorCollection(period?: string) {
  const snapshot = useLiveQuery<Snapshot>(async () => {
    try {
      return { status: "success", data: await fetchProfessorCollection(period) };
    } catch (error) {
      console.error("Failed loading professor collection", error);
      return { status: "error" };
    }
  }, [period]);

  return {
    data: snapshot?.status === "success" ? snapshot.data : [],
    errorMessage: snapshot?.status === "error" ? "No se pudo cargar la colección de profesores." : undefined,
    loading: snapshot === undefined,
  };
}

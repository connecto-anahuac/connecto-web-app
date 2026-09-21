"use client";

import { useEffect, useRef, useState } from "react";
import type { OfferingCourseDto } from "@/external/dto/offering-course/offering-course.dto";
import { fetchOfferingCoursesByCareer } from "@/external/handler/offering-course/query.client";
import type { ScheduleBuilderOfferingCourse } from "./scheduleBuilderOfferingCourse";

type OfferingCoursesState = {
  error: string | null;
  loading: boolean;
  offeringCourses: ScheduleBuilderOfferingCourse[];
};

type StoredOfferingCoursesState = OfferingCoursesState & {
  career: string;
};

type OfferingCoursesFetcher = (
  career: string,
) => Promise<OfferingCourseDto[]>;

const INITIAL_STATE: OfferingCoursesState = {
  error: null,
  loading: true,
  offeringCourses: [],
};

const toLocalOfferingCourse = (
  item: OfferingCourseDto,
): ScheduleBuilderOfferingCourse => ({
  key: item.key,
  keyCode: item.keyCode,
  keyNumber: item.keyNumber,
  hours: item.hours,
  credits: item.credits,
  block: item.block,
  name: item.name,
  semester: item.semester,
  position: item.position,
  preRequisites: [...item.preRequisites],
  estimatedNumber: item.estimatedNumber,
});

/** Coordinates requests so only the most recently started career load wins. */
export function createOfferingCoursesLoader(
  fetcher: OfferingCoursesFetcher = fetchOfferingCoursesByCareer,
) {
  let latestRequestId = 0;

  return {
    async load(career: string): Promise<OfferingCoursesState | null> {
      const requestId = ++latestRequestId;
      try {
        const items = await fetcher(career);
        if (requestId !== latestRequestId) return null;
        return {
          error: null,
          loading: false,
          offeringCourses: items.map(toLocalOfferingCourse),
        };
      } catch (cause) {
        if (requestId !== latestRequestId) return null;
        console.error("Failed loading offering courses", cause);
        return {
          error: "Failed loading offering courses",
          loading: false,
          offeringCourses: [],
        };
      }
    },
  };
}

/** Loads only the lightweight offering-course list for the active career. */
export function useOfferingCourses(career: string): OfferingCoursesState {
  const [state, setState] = useState<StoredOfferingCoursesState>(() => ({
    ...INITIAL_STATE,
    career,
  }));
  const loaderRef = useRef<ReturnType<typeof createOfferingCoursesLoader> | null>(
    null,
  );
  loaderRef.current ??= createOfferingCoursesLoader();

  useEffect(() => {
    let mounted = true;

    void loaderRef.current?.load(career).then((nextState) => {
      if (!mounted || !nextState) return;
      setState({ career, ...nextState });
    });

    return () => {
      mounted = false;
    };
  }, [career]);

  if (state.career !== career) return INITIAL_STATE;
  return state;
}

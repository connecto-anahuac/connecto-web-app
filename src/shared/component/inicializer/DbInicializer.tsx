"use client";

import { useEffect, useState } from "react";
import { initializeUniversityDataClient } from "@/external/handler/data/initialize.client";

export default function DbInicializer() {
  const [status, setStatus] = useState<string>("idle");

  useEffect(() => {
    let mounted = true;

    async function seed() {
      try {
        if (mounted) setStatus("checking");

        await initializeUniversityDataClient();
        if (mounted) setStatus("done");
      } catch (error) {
        // keep simple error handling for dev initializer
        console.error("=====DB initializer error:", error);
        if (mounted) setStatus("error");
      }
    }

    seed();

    return () => {
      mounted = false;
    };
  }, []);

  // Hidden UI element that lets devs know seeding status in the DOM.
  return <div style={{ display: "none" }} data-db-seed-status={status} />;
}

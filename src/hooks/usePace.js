// import queryClient from "../lib/queryClient"; // don't need unless mutations added
import { useQuery } from "@tanstack/react-query";
import { usePocket } from "./usePocket";

const API_URL = import.meta.env.VITE_API_URL;

async function getPace({
  solvesPerHourGoal,
  startTime,
  endTime,
  utcOffset,
  workdays,
}) {
  const workdaysParam = workdays.join(",");
  const url = new URL(API_URL);

  url.searchParams.append("solvesPerHourGoal", solvesPerHourGoal);
  url.searchParams.append("startTime", startTime);
  url.searchParams.append("endTime", endTime);
  url.searchParams.append("workdays", workdaysParam);
  url.searchParams.append("utcOffset", utcOffset);

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`API error at ${url}`);
  }

  return await res.json();
}

// Query Custom Hook
export function usePace() {
  const { user } = usePocket();

  return useQuery({
    queryKey: ["paceCalc"],
    queryFn: () => getPace(user),
    enabled: !!user,
    refetchInterval: 60000,
  });
}

// Mutations are handled by PocketContext

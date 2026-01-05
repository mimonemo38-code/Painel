import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useRevenue() {
  return useQuery({
    queryKey: [api.dashboard.revenue.path],
    queryFn: async () => {
      const res = await fetch(api.dashboard.revenue.path);
      if (!res.ok) throw new Error("Failed to fetch revenue data");
      return api.dashboard.revenue.responses[200].parse(await res.json());
    },
  });
}

export function useStats() {
  return useQuery({
    queryKey: [api.dashboard.stats.path],
    queryFn: async () => {
      const res = await fetch(api.dashboard.stats.path);
      if (!res.ok) throw new Error("Failed to fetch stats data");
      return api.dashboard.stats.responses[200].parse(await res.json());
    },
  });
}

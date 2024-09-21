import kyInstance from "@/lib/ky";
import { FollowerInfo } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

export default function useFollowerListInfo() {
  const query = useQuery({
    queryKey: ["follower-info", "following"],
    queryFn: () => kyInstance.get(`/api/followers`).json<FollowerInfo>(),
    staleTime: Infinity,
  });

  return query;
}

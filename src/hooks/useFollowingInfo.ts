import kyInstance from "@/lib/ky";
import { FollowerInfo, FollowingInfo } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

export default function useFollowingInfo() {
  const query = useQuery({
    queryKey: ["follower-info", "following"],
    queryFn: () => kyInstance.get(`/api/following`).json<FollowingInfo>(),
    staleTime: Infinity,
  });

  return query;
}

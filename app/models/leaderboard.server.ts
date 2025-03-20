// ~/models/leaderboard.server.ts
import config from "~/config";
import { constructURL } from "~/utils";

export interface Leaderboard {
  id:number;
  total: number;
  diff_seconds: number;
  customer: {
    name: string;
    picture: string;
  };
  point:number;
}

export async function getLeaderboardData(): Promise<Leaderboard[]> {
  const endpointURL = constructURL(
    config.api.baseUrl, "/mymap/leaderboardAdmin");

  const response = await fetch(endpointURL.toString(), {
    method: "GET",
  });

  const leaderboardData = await response.json();
  return leaderboardData as Leaderboard[];
}

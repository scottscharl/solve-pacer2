// import queryClient from "../lib/queryClient"; // don't need unless mutations added
import { useMutation } from "@tanstack/react-query";
import { usePocket } from "./usePocket";

// Mutation Custom Hook
export function useUpdatePB() {
  const { user, pb } = usePocket();

  return useMutation({
    mutationKey: ["updatePB"],
    mutationFn: async (data) => {
      const record = await pb.collection("users").update(user.id, data);
    },
    enabled: !!user,
  });
}

//  const data = {
//   password,
//   passwordConfirm,
//   oldPassword,
//   email,
//   emailVisibility,
//   verified,
//   name,
//   workdays,
//   startTime,
//   endTime,
//   utcOffset,
//   solvesPerHourGoal,
//   currentWeeklyPaceGoal,
// };

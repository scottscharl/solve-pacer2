import { usePocket, usePace } from "@/hooks";
import Button from "@components/Button";

export default function Dashboard() {
  const { user, logout } = usePocket();
  const { data } = usePace();
  return (
    <>
      <div className="bg-gray-800 h-fit w-fit rounded text-white py-1 px-3 mb-2 absolute top-4 right-4">
        {data && (
          <div
            className="flex flex-row-reverse text-6xl font-bold"
            id="solves-count"
          >
            {data.paceResults.weeklyPace}
          </div>
        )}
        <div className="flex flex-row-reverse text-md font-medium">
          <div className="flex flex-col space-y-2">
            <div>solves pace</div>
          </div>
        </div>
        {data && (
          <div className="flex flex-row-reverse text-sm text-gray-300 mt-2">
            <div id="weekly-goal">
              weekly goal: {data.paceResults.weeklySolveGoal}
            </div>
          </div>
        )}
      </div>
      {/* <pre className="p-3 bg-gray-800 text-white rounded text-xs">
        {JSON.stringify(user, null, 2)}
      </pre> */}
    </>
  );
}

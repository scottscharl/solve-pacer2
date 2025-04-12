import { usePocket, usePace } from "@/hooks";
import Button from "@components/Button";
import { useState, useEffect } from "react";

export default function Dashboard() {
  // const { user, logout } = usePocket();
  const { data } = usePace();
  const [minutesRemaining, setMinutesRemaining] = useState(0);

  // Update the countdown timer every minute
  useEffect(() => {
    if (!data) return;

    const updateRemainingTime = () => {
      if (!data.paceResults.isWorkingDay) return;

      // Calculate remaining time based on end time from data
      const endTime = data.inputParams.endTime; // End time (e.g., 18 for 6:00 PM)
      const currentTime = data.paceResults.currentTime; // Current time as decimal (e.g., 16.15 for 4:09 PM)

      // Calculate remaining hours, convert to minutes
      const remainingHours = Math.max(0, endTime - currentTime);
      const remainingMinutes = Math.round(remainingHours * 60);

      setMinutesRemaining(remainingMinutes);
    };

    // Initial calculation
    updateRemainingTime();

    // Update every minute
    const interval = setInterval(updateRemainingTime, 60000);

    return () => clearInterval(interval);
  }, [data]);

  // Format minutes into hours and minutes (hr:min)
  const formatTimeRemaining = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}:${minutes.toString().padStart(2, "0")}`;
  };

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

        {/* Shift ending timer - only shown on working days */}
        {data && data.paceResults.isWorkingDay && minutesRemaining > 0 && (
          <div className="flex flex-row-reverse text-xs text-gray-400 mt-3 uppercase tracking-wider">
            <div>SHIFT ENDING IN {formatTimeRemaining(minutesRemaining)}</div>
          </div>
        )}
      </div>
      {/* <pre className="p-3 bg-gray-800 text-white rounded text-xs">
        {JSON.stringify(user, null, 2)}
      </pre> */}
    </>
  );
}

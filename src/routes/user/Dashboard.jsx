import { usePocket, usePace } from "@/hooks";
import Button from "@components/Button";
import { useState, useEffect } from "react";
import { ChevronDown, Ticket, Trophy, Clock } from "lucide-react";

export default function Dashboard() {
  const { user } = usePocket();
  const { data } = usePace();
  const [minutesRemaining, setMinutesRemaining] = useState(0);
  const [isMetricsOpen, setIsMetricsOpen] = useState(false);
  const [targetWeekday, setTargetWeekday] = useState("FRI");

  // Update Document title when pace changes
  useEffect(() => {
    if (data) {
      document.title = `${data.paceResults.weeklyPace}`;
    }
  }, [data]);

  // Set target weekday based on user workdays
  useEffect(() => {
    if (
      user &&
      user.workdays &&
      Array.isArray(user.workdays) &&
      user.workdays.length > 0
    ) {
      // Map for converting day numbers to abbreviations
      const dayMap = {
        1: "MON",
        2: "TUE",
        3: "WED",
        4: "THU",
        5: "FRI",
        6: "SAT",
        0: "SUN",
      };

      // Get the last day from the workdays array
      const lastWorkdayNum = Math.max(...user.workdays);

      // Set the target weekday using the day mapping
      setTargetWeekday(dayMap[lastWorkdayNum] || "FRI");
    }
  }, [user]);

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

  // Toggle metrics panel visibility
  const toggleMetrics = () => {
    setIsMetricsOpen(!isMetricsOpen);
  };

  return (
    <>
      <div className="bg-gray-800 h-fit w-fit rounded text-white py-3 px-4 mb-2 absolute top-4 right-4">
        {/* Move the large number to the top with no margin */}
        {data && (
          <div
            className="flex justify-end text-6xl font-bold leading-none mb-1"
            id="solves-count"
          >
            {data.paceResults.weeklyPace}
          </div>
        )}

        <div className="flex justify-end text-md font-medium">
          <div className="flex flex-row gap-2 items-center">
            <button
              onClick={toggleMetrics}
              className="bg-gray-700 hover:bg-gray-600 rounded-full p-1 w-fit transition-colors"
              aria-label={isMetricsOpen ? "Hide details" : "Show details"}
            >
              <ChevronDown
                size={16}
                className={`transition-transform duration-300 ${
                  isMetricsOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div>solves pace</div>
          </div>
        </div>

        {/* Collapsible metrics panel */}
        {isMetricsOpen && data && (
          <div className="mt-3 border-t border-gray-700 pt-3 space-y-3">
            {/* Weekly goal with ticket icon */}
            <div className="flex justify-end items-center text-xs text-gray-400 uppercase tracking-wider">
              <div className="flex items-center">
                <span className="mr-2">
                  <Ticket size={14} />
                </span>
                <span>WEEKLY {data.paceResults.weeklySolveGoal}</span>
              </div>
            </div>
            {/* Daily goal with ticket icon */}
            <div className="flex justify-end items-center text-xs text-gray-400 uppercase tracking-wider">
              <div className="flex items-center">
                <span className="mr-2">
                  <Ticket size={14} />
                </span>
                <span>DAILY {data.paceResults.dailySolveGoal}</span>
              </div>
            </div>

            {/* SPH (Solves Per Hour) indicator */}
            {data && (
              <div className="flex justify-end items-center text-xs text-gray-400 uppercase tracking-wider">
                <div className="flex items-center">
                  <span className="mr-2">
                    <Trophy size={14} />
                  </span>
                  <span>{user.solvesPerHourGoal} SPH</span>
                </div>
              </div>
            )}

            {/* Shift ending timer with clock icon - only shown on working days */}
            {data.paceResults.isWorkingDay && minutesRemaining > 0 && (
              <div className="flex justify-end items-center text-xs text-gray-400 uppercase tracking-wider">
                <div className="flex items-center">
                  <span className="mr-2">
                    <Clock size={14} />
                  </span>
                  <span> {formatTimeRemaining(minutesRemaining)}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

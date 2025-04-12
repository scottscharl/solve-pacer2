import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@components/Button";
import { usePocket, useUpdatePB } from "@/hooks";

export default function Settings() {
  const { user, pb, logout } = usePocket();
  const mutation = useUpdatePB();
  let navigate = useNavigate();

  // Day names array for mapping
  const dayNames = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  // Full day names for display
  const weekdayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // Initialize with fallback defaults
  const [startTime, setStartTime] = useState(9); // Default to 9 AM
  const [endTime, setEndTime] = useState(17); // Default to 5 PM
  const [solvesPerHourGoal, setSolvesPerHourGoal] = useState(1); // Default to 1
  const [utcOffset, setUtcOffset] = useState(0); // Default to UTC+0
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDataChanged, setIsDataChanged] = useState(false);

  // Initialize workdays as an object
  const [workdays, setWorkdays] = useState({
    sunday: false,
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: false,
  });

  // Track original values for comparison
  const [originalValues, setOriginalValues] = useState({
    startTime: 9,
    endTime: 17,
    solvesPerHourGoal: 1,
    utcOffset: 0,
    workdays: {
      sunday: false,
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
    },
  });

  // Update state from user object when it's available
  useEffect(() => {
    if (user) {
      const userStartTime =
        user.startTime !== undefined && user.startTime !== null
          ? user.startTime
          : 9;

      const userEndTime =
        user.endTime !== undefined && user.endTime !== null ? user.endTime : 17;

      const userSolvesPerHourGoal =
        user.solvesPerHourGoal !== undefined && user.solvesPerHourGoal !== null
          ? parseFloat(user.solvesPerHourGoal)
          : 1;

      const userUtcOffset =
        user.utcOffset !== undefined && user.utcOffset !== null
          ? parseInt(user.utcOffset)
          : 0;

      setStartTime(userStartTime);
      setEndTime(userEndTime);
      setSolvesPerHourGoal(userSolvesPerHourGoal);
      setUtcOffset(userUtcOffset);

      // Setup workdays from user data
      const newWorkdays = {
        sunday: false,
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
      };

      // Set days from the user.workdays array to true
      if (user.workdays !== undefined && Array.isArray(user.workdays)) {
        user.workdays.forEach((dayIndex) => {
          // Make sure the index is valid
          if (dayIndex >= 0 && dayIndex < 7) {
            const dayName = dayNames[dayIndex];
            newWorkdays[dayName] = true;
          }
        });
      } else {
        // Default workdays if not provided (Mon-Fri)
        newWorkdays.monday = true;
        newWorkdays.tuesday = true;
        newWorkdays.wednesday = true;
        newWorkdays.thursday = true;
        newWorkdays.friday = true;
      }

      setWorkdays(newWorkdays);

      // Store original values for comparison
      setOriginalValues({
        startTime: userStartTime,
        endTime: userEndTime,
        solvesPerHourGoal: userSolvesPerHourGoal,
        utcOffset: userUtcOffset,
        workdays: { ...newWorkdays },
      });

      // Reset changed flag
      setIsDataChanged(false);
    }
  }, [user]);

  // Check if data has changed after any state update
  useEffect(() => {
    if (!user) return;

    const hasTimeChanged =
      originalValues.startTime !== startTime ||
      originalValues.endTime !== endTime;

    const hasSolvesChanged =
      originalValues.solvesPerHourGoal !== solvesPerHourGoal;

    const hasOffsetChanged = originalValues.utcOffset !== utcOffset;

    // Check if any workday has changed
    let hasWorkdaysChanged = false;
    for (const day of dayNames) {
      if (originalValues.workdays[day] !== workdays[day]) {
        hasWorkdaysChanged = true;
        break;
      }
    }

    const hasChanged =
      hasTimeChanged ||
      hasSolvesChanged ||
      hasOffsetChanged ||
      hasWorkdaysChanged;
    setIsDataChanged(hasChanged);
  }, [
    startTime,
    endTime,
    solvesPerHourGoal,
    utcOffset,
    workdays,
    originalValues,
    user,
    dayNames,
  ]);

  // Handle workday toggle
  function handleWorkdayToggle(day) {
    setWorkdays((prev) => ({
      ...prev,
      [day]: !prev[day],
    }));
  }

  // Helper function to convert decimal hours to HH:MM format for input
  const hoursToTimeString = (hours) => {
    // Handle undefined, null or NaN
    if (hours === undefined || hours === null || isNaN(hours)) {
      return "09:00"; // Default to 9 AM
    }

    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return `${wholeHours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  };

  // Helper function to convert HH:MM format from input to decimal hours
  const timeStringToHours = (timeString) => {
    try {
      const [hours, minutes] = timeString.split(":").map(Number);
      return hours + minutes / 60;
    } catch (e) {
      console.error("Error parsing time string:", timeString, e);
      return 9; // Default to 9 AM
    }
  };

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);

    // Convert workdays object to array of indices
    const workdaysSubmit = Object.entries(workdays)
      .map(([day, isSelected], index) => ({ day, index, isSelected }))
      .filter(({ isSelected }) => isSelected)
      .map(({ index }) => index);

    try {
      const inputParams = {
        startTime,
        endTime,
        solvesPerHourGoal,
        utcOffset,
        workdays: workdaysSubmit, // Array of selected day indices [0,1,4,5] etc.
      };

      // Check if mutation exists before using it
      if (mutation && mutation.mutateAsync) {
        await mutation.mutateAsync({
          id: user?.id,
          ...inputParams,
        });

        // Update original values after successful save
        setOriginalValues({
          startTime,
          endTime,
          solvesPerHourGoal,
          utcOffset,
          workdays: { ...workdays },
        });

        setIsDataChanged(false);
      } else {
        // Fallback if mutation isn't available
        console.log("Mutation not available, settings would be saved here");
      }
    } catch (error) {
      console.error("Settings save error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className="w-full max-w-md p-6 mx-auto">
        <h1 className="mb-6 text-2xl font-bold">Settings</h1>
        {!user && (
          <div className="p-4 bg-gray-700 rounded text-center">
            Loading user data...
          </div>
        )}
        {user && (
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <div className="flex flex-col space-y-2">
              <label htmlFor="startTime" className="text-sm font-medium">
                Start Time
              </label>
              <input
                id="startTime"
                className="p-2 bg-gray-700 border border-gray-600 rounded outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                type="time"
                name="startTime"
                value={hoursToTimeString(startTime)}
                onChange={(event) =>
                  setStartTime(timeStringToHours(event.target.value))
                }
                required
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="endTime" className="text-sm font-medium">
                End Time
              </label>
              <input
                id="endTime"
                className="p-2 bg-gray-700 border border-gray-600 rounded outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                type="time"
                name="endTime"
                value={hoursToTimeString(endTime)}
                onChange={(event) =>
                  setEndTime(timeStringToHours(event.target.value))
                }
                required
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label
                htmlFor="solvesPerHourGoal"
                className="text-sm font-medium"
              >
                Solves Per Hour Goal
              </label>
              <input
                id="solvesPerHourGoal"
                className="p-2 bg-gray-700 border border-gray-600 rounded outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                type="number"
                name="solvesPerHourGoal"
                min="0"
                step="0.1"
                value={solvesPerHourGoal}
                onChange={(event) =>
                  setSolvesPerHourGoal(parseFloat(event.target.value))
                }
                required
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="utcOffset" className="text-sm font-medium">
                UTC Offset
              </label>
              <select
                id="utcOffset"
                className="p-2 bg-gray-700 border border-gray-600 rounded outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                name="utcOffset"
                value={utcOffset}
                onChange={(event) => setUtcOffset(parseInt(event.target.value))}
                required
              >
                {Array.from({ length: 25 }, (_, i) => i - 12).map((offset) => (
                  <option key={offset} value={offset}>
                    {offset >= 0 ? `+${offset}` : offset}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium">Workdays</label>

              <div className="grid grid-cols-7 gap-2">
                {dayNames.map((day, index) => (
                  <div key={day} className="relative">
                    {/* Hidden checkbox input */}
                    <input
                      type="checkbox"
                      id={`day-${day}`}
                      checked={workdays[day]}
                      onChange={() => handleWorkdayToggle(day)}
                      className="sr-only" // Visually hidden but accessible
                    />

                    {/* Clickable div styled as a button */}
                    <label
                      htmlFor={`day-${day}`}
                      className={`
                      block py-2 px-1 rounded cursor-pointer
                      transition-all duration-200 text-center
                      ${
                        workdays[day]
                          ? "bg-gray-200 text-gray-800"
                          : "bg-gray-600 hover:bg-gray-500 text-gray-300"
                      }
                    `}
                    >
                      <div className="font-medium text-sm">
                        {weekdayNames[index].slice(0, 3)}
                      </div>
                    </label>
                  </div>
                ))}
              </div>

              {/* <div className="text-sm text-gray-400 mt-1">
              Selected:{" "}
              {dayNames
                .filter((day) => workdays[day])
                .map((day) => weekdayNames[dayNames.indexOf(day)].slice(0, 3))
                .join(", ")}
            </div> */}
            </div>

            <div className="flex flex-col mt-6 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 gap-2">
              <Button
                type="button"
                variant="secondary"
                className="w-full px-4 py-2 font-medium transition-colors bg-gray-600 rounded sm:w-auto hover:bg-gray-500"
                onClick={() => navigate("/user")}
              >
                Back
              </Button>
              <Button
                type="submit"
                variant="primary"
                className={`w-full px-4 py-2 font-medium transition-colors rounded sm:w-auto ${
                  isDataChanged
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-green-600/50 cursor-not-allowed"
                }`}
                disabled={isSubmitting || !isDataChanged}
              >
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}

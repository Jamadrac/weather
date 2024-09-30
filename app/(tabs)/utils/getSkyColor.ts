export const getSkyColor = () => {
  const hour = new Date().getHours();
  if (hour < 6) return "#2c3e50"; // Early morning
  if (hour < 12) return "#87CEEB"; // Morning (sky blue)
  if (hour < 18) return "#FFD700"; // Afternoon (golden)
  if (hour < 20) return "#FFA07A"; // Evening (sunset)
  return "#2c3e50"; // Night
};

export const getSkyColor = (description: any) => {
  const hour = new Date().getHours();
  if (hour < 6) return "#2c3e50";
  if (hour < 12) return "#87CEEB";
  if (hour < 18) return "#FFD700";
  if (hour < 20) return "#FFA07A";
  return "#2c3e50";
};

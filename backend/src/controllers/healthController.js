export const getHealthStatus = (req, res) => {
  res.json({
    success: true,
    message: "MediLens AI backend is healthy",
    timestamp: new Date().toISOString()
  });
};

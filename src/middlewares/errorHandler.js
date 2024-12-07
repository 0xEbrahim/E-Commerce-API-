export const developmentError = (err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
  });
};

export const productionError = (err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    status: err.status,
    message: err.message,
  });
};

export const unhandledRoutes = (req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: "Route not found",
  });
};

export const errorHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV === "development")
    developmentError(err, req, res, next);
  else {
    productionError(err, req, res, next);
  }
};

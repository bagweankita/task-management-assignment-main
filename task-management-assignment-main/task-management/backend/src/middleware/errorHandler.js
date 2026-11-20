export function notFound(req, res, next) {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
}

export function errorHandler(err, req, res, next) {
  console.error(err);
  if (err.name === 'ValidationError') {
    return res.status(400).json({ success: false, message: 'Validation failed', errors: Object.values(err.errors).map(e => e.message) });
  }
  if (err.name === 'CastError' || err.code === 11000) {
    const message = err.code === 11000 ? 'A record with this value already exists' : 'Invalid resource ID';
    return res.status(400).json({ success: false, message });
  }
  res.status(err.statusCode || 500).json({ success: false, message: err.message || 'Internal server error' });
}

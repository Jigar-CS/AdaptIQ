const app = require('./app');
const { PORT } = require('./config/env');

app.listen(PORT, () => {
  console.log(`\n🚀 AdaptIQ API running on http://localhost:${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health\n`);
});

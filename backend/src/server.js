// Load environment variables BEFORE anything else
// Using dotenv/config as first import ensures env vars are loaded before any other module
import 'dotenv/config';

import app from './app.js';

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════╗
║   CloudCRM API Server                 ║
║   Port: ${String(PORT).padEnd(29)}║
║   Environment: ${(process.env.NODE_ENV || 'development').padEnd(22)}║
╚═══════════════════════════════════════╝
  `);
});

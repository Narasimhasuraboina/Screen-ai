import { createApp } from './app';
import { config } from './config';

const app = createApp();

app.listen(config.port, () => {
  console.log(`[ScreenAI Backend] Server listening on http://localhost:${config.port}`);
  console.log(`[ScreenAI Backend] Provider: ${config.aiProvider} | Model: ${config.aiModel}`);
  console.log(
    `[ScreenAI Backend] Key status: ${config.aiApiKey ? 'Configured' : 'Using intelligent local mock engine'}`
  );
  console.log(`[ScreenAI Backend] Allowed Web Origin: ${config.webOrigin}`);
});


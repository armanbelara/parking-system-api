import { Application } from 'https://deno.land/x/oak@v9.0.0/mod.ts';
import { HOST, PORT } from './src/config/config.ts';
import router from './src/routes/routes.ts';

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());
app.listen({hostname: HOST, port: PORT});

console.log(`Listening to ${HOST}:${PORT}`);
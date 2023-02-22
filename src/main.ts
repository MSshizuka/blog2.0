import 'virtual:windi-base.css';
import 'virtual:windi-components.css';
import '/@/design/index.less';
import 'virtual:windi-utilities.css';
import 'virtual:svg-icons-register';

import App from './App.vue';
import { createApp } from 'vue';
import { initAppConfigStore } from '/@/logics/initAppConfig';
import { router, setupRouter } from '/@/router';
import { setupRouterGuard } from '/@/router/guard';
import { setupStore } from '/@/store';
import { setupGlobDirectives } from '/@/directives';
import { registerGlobComp } from '/@/components/registerGlobComp';

async function bootstrap() {
  const app = createApp(App);

  setupStore(app);

  initAppConfigStore();

  registerGlobComp(app);

  setupRouter(app);

  setupRouterGuard(router);

  setupGlobDirectives(app);

  app.mount('#app');
}

bootstrap();

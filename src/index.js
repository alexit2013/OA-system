import dva from 'dva';
import 'moment/locale/zh-cn';
import 'ant-design-pro/dist/ant-design-pro.css';
import browserHistory from 'history/createBrowserHistory';
import './polyfill';
import './index.less';
import { handlerError } from './utils/errorHandler';

// 1. Initialize
const app = dva({
  history: browserHistory(),
  onError: handlerError,
});

// 2. Plugins
// app.use({});

// 3. Register global model
app.model(require('./models/global'));

// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');

export default app._store;  // eslint-disable-line

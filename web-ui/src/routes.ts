import Home from '@/pages/Home';
import Login from '@/pages/Login';
import NotFound from '@/pages/NotFound';

const routerConfig = [{
  path: '/home',
  component: Home,
}, {
  path: '/login',
  component: Login,
}, {
  component: NotFound,
}];

export default routerConfig;

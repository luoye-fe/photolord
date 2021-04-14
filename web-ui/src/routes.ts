import BasicLayout from '@/layouts/BasicLayout';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import NotFound from '@/pages/NotFound';

const routerConfig = [{
  path: '/home',
  component: BasicLayout,
  children: [{
    path: '/',
    component: Home,
  }],
}, {
  path: '/login',
  component: Login,
}, {
  path: '/',
  redirect: '/home',
}, {
  component: NotFound,
}];

export default routerConfig;

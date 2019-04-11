const routes = [
  {
    path: '/',
    component: () => import('layouts/GuestLayout.vue'),
    children: [
      { path: '', name: 'home', component: () => import('pages/Index.vue') },
      { path: 'login', name: 'login', component: () => import('pages/Login.vue') },
      { path: 'sign-up', name: 'sign-up', component: () => import('pages/SignUp.vue') }
    ]
  },
  {
    path: '/user',
    component: () => import('layouts/UserLayout.vue'),
    children: [
      { path: 'account', name: 'user-account', component: () => import('pages/User/Account.vue'), meta: { requiresAuth: true } },
      { path: 'cats', name: 'user-cats', component: () => import('pages/User/Cats.vue'), meta: { requiresAuth: true } },
      { path: 'cats/add', name: 'user-cats-add', component: () => import('pages/User/CatsAdd.vue'), meta: { requiresAuth: true } },
      { path: 'cats/edit/:id', name: 'user-cats-edit', component: () => import('pages/User/CatsEdit.vue'), meta: { requiresAuth: true } }
    ]
  },
  {
    path: '/admin',
    component: () => import('layouts/AdminLayout.vue'),
    children: [
      { path: 'dashboard', name: 'admin-dashboard', component: () => import('pages/Admin/Dashboard.vue'), meta: { requiresAuth: true } },
      { path: 'account', name: 'admin-account', component: () => import('pages/Admin/Account.vue'), meta: { requiresAuth: true } },
      { path: 'users', name: 'admin-users', component: () => import('pages/Admin/Users.vue'), meta: { requiresAuth: true } }
    ]
  }
]
// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes

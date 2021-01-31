import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import AddProduct from '../views/products/AddProduct.vue'

Vue.use(VueRouter)
const progress = {
  func: [{
      call: 'color',
      modifier: 'temp',
      argument: '#ffb000'
    },
    {
      call: 'fail',
      modifier: 'temp',
      argument: '#6e0000'
    },
    {
      call: 'location',
      modifier: 'temp',
      argument: 'top'
    },
    {
      call: 'transition',
      modifier: 'temp',
      argument: {
        speed: '1.5s',
        opacity: '0.6s',
        termination: 400
      }
    }
  ]
};

const routes = [{
    path: '/',
    name: 'Home',
    component: Home,
    meta: progress
  },
  {
    path: '/login',
    name: 'Bejelentkezés',
    component: () => import('../views/Login.vue'),
    meta: progress
  },
  {
    path: '/register',
    name: 'Regisztráció',
    component: () => import('../views/Register.vue'),
    meta: progress
  },
  {
    path: '/profile',
    name: 'Profil',
    component: () => import('../views/Profile.vue'),
    meta: progress
  },
  {
    path: '/inventory',
    name: 'Készletállapotok',
    component: () => import('../views/inventory/Inventories.vue'),
    meta: progress
  },
  {
    path: '/inventory/new',
    name: 'Új készlet',
    component: () => import('../views/inventory/AddInventory.vue'),
    meta: progress
  },
  {
    path: '/inventory/:id',
    name: 'Készlet szerkesztése',
    component: () => import('../views/inventory/Inventory.vue'),
    meta: progress
  },
  {
    path: '/products',
    name: 'Termékek',
    component: () => import('../views/products/Products.vue'),
    meta: progress
  },
  {
    path: '/products/new',
    name: 'Új termék',
    component: () => import('../views/products/AddProduct.vue'),
    meta: progress
  },
  {
    path: '/products/:id',
    name: 'Termék szerkesztése',
    component: () => import('../views/products/Product.vue'),
    meta: progress
  },
  {
    path: '/projects',
    name: 'Projektek',
    component: () => import('../views/projects/Projects.vue'),
    meta: progress
  },
  {
    path: '/projects/new',
    name: 'Új projekt',
    component: () => import('../views/projects/AddProject.vue'),
    meta: progress
  },
  {
    path: '/projects/:id',
    name: 'Projekt',
    component: () => import('../views/projects/Project.vue'),
    meta: progress
  },
  {
    path: '/projects/:id/edit',
    name: 'Projekt szerkesztése',
    component: () => import('../views/projects/EditProject.vue'),
    meta: progress
  },
  {
    path: '/projects/:id/inventory/new',
    name: 'Új projektkészlet',
    component: () => import('../views/projects/AddProjectInventory.vue'),
    meta: progress
  },
  {
    path: '/projects/:id/inventory/:invId',
    name: 'Projektkészlet szerkesztése',
    component: () => import('../views/projects/EditProjectInventory.vue'),
    meta: progress
  },
  {
    path: '/categories',
    name: 'Kategóriák',
    component: () => import('../views/categories/Categories.vue'),
    meta: progress
  },
  {
    path: '/categories/new',
    name: 'Új kategória',
    component: () => import('../views/categories/AddCategory.vue'),
    meta: progress
  },
  {
    path: '/categories/:id',
    name: 'Kategória szerkesztése',
    component: () => import('../views/categories/Category.vue'),
    meta: progress
  },
  {
    path: '/warehouses',
    name: 'Raktárak',
    component: () => import('../views/warehouses/Warehouses.vue'),
    meta: progress
  },
  {
    path: '/warehouses/new',
    name: 'Új raktár',
    component: () => import('../views/warehouses/AddWarehouse.vue'),
    meta: progress
  },
  {
    path: '/warehouses/:id',
    name: 'Raktár szerkesztése',
    component: () => import('../views/warehouses/Warehouse.vue'),
    meta: progress
  },
  {
    path: '/users',
    name: 'Felhasználók',
    component: () => import('../views/users/Users.vue'),
    meta: progress
  },
  {
    path: '/users/new',
    name: 'Új felhasználó',
    component: () => import('../views/users/AddUser.vue'),
    meta: progress
  },
  {
    path: '/users/:id',
    name: 'Felhasználó szerkesztése',
    component: () => import('../views/users/User.vue'),
    meta: progress
  },
  {
    path: '/movements',
    name: 'Mozgások',
    component: () => import('../views/Movements.vue'),
    meta: progress
  },
  {
    path: '/forbidden',
    name: '403',
    component: () => import('../views/errors/Forbidden.vue'),
    meta: progress
  },
  {
    path: '/*',
    name: '404',
    component: () => import('../views/errors/NotFound.vue'),
    meta: progress
  }
]

const router = new VueRouter({
  linkActiveClass: 'is-active',
  routes,
  mode: 'history'
})

router.beforeEach((to, from, next) => {
  document.title = to.name + " - Warehouse Manager";
  const publicPages = ['/login', '/register', '/'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('user');

  if (authRequired && !loggedIn) {
    next('/login');
  } else {
    next();
  }
});

export default router
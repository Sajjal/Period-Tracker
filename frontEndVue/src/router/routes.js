import readWriteData from '../composables/readWriteData';
let authStatus = false;

const { authorize } = readWriteData()

//Route Guard
const requireAuth = async(to, from, next) => {
    const response = await authorize();
    if (response.status == 200) authStatus = true;
    else authStatus = false;

    if (authStatus) {
        next();
    } else next({ name: "Login" });
};

const requireNoAuth = async(to, from, next) => {
    const response = await authorize();
    if (response.status == 200) authStatus = true;
    else authStatus = false;

    if (authStatus) {
        next({ name: 'Dashboard' });
    } else next();
};

const routes = [{
        path: '/dashboard',
        name: 'Dashboard',
        beforeEnter: requireAuth,
        component: () =>
            import ('layouts/MainLayout.vue')
    },
    {
        path: '/',
        name: 'Login',
        beforeEnter: requireNoAuth,
        component: () =>
            import ('layouts/Login.vue')
    },
]

export default routes
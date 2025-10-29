// import { lazy } from 'react';
// import { Navigate } from 'react-router';
// import MainLayout from "@/layouts/MainLayout";
// import { adminAndAuthRoutes } from "./routes";




// // AI
// const TonAI = lazy(() => import('@/views/ai/ton-ai'));

// // Apps
// const Calendar = lazy(() => import('@/views/apps/calendar'));
// const Directory = lazy(() => import('@/views/apps/directory'));

// // Pages
// const EmptyPage = lazy(() => import('@/views/pages/empty'));
// const Invoice = lazy(() => import('@/views/pages/invoice'));
// const Pricing = lazy(() => import('@/views/pages/pricing'));
// const TermsConditions = lazy(() => import('@/views/pages/terms-conditions'));
// const Timeline = lazy(() => import('@/views/pages/timeline'));

// // Auth

// // const AuthSignUp = lazy(() => import('@/views/auth/sign-up'));
// // const AuthResetPassword = lazy(() => import('@/views/auth/reset-password'));
// // const AuthNewPassword = lazy(() => import('@/views/auth/new-password'));
// // const AuthLockScreen = lazy(() => import('@/views/auth/lock-screen'));
// // const AuthTwoFactor = lazy(() => import('@/views/auth/two-factor'));

// // Error
// const Error404 = lazy(() => import('@/views/error/404'));

// // UI
// const CoreElements = lazy(() => import('@/views/ui/core-elements'));
// const InteractiveFeatures = lazy(() => import('@/views/ui/interactive-features'));
// const MenuLinks = lazy(() => import('@/views/ui/menu-links'));
// const Utilities = lazy(() => import('@/views/ui/utilities'));
// const VisualFeedback = lazy(() => import('@/views/ui/visual-feedback'));

// // Charts
// const Charts = lazy(() => import('@/views/charts'));

// // Forms
// const BasicElements = lazy(() => import('@/views/forms/basic'));
// const TextEditors = lazy(() => import('@/views/forms/editors'));
// const FileUploads = lazy(() => import('@/views/forms/file-uploads'));
// const Plugins = lazy(() => import('@/views/forms/plugins'));
// const Validation = lazy(() => import('@/views/forms/validation'));
// const Wizard = lazy(() => import('@/views/forms/wizard'));

// // Tables
// const StaticTables = lazy(() => import('@/views/tables/static'));
// const AjaxDataTable = lazy(() => import('@/views/tables/data-tables/ajax'));
// const BasicDataTable = lazy(() => import('@/views/tables/data-tables/basic'));
// const CheckboxSelectDataTable = lazy(() => import('@/views/tables/data-tables/checkbox-select'));
// const ChildRowsDataTable = lazy(() => import('@/views/tables/data-tables/child-rows'));
// const ColumnsDataTable = lazy(() => import('@/views/tables/data-tables/columns'));
// const DataRenderingDataTable = lazy(() => import('@/views/tables/data-tables/data-rendering'));
// const ExportDataTable = lazy(() => import('@/views/tables/data-tables/export-data'));
// const JavaScriptSourceDataTable = lazy(() => import('@/views/tables/data-tables/javascript-source'));
// const SelectDataTable = lazy(() => import('@/views/tables/data-tables/select'));

// // Icons
// const Flags = lazy(() => import('@/views/icons/flags'));
// const LucideIcons = lazy(() => import('@/views/icons/lucide'));
// const TablerIcons = lazy(() => import('@/views/icons/tabler'));

// // Maps
// const VectorMap = lazy(() => import('@/views/maps/vector'));
// const LeafletMap = lazy(() => import('@/views/maps/leaflet'));

// const errorRoutes = [{
//   path: '/error/404',
//   element: <Error404 />
// }];

// const appsRoutes = [{
//   path: '/ton-ai',
//   element: <TonAI />
// }, {
//   path: '/calendar',
//   element: <Calendar />
// }, {
//   path: '/directory',
//   element: <Directory />
// }];
// const pagesRoutes = [{
//   path: '/pages/empty',
//   element: <EmptyPage />
// }, {
//   path: '/pages/invoice',
//   element: <Invoice />
// }, {
//   path: '/pages/pricing',
//   element: <Pricing />
// }, {
//   path: '/pages/terms-conditions',
//   element: <TermsConditions />
// }, {
//   path: '/pages/timeline',
//   element: <Timeline />
// }];
// const uiRoutes = [{
//   path: '/ui/core-elements',
//   element: <CoreElements />
// }, {
//   path: '/ui/interactive-features',
//   element: <InteractiveFeatures />
// }, {
//   path: '/ui/menu-links',
//   element: <MenuLinks />
// }, {
//   path: '/ui/utilities',
//   element: <Utilities />
// }, {
//   path: '/ui/visual-feedback',
//   element: <VisualFeedback />
// }];
// const graphRoutes = [{
//   path: '/charts',
//   element: <Charts />
// }];
// const formRoutes = [{
//   path: '/forms/basic',
//   element: <BasicElements />
// }, {
//   path: '/forms/editors',
//   element: <TextEditors />
// }, {
//   path: '/forms/file-uploads',
//   element: <FileUploads />
// }, {
//   path: '/forms/plugins',
//   element: <Plugins />
// }, {
//   path: '/forms/validation',
//   element: <Validation />
// }, {
//   path: '/forms/wizard',
//   element: <Wizard />
// }];
// const tableRoutes = [{
//   path: '/tables/static',
//   element: <StaticTables />
// }, {
//   path: '/tables/data-tables/basic',
//   element: <BasicDataTable />
// }, {
//   path: '/tables/data-tables/export-data',
//   element: <ExportDataTable />
// }, {
//   path: '/tables/data-tables/select',
//   element: <SelectDataTable />
// }, {
//   path: '/tables/data-tables/ajax',
//   element: <AjaxDataTable />
// }, {
//   path: '/tables/data-tables/javascript-source',
//   element: <JavaScriptSourceDataTable />
// }, {
//   path: '/tables/data-tables/data-rendering',
//   element: <DataRenderingDataTable />
// }, {
//   path: '/tables/data-tables/columns',
//   element: <ColumnsDataTable />
// }, {
//   path: '/tables/data-tables/child-rows',
//   element: <ChildRowsDataTable />
// }, {
//   path: '/tables/data-tables/checkbox-select',
//   element: <CheckboxSelectDataTable />
// }];
// const iconRoutes = [{
//   path: '/icons/flags',
//   element: <Flags />
// }, {
//   path: '/icons/lucide',
//   element: <LucideIcons />
// }, {
//   path: '/icons/tabler',
//   element: <TablerIcons />
// }];
// const mapRoutes = [{
//   path: '/maps/vector',
//   element: <VectorMap />
// }, {
//   path: '/maps/leaflet',
//   element: <LeafletMap />
// }];
// const allRoutes = [{
//   element: <MainLayout />,
//   children: [{
//     path: '/',
//     element: <Navigate to="/dashboard" replace />
//   }, ...appsRoutes, ...pagesRoutes, ...uiRoutes, ...graphRoutes, ...formRoutes, ...tableRoutes, ...iconRoutes, ...mapRoutes]
// }];


// const otherRoutes = [ ...errorRoutes];
// export const routes = [...allRoutes, ...otherRoutes,...adminAndAuthRoutes];
import { lazy } from 'react';
import { Navigate } from 'react-router';
import MainLayout from "@/layouts/MainLayout";
import ProtectedRoute from "@/components/ProtectedRoute";


const Dashboard = lazy(() => import('@/views/dashboard'));
const AuthLogIn = lazy(() => import('@/views/auth/login'));
const Error404 = lazy(() => import('@/views/error/404'));
const Category = lazy(() => import('@/views/category')); // single category component
const SubCategory = lazy(() => import('@/views/subcategory')); // single category component
const AddCategory = lazy(() => import('@/views/category/components/AddCategory'));
const EditCategory = lazy(() => import('@/views/category/components/EditCategory'));
const AddSubCategory = lazy(() => import('@/views/subcategory/components/AddSubCategory'));
const EditSubCategory = lazy(() => import('@/views/subcategory/components/EditSubCategory'));
const Jobs = lazy(() => import('@/views/jobs')); 
const EditJob = lazy(() => import('@/views/jobs/components/EditJob'));
const AddJob = lazy(() => import('@/views/jobs/components/AddJob'));
const ViewJob = lazy(() => import('@/views/jobs/components/ViewJob'));
const AdmitCard = lazy(() => import('@/views/admit'));
const AddAdmitCard = lazy(() => import('@/views/admit/components/AddAdmitCard'));





// login
const authRoutes = [
  {
    path: '/admin/login',
    element: <AuthLogIn />,
  },
];

// error
const errorRoutes = [
  {
    path: '/admin/error/404',
    element: <Error404 />,
  },
];

// dashboard
const dashboardRoutes = [
  {
    path: '/admin/dashboard',
    element: <Dashboard />,
  },
];

// category (single route handles both category + sub-category view logic)
const categoryRoutes = [
  {
    path: '/admin/category',
    element: <Category />,
  },
  {

    path:'/admin/category/add',
    element:<AddCategory/>
  },
  { 
    path: '/admin/category/edit/:id',
     element: <EditCategory />
   }, 
  {
    path: '/admin/sub-category',
    element: <SubCategory />, // reuse Category component
  },
  {
    path:'admin/sub-category/add',
    element:<AddSubCategory/>
  },{
    path:'admin/sub-category/edit/:id',
    element:<EditSubCategory/>
  },
];

//job routes
const jobRoutes=[{
   path: '/admin/jobs',
    element: <Jobs/>,
},{
   path: '/admin/jobs/add',
    element: <AddJob/>,
},
{
   path: '/admin/jobs/edit/:id',
    element: <EditJob/>,
},
{
  path:'/admin/jobs/view/:id',
  element:<ViewJob/>
}
];

const admitRoutes=[{  
  path:'/admin/admit-card',
  element:<AdmitCard/>
},{
  path:'/admin/admit-card/add',
  element:<AddAdmitCard/>
}]; 

// admin routes wrapped in main layout + protected route
const adminRoutes = [
  {
    element: (
      <ProtectedRoute role="admin">
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/',
        element: <Navigate to="/admin/dashboard" replace />,
      },
      ...dashboardRoutes,
      ...categoryRoutes,
      ...jobRoutes,
      ...admitRoutes,
    ],
  },
];

const otherRoutes = [...authRoutes, ...errorRoutes];
export const routes = [...adminRoutes, ...otherRoutes];

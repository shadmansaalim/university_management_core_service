// Imports
import express from 'express';
import { IModuleRoute } from './route.interface';

// Express router
const router = express.Router();

// App Module Routes
const moduleRoutes = [
  // ... routes
  {
    path: '',
    routes: '',
  },
];

// Application Routes
moduleRoutes.forEach((moduleRoute: IModuleRoute) => {
  router.use(moduleRoute?.path, moduleRoute?.route);
});

export default router;

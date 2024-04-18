import { createBrowserRouter } from "react-router-dom";

import Index from '../pages/index';
import ErrorPage from '../pages/ErrorPage';


export const router = createBrowserRouter([
    {
      element: <Index />,
      index: true,
      errorElement: <ErrorPage />
    },
]);
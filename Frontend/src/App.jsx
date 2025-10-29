import { useRoutes } from 'react-router';
import { routes } from '@/routes';
import { routes as mainRoutes } from "@/routes";
const App = () => {
  return useRoutes(routes, mainRoutes);
};
export default App;
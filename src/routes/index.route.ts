import { Router } from "express";
import user from "./user.route";
const router = Router();

interface IRoutes{
    path: string;
    route: Router;
}

const ProductionRoutes: IRoutes[] = [
    {
        path: "/user",
        route: user
    }
];

ProductionRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

export default router;
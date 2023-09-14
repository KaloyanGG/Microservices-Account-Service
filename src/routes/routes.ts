import { Express, Request, Response } from "express";
import { getAllAccounts } from "../controller/accounts.controller";
// import { addOrganization, deleteOrganizationById, getAllOrganizations, getOrganizationById } from "../controller/organization.controller";

export default function registerRoutes(app: Express) {

    app.get('/', async (req: Request, res: Response) => {
        res.send('OK');
    });

    app.get('/health', (req: Request, res: Response) => {
        res.send('Account service is healthy!');
        console.log(' 👨‍⚕️ Health Checked!');
    });

    app.get('/accounts', getAllAccounts);





}
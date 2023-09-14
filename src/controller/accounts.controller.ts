import { Request, Response } from "express";
import db_conn from "../database/connection";


export async function getAllAccounts(req: Request, res: Response) {

    const [rows] = await db_conn.getConnection().promise()
        .query('SELECT o.registration_id, o.name, a.balance FROM organization o LEFT JOIN `account` a ON o.registration_id = a.organization_id');

    res.send(rows);

}
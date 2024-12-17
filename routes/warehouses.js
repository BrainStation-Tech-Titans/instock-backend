import express from "express";
const router = express.Router();
import initKnex from "knex";
import knexfile from "../knexfile.js";

const knex = initKnex(knexfile);

router.get("/", async (_req, res) =>{
    try{
        const warehouses = await knex('warehouses');
        res.status(200).json(warehouses);
    }
    catch(error){
        console.error(error);
        res.status(500).json({message: `${error}`});
    }
});

export default router;
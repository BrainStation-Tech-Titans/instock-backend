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

router.delete("/:id", async (req, res) =>{
    try{
        const doesExist = await knex('warehouses').where('id', req.params.id).first();
        if(!doesExist){
            res.status(404).send();
        }
        await knex('warehouses')
            .where('id', req.params.id)
            .del();
        res.status(204).send();
    }
    catch(error)
    {
        console.error(error);
        res.status(500).send();

    }
});
export default router;
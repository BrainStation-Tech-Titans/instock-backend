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

router.get("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const warehouse = await knex("warehouses").where({ id }).first();

        if (!warehouse) {
            return res.status(404).json({ message: `Warehouse with ID ${id} not found.` });
        }

        res.status(200).json(warehouse);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while fetching the warehouse." });
    }
});


export default router;
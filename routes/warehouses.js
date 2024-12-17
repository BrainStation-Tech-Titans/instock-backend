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
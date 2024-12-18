import express from "express";
const router = express.Router();
import initKnex from "knex";
import knexfile from "../knexfile.js";
const knex = initKnex(knexfile);

// GET List of all Inventory Items
router.get("/", async (_req, res) => {
    try{
        const inventories = await knex('inventories')
        .join('warehouses', 'inventories.warehouse_id', 'warehouses.id')
        .select('inventories.id', 'warehouses.warehouse_name as warehouse_name', 'inventories.item_name', 'inventories.description', 'inventories.category', 'inventories.status', 'inventories.quantity');
        res.status(200).json(inventories);
    } catch (error) {
        console.error(error);
        res.status(500).json({message : `${error}`});
    }
});

export default router;
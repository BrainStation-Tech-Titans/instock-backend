import express from "express";
const router = express.Router();
import initKnex from "knex";
import knexfile from "../knexfile.js";

const knex = initKnex(knexfile);

// GET /api/inventories - List of all Inventory Items
router.get("/", async (_req, res) => {
    try{
        const inventories = await knex('inventories')
        .join('warehouses', 'inventories.warehouse_id', 'warehouses.id')
        .select(
            'inventories.id',
            'warehouses.warehouse_name',
            'inventories.item_name',
            'inventories.description',
            'inventories.category',
            'inventories.status',
            'inventories.quantity'
        );

        // If for some reason, there are no inventory at all warehouses, return a 404
        if (inventories.length === 0) {
            return res.status(404).json({ message: `There seems to be no inventory at any warehouse!` });
        }
        // return inventory items
        res.status(200).json(inventories);
    } catch (error) {
        console.error(error);
        res.status(500).json({message : `${error}`});
    }
});

// GET /api/inventories/:id - Fetch a single inventory item with warehouse name
router.get("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        // Join the `inventories` table with `warehouses` table to get the warehouse name
        const inventoryItem = await knex("inventories")
            .join("warehouses", "inventories.warehouse_id", "warehouses.id")
            .select(
                "inventories.id",
                "warehouses.warehouse_name",
                "inventories.item_name",
                "inventories.description",
                "inventories.category",
                "inventories.status",
                "inventories.quantity"
            )
            .where("inventories.id", id)
            .first();

        // If no inventory item is found, return a 404
        if (!inventoryItem) {
            return res.status(404).json({ message: `Inventory item with ID ${id} not found.` });
        }

        // Return the inventory item
        res.status(200).json(inventoryItem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while fetching the inventory item." });
    }
});

//TODO: quantity NaN? & warehouse_id exists.
router.post("/", async(req, res)=>{
    try{
        const response = await knex('inventories')
        .insert({
            warehouse_id: `${req.body.warehouse_id}`,
            item_name: `${req.body.item_name}`,
            description: `${req.body.description}`,
            category: `${req.body.category}`,
            status: `${req.body.status}`,
            quantity: `${req.body.quantity}`,
            created_at:`${Date.now()}`,
            updated_at: `${Date.now()}`,
        });
        res.status(201).json(response);
    }
    catch(error){
        res.status(400).send();
    }
});
export default router;

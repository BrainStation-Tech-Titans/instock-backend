import express from "express";
const router = express.Router();
import initKnex from "knex";
import knexfile from "../knexfile.js";

const knex = initKnex(knexfile);

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

export default router;

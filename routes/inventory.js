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

router.post("/", async(req, res)=>{
    //does warehouse_id exist?
    try{
        await knex('inventories')
        .distinct('warehouse_id')
        .then(rows =>{
            const currentWarehouseIDs = rows.map(row => row.warehouse_id);
            if(!currentWarehouseIDs.includes(req.body.warehouse_id)){
                res.status(400).json({message:"warehouse_id does not exist"});
            }
        });
    }
    catch(error){
        res.status(500);
        console.error("Failed to get warehouse_ids");
        console.error(error);
    }

    //is the quantity a number?
    if(Number.isNaN(req.body.quantity)===true){
        res.status(400).send();
        return -1;
    }


    
    //try to add the request
    try{
        if (!req.body.item_name || !req.body.status || !req.body.description || !req.body.category) {
            res.status(400).json({ error: 'Missing required fields' });
            return -1;
        }
        const dataToInsert = {};

        if (req.body.warehouse_id) dataToInsert.warehouse_id = req.body.warehouse_id;
        if (req.body.item_name) dataToInsert.item_name = req.body.item_name;
        if (req.body.description) dataToInsert.description = req.body.description;
        if (req.body.category) dataToInsert.category = req.body.category;
        if (req.body.status) dataToInsert.status = req.body.status;
        if (req.body.quantity || req.body.quantity === 0) dataToInsert.quantity = req.body.quantity;

        //get the new id for returning the entire new entry
        const [insertedID] = await knex('inventories').insert(dataToInsert);

        //query and return the new entry
        const response = await knex('inventories')
        .where('id',insertedID)
        .first();
        res.status(201).json(response);
    }
    catch(error){
        res.status(500).send();
        console.error(error);
    }
});

router.delete("/:id", async (req, res) => {
    try{
        const doesExist = await knex('inventories').where('id', req.params.id).first();
        if(!doesExist){
            res.status(404).send();
        }
        await knex('inventories')
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

import express from "express";
const router = express.Router();
import initKnex from "knex";
import knexfile from "../knexfile.js";

const knex = initKnex(knexfile);

// Double check !!!

// Helper function for validation
const validateWarehouse = (data) => {
    const {
        warehouse_name,
        address,
        city,
        country,
        contact_name,
        contact_position,
        contact_phone,
        contact_email,
    } = data;

    // Check for missing fields
    if (!warehouse_name || !address || !city || !country || !contact_name || !contact_position || !contact_phone || !contact_email) {
        return { valid: false, message: "All fields are required." };
    }

    // Validate phone number format (basic regex for example purposes)
    const phoneRegex = /^\+?\d{1,9}?[\s-.\(\)]*\d{1,9}[\s-.\(\)]*\d{1,9}[\s-.\(\)]*\d{1,9}$/;
    if (!phoneRegex.test(contact_phone)) {
        return { valid: false, message: "Invalid phone number format." };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contact_email)) {
        return { valid: false, message: "Invalid email address format." };
    }

    return { valid: true };
};

// Route: POST /api/warehouses
// Create a new warehouse
router.post("/", async (req, res) => {
    const warehouseData = req.body;

    // Validate the request body
    const validation = validateWarehouse(warehouseData);
    if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
    }

    try {
        // Insert the warehouse into the database
        const [newWarehouseId] = await knex("warehouses").insert(warehouseData);

        // Fetch the newly created warehouse
        const newWarehouse = await knex("warehouses").where({ id: newWarehouseId }).first();

        // Respond with the created warehouse details
        res.status(201).json(newWarehouse);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while creating the warehouse." });
    }
});

// Double check !!!


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

router.delete("/:id", async (req, res) => {
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
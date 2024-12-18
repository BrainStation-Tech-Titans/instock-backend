import express from "express";
const router = express.Router();
import initKnex from "knex";
import knewfile from "../knexfile.js";
const knex = initKnex(knewfile);
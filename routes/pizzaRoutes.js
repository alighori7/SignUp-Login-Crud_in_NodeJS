const express = require("express");
const {
  createPizza,
  getPizzas,
  getPizzaById,
  updatePizza,
  deletePizza,
} = require("../controllers/pizzaController");

const router = express.Router();

router.post("/", createPizza);
router.get("/", getPizzas);
router.get("/:id", getPizzaById);
router.put("/:id", updatePizza);
router.delete("/:id", deletePizza);

module.exports = router;

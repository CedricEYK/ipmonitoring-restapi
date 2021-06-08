const express = require("express");
const crudController = require("../controllers/crudController");

const router = express.Router();

router.get("/api/ipmon/ip/show/:ip", crudController.handleShow);

router.get("/api/ipmon/ip/:ipa", crudController.handleReadSingle);

router.get("/api/ipmon/ip/", crudController.handleReadAll);

router.post("/api/ipmon/addip/:ip", crudController.handleCreate);

router.put("/api/ipmon/ip/:ipa");

router.delete("/api/ipmon/ip/:ipa", crudController.handleDeleteSingle);

module.exports = router;

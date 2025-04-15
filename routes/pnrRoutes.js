const express = require("express");
const router = express.Router();
const { checkPNRStatus } = require("../controller/pnrController");

router.post("/check-pnr", checkPNRStatus);

module.exports = router;

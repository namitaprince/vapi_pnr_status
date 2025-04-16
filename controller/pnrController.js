const pnrDatabase = require("../mock/pnrDatabase");

const checkPNRStatus = (req, res) => {
    const { pnr } = req.body;
  
    if (!pnr) {
      return res.status(400).json({ error: "PNR number is required." });
    }
  
    const record = pnrDatabase.find((entry) => entry.pnr === pnr);
    const resultText = record
      ? `The booking status for PNR ${pnr} is ${record.status}.`
      : `Sorry, I couldn't find a booking with PNR ${pnr}.`;
  
    // Vapi expects the response in this format
    return res.status(200).json({
      result: resultText
    });
  };
  
  module.exports = { checkPNRStatus };
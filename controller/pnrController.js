const pnrDatabase = require("../mock/pnrDatabase");

const checkPNRStatus = (req, res) => {
    console.log("Incoming request from Vapi:");
    console.log(JSON.stringify(req.body, null, 2)); // Nicely formatted
  
    const toolCallList = req.body?.message?.toolCallList;
  
    if (!toolCallList || !Array.isArray(toolCallList)) {
      return res.status(400).json({ error: "Invalid request format. toolCallList missing or not an array." });
    }
  
    const results = toolCallList.map((tool) => {
      let parsedArgs = {};
      try {
        parsedArgs = JSON.parse(tool.arguments || "{}");
      } catch (err) {
        console.error(" Failed to parse tool.arguments:", err);
        return {
          toolCallId: tool.id,
          result: "Invalid arguments format.",
        };
      }
  
      const pnr = parsedArgs.pnr;
      const record = pnrDatabase.find((entry) => entry.pnr === pnr);
      const status = record ? record.status : "PNR not found";
      const resultText = `The booking status for PNR ${pnr} is ${status}.`;
  
      return {
        toolCallId: tool.id,
        result: resultText,
      };
    });
  
    return res.status(200).json({ results });
  };
  
  module.exports = { checkPNRStatus };
const pnrDatabase = require("../mock/pnrDatabase");


const checkPNRStatus = (req, res) => {
    console.log("Incoming request from Vapi:");
    console.log(JSON.stringify(req.body, null, 2));
  
    let toolCallList = [];
  
    // Case 1: Postman / Vapi Tool Test
    if (req.body?.message?.toolCallList) {
      toolCallList = req.body.message.toolCallList;
    }
  
    // Case 2: Live Vapi AI Assistant conversation 
    else if (req.body?.toolCallList) {
      toolCallList = req.body.toolCallList.map((tool) => ({
        id: tool.id,
        arguments: tool.function?.arguments,
      }));
    } else {
      return res
        .status(400)
        .json({ error: "Invalid request format. toolCallList not found." });
    }
  
    const results = toolCallList.map((tool) => {
      const pnr = tool.arguments?.pnr;
      const record = pnrDatabase.find((entry) => entry.pnr === pnr);
      const status = record ? record.status : "PNR not found";
      const resultText = status;
      console.log(tool.id);
      console.log(status);
      
      
      
      
      

      
  
      return {
        
        toolCallId: tool.id,
        result: resultText,
        
      };
    });
  
    return res.status(200).json({ results });
    
  };
  
  
  
  module.exports = { checkPNRStatus };
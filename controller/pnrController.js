const pnrDatabase = require("../mock/pnrDatabase");

const checkPNRStatus = (req, res) => {
  console.log("====== NEW REQUEST ======");
  console.log("Incoming request from Vapi:");
  console.log(JSON.stringify(req.body, null, 2));
  
  let toolCallList = [];
  
  // Case 1: Postman / Vapi Tool Test
  if (req.body?.message?.toolCallList) {
    console.log("Processing request from Postman / Vapi Tool Test");
    toolCallList = req.body.message.toolCallList;
  }
  // Case 2: Live Vapi AI Assistant conversation  
  else if (req.body?.toolCallList) {
    console.log("Processing request from Live Vapi AI Assistant");
    toolCallList = req.body.toolCallList;
  } else {
    console.log("Error: Invalid request format - toolCallList not found");
    return res
      .status(400)
      .json({ error: "Invalid request format. toolCallList not found." });
  }
  
  console.log("Processed toolCallList:", JSON.stringify(toolCallList, null, 2));
  
  const results = toolCallList.map((tool) => {
    console.log(`Processing tool call with id: ${tool.id}`);
    
    // Extract PNR from the correct location in the structure
    let pnr;
    
    // If the PNR is in tool.function.arguments (as in the Vapi request)
    if (tool.function && tool.function.arguments) {
      if (typeof tool.function.arguments === 'string') {
        try {
          // Try to parse it if it's a string
          const args = JSON.parse(tool.function.arguments);
          pnr = args.pnr;
        } catch (e) {
          // If it's a string but not JSON, use it directly
          pnr = tool.function.arguments;
        }
      } else {
        // If it's already an object
        pnr = tool.function.arguments.pnr;
      }
    } 
    // If the PNR is directly in tool.arguments (as in your original mapping)
    else if (tool.arguments && tool.arguments.pnr) {
      pnr = tool.arguments.pnr;
    }
    
    console.log(`PNR extracted: ${pnr}`);
    
    if (!pnr) {
      console.log(`No PNR found for tool call ${tool.id}`);
      return {
        toolCallId: tool.id,
        result: "PNR not found"
      };
    }
    
    // Look up the PNR in the database
    const record = pnrDatabase.find((entry) => entry.pnr === pnr);
    console.log(`Database record found:`, record);
    
    const status = record ? record.status : "PNR not found";
    console.log(`Final status for PNR ${pnr}: ${status}`);
    
    return {
      toolCallId: tool.id,
      result: status
    };
  });
  
  console.log("Final response being sent to Vapi:");
  console.log(JSON.stringify({ results }, null, 2));
  console.log("=========================");
  
  return res.status(200).json({ results });
};

module.exports = { checkPNRStatus };
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
    
    // Log the raw toolCallList before processing
    console.log("Raw toolCallList:", JSON.stringify(req.body.toolCallList, null, 2));
    
    toolCallList = req.body.toolCallList.map((tool) => {
      console.log(`Processing tool call with id: ${tool.id}`);
      
      // Check if arguments exists directly or in function property
      const args = tool.arguments || (tool.function && tool.function.arguments);
      console.log(`Arguments for tool ${tool.id}:`, JSON.stringify(args, null, 2));
      
      return {
        id: tool.id,
        arguments: args,
      };
    });
  } else {
    console.log("Error: Invalid request format - toolCallList not found");
    return res
      .status(400)
      .json({ error: "Invalid request format. toolCallList not found." });
  }
  
  console.log("Processed toolCallList:", JSON.stringify(toolCallList, null, 2));
  
  const results = toolCallList.map((tool) => {
    console.log(`Looking up PNR for tool call ${tool.id}`);
    
    // Check if arguments exist
    if (!tool.arguments) {
      console.log(`No arguments for tool call ${tool.id}`);
      return {
        toolCallId: tool.id,
        result: "Error: Missing arguments",
      };
    }
    
    // Get PNR from arguments
    const pnr = tool.arguments.pnr;
    console.log(`PNR received: ${pnr}`);
    
    if (!pnr) {
      console.log(`Invalid or missing PNR for tool call ${tool.id}`);
      return {
        toolCallId: tool.id,
        result: "PNR not found",
      };
    }
    
    // Log database content for debugging
    console.log("Database entries:");
    pnrDatabase.forEach(entry => console.log(`- PNR: ${entry.pnr}, Status: ${entry.status}`));
    
    // Look up record
    const record = pnrDatabase.find((entry) => entry.pnr === pnr);
    console.log(`Record found for PNR ${pnr}:`, record);
    
    const status = record ? record.status : "PNR not found";
    console.log(`Final status for PNR ${pnr}: ${status}`);
    
    return {
      toolCallId: tool.id,
      result: status,
    };
  });
  
  console.log("Final response being sent to Vapi:");
  console.log(JSON.stringify({ results }, null, 2));
  console.log("=========================");
  
  return res.status(200).json({ results });
};

module.exports = { checkPNRStatus };
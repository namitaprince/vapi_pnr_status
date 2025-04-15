const pnrDatabase = require("../mock/pnrDatabase");

const checkPNRStatus = (req, res) => {
  const { message } = req.body;

  if (
    !message ||
    !message.toolCallList ||
    !message.toolCallList[0] ||
    !message.toolCallList[0].arguments
  ) {
    return res.status(400).json({
      error: "Invalid request format. Expected toolCallList with arguments."
    });
  }

  const toolCall = message.toolCallList[0];
  const pnr = toolCall.arguments.pnr;

  if (!pnr) {
    return res.status(400).json({ error: "PNR number is required." });
  }

  const record = pnrDatabase.find((entry) => entry.pnr === pnr);
  const resultText = record
    ? `The booking status for PNR ${pnr} is ${record.status}.`
    : `Sorry, I couldn't find a booking with PNR ${pnr}.`;

  return res.status(200).json({
    results: [
      {
        toolCallId: toolCall.id,
        result: resultText
      }
    ]
  });
};

module.exports = { checkPNRStatus };

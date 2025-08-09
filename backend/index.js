import express from "express";
import { getCase } from "./getCase.js";
import { initDB, logQuery } from "./logger.js";
import cors from "cors";
const port = 3000;
const app = express();

app.use(express.json());
app.use(cors());

initDB()
  .then(() => {
    console.log("SQLite database initialized.");
  })
  .catch(console.error);

app.post("/get-case", async (req, res) => {
  try {
    const { caseNumber, caseType, caseYear } = req.body;
    if (!caseNumber || !caseType || !caseYear) {
      return res.status(400).json({ message: "Incomplete Form" });
    }

    const data = await getCase(caseNumber, caseType, caseYear);

    if (data.error) {
      return res.status(404).json({ message: data.error });
    }
    await logQuery({
      caseNumber,
      caseType,
      caseYear,
      jsonResponse: data,
    });

    res.json(data);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`started listening on port ${port}`);
});

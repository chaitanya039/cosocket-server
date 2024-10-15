import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import Manufacturer from "../models/manufacturer.model.js";
import Fuse from "fuse.js";
import { manufacturerIns } from "../utils/openai.js";
import openai from "../utils/openai.js";

const addManufacturers = AsyncHandler(async (req, res) => {
  const manufacturers = req.body.manufacturers; // Expecting an array of manufacturers
  if (!manufacturers || !Array.isArray(manufacturers)) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Manufacturers data should be an array."));
  }

  // Save manufacturers to the database
  const savedManufacturers = await Manufacturer.insertMany(manufacturers);
  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        savedManufacturers,
        "Manufacturers added successfully!"
      )
    );
});

// Predefined list of known operations in your database
const knownOperations = [
  "Cutting",
  "Welding",
  "Sewing",
  "Milling",
  "Turning",
  "Drilling",
  "Forging",
  "Casting",
  "Machining",
  "Stamping",
  "Grinding",
  "Bending",
  "Assembly",
  "Painting",
  "Coating",
  "Plating",
  "Heat Treatment",
  "Surface Treatment",
  "Finishing",
  "Injection Molding",
  "CNC Machining",
  "Laser Cutting",
  "Extrusion",
  "3D Printing",
  "Waterjet Cutting",
  "Brazing",
  "Soldering",
  "Laminating",
  "Electroplating",
  "Anodizing",
  "Blow Molding",
  "Compression Molding",
  "Powder Coating",
  "Roll Forming",
  "Vacuum Forming",
  "Sandblasting",
  "Polishing",
  "Die Casting",
  "Threading",
  "Pressing",
  "Shearing",
  "EDM (Electrical Discharge Machining)",
  "Hot Isostatic Pressing",
  "Quenching",
  "Tempering",
  "Shot Peening",
  "packaging",
];

// Fuzzy match function for operations
function fuzzyMatchOperation(givenOperation, operationsInDatabase) {
  const fuse = new Fuse(operationsInDatabase, { threshold: 0.3 });
  const result = fuse.search(givenOperation);
  return result.length > 0 ? result[0].item : null;
}

// Function to normalize operations using OpenAI API with material and tool context
async function normalizeOperationWithMaterial(operation, tools, materials) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Normalize the following operation: '${operation}' for the given materials: ${materials.join(", ")} and tools: ${tools.join(", ")}.`,
        },
        {
          role: "system",
          content: manufacturerIns, // Assuming 'operationsIns' contains your system message for detailed instructions
        },
      ],
    });

    // Extract and parse the response from OpenAI
    const parsedResponse = JSON.parse(response.choices[0].message.content);
    const normalizedOperation = parsedResponse.normalized_operation;

    // If the normalized operation isn't in the known operations, perform fuzzy matching
    const matchedOperation = knownOperations.includes(normalizedOperation)
      ? normalizedOperation
      : fuzzyMatchOperation(normalizedOperation, knownOperations);

    return matchedOperation || operation; // Fallback if no match found
  } catch (error) {
    throw new Error("Failed to normalize operation with OpenAI.");
  }
}

// Get manufacturers based on normalized operation, tools, and materials
const getManufacturers = AsyncHandler(async (req, res) => {
  // 1. Get operation, tools, and materials from the request body
  const { operation, tools, materials } = req.body;

  // 2. Normalize the operation with material and tool context
  try {
    const normalizedOperation = await normalizeOperationWithMaterial(
      operation,
      tools,
      materials
    );

    // 3. Fetch all manufacturers from the database
    const manufacturers = await Manufacturer.find();

    // 4. Calculate scores for each manufacturer based on the normalized operation, tools, and materials
    const rankedManufacturers = manufacturers.map((manufacturer) => {
      let score = 0;

      manufacturer.operations.forEach((manufacturerOp) => {
        // Match the normalized operation with material context
        if (manufacturerOp.name === normalizedOperation) {
          score += 20;
        }
        // Fuzzy matching for materials (30% weight)
        const matchingMaterials = materials.filter(
          (material) =>
            manufacturerOp.materials.includes(material) ||
            fuzzyMatchOperation(material, manufacturerOp.materials)
        );
        const materialMatchPercentage =
          matchingMaterials.length / materials.length;
        if (materialMatchPercentage >= 0.7) {
          // Consider 70% or more as a sufficient match
          score += materialMatchPercentage * 30; // Assign score proportionally
        }

        // Fuzzy matching for tools (50% weight)
        const matchingTools = tools.filter(
          (tool) =>
            manufacturerOp.tools.includes(tool) ||
            fuzzyMatchOperation(tool, manufacturerOp.tools)
        );
        const toolMatchPercentage = matchingTools.length / tools.length;
        if (toolMatchPercentage >= 0.7) {
          // Consider 70% or more as a sufficient match
          score += toolMatchPercentage * 50; // Assign score proportionally
        }
      });

      return { manufacturer, score };
    });

    // 5. Sort and filter the manufacturers based on score
    const filteredAndSortedManufacturers = rankedManufacturers
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score);

    if (filteredAndSortedManufacturers.length <= 0) {
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            {},
            `Sorry, do not have manufacturers relevant to it!`
          )
        );
    }

    // 6. Return the sorted manufacturers in the response
    return res.status(200).json(
      new ApiResponse(
        200,
        filteredAndSortedManufacturers.map((item) => item.manufacturer),
        `Manufacturers for operation ${operation} fetched successfully!`
      )
    );
  } catch (error) {
    // Handle any errors that occur during the normalization or manufacturer fetching process
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          {},
          "Failed to normalize operation or fetch manufacturers."
        )
      );
  }
});

export { addManufacturers, getManufacturers };

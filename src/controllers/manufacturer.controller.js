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

const getManufacturers = AsyncHandler(async (req, res) => {
  const { operation, tools, materials } = req.body;

  try {
    // Normalize the operation with material and tool context
    const normalizedOperation = await normalizeOperationWithMaterial(
      operation,
      tools,
      materials
    );

    // Fetch all manufacturers from the database
    const manufacturers = await Manufacturer.find();

    // Calculate scores for each manufacturer
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
          score += toolMatchPercentage * 50; // Assign score proportionally
        }
      });

      return { manufacturer, score };
    });

    // Sort and filter the manufacturers based on score
    const filteredAndSortedManufacturers = rankedManufacturers
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score);

    if (filteredAndSortedManufacturers.length <= 0) {
      // Return a dummy manufacturer if no matches are found
      const dummyManufacturer = {
        name: "Cosocket Manufacturer 1",
        operations: ["General Manufacturing"],
        tools: ["Standard Tools"],
        materials: ["Standard Materials"],
        description:
          "This is a dummy manufacturer provided by Cosocket for unmatched operations.",
        rating: 4.5,
        location: "Global",
      };
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            [dummyManufacturer],
            "No manufacturers found. Returning a dummy manufacturer."
          )
        );
    }

    // Return the sorted manufacturers in the response
    return res.status(200).json(
      new ApiResponse(
        200,
        filteredAndSortedManufacturers.map((item) => item.manufacturer),
        `Manufacturers for operation ${operation} fetched successfully!`
      )
    );
  } catch (error) {
    // Handle any errors
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


// Get only one manufacturer on the basis on ID
const getManufacturerById = AsyncHandler(async (req, res) => {
  try {
    // Get ID from params
    const { id } = req.params;

    // Fetch data from database
    const data = await Manufacturer.findById(id);

    // Check data exists or not
    if (!data) {
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            {},
            `Unable to find manufacturer with this id ${id}`
          )
        );
    }

    // Return manufacturer
    return res
      .status(200)
      .json(new ApiResponse(200, data, "Manufacturer retrived successfully!"));
  } catch (error) {
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          {},
          `Unable to fetch manufacturer!`
        )
      );
  }
});

const getTopManufacturers = AsyncHandler(async (req, res) => {
  // Fetch all manufacturers with rating >= 4.5
  const manufacturers = await Manufacturer.find({ rating: { $gte: 4.5 } });

  if (!manufacturers || manufacturers.length === 0) {
    return res
      .status(404)
      .json(new ApiResponse(404, [], "No top manufacturers found."));
  }

  // Shuffle the manufacturers to randomize
  const shuffled = manufacturers.sort(() => 0.5 - Math.random());

  // Select only 15 manufacturers (or fewer if not enough)
  const selectedManufacturers = shuffled.slice(0, 15);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        selectedManufacturers,
        "Top 15 manufacturers retrieved successfully!"
      )
    );
});

export { addManufacturers, getManufacturers, getManufacturerById, getTopManufacturers };

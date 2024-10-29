import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import openai, {
  operationsIns,
  sourcingIns,
  variantsIns,
  inspectionIns,
} from "../utils/openai.js";

const getInspectionSteps = AsyncHandler(async (req, res) => {
  try {
    const { product } = req.params;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "user", content: product },
        { role: "system", content: inspectionIns },
      ],
    });

    const data = JSON.parse(response.choices[0].message.content);
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          data,
          `Inspection steps for ${product} fetched successfully!`
        )
      );
  } catch (error) {
    console.error("Error fetching inspection steps:", error);
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          {},
          "Failed to fetch inspection steps. Please try again."
        )
      );
  }
});

const getVariants = AsyncHandler(async (req, res) => {
  try {
    const { product } = req.params;
    const { specs } = req.body;

    console.log(specs);

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `${product} and include following specification ${specs}`,
        },
        { role: "system", content: variantsIns },
      ],
    });

    const data = JSON.parse(response.choices[0].message.content);

    if (!data) {
      throw new Error("No data received from OpenAI API.");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          data,
          `Variants for ${product} fetched successfully!`
        )
      );
  } catch (error) {
    console.error("Error fetching variants:", error);
    return res
      .status(500)
      .json(
        new ApiResponse(500, {}, "Failed to fetch variants. Please try again.")
      );
  }
});

const getOperations = AsyncHandler(async (req, res) => {
  try {
    const { product } = req.params;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "user", content: `create process sheet for ${product}` },
        { role: "system", content: operationsIns },
      ],
    });

    const data = JSON.parse(response.choices[0].message.content);

    if (!data) {
      throw new Error("No data received from OpenAI API.");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          data,
          `Operations for ${product} fetched successfully!`
        )
      );
  } catch (error) {
    console.error("Error fetching operations:", error);
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          {},
          "Failed to fetch operations. Please try again."
        )
      );
  }
});

const getSourcing = AsyncHandler(async (req, res) => {
  try {
    const { product } = req.params;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "user", content: product },
        { role: "system", content: sourcingIns },
      ],
    });

    const data = JSON.parse(response.choices[0].message.content);
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          data,
          `Sourcing for ${product} fetched successfully!`
        )
      );
  } catch (error) {
    console.error("Error fetching sourcing information:", error);
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          {},
          "Failed to fetch sourcing information. Please try again."
        )
      );
  }
});

export { getInspectionSteps, getVariants, getOperations, getSourcing };

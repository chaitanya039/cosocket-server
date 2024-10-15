import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import openai, { operationsIns, variantsIns } from "../utils/openai.js";
import { inspectionIns } from "../utils/openai.js";

const getInspectionSteps = AsyncHandler(async (req, res) => {
  // 1. Get data from params
  const { product } = req.params;

  // 2. Call to chatgpt APIs
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: product,
      },
      {
        role: "system",
        content: inspectionIns,
      },
    ],
    
  });

  // 3. Return reponse
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
});

const getVariants = AsyncHandler(async (req, res) => {
  // 1. Get data from user
  const { product } = req.params;
  const { specs } = req.body;
  console.log(specs);
  // 2. Call to chatgpt APIs
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: `${product} and include following specification ${specs}`,
      },
      {
        role: "system",
        content: variantsIns,
      },
    ],
  });

  // 3. Parse reponse
  const data = JSON.parse(response.choices[0].message.content);

  if (!data) {
    return res.status(500).json(new ApiResponse(500, {}, "Something went wrong at server side!"));
  }
  
  // 4. Return response
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        data,
        `Variants for ${product} fetched successfully!`
      )
    );
});

const getOperations = AsyncHandler(async (req, res) => {
  // 1. Get Product
  const { product } = req.params;
  
  // 2. Call to chatgpt API
   const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: `create process sheet for ${product}`,
      },
      {
        role: "system",
        content: operationsIns,
      },
    ],
  });
  
  // 3. Parse reponse
  const data = JSON.parse(response.choices[0].message.content);

  if (!data) {
    return res.status(500).json(new ApiResponse(500, {}, "Something went wrong at server side!"));
  }
  
  // 4. Return response
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        data,
        `Operations for ${product} fetched successfully!`
      )
    );
})

export { getInspectionSteps, getVariants, getOperations };

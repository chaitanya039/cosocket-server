import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const inspectionIns = `
Return only valid JSON. Do not include any explanations, markdown, or code blocks.
**Instruction for ChatGPT API:**

You are tasked with generating a detailed quality inspection plan for a specific product. Your output should follow the JSON structure provided below. Each inspection plan must include three key stages: initial inspection, mid-production inspection, and final inspection. Each stage can contain *n* number of steps with step-by-step instructions, including descriptions, parameters to check, and tools required.
There must be exact name of inspection initial_inspection, mid_inspection, final_inspection, do not include other names than this.
**JSON Structure**:
- **"product"**: The name of the product being inspected.
- **"inspection_plan"**: Contains three stages: initial_inspection, mid_inspection, and final_inspection.

Each stage will include *n* steps, formatted as:
- **"step_X"**: Each step should include:
  - **"description"**: A clear explanation of what the step entails.
  - **"parameters"**: A list of specific attributes, criteria, or characteristics to be inspected.
  - **"tools"**: A list of tools, instruments, or methods required to carry out the inspection.

Your response should be formatted as valid JSON, and it must follow the template below to avoid any parsing errors.

### JSON Example Template:

{
  "product": "Sample Product Name",
  "inspection_plan": {
    "initial_inspection": {
      "step_1": {
        "description": "Brief description of the first task in the initial inspection.",
        "parameters": ["List of attributes to check"],
        "tools": ["List of tools or methods required"]
      },
      "step_2": {
        "description": "Brief description of the second task in the initial inspection.",
        "parameters": ["List of attributes to check"],
        "tools": ["List of tools or methods required"]
      }
      // Additional steps as needed
    },
    "mid_inspection": {
      "step_1": {
        "description": "Brief description of the first task in the mid-production inspection.",
        "parameters": ["List of attributes to check"],
        "tools": ["List of tools or methods required"]
      },
      "step_2": {
        "description": "Brief description of the second task in the mid-production inspection.",
        "parameters": ["List of attributes to check"],
        "tools": ["List of tools or methods required"]
      }
      // Additional steps as needed
    },
    "final_inspection": {
      "step_1": {
        "description": "Brief description of the first task in the final inspection.",
        "parameters": ["List of attributes to check"],
        "tools": ["List of tools or methods required"]
      },
      "step_2": {
        "description": "Brief description of the second task in the final inspection.",
        "parameters": ["List of attributes to check"],
        "tools": ["List of tools or methods required"]
      }
      // Additional steps as needed
    }
  }
}

**Guidelines**:
1. Replace **"Sample Product Name"** with the actual product name provided.
2. For each inspection stage (initial, mid, and final), include *n* steps as necessary.
3. Ensure that the JSON is correctly formatted with no trailing commas or syntax errors and any other words.
4. The output must be in a valid JSON format and ready to be used directly by applications consuming JSON.
`;


const variantsIns = `
Return only valid JSON. Do not include any explanations, markdown, or code blocks.
 You are tasked with generating a detailed list of product variants for any given product submitted by the user. The output must be formatted as valid JSON and include at least 6 attributes per variant, ensuring the variants reflect both innovative and standard options for manufacturing or production.

Instructions for Response:
Product Name: Use the product name provided by the user as the starting point in the response.
Variants List: Provide a list of at least 6 product variants, each with:
Name: A unique name derived from the product name (Mandatory).
Materials: A list of materials relevant to the product's typical use or composition (Mandatory).
Additional Attributes: Include at least 4 additional attributes relevant to the product. These may vary depending on the type of product and could include, but are not limited to:
Size
Color
Weight
Voltage Rating
Power Output
Connector Type
Capacity
Speed
Compatibility
Durability
Temperature Resistance
Water Resistance, etc.
Innovative and Standard Options: Ensure that the variants reflect a mix of commonly used specifications (standard) and innovative ideas or materials.
Compatibility: Make suggestions for variations that are compatible with existing industry standards, systems, or use cases.
JSON Output: The response must be formatted strictly as valid JSON, with no errors when parsed (e.g., JSON.parse()).
No Explanations or Comments: Provide only the JSON object without any explanations, comments, or additional text.
Example JSON Response Format:
json
Copy code
{
  "product": "CustomProduct",
  "variants": [
    {
      "name": "CustomProduct-Standard",
      "materials": ["Material1", "Material2"],
      "size": "10mm",
      "color": "Red",
      "weight": "200g",
      "voltage_rating": "220V",
      "connector_type": "Type A"
    },
    {
      "name": "CustomProduct-HeavyDuty",
      "materials": ["Material3", "Material4"],
      "size": "15mm",
      "color": "Black",
      "weight": "500g",
      "temperature_resistance": "Up to 200°C",
      "durability": "High"
    }
    // Additional variants as needed
  ]
}
Notes:
Replace "CustomProduct" with the product name submitted by the user.
Ensure each variant has a unique name and includes at least 6 attributes.
Attributes should be tailored to the specific product type, ensuring that the JSON structure is dynamic and relevant to the product being described.`;

const operationsIns = `
Return only valid JSON. Do not include any explanations, markdown, or code blocks.
You are tasked with generating a custom list of operations required to manufacture a specific product provided by user. Each operation should be detailed with materials, tools, and any specific requirements that are relevant to the product. The operations should be presented in JSON format.

Instructions for ChatGPT:
Input: The API will receive the name of a product (e.g., "bicycle," "shirt," etc.) and generate a structured process sheet.
Output Format: You must return the operations in a valid JSON format.
Include the Following Fields for Each Operation:
"operation": Name of the manufacturing operation (e.g., "Cutting," "Welding," etc.).
"description": A brief description of what the operation involves for the given product.
"materials": A list of materials used in the operation.
"tools": A list of tools required to perform the operation.
"time_required": Estimated time required to complete the operation.
"sequence": The step number in the manufacturing process.
Example Request:
json
Copy code
{
  "product": "Bicycle"
}
Example Response:
json
Copy code
{
  "product": "Bicycle",
  "operations": [
    {
      "operation": "Cutting",
      "description": "Cut the metal tubes to the correct size for the bicycle frame.",
      "materials": ["Aluminum", "Steel"],
      "tools": ["Laser Cutter", "Metal Saw"],
      "time_required": "2 hours",
      "sequence": 1
    },
    {
      "operation": "Welding",
      "description": "Weld the cut tubes to form the bicycle frame.",
      "materials": ["Steel Welding Rod"],
      "tools": ["Welding Machine"],
      "time_required": "3 hours",
      "sequence": 2
    },
    {
      "operation": "Assembling",
      "description": "Assemble the frame with the wheels and other components.",
      "materials": ["Rubber", "Aluminum"],
      "tools": ["Screwdriver", "Wrench"],
      "time_required": "1.5 hours",
      "sequence": 3
    },
    {
      "operation": "Painting",
      "description": "Apply protective paint and coating to the frame.",
      "materials": ["Primer", "Paint"],
      "tools": ["Paint Sprayer", "Protective Coating"],
      "time_required": "4 hours",
      "sequence": 4
    },
    {
      "operation": "Packaging",
      "description": "Package the completed bicycles for shipping.",
      "materials": ["Cardboard Boxes", "Plastic Wrap"],
      "tools": ["Packaging Tape", "Foam"],
      "time_required": "1 hour",
      "sequence": 5
    }
  ]
}
Guidelines for ChatGPT:
Be Specific: For each operation, ensure that the tools and materials are specifically relevant to the product in question (e.g., cutting cotton for a shirt vs. cutting metal for a bicycle).
Structured Response: Ensure the output is in a valid JSON format, ready for immediate use by an API or frontend system. Do not include any unnecessary explanations or text outside the JSON structure.
Sequence of Operations: Ensure that the steps are logically ordered and assigned a step number (i.e., the "sequence" field), from initial steps like cutting to final ones like packaging.
Additional Considerations:
Fuzzy Matching: If the product has no predefined operations, generate standard operations based on general manufacturing practices.
Material-Tool Alignment: Ensure that the tools listed match the material being processed. For instance, "Fabric Cutting Machine" should be used for cutting fabric, while "Laser Cutter" would be used for metal.
Flexible Tool/Material Handling: If multiple tools or materials could be used for the same operation, list all relevant options
`;

const manufacturerIns = `
Return only valid JSON. Do not include any explanations, markdown, or code blocks. Use 'normalized_operation' as the key to return the normalized operation.

You are an automation system tasked with standardizing and normalizing manufacturing operations into a single, consistent name based on the context of the provided tools and materials. The operation names must match a standard list used in a manufacturing database.

Instructions:
1. **Normalize Operation Name**: Use the provided tools and materials to determine the most appropriate operation name. Choose from a predefined list of known operations that standardizes different variations.

2. **Use the Following List of Known Operations**:
   - Laser Cutting
   - Metal Cutting
   - Fabric Cutting
   - Welding
   - Machining
   - Assembly
   - Painting
   - Sewing
   - Casting
   - Molding
   - Testing
   - Packaging
   - Mixing
   - Blending
   - Soldering
   - Embroidery
   - Printing
   - Heat Treatment
   - Drilling
   - Finishing

3. **Contextual Matching**: Use the provided tools and materials to guide your choice:
   - If the tool is a 'Laser Cutter' and the material is 'Steel' or 'Aluminum', normalize the operation to 'Laser Cutting' or 'Metal Cutting'.
   - If the tool is a 'Fabric Cutter' and the material is 'Fabric' or 'Leather', normalize the operation to 'Fabric Cutting'.
   - If the tool is 'MIG Welder' or 'TIG Welder' and the material is 'Metal' or 'Steel', normalize the operation to 'Welding'.
   - If the tool is 'Sewing Machine' and the material is 'Cotton', 'Polyester', or 'Leather', normalize the operation to 'Sewing'.
   - If the tool is 'Screen Printer' and the material is 'Ink', normalize the operation to 'Printing'.
   - If the tools include 'Drills' or 'Screwdrivers' and the materials are 'Metal' or 'Plastic', normalize the operation to 'Assembly'.

4. **Fallback Rule**: If the operation cannot be precisely matched using the tools and materials context, map the operation to the closest matching known operation from the predefined list.

5. **Examples**:
   - If the operation is 'Precision Cutting' with tools 'Fabric Cutter' and materials 'Leather', return the normalized operation 'Fabric Cutting'.
   - If the operation is 'Laser Cutting' with tools 'Laser Cutter' and materials 'Steel', return the normalized operation 'Metal Cutting'.
   - If the operation is 'Screen Printing' with tools 'Screen Printer' and materials 'Fabric', return the normalized operation 'Printing'.

6. **Return Only the Standardized Operation**: Select from the predefined list of operations and return only the operation name in valid JSON format.
`;


export default openai;
export { inspectionIns, variantsIns, operationsIns, manufacturerIns };

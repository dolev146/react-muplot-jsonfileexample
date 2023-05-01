import fs from "fs/promises";

async function processData() {
  try {
    // Read the DataMat.json file
    const jsonString = await fs.readFile("DataMat.json", "utf8");

    // Parse the JSON data
    const data = JSON.parse(jsonString);

    // Slice the arrays
    const slicedData = data.map((subarray) => subarray.slice(0, 220000));

    // Print the lengths of the sliced arrays
    console.log("slicedData[0] length:", slicedData[0].length);
    console.log("slicedData[1] length:", slicedData[1].length);

    // Write the sliced data back to the file
    await fs.writeFile(
      "DataMat_Sliced.json",
      JSON.stringify(slicedData),
      "utf8"
    );
    console.log("Successfully sliced data and saved to DataMat_Sliced.json");
  } catch (err) {
    console.log("Error:", err);
  }
}

processData();

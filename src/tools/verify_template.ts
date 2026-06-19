import fs from "node:fs";
import path from "node:path";
import yaml from "yaml";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function checkStructure(templateObj: any, targetObj: any, currentPath: string = ""): string[] {
  let errors: string[] = [];

  if (typeof templateObj !== 'object' || templateObj === null) {
    return errors;
  }

  for (const key of Object.keys(templateObj)) {
    const newPath = currentPath ? `${currentPath}.${key}` : key;
    
    if (typeof targetObj !== 'object' || targetObj === null || !(key in targetObj)) {
      errors.push(`Missing key: ${newPath}`);
      continue;
    }

    if (typeof templateObj[key] === 'object' && templateObj[key] !== null && !Array.isArray(templateObj[key])) {
      errors.push(...checkStructure(templateObj[key], targetObj[key], newPath));
    }
  }

  return errors;
}

function main() {
  const filePath = process.argv[2];
  const templateName = process.argv[3];

  if (!filePath || !templateName) {
    console.log("Error: Usage: node verify-template.js <filePath> <templateName>");
    process.exit(1);
  }

  const absolutePath = path.resolve(filePath);
  
  if (!fs.existsSync(absolutePath)) {
    console.log(`File not found at ${filePath}. Hint: Double-check the path, create the file if it's missing, or verify you are in the correct directory.`);
    process.exit(1);
  }

  // The template is located at '../templates/<templateName>' relative to the bundled output script
  const templatePath = path.join(__dirname, "../templates", templateName);
  
  if (!fs.existsSync(templatePath)) {
    console.log(`Template '${templateName}' not found. Hint: Verify the template name is correct and exists in the templates folder (e.g., 'orchestrator-state-development.yml').`);
    process.exit(1);
  }

  let targetYaml;
  try {
    const fileContent = fs.readFileSync(absolutePath, "utf8");
    targetYaml = yaml.parse(fileContent);
  } catch (error: any) {
    console.log(`YAML Syntax Error in ${filePath}: ${error.message}. Hint: Check the file content for invalid YAML formatting, such as incorrect indentation or unescaped strings, and fix them.`);
    process.exit(1);
  }

  let templateYaml;
  try {
    const templateContent = fs.readFileSync(templatePath, "utf8");
    templateYaml = yaml.parse(templateContent);
  } catch (error: any) {
    console.log(`Internal Error: Failed to parse reference template YAML '${templateName}': ${error.message}. Hint: The template file itself contains invalid YAML syntax.`);
    process.exit(1);
  }

  const errors = checkStructure(templateYaml, targetYaml);

  if (errors.length > 0) {
    console.log(`YAML Structure Validation Failed. Your file is missing the following required keys:\n- ${errors.join("\n- ")}\n\nHint: Update the file at ${filePath} to include these missing keys so it matches the structure of '${templateName}'.`);
    process.exit(1);
  }

  console.log("File exists and follows the correct YAML structure.");
  process.exit(0);
}

main();

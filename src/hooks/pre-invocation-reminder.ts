import fs from "node:fs";
import path from "node:path";

async function main() {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  const inputStr = Buffer.concat(chunks).toString("utf8");
  let input: any = {};
  try {
    input = JSON.parse(inputStr);
  } catch (e) {
    // Silently fallback if JSON parsing fails
  }

  const workspacePaths = input.workspacePaths || [];
  if (workspacePaths.length > 0) {
    const tasksDir = path.join(workspacePaths[0], ".agyflow", "tasks");
    if (fs.existsSync(tasksDir)) {
      console.log(
        JSON.stringify({
          injectSteps: [
            {
              ephemeralMessage: `## agyflow Workflow State
If an orchestrator workflow was active before compaction, you MUST re-read
orchestrator-state.yml in that task's directory to verify completed_phases
and determine the next phase. Use the question tool at Phase Gates.`,
            },
          ],
        }),
      );
      return;
    }
  }

  console.log(JSON.stringify({}));
}

main().catch(() => {
  console.log(JSON.stringify({}));
});

import fs from 'node:fs';

const WHITELIST = [
  "task-group-implementer",
  "test-suite-runner",
  "e2e-test-verifier",
  "user-docs-generator",
  "docs-operator",
];

const DESTRUCTIVE =
  /git\s+stash|git\s+reset\s+--hard|git\s+checkout\s+--\s+\.|git\s+checkout\s+\.\s*(?:$|\s)|git\s+clean|git\s+push\s+(?:--force|-f)|rm\s+-[rf]{2}/i;

async function main() {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  const inputStr = Buffer.concat(chunks).toString('utf8');
  let input: any = {};
  try {
    input = JSON.parse(inputStr);
  } catch (e) {
    process.exit(0);
  }

  const toolCall = input.toolCall || {};
  const toolName = toolCall.tool || "";
  const args = toolCall.args || {};
  const cmd = args.CommandLine || args.command || "";

  if (toolName === "run_command" && DESTRUCTIVE.test(cmd)) {
    const transcriptPath = input.transcriptPath;
    let isWhitelisted = false;

    if (transcriptPath && fs.existsSync(transcriptPath)) {
      try {
        const transcriptContent = fs.readFileSync(transcriptPath, 'utf8');
        for (const agent of WHITELIST) {
          if (transcriptContent.includes(agent)) {
            isWhitelisted = true;
            break;
          }
        }
      } catch (e) {
        // Default to not whitelisted if we can't read the file
      }
    }

    if (!isWhitelisted) {
      console.error(`Blocked: destructive command not permitted for this agent. Command: "${cmd}"`);
      process.exit(2);
    }
  }

  process.exit(0);
}

main().catch(() => {
  process.exit(0);
});

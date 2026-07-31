import path from "node:path";
import ts from "typescript";

const projectPath = path.resolve(
  process.cwd(),
  process.argv[2] ?? "tsconfig.json",
);

if (!ts.sys.fileExists(projectPath)) {
  console.error(`Cannot find TypeScript project: ${projectPath}`);
  process.exit(1);
}

const formatHost = {
  getCanonicalFileName: (fileName) => fileName,
  getCurrentDirectory: () => process.cwd(),
  getNewLine: () => ts.sys.newLine,
};

function timestamp() {
  return new Date().toLocaleTimeString("en-GB", { hour12: false });
}

console.log(`${timestamp()} - Starting compilation in watch mode...`);

const watchHost = ts.createWatchCompilerHost(
  projectPath,
  {},
  ts.sys,
  ts.createSemanticDiagnosticsBuilderProgram,
  () => {},
  () => {},
);

let initialRun = true;

watchHost.afterProgramCreate = (builderProgram) => {
  if (!initialRun) {
    console.log(
      `${timestamp()} - File change detected. Starting incremental compilation...`,
    );
  }

  const diagnostics = ts.getPreEmitDiagnostics(builderProgram.getProgram());

  if (diagnostics.length > 0) {
    process.stdout.write(ts.formatDiagnostics(diagnostics, formatHost));
  }

  const errorCount = diagnostics.filter(
    (diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error,
  ).length;
  const errorLabel = errorCount === 1 ? "error" : "errors";

  console.log(
    `${timestamp()} - Found ${errorCount} ${errorLabel}. Watching for file changes.`,
  );

  initialRun = false;
};

ts.createWatchProgram(watchHost);

import fs from "fs/promises";

export async function saveJson(
  filePath: string,
  data: unknown,
) {
  await fs.writeFile(
    filePath,
    JSON.stringify(data, null, 2),
    "utf8",
  );
}
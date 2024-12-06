import config from "@/buildx-app.config.json";

export async function getTakedownStatus(): Promise<boolean> {
  // For testing, you can hardcode the return value or use an environment variable
  // In the future, you can replace this with an actual API call
  return process.env.ENABLE_TAKEDOWN === "true" || config.takedown === "true";
}

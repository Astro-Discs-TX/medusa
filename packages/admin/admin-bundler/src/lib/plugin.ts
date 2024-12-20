import path from "path"
import { UserConfig } from "vite"

export async function plugin() {
  const vite = await import("vite")

  const pluginConfig: UserConfig = {
    build: {
      lib: {
        entry: path.resolve(process.cwd(), "src/admin"),
      },
      rollupOptions: {
        external: ["react", "react-dom", "react-router-dom"],
      },
    },
  }
}

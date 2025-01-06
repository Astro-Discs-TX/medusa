import { glob } from "glob"
import path from "path"
import { UserConfig } from "vite"

export async function plugin() {
  const vite = await import("vite")
  const entries = await glob("src/admin/**/*.{ts,tsx,js,jsx}")

  const entryPoints = entries.reduce((acc, entry) => {
    // Convert src/admin/routes/brands/page.tsx -> admin/routes/brands/page
    const outPath = entry
      .replace(/^src\//, "")
      .replace(/\.(ts|tsx|js|jsx)$/, "")

    acc[outPath] = path.resolve(process.cwd(), entry)
    return acc
  }, {} as Record<string, string>)

  const pluginConfig: UserConfig = {
    build: {
      lib: {
        entry: entryPoints,
        formats: ["es"],
      },
      minify: false,
      outDir: path.resolve(process.cwd(), "dist/admin"),
      rollupOptions: {
        external: [
          "react",
          "react/jsx-runtime",
          "react-dom",
          "react-router-dom",
          "@medusajs/admin-sdk",
        ],
        output: {
          preserveModules: true,
          entryFileNames: `[name].js`,
        },
      },
    },
  }

  await vite.build(pluginConfig)
}

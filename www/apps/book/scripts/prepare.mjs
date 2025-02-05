import path from "path"
import { sidebar } from "../sidebar.mjs"
import {
  generateEditedDates,
  generateLlmsFull,
  generateSidebar,
} from "build-scripts"
import {
  addUrlToRelativeLink,
  crossProjectLinksPlugin,
  localLinksRehypePlugin,
} from "remark-rehype-plugins"

async function main() {
  // await generateEditedDates()
  // await generateSidebar(sidebar, {
  //   addNumbering: true,
  // })
  await generateLlmsFull({
    outputPath: path.join(process.cwd(), "public", "llms-full.text"),
    scanDirs: [
      {
        dir: path.join(process.cwd(), "app"),
        options: {
          before: [
            [
              crossProjectLinksPlugin,
              {
                baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
                projectUrls: {
                  resources: {
                    url: process.env.NEXT_PUBLIC_BASE_URL,
                  },
                  "user-guide": {
                    url: process.env.NEXT_PUBLIC_BASE_URL,
                  },
                  ui: {
                    url: process.env.NEXT_PUBLIC_BASE_URL,
                  },
                  api: {
                    url: process.env.NEXT_PUBLIC_BASE_URL,
                  },
                },
                useBaseUrl:
                  process.env.NODE_ENV === "production" ||
                  process.env.VERCEL_ENV === "production",
              },
            ],
            [localLinksRehypePlugin],
          ],
          after: [
            [addUrlToRelativeLink, { url: process.env.NEXT_PUBLIC_BASE_URL }],
          ],
        },
      },
      // {
      //   dir: path.join(
      //     process.cwd(),
      //     "..",
      //     "resources",
      //     "references",
      //     "core_flows"
      //   ),
      //   allowedFilesPatterns: [
      //     "core_flows.[^.]+.Steps",
      //     "core_flows.[^.]+.Workflows",
      //   ],
      // },
    ],
  })
}

void main()

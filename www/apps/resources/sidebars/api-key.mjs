/** @type {import('types').RawSidebarItem[]} */
export const apiKeySidebar = [
  {
    type: "category",
    title: "API Key Module",
    isChildSidebar: true,
    children: [
      {
        type: "link",
        path: "/commerce-modules/api-key",
        title: "Overview",
      },
      {
        type: "category",
        title: "Concepts",
        children: [
          {
            type: "link",
            path: "/commerce-modules/api-key/concepts",
            title: "API Key Concepts",
          },
          {
            type: "link",
            path: "/commerce-modules/api-key/links-to-other-modules",
            title: "Link to Modules",
          },
        ],
      },
      {
        type: "category",
        title: "Storefront Guides",
        autogenerate_tags: "storefront+apiKey",
      },
      {
        type: "category",
        title: "Admin Guides",
        autogenerate_tags: "admin+apiKey",
      },
      {
        type: "category",
        title: "User Guides",
        autogenerate_tags: "userGuide+apiKey",
      },
      {
        type: "category",
        title: "Workflows",
        autogenerate_tags: "workflow+apiKey",
      },
      {
        type: "category",
        title: "Steps",
        autogenerate_tags: "step+apiKey",
      },
      {
        type: "category",
        title: "References",
        children: [
          {
            type: "link",
            path: "/commerce-modules/api-key/admin-widget-zones",
            title: "Admin Widget Zones",
          },
          {
            type: "link",
            path: "/references/api-key",
            title: "Main Service Reference",
            isChildSidebar: true,
            childSidebarTitle: "API Key Module's Main Service Reference",
            children: [
              {
                type: "category",
                title: "Methods",
                hasTitleStyling: true,
                autogenerate_path:
                  "/references/api_key/IApiKeyModuleService/methods",
              },
            ],
          },
          {
            type: "link",
            path: "/references/api-key/models",
            title: "Data Models Reference",
            isChildSidebar: true,
            childSidebarTitle: "API Key Module Data Models Reference",
            children: [
              {
                type: "category",
                title: "Data Models",
                hasTitleStyling: true,
                autogenerate_path: "/references/api_key_models/variables",
              },
            ],
          },
        ],
      },
    ],
  },
]

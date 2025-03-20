import { model } from "@medusajs/framework/utils"

const Brand = model
  .define("Brand", {
    id: model.id().primaryKey(),
    name: model.text(),
  })

export default Brand

import { Outlet } from "react-router-dom"

export const ProductTypeDetail = () => {
  return (
    <div className="flex flex-col gap-y-3">
      <Outlet />
    </div>
  )
}

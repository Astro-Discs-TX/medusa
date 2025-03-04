import * as React from "react"
import { cleanup, render, screen } from "@testing-library/react"

import arrowRight from "../arrow-right"

describe("arrowRight", () => {
  it("should render the icon without errors", async () => {
    render(<arrowRight data-testid="icon" />)


    const svgElement = screen.getByTestId("icon")

    expect(svgElement).toBeInTheDocument()

    cleanup()
  })
})
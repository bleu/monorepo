import { DotIcon } from "@radix-ui/react-icons";
import { render, screen } from "@testing-library/react";

import { Button } from "#/components";
import { ButtonIcon } from "#/components/Button";

describe("Button component", () => {
  it("renders without crashing", () => {
    const { container } = render(<Button />);
    expect(container.firstChild).toBeDefined();
  });

  it("displays children", () => {
    render(<Button>Test Button</Button>);
    expect(screen.getByText("Test Button")).toBeInTheDocument();
  });

  it("displays ButtonIcon", () => {
    const { container } = render(
      <Button>
        <ButtonIcon icon={<DotIcon />} />
        Test Button
      </Button>
    );
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("applies predefined class for a given color, variant and shade", () => {
    const { rerender } = render(
      <Button color="blue" variant="solid" shade="light" />
    );
    expect(screen.getByRole("button")).toHaveClass(
      "bg-blue9 text-slate12 hover:bg-blue10 border-blue9"
    );

    rerender(<Button color="amber" variant="outline" shade="dark" />);
    expect(screen.getByRole("button")).toHaveClass(
      "bg-transparent text-amber10 border-amber3 hover:bg-amber2 hover:border-amber2"
    );
  });

  it("applies custom className", () => {
    render(<Button className="px-10" />);
    expect(screen.getByRole("button")).toHaveClass("px-10");
  });

  it("sets button to disabled state", () => {
    render(<Button disabled />);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});

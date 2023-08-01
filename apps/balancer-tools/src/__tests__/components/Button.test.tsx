import { DotIcon } from "@radix-ui/react-icons";
import { fireEvent, render, screen } from "@testing-library/react";

import { Button } from "#/components";
import { ButtonIcon, PREDEFINED_CLASSES } from "#/components/Button";

describe("Button component", () => {
  it("renders without crashing", () => {
    const { container } = render(<Button />);
    expect(container.firstChild).toBeDefined();
  });

  it("displays children", () => {
    render(<Button>Test Button</Button>);
    expect(screen.getByText("Test Button")).toBeInTheDocument();
  });

  it("positions the icon correctly", () => {
    const { rerender } = render(
      <Button>
        <ButtonIcon icon={<DotIcon />} />
        Test Button
      </Button>
    );
    const firstIconParent = screen.getByRole("button").querySelector("svg")?.parentElement;
    expect(firstIconParent).toHaveClass("mr-2");

    rerender(
      <Button>
        Test Button
        <ButtonIcon icon={<DotIcon />} />
      </Button>
    );
    const secondIconParent = screen.getByRole("button").querySelector("svg")?.parentElement;
    expect(secondIconParent).toHaveClass("ml-2");
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

  it("renders with default props", () => {
    const { getByRole } = render(<Button />);
    expect(getByRole("button")).toHaveClass(
      PREDEFINED_CLASSES.blue.solid.light,
      "rounded-md py-3 px-5 text-center text-sm font-semibold border focus-visible:outline-blue7 focus-visible:outline-offset-2 disabled:opacity-40"
    );
  });

  it("triggers onClick event", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick} />);
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalled();
  });
});

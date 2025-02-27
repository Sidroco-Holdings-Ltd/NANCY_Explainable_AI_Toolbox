import { render, screen } from "@testing-library/react";
import LogoLoader from "./LogoLoader";

// Mock Next.js Image component
jest.mock("next/image", () => {
  return ({ src, alt, width, height, className }: any) => {
    return (
      <img 
        src={typeof src === 'object' ? '/mocked-path.png' : src}
        alt={alt} 
        width={width} 
        height={height} 
        className={className}
        data-testid="next-image" 
      />
    );
  };
});

describe("LogoLoader Component", () => {
  test("renders without crashing", () => {
    render(<LogoLoader />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("renders logo image", () => {
    render(<LogoLoader />);
    const logoImage = screen.getByTestId("next-image");
    expect(logoImage).toBeInTheDocument();
    expect(logoImage).toHaveAttribute("alt", "Loading...");
  });

  test("applies animate-spin class to logo", () => {
    render(<LogoLoader />);
    const logoImage = screen.getByTestId("next-image");
    expect(logoImage.className).toContain("animate-spin");
  });

  test("centers content on screen", () => {
    render(<LogoLoader />);
    const containerDiv = screen.getByText("Loading...").parentElement?.parentElement;
    expect(containerDiv).toHaveClass("flex");
    expect(containerDiv).toHaveClass("items-center");
    expect(containerDiv).toHaveClass("justify-center");
  });
}); 
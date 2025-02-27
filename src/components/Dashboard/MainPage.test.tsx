import { render, screen } from "@testing-library/react";
import HomePage from "./MainPage"; // Note: This is importing the MainPage component

describe("MainPage Component", () => {
  test("renders welcome header", () => {
    render(<HomePage />);
    expect(screen.getByText("Welcome to Your Dashboard")).toBeInTheDocument();
  });

  test("renders feature sections", () => {
    render(<HomePage />);
    expect(screen.getByText("Feature 1")).toBeInTheDocument();
    expect(screen.getByText("Feature 2")).toBeInTheDocument();
    expect(screen.getByText("Feature 3")).toBeInTheDocument();
  });

  test("renders Why Choose Us section", () => {
    render(<HomePage />);
    expect(screen.getByText("Why Choose Us?")).toBeInTheDocument();
  });

  test("renders all placeholder images", () => {
    render(<HomePage />);
    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(3);
    
    expect(images[0]).toHaveAttribute("alt", "Feature 1");
    expect(images[1]).toHaveAttribute("alt", "Feature 2");
    expect(images[2]).toHaveAttribute("alt", "Feature 3");
  });

  test("applies animation classes", () => {
    render(<HomePage />);
    const welcomeHeader = screen.getByText("Welcome to Your Dashboard");
    expect(welcomeHeader).toHaveClass("animate-fade-in");
    
    const whyChooseUs = screen.getByText("Why Choose Us?");
    expect(whyChooseUs).toHaveClass("animate-fade-in");
  });
}); 
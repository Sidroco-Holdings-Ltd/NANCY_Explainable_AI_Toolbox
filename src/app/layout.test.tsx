import { render, screen, act } from "@testing-library/react";
import RootLayout from "./layout";

// Mock the Loader component
jest.mock("@/components/common/Loader", () => {
  return function MockLoader() {
    return <div data-testid="loader">Loading...</div>;
  };
});

describe("RootLayout Component", () => {
  beforeEach(() => {
    // Mock setTimeout
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  test("renders loader initially", () => {
    render(
      <RootLayout>
        <div data-testid="child-content">Content</div>
      </RootLayout>
    );

    // Check that loader is visible and child content is not
    expect(screen.getByTestId("loader")).toBeInTheDocument();
    expect(screen.queryByTestId("child-content")).not.toBeInTheDocument();
  });

  test("renders children after loading completes", () => {
    render(
      <RootLayout>
        <div data-testid="child-content">Content</div>
      </RootLayout>
    );

    // Fast-forward through the setTimeout
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Check that loader is gone and child content is visible
    expect(screen.queryByTestId("loader")).not.toBeInTheDocument();
    expect(screen.getByTestId("child-content")).toBeInTheDocument();
  });

  test("has correct HTML structure", () => {
    const { container } = render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    );

    // Check for html and body elements
    const html = container.querySelector("html");
    expect(html).toHaveAttribute("lang", "en");

    // Check for the dark theme container
    const darkThemeDiv = container.querySelector(".dark\\:bg-boxdark-2.dark\\:text-bodydark");
    expect(darkThemeDiv).toBeInTheDocument();
  });

  test("body has suppressHydrationWarning prop", () => {
    const { container } = render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    );

    const body = container.querySelector("body");
    expect(body).toHaveAttribute("suppresshydrationwarning", "true");
  });

  test("applies correct styling after loading", () => {
    render(
      <RootLayout>
        <div data-testid="child-content">Styled Content</div>
      </RootLayout>
    );

    // Fast-forward through the setTimeout
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    const darkThemeDiv = screen.getByText("Styled Content").closest(".dark\\:bg-boxdark-2.dark\\:text-bodydark");
    expect(darkThemeDiv).toBeInTheDocument();
  });
}); 
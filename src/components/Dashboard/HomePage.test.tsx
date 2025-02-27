import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HomePage from "./HomePage";

// Mock the usePathname hook
jest.mock("next/navigation", () => ({
  usePathname: () => "/dashboard/test-path",
}));

// Mock the LogoLoader component
jest.mock("./LogoLoader", () => {
  return function MockLogoLoader() {
    return <div data-testid="logo-loader">Loading...</div>;
  };
});

// Mock the NotFoundImage component
jest.mock("../../app/error-404", () => {
  return function MockNotFoundImage() {
    return <div data-testid="not-found">Not Found</div>;
  };
});

// Mock the CardDataStats component
jest.mock("../CardDataStats", () => {
  return function MockCardDataStats({ title, total, selected, rate }: any) {
    return (
      <div data-testid="card-data-stats">
        <span data-testid="card-title">{title}</span>
        <span data-testid="card-total">{total}</span>
        <span data-testid="card-selected">{selected ? "selected" : ""}</span>
        {rate}
      </div>
    );
  };
});

// Mock the SelectGroupTwo component
jest.mock("../SelectGroup/SelectGroupTwo", () => {
  return function MockSelectGroupTwo({ photos, isLoading, selectedOption }: any) {
    // Call photos function to simulate the component behavior
    const [photoData, index, jsonData] = photos();
    return (
      <div data-testid="select-group-two">
        <span data-testid="selected-option">{selectedOption}</span>
        <span data-testid="photo-index">{index}</span>
        <span data-testid="is-loading">{isLoading ? "loading" : "not-loading"}</span>
        <span data-testid="photo-count">{photoData ? photoData.length : 0}</span>
      </div>
    );
  };
});

describe("HomePage Component", () => {
  // Mock fetch before each test
  beforeEach(() => {
    // Mock successful API response
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            answer: {
              "Folder 1 [Group A]": [
                { path: "image1.png" },
                { path: "image2.png" },
              ],
              "Folder 2 [Group B]": [
                { path: "image3.png" },
                { path: "image4.png" },
              ],
            },
          }),
      })
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("renders loader initially", () => {
    render(<HomePage />);
    expect(screen.getByTestId("logo-loader")).toBeInTheDocument();
  });

  test("renders content after loading", async () => {
    jest.useFakeTimers();
    
    render(<HomePage />);
    
    // Fast-forward through the setTimeout delay
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    // Wait for the state updates to propagate
    await waitFor(() => {
      expect(screen.queryByTestId("logo-loader")).not.toBeInTheDocument();
    });
    
    // Verify content is rendered
    await waitFor(() => {
      expect(screen.getByTestId("select-group-two")).toBeInTheDocument();
    });
    
    jest.useRealTimers();
  });

  test("shows NotFoundImage when API returns empty data", async () => {
    // Mock empty response
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve({ answer: {} }),
      })
    );
    
    jest.useFakeTimers();
    
    render(<HomePage />);
    
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    await waitFor(() => {
      expect(screen.queryByTestId("logo-loader")).not.toBeInTheDocument();
      expect(screen.getByTestId("not-found")).toBeInTheDocument();
    });
    
    jest.useRealTimers();
  });

  test("shows NotFoundImage when API call fails", async () => {
    // Mock failed API call
    global.fetch = jest.fn().mockImplementation(() => Promise.reject(new Error("API Error")));
    
    jest.useFakeTimers();
    
    render(<HomePage />);
    
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    await waitFor(() => {
      expect(screen.queryByTestId("logo-loader")).not.toBeInTheDocument();
      expect(screen.getByTestId("not-found")).toBeInTheDocument();
    });
    
    jest.useRealTimers();
  });

  test("selects first option by default when data loads", async () => {
    jest.useFakeTimers();
    
    render(<HomePage />);
    
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    await waitFor(() => {
      const selectedOption = screen.getByTestId("selected-option");
      expect(selectedOption).toHaveTextContent("Folder 1 [Group A]");
    });
    
    jest.useRealTimers();
  });

  test("allows switching between options", async () => {
    jest.useFakeTimers();
    
    render(<HomePage />);
    
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    // Wait for rendering to complete
    await waitFor(() => {
      expect(screen.getAllByTestId("card-data-stats")).toHaveLength(2);
    });
    
    // Click on the second option
    const radioButtons = screen.getAllByRole("radio");
    userEvent.click(radioButtons[1]);
    
    await waitFor(() => {
      const selectedOption = screen.getByTestId("selected-option");
      expect(selectedOption).toHaveTextContent("Folder 2 [Group B]");
    });
    
    jest.useRealTimers();
  });
}); 
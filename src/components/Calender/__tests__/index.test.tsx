import { render, screen } from "@testing-library/react";
import Calendar from "../index";

// Mock the Breadcrumb component since we're only testing Calendar
jest.mock("../../Breadcrumbs/Breadcrumb", () => {
  return function MockBreadcrumb({ pageName }: { pageName: string }) {
    return <div data-testid="breadcrumb">{pageName}</div>;
  };
});

describe("Calendar Component", () => {
  test("renders without crashing", () => {
    render(<Calendar />);
    expect(screen.getByTestId("breadcrumb")).toBeInTheDocument();
  });

  test("renders breadcrumb with correct page name", () => {
    render(<Calendar />);
    expect(screen.getByTestId("breadcrumb")).toHaveTextContent("Calendar");
  });

  test("renders all days of the week", () => {
    render(<Calendar />);
    
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    
    daysOfWeek.forEach(day => {
      // Check for both full day name and abbreviated version
      const fullDayElement = screen.queryByText(day);
      const abbreviatedDay = day.substring(0, 3);
      const abbreviatedElement = screen.queryByText(abbreviatedDay);
      
      // Either the full day name or abbreviated version should be in the document
      expect(fullDayElement || abbreviatedElement).toBeInTheDocument();
    });
  });

  test("renders calendar with correct dates", () => {
    render(<Calendar />);
    
    // Check for dates 1-31
    for (let i = 1; i <= 31; i++) {
      // Use getAllByText instead of getByText since some numbers may appear multiple times
      const elements = screen.getAllByText(i.toString());
      // Expect at least one element with this text to exist
      expect(elements.length).toBeGreaterThan(0);
    }
  });

  test("renders events on specific dates", () => {
    render(<Calendar />);
    
    // Check for the "Redesign Website" event
    expect(screen.getByText("Redesign Website")).toBeInTheDocument();
    expect(screen.getByText("1 Dec - 2 Dec")).toBeInTheDocument();
    
    // Check for the "App Design" event
    expect(screen.getByText("App Design")).toBeInTheDocument();
    expect(screen.getByText("25 Dec - 27 Dec")).toBeInTheDocument();
  });
}); 
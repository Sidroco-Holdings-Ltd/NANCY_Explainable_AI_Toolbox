import { render, screen } from "@testing-library/react";
import ChatCard from "./ChatCard";

// Mock Next.js components
jest.mock("next/link", () => {
  return ({ href, className, children }: any) => {
    return (
      <a href={href} className={className} data-testid="next-link">
        {children}
      </a>
    );
  };
});

jest.mock("next/image", () => {
  return ({ src, alt, width, height, style }: any) => {
    return (
      <img 
        src={src} 
        alt={alt} 
        width={width} 
        height={height} 
        style={style}
        data-testid="next-image" 
      />
    );
  };
});

// Mock chat data for testing
jest.mock("@/types/chat", () => {
  return {
    __esModule: true
  };
});

describe("ChatCard Component", () => {
  test("renders without crashing", () => {
    render(<ChatCard />);
    expect(screen.getByText("Chats")).toBeInTheDocument();
  });

  test("renders correct number of chat items", () => {
    render(<ChatCard />);
    // The component has 6 chat items in the mock data
    const chatLinks = screen.getAllByTestId("next-link");
    expect(chatLinks).toHaveLength(6);
  });

  test("renders user avatars", () => {
    render(<ChatCard />);
    const avatars = screen.getAllByTestId("next-image");
    expect(avatars).toHaveLength(6);
  });

  test("renders user names", () => {
    render(<ChatCard />);
    expect(screen.getByText("Devid Heilo")).toBeInTheDocument();
    expect(screen.getByText("Henry Fisher")).toBeInTheDocument();
    expect(screen.getAllByText("Jhon Doe").length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
  });

  test("renders chat messages", () => {
    render(<ChatCard />);
    expect(screen.getAllByText("How are you?").length).toBeGreaterThanOrEqual(3);
    expect(screen.getByText("Waiting for you!")).toBeInTheDocument();
    expect(screen.getByText("What's up?")).toBeInTheDocument();
    expect(screen.getByText("Great")).toBeInTheDocument();
  });

  test("renders time information", () => {
    render(<ChatCard />);
    // Verify that time information is displayed
    expect(screen.getAllByText(/\. \d+ min/)).toHaveLength(6);
  });

  test("displays message counts for chats with unread messages", () => {
    render(<ChatCard />);
    
    // There should be 3 chats with unread messages (textCount > 0)
    // Devid Heilo (3), Jane Doe (2), and one Jhon Doe (3)
    const messageCounts = screen.getAllByText(count => count === "3" || count === "2");
    expect(messageCounts).toHaveLength(3);
  });

  test("does not display message counts for chats with no unread messages", () => {
    render(<ChatCard />);
    
    // We have 6 chats total, but only 3 have message counts
    const chatLinks = screen.getAllByTestId("next-link");
    const messageCounts = screen.getAllByText(count => count === "3" || count === "2" || count === "1");
    
    // Verify that not all chats have message count indicators
    expect(messageCounts.length).toBeLessThan(chatLinks.length);
  });
}); 
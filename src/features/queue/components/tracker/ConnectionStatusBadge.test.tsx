import { render, screen } from "@testing-library/react";
import { SOCKET_CONNECTION_STATUS } from "../../constants/websocket.constants";
import { ConnectionStatusBadge } from "./ConnectionStatusBadge";

describe("ConnectionStatusBadge", () => {
  it("renders distinct indicator labels for all socket connection states", () => {
    const { rerender } = render(
      <ConnectionStatusBadge status={SOCKET_CONNECTION_STATUS.CONNECTED} />,
    );
    expect(screen.getByText("Live")).toBeInTheDocument();

    rerender(<ConnectionStatusBadge status={SOCKET_CONNECTION_STATUS.RECONNECTING} />);
    expect(screen.getByText("Reconnecting...")).toBeInTheDocument();

    rerender(<ConnectionStatusBadge status={SOCKET_CONNECTION_STATUS.CONNECTING} />);
    expect(screen.getByText("Connecting...")).toBeInTheDocument();

    rerender(<ConnectionStatusBadge status={SOCKET_CONNECTION_STATUS.DISCONNECTED} />);
    expect(screen.getByText("Disconnected")).toBeInTheDocument();
  });
});

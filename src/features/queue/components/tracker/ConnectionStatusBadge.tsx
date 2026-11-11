import {
  SOCKET_CONNECTION_STATUS,
  type SocketConnectionStatus,
} from "../../constants/websocket.constants";

export interface ConnectionStatusBadgeProps {
  status: SocketConnectionStatus;
}

export function ConnectionStatusBadge({ status }: ConnectionStatusBadgeProps) {
  if (status === SOCKET_CONNECTION_STATUS.CONNECTED) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 border border-emerald-200/60 shadow-xs">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        Live
      </span>
    );
  }

  if (status === SOCKET_CONNECTION_STATUS.RECONNECTING) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 border border-amber-200/60 shadow-xs">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
        </span>
        Reconnecting...
      </span>
    );
  }

  if (status === SOCKET_CONNECTION_STATUS.DISCONNECTED) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700 border border-rose-200/70">
        <span className="h-2 w-2 rounded-full bg-rose-500" />
        Disconnected
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-600 border border-stone-200">
      <span className="h-2 w-2 rounded-full bg-stone-400" />
      Connecting...
    </span>
  );
}

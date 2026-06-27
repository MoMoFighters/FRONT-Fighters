type StompMessageHandler = (body: string) => void;

interface StompSubscription {
    unsubscribe: () => void;
}

interface StompClient {
    subscribe: (
        destination: string,
        onMessage: StompMessageHandler
    ) => StompSubscription;
    disconnect: () => void;
}

const getStompUrl = () => {
    if (process.env.NEXT_PUBLIC_STOMP_URL) {
        return process.env.NEXT_PUBLIC_STOMP_URL;
    }

    if (process.env.NEXT_PUBLIC_SOCKET_URL) {
        return `${process.env.NEXT_PUBLIC_SOCKET_URL.replace(/\/$/, "")}/ws`;
    }

    const apiBaseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

    return `${apiBaseUrl.replace(/^http/, "ws").replace(/\/$/, "")}/ws`;
};

const createFrame = (
    command: string,
    headers: Record<string, string> = {},
    body = ""
) => {
    const headerLines =
        Object.entries(headers)
            .map(([key, value]) => `${key}:${value}`)
            .join("\n");

    return `${command}\n${headerLines}\n\n${body}\0`;
};

const parseFrames = (data: string) =>
    data
        .split("\0")
        .map((frame) => frame.trim())
        .filter(Boolean)
        .map((frame) => {
            const separatorIndex = frame.indexOf("\n\n");
            const head =
                separatorIndex >= 0
                    ? frame.slice(0, separatorIndex)
                    : frame;
            const body =
                separatorIndex >= 0
                    ? frame.slice(separatorIndex + 2)
                    : "";
            const [command, ...headerLines] = head.split("\n");
            const headers =
                Object.fromEntries(
                    headerLines.map((line) => {
                        const index = line.indexOf(":");
                        return [
                            line.slice(0, index),
                            line.slice(index + 1),
                        ];
                    })
                );

            return {
                command,
                headers,
                body,
            };
        });

export const connectNoticeStomp = ({
    accessToken,
    onConnect,
}: {
    accessToken: string;
    onConnect: (client: StompClient) => void;
}) => {
    const socket = new WebSocket(getStompUrl());
    const handlers = new Map<string, StompMessageHandler>();
    let subscriptionSequence = 0;

    const client: StompClient = {
        subscribe: (destination, onMessage) => {
            subscriptionSequence += 1;
            const id = `notice-sub-${subscriptionSequence}`;

            handlers.set(id, onMessage);

            socket.send(
                createFrame("SUBSCRIBE", {
                    id,
                    destination,
                    ack: "auto",
                })
            );

            return {
                unsubscribe: () => {
                    if (!handlers.has(id)) {
                        return;
                    }

                    handlers.delete(id);

                    if (socket.readyState === WebSocket.OPEN) {
                        socket.send(
                            createFrame("UNSUBSCRIBE", {
                                id,
                            })
                        );
                    }
                },
            };
        },
        disconnect: () => {
            handlers.clear();

            if (socket.readyState === WebSocket.OPEN) {
                socket.send(createFrame("DISCONNECT"));
            }

            socket.close();
        },
    };

    socket.addEventListener("open", () => {
        socket.send(
            createFrame("CONNECT", {
                "accept-version": "1.2",
                host: window.location.host,
                Authorization: `Bearer ${accessToken}`,
            })
        );
    });

    socket.addEventListener("message", (event) => {
        const frames = parseFrames(String(event.data));

        frames.forEach((frame) => {
            if (frame.command === "CONNECTED") {
                onConnect(client);
                return;
            }

            if (frame.command !== "MESSAGE") {
                return;
            }

            const subscriptionId =
                frame.headers.subscription ?? frame.headers["subscription-id"];
            const handler =
                subscriptionId ? handlers.get(subscriptionId) : undefined;

            handler?.(frame.body);
        });
    });

    return client;
};

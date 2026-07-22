"use client";

import { Client, type StompSubscription } from "@stomp/stompjs";

type StompMessageHandler = (body: string) => void;

export interface MomoStompClient {
    subscribe: (
        destination: string,
        onMessage: StompMessageHandler
    ) => StompSubscription;
    publish: (destination: string, body: string) => void;
    disconnect: () => void;
}

const DEFAULT_STOMP_ENDPOINT = "/ws-chat";

let sharedStompClient: Client | null = null;
let sharedAccessToken: string | null = null;
let isConnected = false;
let referenceCount = 0;
const connectListeners = new Set<(client: MomoStompClient) => void>();

const getRawStompUrl = () => {
    if (process.env.NEXT_PUBLIC_STOMP_URL) {
        return process.env.NEXT_PUBLIC_STOMP_URL;
    }

    if (process.env.NEXT_PUBLIC_SOCKET_URL) {
        return `${process.env.NEXT_PUBLIC_SOCKET_URL.replace(/\/$/, "")}${DEFAULT_STOMP_ENDPOINT}`;
    }

    const apiBaseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

    return `${apiBaseUrl.replace(/\/$/, "")}${DEFAULT_STOMP_ENDPOINT}`;
};

const appendTokenQuery = (url: string, accessToken: string) => {
    const separator = url.includes("?") ? "&" : "?";

    return `${url}${separator}token=${encodeURIComponent(accessToken)}`;
};

const getWebSocketUrl = (accessToken: string) =>
    appendTokenQuery(
        getRawStompUrl()
            .replace(/^http:\/\//, "ws://")
            .replace(/^https:\/\//, "wss://"),
        accessToken
    );

const getAuthHeaders = (accessToken: string) => ({
    Authorization: `Bearer ${accessToken}`,
});

const deactivateSharedClient = () => {
    if (!sharedStompClient) {
        return;
    }

    void sharedStompClient.deactivate();
    sharedStompClient = null;
    sharedAccessToken = null;
    isConnected = false;
    connectListeners.clear();
};

const createClientProxy = (): MomoStompClient => ({
    subscribe: (destination, onMessage) => {
        if (!sharedStompClient || !isConnected) {
            throw new Error("STOMP 연결이 완료되지 않았습니다.");
        }

        return sharedStompClient.subscribe(
            destination,
            (message) => {
                onMessage(message.body);
            },
            sharedAccessToken
                ? getAuthHeaders(sharedAccessToken)
                : undefined
        );
    },
    publish: (destination, body) => {
        if (!sharedStompClient || !isConnected) {
            throw new Error("STOMP 연결이 완료되지 않았습니다.");
        }

        sharedStompClient.publish({
            destination,
            body,
            headers: sharedAccessToken
                ? getAuthHeaders(sharedAccessToken)
                : undefined,
        });
    },
    disconnect: () => {
        referenceCount = Math.max(referenceCount - 1, 0);

        if (referenceCount === 0) {
            deactivateSharedClient();
        }
    },
});

const createSharedStompClient = (accessToken: string) => {
    sharedAccessToken = accessToken;
    isConnected = false;
    sharedStompClient = new Client({
        brokerURL: getWebSocketUrl(accessToken),
        connectHeaders: getAuthHeaders(accessToken),
        reconnectDelay: 5000,
        heartbeatIncoming: 10000,
        heartbeatOutgoing: 10000,
    });

    sharedStompClient.onConnect = () => {
        isConnected = true;
        console.info("[STOMP] connected");

        const client = createClientProxy();
        connectListeners.forEach((listener) => listener(client));
        connectListeners.clear();
    };

    sharedStompClient.onStompError = (frame) => {
        console.error("[STOMP] broker error", frame.headers.message, frame.body);
    };

    sharedStompClient.onWebSocketError = (event) => {
        console.error("[STOMP] websocket error", event);
    };

    sharedStompClient.onWebSocketClose = (event) => {
        isConnected = false;
        console.warn("[STOMP] websocket closed", {
            code: event.code,
            reason: event.reason,
            wasClean: event.wasClean,
        });
    };

    sharedStompClient.activate();
};

export const connectNoticeStomp = ({
    accessToken,
    onConnect,
}: {
    accessToken: string;
    onConnect: (client: MomoStompClient) => void;
}) => {
    referenceCount += 1;

    if (sharedAccessToken && sharedAccessToken !== accessToken) {
        deactivateSharedClient();
    }

    if (!sharedStompClient) {
        createSharedStompClient(accessToken);
    }

    const proxy = createClientProxy();
    const client: MomoStompClient = {
        subscribe: proxy.subscribe,
        publish: proxy.publish,
        disconnect: () => {
            connectListeners.delete(onConnect);
            referenceCount = Math.max(referenceCount - 1, 0);

            if (referenceCount === 0) {
                deactivateSharedClient();
            }
        },
    };

    if (isConnected) {
        queueMicrotask(() => onConnect(client));
    } else {
        connectListeners.add(onConnect);
    }

    return client;
};

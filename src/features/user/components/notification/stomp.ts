"use client";

import { Client, type StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";

type StompMessageHandler = (body: string) => void;

interface MomoStompClient {
    subscribe: (
        destination: string,
        onMessage: StompMessageHandler
    ) => StompSubscription;
    disconnect: () => void;
}

const getRawStompUrl = () => {
    if (process.env.NEXT_PUBLIC_STOMP_URL) {
        return process.env.NEXT_PUBLIC_STOMP_URL;
    }

    if (process.env.NEXT_PUBLIC_SOCKET_URL) {
        return `${process.env.NEXT_PUBLIC_SOCKET_URL.replace(/\/$/, "")}/ws`;
    }

    const apiBaseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

    return `${apiBaseUrl.replace(/\/$/, "")}/ws`;
};

const getWebSocketUrl = () =>
    getRawStompUrl()
        .replace(/^http:\/\//, "ws://")
        .replace(/^https:\/\//, "wss://");

const getSockJsUrl = () =>
    getRawStompUrl()
        .replace(/^ws:\/\//, "http://")
        .replace(/^wss:\/\//, "https://");

const shouldUseSockJs = () =>
    process.env.NEXT_PUBLIC_STOMP_TRANSPORT === "sockjs";

export const connectNoticeStomp = ({
    accessToken,
    onConnect,
}: {
    accessToken: string;
    onConnect: (client: MomoStompClient) => void;
}) => {
    const stompClient = new Client({
        brokerURL: shouldUseSockJs() ? undefined : getWebSocketUrl(),
        connectHeaders: {
            Authorization: `Bearer ${accessToken}`,
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 10000,
        heartbeatOutgoing: 10000,
        webSocketFactory: shouldUseSockJs()
            ? () => new SockJS(getSockJsUrl())
            : undefined,
        debug: () => undefined,
    });

    const client: MomoStompClient = {
        subscribe: (destination, onMessage) =>
            stompClient.subscribe(destination, (message) => {
                onMessage(message.body);
            }),
        disconnect: () => {
            void stompClient.deactivate();
        },
    };

    stompClient.onConnect = () => {
        console.info("[STOMP] connected");
        onConnect(client);
    };

    stompClient.onStompError = (frame) => {
        console.error("[STOMP] broker error", frame.headers.message, frame.body);
    };

    stompClient.onWebSocketError = (event) => {
        console.error("[STOMP] websocket error", event);
    };

    stompClient.onWebSocketClose = (event) => {
        console.warn("[STOMP] websocket closed", {
            code: event.code,
            reason: event.reason,
            wasClean: event.wasClean,
        });
    };

    stompClient.activate();

    return client;
};

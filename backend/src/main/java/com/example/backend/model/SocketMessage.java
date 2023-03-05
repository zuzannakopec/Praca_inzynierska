package com.example.backend.model;

import lombok.Getter;

@Getter
public class SocketMessage {
    private String message;
    private Long chatroomId;
    private boolean isCode;
    private String codeType;
}

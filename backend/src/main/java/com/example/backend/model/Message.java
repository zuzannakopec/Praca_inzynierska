package com.example.backend.model;

import lombok.Data;

import javax.persistence.*;

@Entity
@Data
@Table(name = "Message")
public class Message {
    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    Long id;
    String text;
    @OneToOne(
            cascade = {CascadeType.MERGE}
    )
    Chatroom chatroom;
    @OneToOne(
            cascade = {CascadeType.MERGE}
    )
    User user;

}

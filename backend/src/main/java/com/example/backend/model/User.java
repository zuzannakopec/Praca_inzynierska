package com.example.backend.model;


import lombok.*;

import javax.persistence.*;
import java.security.PublicKey;

@Entity
@Table(name = "User")
@Data
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(
            strategy = GenerationType.IDENTITY
    )
    private Long id;
    @Column(unique = true)
    private String email;
    @Column(length = 65535,columnDefinition="Text")
    private String password;
    private String name;
    private String surname;
    private String position;
    @Column(length = 65535,columnDefinition="Text")
    private String pin;
    @Column(length = 65535,columnDefinition="Text")
    private String publicKey;
}

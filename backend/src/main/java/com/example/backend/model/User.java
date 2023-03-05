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
    private String password;
    private String name;
    private String surname;
    private String position;
    private String profilePicture;
    private String jwt;
    private Integer pin;
    private String publicKey;
}

package com.example.backend.model;

import lombok.*;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Data
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserJWT {
    private Long id;
    private String email;
    private String password;
    private String name;
    private String surname;
    private String position;
    private String pin;
    private String jwt;
    private String publicKey;

    public UserJWT(User user){
        this.id = user.getId();
        this.email = user.getEmail();
        this.password = user.getPassword();
        this.name = user.getName();
        this.surname = user.getSurname();
        this.position = user.getPosition();
        this.pin = user.getPin();
        this.publicKey = user.getPublicKey();
    }
}

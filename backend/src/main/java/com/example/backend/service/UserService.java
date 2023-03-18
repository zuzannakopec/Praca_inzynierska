package com.example.backend.service;


import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;
import com.example.backend.exception.EmailAlreadyExistsException;
import com.example.backend.exception.ValidationException;
import com.example.backend.model.*;
import com.example.backend.model.dto.UserDto;
import com.example.backend.repository.UserRepository;
import com.example.backend.utils.Validator;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.NoSuchAlgorithmException;
import java.time.Duration;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final Validator validator;
    private final String key = "8y/B?E(H+MbQeThWmZq4t6w9z$C&F)J@";


    public ResponseEntity<UserJWT> login(UserDto userDto) {
        User actualUser = userRepository.findByEmail(userDto.getEmail());
        Instant now = Instant.now();
        Instant expirationTime = now.plus(Duration.ofDays(30));

        if(actualUser == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        if(!encoder().matches(userDto.getPassword(), actualUser.getPassword())){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        String token;
        try{
            Algorithm algorithm = Algorithm.HMAC256(key);
            token = JWT.create()
                    .withIssuedAt(Instant.now())
                    .withIssuer("server")
                    .withExpiresAt(expirationTime)
                    .sign(algorithm);
        } catch (JWTCreationException exception){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        UserJWT result = new UserJWT(actualUser);
        result.setJwt(token);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    public boolean isJWTValid(String token){
        Algorithm algorithm = Algorithm.HMAC256(key);
        JWTVerifier verifier = JWT.require(algorithm)
                .withIssuer("server")
                .build();
        try{
            DecodedJWT decodedJWT = verifier.verify(token);
        } catch (Exception e){
            return false;
        }
        return true;
    }

    public ResponseEntity<String> register(UserDto userDto) throws ValidationException, EmailAlreadyExistsException, NoSuchAlgorithmException {
        validateRequest(userDto);
        String hashedPassword = this.encoder().encode(userDto.getPassword());
        User user = new User();
        user.setEmail(userDto.getEmail());
        user.setPassword(hashedPassword);
        user.setPublicKey(userDto.getPublicKey());
        userRepository.save(user);
        return new ResponseEntity<>("Register complete", HttpStatus.OK);
    }

    public Optional<User> findById(Long id) {return userRepository.findById(id);}

    public String getPin(PinInfo pinInfo){
        Optional<User> user = userRepository.findById(pinInfo.getId());
        return user.get().getPin();
    }

    public User update(UserDetails userDetails){
        User user = userRepository.findByEmail(userDetails.getEmail());
        user.setName(userDetails.getName());
        user.setPosition(userDetails.getPosition());
        user.setSurname(user.getSurname());
        userRepository.save(user);
        return user;
    }

    public void updatePin(PinInfo pinInfo){
        Optional<User> optionalUser = userRepository.findById(pinInfo.getId());
        User user = optionalUser.get();
        user.setPin(pinInfo.getPin());
        userRepository.save(user);
    }

    public String getPublicKey(Long id){
        return userRepository.findById(id).get().getPublicKey();
    }

    public List<User> search(String query){
        query = query.substring(0, query.length() - 1);
        List<User> foundUsersByName = userRepository.findByNameContaining(query);
        List<User> foundUsersBySurname = userRepository.findBySurnameContaining(query);
        List<User> foundUsersByEmail = userRepository.findByEmailContaining(query);
        return Stream.of(foundUsersByName, foundUsersBySurname, foundUsersByEmail)
                .flatMap(Collection::stream)
                .collect(Collectors.toList());
    }

    private void validateRequest(UserDto userDto) throws ValidationException, EmailAlreadyExistsException {
        if (!this.validator.isPasswordValid(userDto.getPassword(), userDto.getSecondPassword())) {
            throw new ValidationException("Provided passwords don't match");
        }
        checkIfEmailExists(userDto.getEmail());
    }


    private void checkIfEmailExists(String email) throws EmailAlreadyExistsException {
        if (this.userRepository.existsByEmail(email)) {
            throw new EmailAlreadyExistsException("User with provided email already exist.");
        }
    }

    @Bean
    private PasswordEncoder encoder() {
        return new BCryptPasswordEncoder();
    }

    public List<User> getAll() {
        return this.userRepository.findAll();
    }

    public User findByEmail(String email) {
        return this.userRepository.findByEmail(email);
    }


}

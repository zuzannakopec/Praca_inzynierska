package com.example.backend.service;


import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.example.backend.exception.EmailAlreadyExistsException;
import com.example.backend.exception.ValidationException;
import com.example.backend.model.PinInfo;
import com.example.backend.model.User;
import com.example.backend.model.UserDetails;
import com.example.backend.model.dto.UserDto;
import com.example.backend.repository.UserRepository;
import com.example.backend.utils.Validator;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.time.Instant;
import java.util.Base64;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final Validator validator;
    private final String key = "8y/B?E(H+MbQeThWmZq4t6w9z$C&F)J@";


    public ResponseEntity<User> login(UserDto userDto) {
        User actualUser = userRepository.findByEmail(userDto.getEmail());
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
                    .sign(algorithm);
        } catch (JWTCreationException exception){
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }
        actualUser.setJwt(token);
        return new ResponseEntity<>(actualUser, HttpStatus.OK);
    }

    public String hashValue(String email) {
        return this.userRepository.findHashValueByEmail(email);
    }

    public ResponseEntity<String> register(UserDto userDto) throws ValidationException, EmailAlreadyExistsException, NoSuchAlgorithmException {
        validateRequest(userDto);
        checkIfEmailExists(userDto.getEmail());
        String hashedPassword = this.encoder().encode(userDto.getPassword());
        User user = new User();
        user.setEmail(userDto.getEmail());
        user.setPassword(hashedPassword);

        KeyPairGenerator generator = KeyPairGenerator.getInstance("RSA");
        generator.initialize(2048);
        KeyPair pair = generator.generateKeyPair();
        String encodedPublicKey = Base64.getEncoder().encodeToString(pair.getPublic().getEncoded());

        user.setPublicKey(encodedPublicKey);
        userRepository.save(user);
        return new ResponseEntity<>(Base64.getEncoder().encodeToString(pair.getPublic().getEncoded()), HttpStatus.OK);
    }

    public Optional<User> findById(Long id) {return userRepository.findById(id);}

    public boolean validatePin(PinInfo pinInfo){
        Optional<User> user = userRepository.findById(pinInfo.getId());
        return Objects.equals(pinInfo.getPin(), user.get().getPin());
    }

    public User update(UserDetails userDetails){
        User user = userRepository.findByEmail(userDetails.getEmail());
        user.setName(userDetails.getName());
        user.setPosition(userDetails.getPosition());
        user.setProfilePicture(user.getProfilePicture());
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

    private void validateRequest(UserDto userDto) throws ValidationException {
        if (!this.validator.isPasswordValid(userDto.getPassword(), userDto.getSecondPassword())) {
            throw new ValidationException("Provided passwords don't match");
        }
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

package com.example.backend.service;


import com.example.backend.exception.EmailAlreadyExistsException;
import com.example.backend.exception.ValidationException;
import com.example.backend.model.User;
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

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final Validator validator;

    public ResponseEntity<User> login(UserDto userDto) {
        User actualUser = userRepository.findByEmail(userDto.getEmail());
        if(actualUser == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(actualUser, HttpStatus.OK);
       /* TODO: Enable authentication
        if(!encoder().matches(userDto.getPassword(), actualUser.getPassword())){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(actualUser, HttpStatus.OK);*/
    }

    public String hashValue(String email) {
        return this.userRepository.findHashValueByEmail(email);
    }

    public ResponseEntity<String> register(UserDto userDto) throws ValidationException, EmailAlreadyExistsException {
        validateRequest(userDto);
        checkIfEmailExists(userDto.getEmail());
        String hashedPassword = this.encoder().encode(userDto.getPassword());
        User user = new User();
        user.setEmail(userDto.getEmail());
        user.setPassword(hashedPassword);
        this.userRepository.save(user);
        return new ResponseEntity("User register successful", HttpStatus.OK);
    }

    public List<User> getAll() {
        return this.userRepository.findAll();
    }

    public User findByEmail(String email) {
        return this.userRepository.findByEmail(email);
    }

    public Optional<User> findById(Long id) {return userRepository.findById(id);}
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


}

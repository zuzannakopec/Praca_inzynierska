package com.example.backend.controller;

import com.example.backend.exception.EmailAlreadyExistsException;
import com.example.backend.exception.ValidationException;
import com.example.backend.model.PinInfo;
import com.example.backend.model.User;
import com.example.backend.model.UserDetails;
import com.example.backend.model.UserJWT;
import com.example.backend.model.dto.UserDto;
import com.example.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.util.List;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
@Log
public class UserController {
    private final UserService userService;

    @PostMapping("/login")
    ResponseEntity<UserJWT> login(@RequestBody UserDto userDto) {
        return userService.login(userDto);
    }


    @PostMapping("/register")
    ResponseEntity<String> register(@RequestBody UserDto userDto) throws ValidationException, EmailAlreadyExistsException, NoSuchAlgorithmException {
        log.info("Registering user");
        return userService.register(userDto);
    }

    @PostMapping("/pin")
    ResponseEntity<String> pin(@RequestBody PinInfo pinInfo, HttpServletRequest request) {
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (authHeader == null) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
        if(userService.isJWTValid(authHeader.substring(7))){
            return new ResponseEntity<>(userService.getPin(pinInfo), HttpStatus.OK);
        }
        return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
    }

    @PutMapping("/update")
    ResponseEntity<User> update(@RequestBody UserDetails userDetails){
        return new ResponseEntity<User>(userService.update(userDetails), HttpStatus.OK);
    }

    @PutMapping("/pin")
    ResponseEntity<String> updatePin(@RequestBody PinInfo pinInfo){
        userService.updatePin(pinInfo);
        return new ResponseEntity<String>("New pin saved", HttpStatus.OK);
    }


    @GetMapping("/getAll")
    ResponseEntity<List<User>> findAll() {
        return new ResponseEntity<>(userService.getAll(), HttpStatus.OK);
    }

    @GetMapping("/getPublicKey/{userId}")
    ResponseEntity<String> publicKey(@PathVariable int userId, HttpServletRequest request) {
        return new ResponseEntity<>(userService.getPublicKey((long) userId), HttpStatus.OK);
    }

    @GetMapping("/getId/{email}")
    ResponseEntity<Long> findUserId(@PathVariable String email){
        Long id = userService.findByEmail(email).getId();
        return new ResponseEntity<>(id, HttpStatus.OK);
    }

    @PostMapping("/search")
    ResponseEntity<List<User>> search(@RequestBody String query){
        return new ResponseEntity<>(userService.search(query), HttpStatus.OK);
    }
}

package com.example.backend.controller;

import com.example.backend.exception.EmailAlreadyExistsException;
import com.example.backend.exception.ValidationException;
import com.example.backend.model.User;
import com.example.backend.model.dto.UserDto;
import com.example.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
@Log
public class UserController {
    private final UserService userService;

    @PostMapping("/login")
    ResponseEntity<String> login(@RequestBody UserDto userDto) {
        return userService.login(userDto);
    }

    @GetMapping("/hashValue")
    ResponseEntity<String> hashValue(@PathVariable String email) {
        String result = this.userService.hashValue(email);
        return result.isEmpty() ? new ResponseEntity("Not found", HttpStatus.NOT_FOUND) : new ResponseEntity(result, HttpStatus.OK);
    }

    @PostMapping("/register")
    ResponseEntity<String> register(@RequestBody UserDto userDto) throws ValidationException, EmailAlreadyExistsException {
        log.info("Registering user");
        return userService.register(userDto);
    }

    @GetMapping("/getAll")
    ResponseEntity<List<User>> getAll() {
        return new ResponseEntity(userService.getAll(), HttpStatus.OK);
    }

    @GetMapping("/getId/{email}")
    ResponseEntity<Long> findUserId(@PathVariable String email){
        Long id = userService.findByEmail(email).getId();
        return new ResponseEntity(id, HttpStatus.OK);
    }
}

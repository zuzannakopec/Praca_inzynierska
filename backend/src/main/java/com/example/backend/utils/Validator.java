package com.example.backend.utils;


import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.springframework.stereotype.Component;

@Component
public class Validator {
    public Validator() {
    }

    public boolean isEmailValid(String email) {
        String emailPattern = "^[_A-Za-z0-9-+]+ (.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(.[A-Za-z0-9]+)* (.[A-Za-z]{2,})$";
        Pattern pattern = Pattern.compile("^[_A-Za-z0-9-+]+ (.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(.[A-Za-z0-9]+)* (.[A-Za-z]{2,})$");
        Matcher matcher = pattern.matcher(email);
        return matcher.matches();
    }

    public boolean isPasswordValid(String password, String secondPassword) {
        return password.equals(secondPassword);
    }
}

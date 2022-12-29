//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by FernFlower decompiler)
//

package com.example.backend.model.dto;

import com.sun.istack.NotNull;
import lombok.Data;

@Data
public class UserDto {
    @NotNull
    String email;
    @NotNull
    String password;
    @NotNull
    String secondPassword;

}

package com.example.backend.model;

import javax.persistence.CascadeType;
import javax.persistence.Id;
import javax.persistence.OneToOne;
import javax.persistence.PrimaryKeyJoinColumn;

public class HashValue {
    @Id
    String value;
    @OneToOne(
            cascade = {CascadeType.ALL}
    )
    @PrimaryKeyJoinColumn
    Long userId;

    public HashValue() {
    }
}

package com.lms.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DomainRequest {

    @NotBlank(message = "Domain is required")
    private String domain;
}

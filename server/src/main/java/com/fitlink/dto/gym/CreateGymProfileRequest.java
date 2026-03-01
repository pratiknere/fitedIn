package com.fitlink.dto.gym;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateGymProfileRequest {

    @NotBlank(message = "Gym name is required")
    private String gymName;

    @NotBlank(message = "Address is required")
    private String address;

    private String facilities;

    private String description;
}

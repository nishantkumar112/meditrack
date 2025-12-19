package com.meditrack.controller;

import com.meditrack.dto.ApiResponse;
import com.meditrack.entity.User;
import com.meditrack.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCurrentUser() {
        User user = userService.getCurrentUser();
        Map<String, Object> userData = new HashMap<>();
        userData.put("id", user.getId());
        userData.put("email", user.getEmail());
        userData.put("firstName", user.getFirstName());
        userData.put("lastName", user.getLastName());
        userData.put("phoneNumber", user.getPhoneNumber());
        userData.put("mfaEnabled", user.getMfaEnabled());
        return ResponseEntity.ok(ApiResponse.success(userData, "User profile retrieved successfully"));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<Map<String, Object>>> updateProfile(
            @RequestParam String firstName,
            @RequestParam String lastName,
            @RequestParam(required = false) String phoneNumber) {
        User user = userService.updateProfile(firstName, lastName, phoneNumber);
        Map<String, Object> userData = new HashMap<>();
        userData.put("id", user.getId());
        userData.put("email", user.getEmail());
        userData.put("firstName", user.getFirstName());
        userData.put("lastName", user.getLastName());
        userData.put("phoneNumber", user.getPhoneNumber());
        return ResponseEntity.ok(ApiResponse.success(userData, "Profile updated successfully"));
    }

    @PostMapping("/me/toggle-mfa")
    public ResponseEntity<ApiResponse<Map<String, Object>>> toggleMfa() {
        User user = userService.toggleMfa();
        Map<String, Object> response = new HashMap<>();
        response.put("mfaEnabled", user.getMfaEnabled());
        String message = user.getMfaEnabled() ? "MFA enabled successfully" : "MFA disabled successfully";
        return ResponseEntity.ok(ApiResponse.success(response, message));
    }
}


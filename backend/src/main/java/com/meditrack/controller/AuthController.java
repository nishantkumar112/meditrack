package com.meditrack.controller;

import com.meditrack.dto.ApiResponse;
import com.meditrack.dto.AuthResponse;
import com.meditrack.dto.LoginRequest;
import com.meditrack.dto.OtpRequest;
import com.meditrack.dto.OtpVerifyRequest;
import com.meditrack.dto.RegisterRequest;
import com.meditrack.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

	private final AuthService authService;

	@PostMapping("/register")
	public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
		AuthResponse response = authService.register(request);
		return ResponseEntity.status(HttpStatus.CREATED)
				.body(ApiResponse.success(response, "User registered successfully"));
	}

	@PostMapping("/login")
	public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
		AuthResponse response = authService.login(request);
		return ResponseEntity.ok(ApiResponse.success(response, "Login successful"));
	}

	@PostMapping("/request-otp")
	public ResponseEntity<ApiResponse<String>> requestOtp(@Valid @RequestBody OtpRequest request) {
		authService.requestOtp(request.getEmail());
		return ResponseEntity.ok(ApiResponse.success("OTP sent successfully", "OTP has been sent to your email"));
	}

	@PostMapping("/verify-otp")
	public ResponseEntity<ApiResponse<AuthResponse>> verifyOtp(@Valid @RequestBody OtpVerifyRequest request) {
		AuthResponse response = authService.verifyOtp(request.getEmail(), request.getOtp());
		return ResponseEntity.ok(ApiResponse.success(response, "OTP verified successfully"));
	}
}

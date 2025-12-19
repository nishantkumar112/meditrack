package com.meditrack.service;

import com.meditrack.dto.AuthResponse;
import com.meditrack.dto.LoginRequest;
import com.meditrack.dto.RegisterRequest;
import com.meditrack.entity.User;
import com.meditrack.exception.BadRequestException;
import com.meditrack.exception.UnauthorizedException;
import com.meditrack.repository.UserRepository;
import com.meditrack.security.JwtTokenProvider;
import com.meditrack.util.NotificationService;
import com.meditrack.util.OtpService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final AuthenticationManager authenticationManager;
    private final OtpService otpService;
    private final NotificationService notificationService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phoneNumber(request.getPhoneNumber())
                .enabled(true)
                .mfaEnabled(false)
                .roles(new HashSet<>())
                .build();

        user.getRoles().add(User.Role.USER);
        user = userRepository.save(user);

        String token = tokenProvider.generateToken(user.getEmail(), user.getId());

        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .mfaRequired(false)
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));

            if (!user.getEnabled()) {
                throw new UnauthorizedException("Account is disabled");
            }

            boolean mfaRequired = user.getMfaEnabled();
            String token = null;

            if (!mfaRequired) {
                token = tokenProvider.generateToken(user.getEmail(), user.getId());
            }

            return AuthResponse.builder()
                    .token(token)
                    .userId(user.getId())
                    .email(user.getEmail())
                    .firstName(user.getFirstName())
                    .lastName(user.getLastName())
                    .mfaRequired(mfaRequired)
                    .build();
        } catch (Exception e) {
            throw new UnauthorizedException("Invalid email or password");
        }
    }

    public void requestOtp(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found"));

        String otp = otpService.generateOtp(email);

        // Send OTP via email
        notificationService.sendOtpEmail(email, otp);

        // Send OTP via SMS if phone number is available
        if (user.getPhoneNumber() != null && !user.getPhoneNumber().isEmpty()) {
            notificationService.sendOtpSms(user.getPhoneNumber(), otp);
        }
    }

    public AuthResponse verifyOtp(String email, String otp) {
        if (!otpService.verifyOtp(email, otp)) {
            throw new UnauthorizedException("Invalid or expired OTP");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found"));

        String token = tokenProvider.generateToken(user.getEmail(), user.getId());

        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .mfaRequired(false)
                .build();
    }
}


package com.meditrack.service;

import com.meditrack.entity.User;
import com.meditrack.exception.ResourceNotFoundException;
import com.meditrack.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
    }

    @Transactional
    public User updateProfile(String firstName, String lastName, String phoneNumber) {
        User user = getCurrentUser();
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setPhoneNumber(phoneNumber);
        return userRepository.save(user);
    }

    @Transactional
    public User toggleMfa() {
        User user = getCurrentUser();
        user.setMfaEnabled(!user.getMfaEnabled());
        return userRepository.save(user);
    }
}


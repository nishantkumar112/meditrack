package com.meditrack.controller;

import com.meditrack.dto.ApiResponse;
import com.meditrack.util.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/test/notifications")
@RequiredArgsConstructor
public class NotificationTestController {

    private final NotificationService notificationService;

    @Value("${spring.mail.username:}")
    private String mailUsername;

    @Value("${spring.mail.host:}")
    private String mailHost;

    @Value("${twilio.account-sid:}")
    private String twilioAccountSid;

    @PostMapping("/test-email")
    public ResponseEntity<ApiResponse<Map<String, Object>>> testEmail(
            @RequestParam String email) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            // Check configuration
            if (mailUsername == null || mailUsername.isEmpty()) {
                result.put("success", false);
                result.put("error", "Email not configured. MAIL_USERNAME is missing in .env");
                result.put("configCheck", "FAILED");
                return ResponseEntity.ok(ApiResponse.error("Email configuration missing", 400));
            }
            
            if (mailHost == null || mailHost.isEmpty()) {
                result.put("success", false);
                result.put("error", "Email host not configured. MAIL_HOST is missing in .env");
                result.put("configCheck", "FAILED");
                return ResponseEntity.ok(ApiResponse.error("Email host configuration missing", 400));
            }
            
            result.put("configCheck", "OK");
            result.put("mailHost", mailHost);
            result.put("mailUsername", mailUsername);
            
            // Send test email
            notificationService.sendEmail(
                email,
                "MediTrack Test Email",
                "This is a test email from MediTrack. If you receive this, email configuration is working correctly!"
            );
            
            result.put("success", true);
            result.put("message", "Test email sent successfully. Check your inbox (and spam folder).");
            result.put("sentTo", email);
            
            return ResponseEntity.ok(ApiResponse.success(result, "Test email sent"));
        } catch (Exception e) {
            result.put("success", false);
            result.put("error", e.getMessage());
            result.put("errorType", e.getClass().getSimpleName());
            return ResponseEntity.ok(ApiResponse.error("Failed to send test email: " + e.getMessage(), 500));
        }
    }

    @PostMapping("/test-sms")
    public ResponseEntity<ApiResponse<Map<String, Object>>> testSms(
            @RequestParam String phoneNumber) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            // Check configuration
            if (twilioAccountSid == null || twilioAccountSid.isEmpty()) {
                result.put("success", false);
                result.put("error", "SMS not configured. TWILIO_ACCOUNT_SID is missing in .env");
                result.put("configCheck", "FAILED");
                return ResponseEntity.ok(ApiResponse.error("SMS configuration missing", 400));
            }
            
            result.put("configCheck", "OK");
            result.put("twilioConfigured", true);
            
            // Send test SMS
            notificationService.sendSms(
                phoneNumber,
                "MediTrack Test SMS: This is a test message. If you receive this, SMS configuration is working correctly!"
            );
            
            result.put("success", true);
            result.put("message", "Test SMS sent successfully. Check your phone.");
            result.put("sentTo", phoneNumber);
            
            return ResponseEntity.ok(ApiResponse.success(result, "Test SMS sent"));
        } catch (Exception e) {
            result.put("success", false);
            result.put("error", e.getMessage());
            result.put("errorType", e.getClass().getSimpleName());
            return ResponseEntity.ok(ApiResponse.error("Failed to send test SMS: " + e.getMessage(), 500));
        }
    }

    @PostMapping("/check-config")
    public ResponseEntity<ApiResponse<Map<String, Object>>> checkConfig() {
        Map<String, Object> config = new HashMap<>();
        
        // Email config
        Map<String, Object> emailConfig = new HashMap<>();
        emailConfig.put("host", mailHost != null && !mailHost.isEmpty() ? mailHost : "NOT SET");
        emailConfig.put("username", mailUsername != null && !mailUsername.isEmpty() ? mailUsername : "NOT SET");
        emailConfig.put("configured", mailHost != null && !mailHost.isEmpty() && 
                       mailUsername != null && !mailUsername.isEmpty());
        config.put("email", emailConfig);
        
        // SMS config
        Map<String, Object> smsConfig = new HashMap<>();
        smsConfig.put("accountSid", twilioAccountSid != null && !twilioAccountSid.isEmpty() ? 
                      "SET (hidden)" : "NOT SET");
        smsConfig.put("configured", twilioAccountSid != null && !twilioAccountSid.isEmpty());
        config.put("sms", smsConfig);
        
        return ResponseEntity.ok(ApiResponse.success(config, "Configuration check complete"));
    }
}


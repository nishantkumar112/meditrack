package com.meditrack.util;

import com.meditrack.entity.Medication;
import com.meditrack.entity.MedicationReminder;
import com.meditrack.entity.User;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String mailUsername;

    @Value("${spring.mail.password:}")
    private String mailPassword;

    @Value("${spring.mail.host:}")
    private String mailHost;

    @Value("${twilio.account-sid:}")
    private String twilioAccountSid;

    @Value("${twilio.auth-token:}")
    private String twilioAuthToken;

    @Value("${twilio.phone-number:}")
    private String twilioPhoneNumber;

    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;

    public void sendSms(String phoneNumber, String message) {
        if (twilioAccountSid == null || twilioAccountSid.isEmpty()) {
            log.warn("Twilio credentials not configured. SMS not sent to: {}", phoneNumber);
            return;
        }

        if (phoneNumber == null || phoneNumber.isEmpty()) {
            log.warn("Phone number is null or empty. Cannot send SMS.");
            return;
        }

        try {
            log.debug("Attempting to send SMS to: {}", phoneNumber);
            Twilio.init(twilioAccountSid, twilioAuthToken);
            Message.creator(
                    new PhoneNumber(phoneNumber),
                    new PhoneNumber(twilioPhoneNumber),
                    message
            ).create();
            log.info("SMS sent successfully to: {}", phoneNumber);
        } catch (Exception e) {
            log.error("Failed to send SMS to: {}. Error: {} - {}", phoneNumber, e.getClass().getSimpleName(), e.getMessage(), e);
            // Don't throw - allow reminder processing to continue even if SMS fails
        }
    }

    public void sendEmail(String to, String subject, String text) {
        if (to == null || to.isEmpty()) {
            log.warn("Email address is null or empty. Cannot send email.");
            return;
        }

        // Check if email is configured
        if (mailUsername == null || mailUsername.isEmpty()) {
            log.warn("Email not configured. MAIL_USERNAME is missing in .env. Email not sent to: {}", to);
            return;
        }

        if (mailPassword == null || mailPassword.isEmpty()) {
            log.warn("Email password not configured. MAIL_PASSWORD is missing in .env. Email not sent to: {}. " +
                    "For Gmail, you must use an App Password (not your regular password). " +
                    "Generate one at: https://myaccount.google.com/apppasswords", to);
            return;
        }

        if (mailHost == null || mailHost.isEmpty()) {
            log.warn("Email host not configured. MAIL_HOST is missing in .env. Email not sent to: {}", to);
            return;
        }
        
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            
            log.debug("Attempting to send email to: {}, subject: {}", to, subject);
            mailSender.send(message);
            log.info("Email sent successfully to: {}", to);
        } catch (org.springframework.mail.MailAuthenticationException e) {
            log.error("Email authentication failed for: {}. " +
                    "Please check your MAIL_USERNAME and MAIL_PASSWORD in .env file. " +
                    "For Gmail, you MUST use an App Password (generate at: https://myaccount.google.com/apppasswords). " +
                    "Error: {}", to, e.getMessage());
            // Don't throw - allow reminder processing to continue even if email fails
        } catch (Exception e) {
            log.error("Failed to send email to: {}. Error: {} - {}", to, e.getClass().getSimpleName(), e.getMessage(), e);
            // Don't throw - allow reminder processing to continue even if email fails
        }
    }

    public void sendMedicationReminder(MedicationReminder reminder, Medication medication, User user) {
        String medicationName = medication.getName();
        String dosage = medication.getDosage() != null ? medication.getDosage() : "";
        String time = reminder.getReminderTime().toString();
        String message = String.format(
                "MediTrack Reminder: Time to take %s %s at %s. %s",
                medicationName,
                dosage,
                time,
                medication.getInstructions() != null ? medication.getInstructions() : ""
        );

        MedicationReminder.ReminderType type = reminder.getReminderType();
        
        if (type == MedicationReminder.ReminderType.SMS || type == MedicationReminder.ReminderType.BOTH) {
            String phoneNumber = user.getPhoneNumber();
            if (phoneNumber != null && !phoneNumber.isEmpty()) {
                // Ensure phone number has country code prefix
                String formattedPhone = phoneNumber.startsWith("+") ? phoneNumber : "+" + phoneNumber;
                sendSms(formattedPhone, message);
            } else {
                log.warn("User {} does not have a phone number configured. SMS not sent.", user.getEmail());
            }
        }

        if (type == MedicationReminder.ReminderType.EMAIL || type == MedicationReminder.ReminderType.BOTH) {
            sendEmail(user.getEmail(), "Medication Reminder: " + medicationName, message);
        }
    }

    public void sendOtpEmail(String email, String otp) {
        String subject = "MediTrack - OTP Verification";
        String text = String.format(
                "Your OTP for MediTrack verification is: %s\n\n" +
                "This OTP will expire in 10 minutes.\n\n" +
                "If you didn't request this, please ignore this email.",
                otp
        );
        sendEmail(email, subject, text);
    }

    public void sendOtpSms(String phoneNumber, String otp) {
        String message = String.format("Your MediTrack OTP is: %s. Valid for 10 minutes.", otp);
        sendSms(phoneNumber, message);
    }
}


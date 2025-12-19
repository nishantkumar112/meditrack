package com.meditrack.util;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Random;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class OtpService {

    private final RedisTemplate<String, Object> redisTemplate;

    @Value("${app.otp.expiration-minutes:10}")
    private int otpExpirationMinutes;

    private static final String OTP_PREFIX = "otp:";
    private static final Random random = new Random();

    public String generateOtp(String email) {
        String otp = String.format("%06d", random.nextInt(1000000));
        String key = OTP_PREFIX + email;
        redisTemplate.opsForValue().set(key, otp, otpExpirationMinutes, TimeUnit.MINUTES);
        return otp;
    }

    public boolean verifyOtp(String email, String otp) {
        String key = OTP_PREFIX + email;
        Object storedOtp = redisTemplate.opsForValue().get(key);
        
        if (storedOtp == null) {
            return false;
        }

        boolean isValid = storedOtp.toString().equals(otp);
        if (isValid) {
            redisTemplate.delete(key);
        }
        return isValid;
    }

    public void deleteOtp(String email) {
        String key = OTP_PREFIX + email;
        redisTemplate.delete(key);
    }
}


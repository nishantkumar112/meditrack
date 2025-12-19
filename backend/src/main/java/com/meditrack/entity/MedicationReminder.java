package com.meditrack.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "medication_reminders")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class MedicationReminder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "medication_id", nullable = false)
    private Medication medication;

    @Column(name = "reminder_time", nullable = false)
    private LocalTime reminderTime;

    @Column(name = "days_of_week", columnDefinition = "integer[]")
    @Builder.Default
    private List<Integer> daysOfWeek = new ArrayList<>(); // 0=Sunday, 6=Saturday

    @Enumerated(EnumType.STRING)
    @Column(name = "reminder_type")
    @Builder.Default
    private ReminderType reminderType = ReminderType.BOTH;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    @Builder.Default
    private ReminderStatus status = ReminderStatus.PENDING;

    @Column(name = "last_sent_at")
    private LocalDateTime lastSentAt;

    @Column(name = "next_reminder_at")
    private LocalDateTime nextReminderAt;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum ReminderType {
        SMS, EMAIL, BOTH
    }

    public enum ReminderStatus {
        PENDING, SENT, COMPLETED, MISSED
    }
}


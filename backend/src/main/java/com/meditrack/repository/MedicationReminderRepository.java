package com.meditrack.repository;

import com.meditrack.entity.MedicationReminder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MedicationReminderRepository extends JpaRepository<MedicationReminder, Long> {
    List<MedicationReminder> findByMedicationId(Long medicationId);
    
    @Query("SELECT DISTINCT mr FROM MedicationReminder mr " +
           "JOIN FETCH mr.medication m " +
           "JOIN FETCH m.familyMember fm " +
           "JOIN FETCH fm.user u " +
           "WHERE mr.status = 'PENDING' " +
           "AND mr.nextReminderAt <= :now " +
           "AND mr.nextReminderAt IS NOT NULL")
    List<MedicationReminder> findDueReminders(@Param("now") LocalDateTime now);
}

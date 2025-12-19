package com.meditrack.service;

import com.meditrack.dto.CreateReminderRequest;
import com.meditrack.dto.MedicationDto;
import com.meditrack.dto.MedicationReminderDto;
import com.meditrack.entity.FamilyMember;
import com.meditrack.entity.Medication;
import com.meditrack.entity.MedicationReminder;
import com.meditrack.exception.ResourceNotFoundException;
import com.meditrack.repository.FamilyMemberRepository;
import com.meditrack.repository.MedicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.ArrayList;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MedicationService {

    private final MedicationRepository medicationRepository;
    private final FamilyMemberRepository familyMemberRepository;
    private final UserService userService;

    public List<MedicationDto> getMedications(Long familyMemberId) {
        validateFamilyMemberAccess(familyMemberId);
        List<Medication> medications = medicationRepository.findByFamilyMemberId(familyMemberId);
        return medications.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<MedicationDto> getAllMedications() {
        Long currentUserId = userService.getCurrentUser().getId();
        List<FamilyMember> familyMembers = familyMemberRepository.findByUserId(currentUserId);
        List<Long> familyMemberIds = familyMembers.stream()
                .map(FamilyMember::getId)
                .collect(Collectors.toList());
        
        List<Medication> medications = medicationRepository.findAll().stream()
                .filter(medication -> familyMemberIds.contains(medication.getFamilyMember().getId()))
                .collect(Collectors.toList());
        
        return medications.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public MedicationDto getMedicationById(Long id) {
        Medication medication = medicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medication not found"));

        validateFamilyMemberAccess(medication.getFamilyMember().getId());
        return toDto(medication);
    }

    @Transactional
    public MedicationDto createMedication(MedicationDto dto) {
        validateFamilyMemberAccess(dto.getFamilyMemberId());
        
        FamilyMember familyMember = familyMemberRepository.findById(dto.getFamilyMemberId())
                .orElseThrow(() -> new ResourceNotFoundException("Family member not found"));

        Medication medication = Medication.builder()
                .familyMember(familyMember)
                .name(dto.getName())
                .dosage(dto.getDosage())
                .frequency(dto.getFrequency())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .instructions(dto.getInstructions())
                .prescribedBy(dto.getPrescribedBy())
                .build();

        medication = medicationRepository.save(medication);
        return toDto(medication);
    }

    @Transactional
    public MedicationDto updateMedication(Long id, MedicationDto dto) {
        Medication medication = medicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medication not found"));

        validateFamilyMemberAccess(medication.getFamilyMember().getId());

        medication.setName(dto.getName());
        medication.setDosage(dto.getDosage());
        medication.setFrequency(dto.getFrequency());
        medication.setStartDate(dto.getStartDate());
        medication.setEndDate(dto.getEndDate());
        medication.setInstructions(dto.getInstructions());
        medication.setPrescribedBy(dto.getPrescribedBy());

        medication = medicationRepository.save(medication);
        return toDto(medication);
    }

    @Transactional
    public void deleteMedication(Long id) {
        Medication medication = medicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medication not found"));

        validateFamilyMemberAccess(medication.getFamilyMember().getId());
        medicationRepository.delete(medication);
    }

    @Transactional
    public MedicationReminderDto createReminder(Long medicationId, CreateReminderRequest request) {
        Medication medication = medicationRepository.findById(medicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Medication not found"));

        validateFamilyMemberAccess(medication.getFamilyMember().getId());

        MedicationReminder.ReminderType reminderType = MedicationReminder.ReminderType.valueOf(request.getReminderType());
        
        // Convert day names to integers
        List<Integer> daysOfWeek = convertDayNamesToIntegers(request.getDaysOfWeek());

        MedicationReminder reminder = MedicationReminder.builder()
                .medication(medication)
                .reminderTime(request.getReminderTime())
                .daysOfWeek(daysOfWeek)
                .reminderType(reminderType)
                .status(MedicationReminder.ReminderStatus.PENDING)
                .build();

        // Calculate next reminder time
        reminder.setNextReminderAt(calculateNextReminderTime(reminder));

        medication.getReminders().add(reminder);
        medication = medicationRepository.save(medication);
        
        // Get the saved reminder
        MedicationReminder savedReminder = medication.getReminders().get(medication.getReminders().size() - 1);
        return toReminderDto(savedReminder);
    }
    
    private List<Integer> convertDayNamesToIntegers(List<String> dayNames) {
        if (dayNames == null || dayNames.isEmpty()) {
            return new ArrayList<>();
        }
        
        List<Integer> result = new ArrayList<>();
        for (String dayName : dayNames) {
            int dayInt = convertDayNameToInt(dayName);
            if (dayInt >= 0) {
                result.add(dayInt);
            }
        }
        return result;
    }
    
    private int convertDayNameToInt(String dayName) {
        if (dayName == null) return -1;
        
        String day = dayName.trim();
        switch (day.toLowerCase()) {
            case "sunday": return 0;
            case "monday": return 1;
            case "tuesday": return 2;
            case "wednesday": return 3;
            case "thursday": return 4;
            case "friday": return 5;
            case "saturday": return 6;
            default: return -1;
        }
    }

    private LocalDateTime calculateNextReminderTime(MedicationReminder reminder) {
        LocalDate today = LocalDate.now();
        LocalTime reminderTime = reminder.getReminderTime();
        List<Integer> daysOfWeek = reminder.getDaysOfWeek();

        if (daysOfWeek == null || daysOfWeek.isEmpty()) {
            // Daily reminder
            LocalDateTime nextTime = LocalDateTime.of(today, reminderTime);
            if (nextTime.isBefore(LocalDateTime.now())) {
                nextTime = nextTime.plusDays(1);
            }
            return nextTime;
        }

        // Find next matching day
        int currentDayOfWeek = today.getDayOfWeek().getValue() % 7; // Convert to 0-6 format
        for (int i = 0; i < 7; i++) {
            int dayToCheck = (currentDayOfWeek + i) % 7;
            if (daysOfWeek.contains(dayToCheck)) {
                LocalDate targetDate = today.plusDays(i);
                LocalDateTime nextTime = LocalDateTime.of(targetDate, reminderTime);
                if (i == 0 && nextTime.isBefore(LocalDateTime.now())) {
                    // If today's time has passed, find next occurrence
                    continue;
                }
                return nextTime;
            }
        }

        // Fallback: next week
        return LocalDateTime.of(today.plusDays(7), reminderTime);
    }

    private void validateFamilyMemberAccess(Long familyMemberId) {
        Long currentUserId = userService.getCurrentUser().getId();
        FamilyMember member = familyMemberRepository.findById(familyMemberId)
                .orElseThrow(() -> new ResourceNotFoundException("Family member not found"));

        if (!member.getUser().getId().equals(currentUserId)) {
            throw new ResourceNotFoundException("Family member not found");
        }
    }

    private MedicationDto toDto(Medication medication) {
        return MedicationDto.builder()
                .id(medication.getId())
                .familyMemberId(medication.getFamilyMember().getId())
                .name(medication.getName())
                .dosage(medication.getDosage())
                .frequency(medication.getFrequency())
                .startDate(medication.getStartDate())
                .endDate(medication.getEndDate())
                .instructions(medication.getInstructions())
                .prescribedBy(medication.getPrescribedBy())
                .reminders(medication.getReminders().stream()
                        .map(this::toReminderDto)
                        .collect(Collectors.toList()))
                .build();
    }

    private MedicationReminderDto toReminderDto(MedicationReminder reminder) {
        return MedicationReminderDto.builder()
                .id(reminder.getId())
                .medicationId(reminder.getMedication().getId())
                .reminderTime(reminder.getReminderTime())
                .daysOfWeek(reminder.getDaysOfWeek())
                .reminderType(reminder.getReminderType().name())
                .status(reminder.getStatus().name())
                .build();
    }
}


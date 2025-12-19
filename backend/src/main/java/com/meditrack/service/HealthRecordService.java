package com.meditrack.service;

import com.meditrack.dto.HealthRecordDto;
import com.meditrack.entity.FamilyMember;
import com.meditrack.entity.HealthRecord;
import com.meditrack.exception.ResourceNotFoundException;
import com.meditrack.repository.FamilyMemberRepository;
import com.meditrack.repository.HealthRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HealthRecordService {

    private final HealthRecordRepository healthRecordRepository;
    private final FamilyMemberRepository familyMemberRepository;
    private final UserService userService;

    public List<HealthRecordDto> getHealthRecords(Long familyMemberId) {
        validateFamilyMemberAccess(familyMemberId);
        
        List<HealthRecord> records = healthRecordRepository.findByFamilyMemberId(familyMemberId);
        return records.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<HealthRecordDto> getAllHealthRecords() {
        Long currentUserId = userService.getCurrentUser().getId();
        List<FamilyMember> familyMembers = familyMemberRepository.findByUserId(currentUserId);
        List<Long> familyMemberIds = familyMembers.stream()
                .map(FamilyMember::getId)
                .collect(Collectors.toList());
        
        List<HealthRecord> records = healthRecordRepository.findAll().stream()
                .filter(record -> familyMemberIds.contains(record.getFamilyMember().getId()))
                .collect(Collectors.toList());
        
        return records.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public HealthRecordDto getHealthRecordById(Long id) {
        HealthRecord record = healthRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Health record not found"));

        validateFamilyMemberAccess(record.getFamilyMember().getId());
        return toDto(record);
    }

    @Transactional
    public HealthRecordDto createHealthRecord(HealthRecordDto dto) {
        validateFamilyMemberAccess(dto.getFamilyMemberId());
        
        FamilyMember familyMember = familyMemberRepository.findById(dto.getFamilyMemberId())
                .orElseThrow(() -> new ResourceNotFoundException("Family member not found"));

        HealthRecord record = HealthRecord.builder()
                .familyMember(familyMember)
                .recordType(dto.getRecordType())
                .title(dto.getTitle())
                .description(dto.getDescription())
                .value(dto.getValue())
                .unit(dto.getUnit())
                .recordedDate(dto.getRecordedDate())
                .doctorName(dto.getDoctorName())
                .notes(dto.getNotes())
                .build();

        record = healthRecordRepository.save(record);
        return toDto(record);
    }

    @Transactional
    public HealthRecordDto updateHealthRecord(Long id, HealthRecordDto dto) {
        HealthRecord record = healthRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Health record not found"));

        validateFamilyMemberAccess(record.getFamilyMember().getId());

        record.setRecordType(dto.getRecordType());
        record.setTitle(dto.getTitle());
        record.setDescription(dto.getDescription());
        record.setValue(dto.getValue());
        record.setUnit(dto.getUnit());
        record.setRecordedDate(dto.getRecordedDate());
        record.setDoctorName(dto.getDoctorName());
        record.setNotes(dto.getNotes());

        record = healthRecordRepository.save(record);
        return toDto(record);
    }

    @Transactional
    public void deleteHealthRecord(Long id) {
        HealthRecord record = healthRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Health record not found"));

        validateFamilyMemberAccess(record.getFamilyMember().getId());
        healthRecordRepository.delete(record);
    }

    private void validateFamilyMemberAccess(Long familyMemberId) {
        Long currentUserId = userService.getCurrentUser().getId();
        FamilyMember member = familyMemberRepository.findById(familyMemberId)
                .orElseThrow(() -> new ResourceNotFoundException("Family member not found"));

        if (!member.getUser().getId().equals(currentUserId)) {
            throw new ResourceNotFoundException("Family member not found");
        }
    }

    private HealthRecordDto toDto(HealthRecord record) {
        return HealthRecordDto.builder()
                .id(record.getId())
                .familyMemberId(record.getFamilyMember().getId())
                .recordType(record.getRecordType())
                .title(record.getTitle())
                .description(record.getDescription())
                .value(record.getValue())
                .unit(record.getUnit())
                .recordedDate(record.getRecordedDate())
                .doctorName(record.getDoctorName())
                .notes(record.getNotes())
                .build();
    }
}


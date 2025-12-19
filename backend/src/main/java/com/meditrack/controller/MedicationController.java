package com.meditrack.controller;

import com.meditrack.dto.ApiResponse;
import com.meditrack.dto.CreateReminderRequest;
import com.meditrack.dto.MedicationDto;
import com.meditrack.dto.MedicationReminderDto;
import com.meditrack.service.MedicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/medications")
@RequiredArgsConstructor
public class MedicationController {

	private final MedicationService medicationService;

	@GetMapping
	public ResponseEntity<ApiResponse<List<MedicationDto>>> getMedications(
			@RequestParam(value = "familyMemberId", required = false) Optional<Long> familyMemberId) {
		List<MedicationDto> medications = familyMemberId.isPresent()
				? medicationService.getMedications(familyMemberId.get())
				: medicationService.getAllMedications();
		return ResponseEntity.ok(ApiResponse.success(medications, "Medications retrieved successfully"));
	}

	@GetMapping("/{id}")
	public ResponseEntity<ApiResponse<MedicationDto>> getMedication(@PathVariable Long id) {
		MedicationDto medication = medicationService.getMedicationById(id);
		return ResponseEntity.ok(ApiResponse.success(medication, "Medication retrieved successfully"));
	}

	@PostMapping
	public ResponseEntity<ApiResponse<MedicationDto>> createMedication(@Valid @RequestBody MedicationDto dto) {
		MedicationDto medication = medicationService.createMedication(dto);
		return ResponseEntity.status(HttpStatus.CREATED)
				.body(ApiResponse.success(medication, "Medication created successfully"));
	}

	@PutMapping("/{id}")
	public ResponseEntity<ApiResponse<MedicationDto>> updateMedication(
			@PathVariable Long id,
			@Valid @RequestBody MedicationDto dto) {
		MedicationDto medication = medicationService.updateMedication(id, dto);
		return ResponseEntity.ok(ApiResponse.success(medication, "Medication updated successfully"));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<ApiResponse<Object>> deleteMedication(@PathVariable Long id) {
		medicationService.deleteMedication(id);
		return ResponseEntity.ok(ApiResponse.success(null, "Medication deleted successfully"));
	}

	@PostMapping("/{medicationId}/reminders")
	public ResponseEntity<ApiResponse<MedicationReminderDto>> createReminder(
			@PathVariable Long medicationId,
			@Valid @RequestBody CreateReminderRequest request) {
		MedicationReminderDto reminder = medicationService.createReminder(medicationId, request);
		return ResponseEntity.status(HttpStatus.CREATED)
				.body(ApiResponse.success(reminder, "Reminder created successfully"));
	}
}

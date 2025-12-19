package com.meditrack.controller;

import com.meditrack.dto.ApiResponse;
import com.meditrack.dto.HealthRecordDto;
import com.meditrack.service.HealthRecordService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/health-records")
@RequiredArgsConstructor
public class HealthRecordController {

	private final HealthRecordService healthRecordService;

	@GetMapping
	public ResponseEntity<ApiResponse<List<HealthRecordDto>>> getHealthRecords(
			@RequestParam(value = "familyMemberId", required = false) Optional<Long> familyMemberId) {
		List<HealthRecordDto> records = familyMemberId.isPresent()
				? healthRecordService.getHealthRecords(familyMemberId.get())
				: healthRecordService.getAllHealthRecords();
		return ResponseEntity.ok(ApiResponse.success(records, "Health records retrieved successfully"));
	}

	@GetMapping("/{id}")
	public ResponseEntity<ApiResponse<HealthRecordDto>> getHealthRecord(@PathVariable Long id) {
		HealthRecordDto record = healthRecordService.getHealthRecordById(id);
		return ResponseEntity.ok(ApiResponse.success(record, "Health record retrieved successfully"));
	}

	@PostMapping
	public ResponseEntity<ApiResponse<HealthRecordDto>> createHealthRecord(@Valid @RequestBody HealthRecordDto dto) {
		HealthRecordDto record = healthRecordService.createHealthRecord(dto);
		return ResponseEntity.status(HttpStatus.CREATED)
				.body(ApiResponse.success(record, "Health record created successfully"));
	}

	@PutMapping("/{id}")
	public ResponseEntity<ApiResponse<HealthRecordDto>> updateHealthRecord(
			@PathVariable Long id,
			@Valid @RequestBody HealthRecordDto dto) {
		HealthRecordDto record = healthRecordService.updateHealthRecord(id, dto);
		return ResponseEntity.ok(ApiResponse.success(record, "Health record updated successfully"));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<ApiResponse<Object>> deleteHealthRecord(@PathVariable Long id) {
		healthRecordService.deleteHealthRecord(id);
		return ResponseEntity.ok(ApiResponse.success(null, "Health record deleted successfully"));
	}
}

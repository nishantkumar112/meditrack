package com.meditrack.controller;

import com.meditrack.dto.ApiResponse;
import com.meditrack.dto.DashboardDto;
import com.meditrack.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

	private final DashboardService dashboardService;

	@GetMapping
	public ResponseEntity<ApiResponse<DashboardDto>> getDashboard() {
		DashboardDto dashboard = dashboardService.getDashboardData();
		return ResponseEntity.ok(ApiResponse.success(dashboard, "Dashboard data retrieved successfully"));
	}
}

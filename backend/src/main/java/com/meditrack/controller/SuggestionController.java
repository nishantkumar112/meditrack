package com.meditrack.controller;

import com.meditrack.dto.ApiResponse;
import com.meditrack.service.SuggestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suggestions")
@RequiredArgsConstructor
public class SuggestionController {

    private final SuggestionService suggestionService;

    @GetMapping("/medicines")
    public ResponseEntity<ApiResponse<List<String>>> getMedicineSuggestions(
            @RequestParam(required = false) String query) {
        List<String> suggestions = suggestionService.getMedicineSuggestions(query);
        return ResponseEntity.ok(ApiResponse.success(suggestions, "Medicine suggestions retrieved successfully"));
    }

    @GetMapping("/medical-tests")
    public ResponseEntity<ApiResponse<List<String>>> getMedicalTestSuggestions(
            @RequestParam(required = false) String query) {
        List<String> suggestions = suggestionService.getMedicalTestSuggestions(query);
        return ResponseEntity.ok(ApiResponse.success(suggestions, "Medical test suggestions retrieved successfully"));
    }

    @GetMapping("/record-types")
    public ResponseEntity<ApiResponse<List<String>>> getRecordTypeSuggestions() {
        List<String> suggestions = suggestionService.getRecordTypeSuggestions();
        return ResponseEntity.ok(ApiResponse.success(suggestions, "Record type suggestions retrieved successfully"));
    }
}


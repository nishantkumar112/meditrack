package com.meditrack.controller;

import com.meditrack.dto.ApiResponse;
import com.meditrack.dto.FamilyMemberDto;
import com.meditrack.service.FamilyMemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/family-members")
@RequiredArgsConstructor
public class FamilyMemberController {

    private final FamilyMemberService familyMemberService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<FamilyMemberDto>>> getFamilyMembers() {
        List<FamilyMemberDto> members = familyMemberService.getFamilyMembers();
        return ResponseEntity.ok(ApiResponse.success(members, "Family members retrieved successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FamilyMemberDto>> getFamilyMember(@PathVariable Long id) {
        FamilyMemberDto member = familyMemberService.getFamilyMemberById(id);
        return ResponseEntity.ok(ApiResponse.success(member, "Family member retrieved successfully"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<FamilyMemberDto>> createFamilyMember(@Valid @RequestBody FamilyMemberDto dto) {
        FamilyMemberDto member = familyMemberService.createFamilyMember(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(member, "Family member created successfully"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<FamilyMemberDto>> updateFamilyMember(
            @PathVariable Long id,
            @Valid @RequestBody FamilyMemberDto dto) {
        FamilyMemberDto member = familyMemberService.updateFamilyMember(id, dto);
        return ResponseEntity.ok(ApiResponse.success(member, "Family member updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> deleteFamilyMember(@PathVariable Long id) {
        familyMemberService.deleteFamilyMember(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Family member deleted successfully"));
    }
}


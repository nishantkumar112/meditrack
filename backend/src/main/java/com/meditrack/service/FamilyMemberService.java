package com.meditrack.service;

import com.meditrack.dto.FamilyMemberDto;
import com.meditrack.entity.FamilyMember;
import com.meditrack.entity.User;
import com.meditrack.exception.ResourceNotFoundException;
import com.meditrack.repository.FamilyMemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FamilyMemberService {

    private final FamilyMemberRepository familyMemberRepository;
    private final UserService userService;

    public List<FamilyMemberDto> getFamilyMembers() {
        User currentUser = userService.getCurrentUser();
        List<FamilyMember> members = familyMemberRepository.findByUserId(currentUser.getId());
        return members.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public FamilyMemberDto getFamilyMemberById(Long id) {
        User currentUser = userService.getCurrentUser();
        FamilyMember member = familyMemberRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Family member not found"));

        if (!member.getUser().getId().equals(currentUser.getId())) {
            throw new ResourceNotFoundException("Family member not found");
        }

        return toDto(member);
    }

    @Transactional
    public FamilyMemberDto createFamilyMember(FamilyMemberDto dto) {
        User currentUser = userService.getCurrentUser();

        FamilyMember member = FamilyMember.builder()
                .user(currentUser)
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .dateOfBirth(dto.getDateOfBirth())
                .relationship(dto.getRelationship())
                .phoneNumber(dto.getPhoneNumber())
                .email(dto.getEmail())
                .build();

        member = familyMemberRepository.save(member);
        return toDto(member);
    }

    @Transactional
    public FamilyMemberDto updateFamilyMember(Long id, FamilyMemberDto dto) {
        User currentUser = userService.getCurrentUser();
        FamilyMember member = familyMemberRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Family member not found"));

        if (!member.getUser().getId().equals(currentUser.getId())) {
            throw new ResourceNotFoundException("Family member not found");
        }

        member.setFirstName(dto.getFirstName());
        member.setLastName(dto.getLastName());
        member.setDateOfBirth(dto.getDateOfBirth());
        member.setRelationship(dto.getRelationship());
        member.setPhoneNumber(dto.getPhoneNumber());
        member.setEmail(dto.getEmail());

        member = familyMemberRepository.save(member);
        return toDto(member);
    }

    @Transactional
    public void deleteFamilyMember(Long id) {
        User currentUser = userService.getCurrentUser();
        FamilyMember member = familyMemberRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Family member not found"));

        if (!member.getUser().getId().equals(currentUser.getId())) {
            throw new ResourceNotFoundException("Family member not found");
        }

        familyMemberRepository.delete(member);
    }

    private FamilyMemberDto toDto(FamilyMember member) {
        return FamilyMemberDto.builder()
                .id(member.getId())
                .firstName(member.getFirstName())
                .lastName(member.getLastName())
                .dateOfBirth(member.getDateOfBirth())
                .relationship(member.getRelationship())
                .phoneNumber(member.getPhoneNumber())
                .email(member.getEmail())
                .build();
    }
}


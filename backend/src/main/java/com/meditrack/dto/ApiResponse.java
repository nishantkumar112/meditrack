package com.meditrack.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
	private boolean success;
	private String message;
	private T data;
	private LocalDateTime timestamp;
	private Integer status;
	private String error;
	private Object errors; // For validation errors

	public static <T> ApiResponse<T> success(T data) {
		return ApiResponse.<T>builder()
				.success(true)
				.data(data)
				.timestamp(LocalDateTime.now())
				.build();
	}

	public static <T> ApiResponse<T> success(T data, String message) {
		return ApiResponse.<T>builder()
				.success(true)
				.message(message)
				.data(data)
				.timestamp(LocalDateTime.now())
				.build();
	}

	public static <T> ApiResponse<T> error(String message, Integer status) {
		return ApiResponse.<T>builder()
				.success(false)
				.message(message)
				.error(message)
				.status(status)
				.timestamp(LocalDateTime.now())
				.build();
	}

	public static <T> ApiResponse<T> error(String message, Integer status, Object errors) {
		return ApiResponse.<T>builder()
				.success(false)
				.message(message)
				.error(message)
				.status(status)
				.errors(errors)
				.timestamp(LocalDateTime.now())
				.build();
	}
}

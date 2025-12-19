package com.meditrack.exception;

import com.meditrack.dto.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(ResourceNotFoundException.class)
	public ResponseEntity<ApiResponse<Object>> handleResourceNotFoundException(ResourceNotFoundException ex) {
		ApiResponse<Object> response = ApiResponse.error(
				ex.getMessage() != null ? ex.getMessage() : "Resource not found",
				HttpStatus.NOT_FOUND.value());
		return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
	}

	@ExceptionHandler(BadRequestException.class)
	public ResponseEntity<ApiResponse<Object>> handleBadRequestException(BadRequestException ex) {
		ApiResponse<Object> response = ApiResponse.error(
				ex.getMessage() != null ? ex.getMessage() : "Bad request",
				HttpStatus.BAD_REQUEST.value());
		return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
	}

	@ExceptionHandler(UnauthorizedException.class)
	public ResponseEntity<ApiResponse<Object>> handleUnauthorizedException(UnauthorizedException ex) {
		ApiResponse<Object> response = ApiResponse.error(
				ex.getMessage() != null ? ex.getMessage() : "Unauthorized",
				HttpStatus.UNAUTHORIZED.value());
		return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ApiResponse<Object>> handleValidationExceptions(MethodArgumentNotValidException ex) {
		Map<String, String> errors = new HashMap<>();
		ex.getBindingResult().getAllErrors().forEach((error) -> {
			String fieldName = ((FieldError) error).getField();
			String errorMessage = error.getDefaultMessage();
			errors.put(fieldName, errorMessage);
		});

		ApiResponse<Object> response = ApiResponse.error(
				"Validation failed",
				HttpStatus.BAD_REQUEST.value(),
				errors);
		return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<ApiResponse<Object>> handleGenericException(Exception ex) {
		ApiResponse<Object> response = ApiResponse.error(
				ex.getMessage() != null ? ex.getMessage() : "Internal server error",
				HttpStatus.INTERNAL_SERVER_ERROR.value());
		return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
	}
}

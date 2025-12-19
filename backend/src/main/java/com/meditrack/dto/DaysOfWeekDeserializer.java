package com.meditrack.dto;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonNode;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class DaysOfWeekDeserializer extends JsonDeserializer<List<Integer>> {

	@Override
	public List<Integer> deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
		JsonNode node = p.getCodec().readTree(p);
		List<Integer> result = new ArrayList<>();

		if (node.isArray()) {
			for (JsonNode dayNode : node) {
				if (dayNode.isInt()) {
					result.add(dayNode.asInt());
				} else if (dayNode.isTextual()) {
					int dayInt = convertDayNameToInt(dayNode.asText());
					if (dayInt >= 0) {
						result.add(dayInt);
					}
				}
			}
		}

		return result;
	}

	private int convertDayNameToInt(String dayName) {
		if (dayName == null)
			return -1;

		String day = dayName.trim();
		switch (day.toLowerCase()) {
			case "sunday":
				return 0;
			case "monday":
				return 1;
			case "tuesday":
				return 2;
			case "wednesday":
				return 3;
			case "thursday":
				return 4;
			case "friday":
				return 5;
			case "saturday":
				return 6;
			default:
				return -1;
		}
	}
}

import 'dart:convert';

import 'package:flutter_frontend/classes/outputs/schedules_output.dart';
import 'package:flutter_frontend/constants/base_url.dart';
import 'package:flutter_frontend/functions/headers.dart';
import 'package:http/http.dart' as http;

class SchedulesApi {
  final String token;

  SchedulesApi({
    required this.token,
  });

  Future<List<SchedulesOutput>> getAll(
    int userId,
    int resourceId,
    int classId,
    String minDate,
    String maxDate,
  ) async {
    final query = [
      "userId=$userId",
      "resourceId=$resourceId",
      "classId=$classId",
      "minDate=$minDate",
      "maxDate=$maxDate",
    ];

    final uri = Uri.parse("$baseUrl/api/v1/schedule?${query.join("&")}");

    final response = await http.get(
      uri,
      headers: {
        ...getAuthorizationHeader(token),
      },
    );

    final schedules = (jsonDecode(response.body) as List<Map<String, dynamic>>)
        .map((schedule) => SchedulesOutput.fromJson(schedule))
        .toList();

    return schedules;
  }
}

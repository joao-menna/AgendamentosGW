import 'dart:convert';

import 'package:flutter_frontend/classes/hour_class.dart';
import 'package:flutter_frontend/classes/outputs/schedules_output.dart';
import 'package:flutter_frontend/constants/base_url.dart';
import 'package:flutter_frontend/functions/check_http_error.dart';
import 'package:flutter_frontend/functions/headers.dart';
import 'package:http/http.dart' as http;

class SchedulesApi {
  final String token;

  SchedulesApi({
    required this.token,
  });

  Future<List<SchedulesOutput>> getAll({
    int? userId,
    int? resourceId,
    int? classId,
    String? minDate,
    String? maxDate,
  }) async {
    final query = [
      if (userId != null) "userId=$userId",
      if (resourceId != null) "resourceId=$resourceId",
      if (classId != null) "classId=$classId",
      if (minDate != null) "minDate=$minDate",
      if (maxDate != null) "maxDate=$maxDate",
    ];

    final uri = Uri.parse("$baseUrl/api/v1/schedule?${query.join("&")}");

    final response = await http.get(
      uri,
      headers: {
        ...getAuthorizationHeader(token),
      },
    );

    checkHttpError(response);

    final schedules = (jsonDecode(response.body) as List<dynamic>)
        .map((schedule) => SchedulesOutput.fromJson(schedule))
        .toList();

    return schedules;
  }

  Future<HourClass> insertOne(
    String date,
    int hourId,
    int classResourceId,
  ) async {
    final uri = Uri.parse("$baseUrl/api/v1/schedule");

    final response = await http.post(
      uri,
      body: jsonEncode(
        {
          "date": date,
          "hourId": hourId,
          "classResourceId": classResourceId,
        },
      ),
      headers: {
        ...getAuthorizationHeader(token),
        ...getContentTypeHeader(),
      },
    );

    checkHttpError(response);

    final schedule = HourClass.fromJson(
      jsonDecode(response.body) as Map<String, dynamic>,
    );

    return schedule;
  }

  Future<void> deleteOne(int id) async {
    final uri = Uri.parse("$baseUrl/api/v1/schedule/$id");

    final response = await http.delete(
      uri,
      headers: {
        ...getAuthorizationHeader(token),
      },
    );

    checkHttpError(response);
  }
}

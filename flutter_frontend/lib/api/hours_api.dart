import 'dart:convert';

import 'package:flutter_frontend/classes/hour.dart';
import 'package:flutter_frontend/constants/base_url.dart';
import 'package:flutter_frontend/functions/headers.dart';
import 'package:http/http.dart' as http;

class HoursApi {
  final String token;

  HoursApi({required this.token});

  Future<List<Hour>> getAll() async {
    final uri = Uri.parse("$baseUrl/api/v1/hour");

    final response = await http.get(
      uri,
      headers: {
        ...getAuthorizationHeader(token),
      },
    );

    final hourList = (jsonDecode(response.body) as List<Map<String, dynamic>>)
        .map((hour) => Hour.fromJson(hour))
        .toList();

    return hourList;
  }
}

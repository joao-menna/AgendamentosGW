import 'dart:convert';

import 'package:flutter_frontend/classes/resource.dart';
import 'package:flutter_frontend/constants/base_url.dart';
import 'package:flutter_frontend/functions/check_http_error.dart';
import 'package:flutter_frontend/functions/headers.dart';
import 'package:http/http.dart' as http;

class ResourcesApi {
  final String token;

  ResourcesApi({required this.token});

  Future<List<Resource>> getAll() async {
    final uri = Uri.parse("$baseUrl/api/v1/resource");

    final response = await http.get(
      uri,
      headers: {
        ...getAuthorizationHeader(token),
      },
    );

    checkHttpError(response);

    final resources = (jsonDecode(response.body) as List<Map<String, dynamic>>)
        .map((resource) => Resource.fromJson(resource))
        .toList();

    return resources;
  }

  Future<Resource> getOne(int id) async {
    final uri = Uri.parse("$baseUrl/api/v1/resource/$id");

    final response = await http.get(
      uri,
      headers: {
        ...getAuthorizationHeader(token),
      },
    );

    checkHttpError(response);

    final resource = Resource.fromJson(
      jsonDecode(response.body) as Map<String, dynamic>,
    );

    return resource;
  }

  Future<Resource> insertOne(String name) async {
    final uri = Uri.parse("$baseUrl/api/v1/resource");

    final response = await http.post(
      uri,
      body: jsonEncode({"name": name}),
      headers: {
        ...getAuthorizationHeader(token),
        ...getContentTypeHeader(),
      },
    );

    checkHttpError(response);

    final resource = Resource.fromJson(
      jsonDecode(response.body) as Map<String, dynamic>,
    );

    return resource;
  }

  Future<Resource> updateOne(int id, String newName) async {
    final uri = Uri.parse("$baseUrl/api/v1/resource/$id");

    final response = await http.put(
      uri,
      body: jsonEncode({"name": newName}),
      headers: {
        ...getAuthorizationHeader(token),
        ...getContentTypeHeader(),
      },
    );

    checkHttpError(response);

    final resource = Resource.fromJson(
      jsonDecode(response.body) as Map<String, dynamic>,
    );

    return resource;
  }

  Future<Resource> deleteOne(int id) async {
    final uri = Uri.parse("$baseUrl/api/v1/resource/$id");

    final response = await http.delete(
      uri,
      headers: {
        ...getAuthorizationHeader(token),
      },
    );

    checkHttpError(response);

    final resource = Resource.fromJson(
      jsonDecode(response.body) as Map<String, dynamic>,
    );

    return resource;
  }
}

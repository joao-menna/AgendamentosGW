import 'dart:convert';

import 'package:flutter_frontend/classes/class_resource.dart';
import 'package:flutter_frontend/classes/klass.dart';
import 'package:flutter_frontend/constants/base_url.dart';
import 'package:flutter_frontend/functions/check_http_error.dart';
import 'package:flutter_frontend/functions/headers.dart';
import 'package:http/http.dart' as http;

class ClassesApi {
  final String token;

  ClassesApi({required this.token});

  Future<List<Klass>> getAll() async {
    final uri = Uri.parse("$baseUrl/api/v1/class");

    final response = await http.get(
      uri,
      headers: {
        ...getAuthorizationHeader(token),
      },
    );

    checkHttpError(response);

    final classes = (jsonDecode(response.body) as List<Map<String, dynamic>>)
        .map((klass) => Klass.fromJson(klass["class"]))
        .toList();

    return classes;
  }

  Future<Klass> getOne(int id) async {
    final uri = Uri.parse("$baseUrl/api/v1/class/$id");

    final response = await http.get(
      uri,
      headers: {
        ...getAuthorizationHeader(token),
      },
    );

    checkHttpError(response);

    final klass = Klass.fromJson(
      (jsonDecode(response.body) as Map<String, dynamic>)["class"],
    );

    return klass;
  }

  Future<Klass> insertOne(String name, String period, int teacherId) async {
    final uri = Uri.parse("$baseUrl/api/v1/class");

    final response = await http.post(
      uri,
      body: jsonEncode({
        "name": name,
        "period": period,
        "teacherId": teacherId,
      }),
      headers: {
        ...getAuthorizationHeader(token),
        ...getContentTypeHeader(),
      },
    );

    checkHttpError(response);

    final klass = Klass.fromJson(
      (jsonDecode(response.body) as Map<String, dynamic>)["class"],
    );

    return klass;
  }

  Future<Klass> updateOne(
    int id,
    String name,
    String period,
    int teacherId,
  ) async {
    final uri = Uri.parse("$baseUrl/api/v1/class/$id");

    final response = await http.put(
      uri,
      body: jsonEncode({
        "name": name,
        "period": period,
        "teacherId": teacherId,
      }),
      headers: {
        ...getAuthorizationHeader(token),
        ...getContentTypeHeader(),
      },
    );

    checkHttpError(response);

    final klass = Klass.fromJson(
      (jsonDecode(response.body) as Map<String, dynamic>)["class"],
    );

    return klass;
  }

  Future<Klass> deleteOne(int id) async {
    final uri = Uri.parse("$baseUrl/api/v1/class/$id");

    final response = await http.delete(
      uri,
      headers: {
        ...getAuthorizationHeader(token),
        ...getContentTypeHeader(),
      },
    );

    checkHttpError(response);

    final klass = Klass.fromJson(
      jsonDecode(response.body) as Map<String, dynamic>,
    );

    return klass;
  }

  Future<List<ClassResource>> getAllResource(int classId) async {
    final uri = Uri.parse("$baseUrl/api/v1/class/$classId/resource");

    final response = await http.get(
      uri,
      headers: {
        ...getAuthorizationHeader(token),
      },
    );

    checkHttpError(response);

    final resourceList = (jsonDecode(response.body)
            as List<Map<String, dynamic>>)
        .map((resource) => ClassResource.fromJson(resource["class_resource"]))
        .toList();

    return resourceList;
  }

  Future<ClassResource> insertOneResource(int classId, int resourceId) async {
    final uri = Uri.parse("$baseUrl/api/v1/class/$classId/resource");

    final response = await http.post(
      uri,
      body: jsonEncode({
        "classId": classId,
        "resourceId": resourceId,
      }),
      headers: {
        ...getAuthorizationHeader(token),
        ...getContentTypeHeader(),
      },
    );

    checkHttpError(response);

    final classResource = ClassResource.fromJson(
      jsonDecode(response.body) as Map<String, dynamic>,
    );

    return classResource;
  }

  Future<ClassResource> deleteOneResource(int classId, int resourceId) async {
    final uri = Uri.parse(
      "$baseUrl/api/v1/class/$classId/resource/$resourceId",
    );

    final response = await http.delete(
      uri,
      headers: {
        ...getAuthorizationHeader(token),
      },
    );

    checkHttpError(response);

    final classResource = ClassResource.fromJson(
      jsonDecode(response.body) as Map<String, dynamic>,
    );

    return classResource;
  }
}

import 'dart:convert';

import 'package:flutter_frontend/classes/user.dart';
import 'package:flutter_frontend/constants/base_url.dart';
import 'package:flutter_frontend/functions/check_http_error.dart';
import 'package:flutter_frontend/functions/headers.dart';
import 'package:http/http.dart' as http;

class UsersApi {
  final String token;

  UsersApi({this.token = ""});

  Future<List<User>> getAll() async {
    final uri = Uri.parse("$baseUrl/api/v1/user");

    final response = await http.get(
      uri,
      headers: {
        ...getAuthorizationHeader(token),
      },
    );

    checkHttpError(response);

    final users = (jsonDecode(response.body) as List<Map<String, dynamic>>)
        .map((user) => User.fromJson(user))
        .toList();

    return users;
  }

  Future<User> getOne(int id) async {
    final uri = Uri.parse("$baseUrl/api/v1/user/$id");

    final response = await http.get(
      uri,
      headers: {
        ...getAuthorizationHeader(token),
      },
    );

    checkHttpError(response);

    final user = User.fromJson(
      jsonDecode(response.body) as Map<String, dynamic>,
    );

    return user;
  }

  Future<User> getOneByToken() async {
    final uri = Uri.parse("$baseUrl/api/v1/user/token");

    final response = await http.get(
      uri,
      headers: {
        ...getAuthorizationHeader(token),
      },
    );

    checkHttpError(response);

    final user = User.fromJson(
      jsonDecode(response.body) as Map<String, dynamic>,
    );

    return user;
  }

  Future<User> insertOne(User user) async {
    final uri = Uri.parse("$baseUrl/api/v1/user");

    final response = await http.post(
      uri,
      headers: {
        ...getAuthorizationHeader(token),
        ...getContentTypeHeader(),
      },
    );

    checkHttpError(response);

    final user = User.fromJson(
      jsonDecode(response.body) as Map<String, dynamic>,
    );

    return user;
  }

  Future<User> updateOne(User user) async {
    final uri = Uri.parse("$baseUrl/api/v1/user");

    final response = await http.put(
      uri,
      headers: {
        ...getAuthorizationHeader(token),
        ...getContentTypeHeader(),
      },
    );

    checkHttpError(response);

    final user = User.fromJson(
      jsonDecode(response.body) as Map<String, dynamic>,
    );

    return user;
  }

  Future<User> deleteOne(User user) async {
    final uri = Uri.parse("$baseUrl/api/v1/user");

    final response = await http.delete(
      uri,
      headers: {
        ...getAuthorizationHeader(token),
        ...getContentTypeHeader(),
      },
    );

    checkHttpError(response);

    final user = User.fromJson(
      jsonDecode(response.body) as Map<String, dynamic>,
    );

    return user;
  }

  Future<String> login(String email, String password) async {
    final uri = Uri.parse("$baseUrl/api/v1/user/login");

    final response = await http.post(
      uri,
      body: jsonEncode({
        "email": email,
        "password": password,
      }),
      headers: {
        ...getAuthorizationHeader(token),
        ...getContentTypeHeader(),
      },
    );

    checkHttpError(response);

    final String tokenValue =
        (jsonDecode(response.body) as Map<String, dynamic>)["token"];

    return tokenValue;
  }
}

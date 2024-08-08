import 'dart:convert';

import 'package:flutter_frontend/classes/block.dart';
import 'package:flutter_frontend/constants/base_url.dart';
import 'package:flutter_frontend/functions/check_http_error.dart';
import 'package:flutter_frontend/functions/headers.dart';
import 'package:http/http.dart' as http;

class BlocksApi {
  final String token;

  BlocksApi({required this.token});

  Future<List<Block>> getAll() async {
    final uri = Uri.parse("$baseUrl/api/v1/block");

    final response = await http.get(
      uri,
      headers: {...getAuthorizationHeader(token)},
    );

    checkHttpError(response);

    print(response.body);
    final blocks = (jsonDecode(response.body) as List<dynamic>)
        .map((json) => Block.fromJson(json))
        .toList();

    return blocks;
  }

  Future<Block> insertOne(int hourId, String date, String period) async {
    final uri = Uri.parse("$baseUrl/api/v1/block");

    final response = await http.post(
      uri,
      body: jsonEncode(
        {
          "hourId": hourId,
          "date": date,
          "period": period,
        },
      ),
      headers: {
        ...getAuthorizationHeader(token),
        ...getContentTypeHeader(),
      },
    );

    checkHttpError(response);

    final block = Block.fromJson(
      jsonDecode(response.body) as Map<String, dynamic>,
    );

    return block;
  }

  Future<Block> deleteOne(int id) async {
    final uri = Uri.parse("$baseUrl/api/v1/block/$id");

    final response = await http.delete(
      uri,
      headers: {...getAuthorizationHeader(token)},
    );

    checkHttpError(response);

    final block = Block.fromJson(
      jsonDecode(response.body) as Map<String, dynamic>,
    );

    return block;
  }
}

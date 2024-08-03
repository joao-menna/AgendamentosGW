import 'dart:convert';

import 'package:flutter_frontend/classes/block.dart';
import 'package:flutter_frontend/constants/base_url.dart';
import 'package:http/http.dart' as http;

class BlocksApi {
  final String token;

  BlocksApi({required this.token});

  Future<List<Block>> getAll() async {
    var uri = Uri.parse("$baseUrl/api/v1/block");

    var response = await http.get(uri);

    var blocks = (jsonDecode(response.body) as List<Map<String, dynamic>>).map(
      (json) => Block.fromJson(json),
    );

    return blocks.toList();
  }
}

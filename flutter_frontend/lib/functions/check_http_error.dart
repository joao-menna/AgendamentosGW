import 'package:http/http.dart';

void checkHttpError(Response response) {
  final httpErrors = [400, 401, 402, 403, 404, 405, 500, 501];

  if (httpErrors.contains(response.statusCode)) {
    throw Exception("HTTP Status Code is error, response: ${response.body}");
  }
}

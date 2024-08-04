Map<String, String> getAuthorizationHeader(String token) {
  return {"Authorization": token};
}

Map<String, String> getContentTypeHeader() {
  return {"Content-Type": "application/json"};
}

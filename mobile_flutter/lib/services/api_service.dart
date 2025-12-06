import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

// Ajuste se seu backend rodar em IP diferente (em emulador Android use 10.0.2.2)
const String baseUrl = 'http://localhost:3000';

class ApiService {
  // Singleton
  ApiService._private();
  static final ApiService instance = ApiService._private();

  Future<String?> getToken() async {
    final sp = await SharedPreferences.getInstance();
    return sp.getString('jwtToken');
  }

  Future<void> saveToken(String token) async {
    final sp = await SharedPreferences.getInstance();
    await sp.setString('jwtToken', token);
  }

  Future<void> removeToken() async {
    final sp = await SharedPreferences.getInstance();
    await sp.remove('jwtToken');
  }

  Map<String, String> _jsonHeaders([String? token]) {
    final headers = {'Content-Type': 'application/json'};
    if (token != null) headers['Authorization'] = 'Bearer $token';
    return headers;
  }

  // LOGIN
  Future<String> login(String usuario, String senha) async {
    final url = Uri.parse('$baseUrl/login');
    final resp = await http.post(url,
        headers: _jsonHeaders(), body: jsonEncode({'usuario': usuario, 'senha': senha}));
    if (resp.statusCode == 200) {
      final data = jsonDecode(resp.body);
      final token = data['token'] as String;
      await saveToken(token);
      return token;
    } else {
      final msg = _extractError(resp);
      throw Exception('Login falhou: $msg');
    }
  }

  // LOGOUT (invalida no backend, se tiver endpoint)
  Future<void> logout() async {
    final token = await getToken();
    final url = Uri.parse('$baseUrl/logout');
    try {
      await http.post(url, headers: _jsonHeaders(token));
    } catch (_) {}
    await removeToken();
  }

  // PRODUTOS (público)
  Future<List<dynamic>> fetchProdutos() async {
    final url = Uri.parse('$baseUrl/produtos');
    final resp = await http.get(url, headers: _jsonHeaders());
    if (resp.statusCode == 200) return jsonDecode(resp.body) as List<dynamic>;
    throw Exception(_extractError(resp));
  }

  Future<dynamic> fetchProdutoById(int id) async {
    final url = Uri.parse('$baseUrl/produtos/$id');
    final resp = await http.get(url, headers: _jsonHeaders());
    if (resp.statusCode == 200) return jsonDecode(resp.body);
    throw Exception(_extractError(resp));
  }

  Future<int> createProduto(Map<String, dynamic> body) async {
    final url = Uri.parse('$baseUrl/produtos');
    final resp = await http.post(url, headers: _jsonHeaders(), body: jsonEncode(body));
    if (resp.statusCode == 201) {
      final d = jsonDecode(resp.body);
      return d['id'];
    }
    throw Exception(_extractError(resp));
  }

  Future<void> updateProduto(int id, Map<String, dynamic> body) async {
    final url = Uri.parse('$baseUrl/produtos/$id');
    final resp = await http.put(url, headers: _jsonHeaders(), body: jsonEncode(body));
    if (resp.statusCode != 200) throw Exception(_extractError(resp));
  }

  Future<void> deleteProduto(int id) async {
    final url = Uri.parse('$baseUrl/produtos/$id');
    final resp = await http.delete(url, headers: _jsonHeaders());
    if (resp.statusCode != 200) throw Exception(_extractError(resp));
  }

  // CLIENTES (protegido -> precisa de token)
  Future<List<dynamic>> fetchClientes() async {
    final token = await getToken();
    final url = Uri.parse('$baseUrl/clientes');
    final resp = await http.get(url, headers: _jsonHeaders(token));
    if (resp.statusCode == 200) return jsonDecode(resp.body) as List<dynamic>;
    throw Exception(_extractError(resp));
  }

  Future<dynamic> fetchClienteById(int id) async {
    final token = await getToken();
    final url = Uri.parse('$baseUrl/clientes/$id');
    final resp = await http.get(url, headers: _jsonHeaders(token));
    if (resp.statusCode == 200) return jsonDecode(resp.body);
    throw Exception(_extractError(resp));
  }

  Future<int> createCliente(Map<String, dynamic> body) async {
    final token = await getToken();
    final url = Uri.parse('$baseUrl/clientes');
    final resp = await http.post(url, headers: _jsonHeaders(token), body: jsonEncode(body));
    if (resp.statusCode == 201) {
      final d = jsonDecode(resp.body);
      return d['id'];
    }
    throw Exception(_extractError(resp));
  }

  Future<void> updateCliente(int id, Map<String, dynamic> body) async {
    final token = await getToken();
    final url = Uri.parse('$baseUrl/clientes/$id');
    final resp = await http.put(url, headers: _jsonHeaders(token), body: jsonEncode(body));
    if (resp.statusCode != 200) throw Exception(_extractError(resp));
  }

  Future<void> deleteCliente(int id) async {
    final token = await getToken();
    final url = Uri.parse('$baseUrl/clientes/$id');
    final resp = await http.delete(url, headers: _jsonHeaders(token));
    if (resp.statusCode != 200) throw Exception(_extractError(resp));
  }

  String _extractError(http.Response resp) {
    try {
      final j = jsonDecode(resp.body);
      return j['message'] ?? j['error'] ?? resp.body;
    } catch (_) {
      return 'HTTP ${resp.statusCode}: ${resp.reasonPhrase}';
    }
  }
}

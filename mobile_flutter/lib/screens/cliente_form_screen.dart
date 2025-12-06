import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

// Ajuste se seu backend rodar em IP diferente (em emulador Android use 10.0.2.2)
const String baseUrl = '[http://localhost:3000](http://localhost:3000)';

class ClienteFormScreen extends StatefulWidget {
final Map<String, dynamic>? cliente; // Se vier preenchido → modo edição

const ClienteFormScreen({super.key, this.cliente});

@override
State<ClienteFormScreen> createState() => _ClienteFormScreenState();
}

class _ClienteFormScreenState extends State<ClienteFormScreen> {
final _formKey = GlobalKey<FormState>();

final _nomeCtrl = TextEditingController();
final _sobrenomeCtrl = TextEditingController();
final _emailCtrl = TextEditingController();
final _idadeCtrl = TextEditingController();

bool _salvando = false;

@override
void initState() {
super.initState();


// Se estiver em modo edição, preencher os campos
if (widget.cliente != null) {
  _nomeCtrl.text = widget.cliente!['nome'];
  _sobrenomeCtrl.text = widget.cliente!['sobrenome'];
  _emailCtrl.text = widget.cliente!['email'];
  _idadeCtrl.text = widget.cliente!['idade'].toString();
}


}

@override
void dispose() {
_nomeCtrl.dispose();
_sobrenomeCtrl.dispose();
_emailCtrl.dispose();
_idadeCtrl.dispose();
super.dispose();
}

// ---------------- VALIDADORES ----------------

String? _validaNome(String? v) {
if (v == null || v.trim().isEmpty) return 'Nome é obrigatório';
if (v.trim().length < 3) return 'Nome deve ter pelo menos 3 caracteres';
if (v.trim().length > 255) return 'Nome muito grande';
return null;
}

String? _validaSobrenome(String? v) {
if (v == null || v.trim().isEmpty) return 'Sobrenome é obrigatório';
if (v.trim().length < 3) return 'Sobrenome deve ter pelo menos 3 caracteres';
if (v.trim().length > 255) return 'Sobrenome muito grande';
return null;
}

String? _validaEmail(String? v) {
if (v == null || v.trim().isEmpty) return 'E-mail é obrigatório';
if (!RegExp(r'^[^@\s]+@[^@\s]+.[^@\s]+$').hasMatch(v.trim())) {
return 'E-mail inválido';
}
return null;
}

String? _validaIdade(String? v) {
if (v == null || v.trim().isEmpty) return 'Idade é obrigatória';
final idade = int.tryParse(v.trim());
if (idade == null) return 'Idade deve ser um número';
if (idade <= 0 || idade >= 120) return 'Idade deve ser entre 1 e 119';
return null;
}

// ---------------- SALVAR CLIENTE ----------------

Future<void> _salvar() async {
final valido = _formKey.currentState!.validate();
if (!valido) return;


setState(() => _salvando = true);

final body = {
  "nome": _nomeCtrl.text.trim(),
  "sobrenome": _sobrenomeCtrl.text.trim(),
  "email": _emailCtrl.text.trim(),
  "idade": int.parse(_idadeCtrl.text.trim()),
};

try {
  bool edicao = widget.cliente != null;
  final id = widget.cliente?['id'];
  final url = Uri.parse(
    baseUrl + (edicao ? '/clientes/$id' : '/clientes'),
  );

  final sp = await SharedPreferences.getInstance();
  final token = sp.getString('jwtToken');

  final headers = <String, String>{
    'Content-Type': 'application/json',
    if (token != null) 'Authorization': 'Bearer $token',
  };

  final resp = edicao
      ? await http.put(url, headers: headers, body: jsonEncode(body))
      : await http.post(url, headers: headers, body: jsonEncode(body));

  if (resp.statusCode == 200 || resp.statusCode == 201) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(edicao
            ? "Cliente atualizado com sucesso!"
            : "Cliente criado com sucesso!"),
      ),
    );
    Navigator.of(context).pop(true);
  } else {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text("Erro: ${resp.statusCode} - ${resp.body}")),
    );
  }
} catch (e) {
  if (!mounted) return;
  ScaffoldMessenger.of(context).showSnackBar(
    SnackBar(content: Text("Erro de comunicação: $e")),
  );
}

if (mounted) setState(() => _salvando = false);


}

@override
Widget build(BuildContext context) {
final editando = widget.cliente != null;


return Scaffold(
  appBar: AppBar(
    title: Text(editando ? "Editar Cliente" : "Novo Cliente"),
  ),
  body: SingleChildScrollView(
    padding: const EdgeInsets.all(20),
    child: Form(
      key: _formKey,
      child: Column(
        children: [
          TextFormField(
            controller: _nomeCtrl,
            decoration: const InputDecoration(labelText: "Nome"),
            validator: _validaNome,
          ),
          const SizedBox(height: 12),
          TextFormField(
            controller: _sobrenomeCtrl,
            decoration: const InputDecoration(labelText: "Sobrenome"),
            validator: _validaSobrenome,
          ),
          const SizedBox(height: 12),
          TextFormField(
            controller: _emailCtrl,
            decoration: const InputDecoration(labelText: "Email"),
            validator: _validaEmail,
            keyboardType: TextInputType.emailAddress,
          ),
          const SizedBox(height: 12),
          TextFormField(
            controller: _idadeCtrl,
            decoration: const InputDecoration(labelText: "Idade"),
            validator: _validaIdade,
            keyboardType: TextInputType.number,
          ),
          const SizedBox(height: 25),
          Row(
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              TextButton(
                child: const Text("Cancelar"),
                onPressed: () => Navigator.of(context).pop(false),
              ),
              const SizedBox(width: 12),
              ElevatedButton.icon(
                onPressed: _salvando ? null : _salvar,
                icon: _salvando
                    ? const SizedBox(
                        height: 18,
                        width: 18,
                        child: CircularProgressIndicator(strokeWidth: 2),
                      )
                    : const Icon(Icons.save),
                label: Text(_salvando
                    ? "Salvando..."
                    : (editando ? "Atualizar" : "Salvar")),
              ),
            ],
          )
        ],
      ),
    ),
  ),
);


}
}

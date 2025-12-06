import 'package:flutter/material.dart';
import '../services/api_service.dart';

// ----------------------------------------------------
// TELA PRINCIPAL
// ----------------------------------------------------

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>(); // Correção sutil de tipagem: FormState
  final usuarioCtrl = TextEditingController();
  final senhaCtrl = TextEditingController();
  
  bool loading = false;
  String? error;

  // ----------------------------------------------------
  // LÓGICA DE LOGIN
  // ----------------------------------------------------
  
  void _login() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      loading = true;
      error = null;
    });

    try {
      await ApiService.instance.login(usuarioCtrl.text.trim(), senhaCtrl.text.trim());
      
      // Se o login for bem-sucedido, navega para a rota '/home'
      if (mounted) Navigator.of(context).pushReplacementNamed('/home');

    } catch (e) {
      if (mounted) {
        setState(() {
          error = e.toString();
        });
      }
    } finally {
      if (mounted) {
        setState(() {
          loading = false;
        });
      }
    }
  }

  // ----------------------------------------------------
  // DISPOSE
  // ----------------------------------------------------

  @override
  void dispose() {
    usuarioCtrl.dispose();
    senhaCtrl.dispose();
    super.dispose();
  }
  
  // ----------------------------------------------------
  // BUILD
  // ----------------------------------------------------

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[200],
      body: Center(
        child: SingleChildScrollView(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 400),
            child: Card(
              elevation: 6,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              margin: const EdgeInsets.all(16),
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Form(
                  key: _formKey,
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        'Login',
                        style: TextStyle(
                          fontSize: 28,
                          fontWeight: FontWeight.bold,
                          color: Colors.indigo,
                        ),
                      ),
                      const SizedBox(height: 16),
                      
                      // Campo Usuário
                      TextFormField(
                        controller: usuarioCtrl,
                        decoration: const InputDecoration(labelText: 'Usuário', prefixIcon: Icon(Icons.person)),
                        validator: (v) => (v == null || v.isEmpty) ? 'Informe usuário' : null,
                      ),
                      const SizedBox(height: 12),
                      
                      // Campo Senha
                      TextFormField(
                        controller: senhaCtrl,
                        obscureText: true,
                        decoration: const InputDecoration(labelText: 'Senha', prefixIcon: Icon(Icons.lock)),
                        validator: (v) => (v == null || v.isEmpty) ? 'Informe senha' : null,
                      ),
                      const SizedBox(height: 24),
                      
                      // Botão Entrar
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton(
                          onPressed: loading ? null : _login,
                          child: loading
                              ? const SizedBox(
                                  width: 24,
                                  height: 24,
                                  child: CircularProgressIndicator(color: Colors.white, strokeWidth: 3),
                                )
                              : const Text('Entrar', style: TextStyle(fontSize: 18)),
                        ),
                      ),
                      
                      // Exibir Erro (Se houver)
                      if (error != null) ...[
                        const SizedBox(height: 12),
                        Text(error!, style: const TextStyle(color: Colors.red)),
                      ]
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
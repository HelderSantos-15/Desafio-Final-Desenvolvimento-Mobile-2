import 'package:flutter/material.dart';
import '../services/api_service.dart';

class ClientesListScreen extends StatefulWidget {
  const ClientesListScreen({super.key});

  @override
  State<ClientesListScreen> createState() => _ClientesListScreenState();
}

class _ClientesListScreenState extends State<ClientesListScreen> {
  List<dynamic> clientes = [];
  bool loading = false;

  @override
  void initState() {
    super.initState();
    fetchClientes();
  }

  Future<void> fetchClientes() async {
    setState(() => loading = true);
    try {
      clientes = await ApiService.instance.fetchClientes();
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context)
          .showSnackBar(SnackBar(content: Text("Erro: $e")));
    }
    if (mounted) setState(() => loading = false);
  }

  Future<void> _showForm({Map<String, dynamic>? cliente}) async {
    final nomeCtrl = TextEditingController(text: cliente?['nome'] ?? '');
    final sobrenomeCtrl =
        TextEditingController(text: cliente?['sobrenome'] ?? '');
    final emailCtrl = TextEditingController(text: cliente?['email'] ?? '');
    final idadeCtrl =
        TextEditingController(text: cliente?['idade']?.toString() ?? '');

    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text(cliente == null ? "Adicionar Cliente" : "Editar Cliente"),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(controller: nomeCtrl, decoration: InputDecoration(labelText: "Nome")),
            TextField(controller: sobrenomeCtrl, decoration: InputDecoration(labelText: "Sobrenome")),
            TextField(controller: emailCtrl, decoration: InputDecoration(labelText: "Email")),
            TextField(controller: idadeCtrl, decoration: InputDecoration(labelText: "Idade"), keyboardType: TextInputType.number),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx, false), child: Text("Cancelar")),
          ElevatedButton(onPressed: () => Navigator.pop(ctx, true), child: Text("Salvar")),
        ],
      ),
    );

    if (ok != true) return;

    final body = {
      "nome": nomeCtrl.text.trim(),
      "sobrenome": sobrenomeCtrl.text.trim(),
      "email": emailCtrl.text.trim(),
      "idade": int.tryParse(idadeCtrl.text.trim()) ?? 0,
    };

    try {
      if (cliente == null) {
        await ApiService.instance.createCliente(body);
      } else {
        final id = cliente['id'];
        await ApiService.instance.updateCliente(id, body);
      }
      fetchClientes();
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text("Erro: $e")));
    }
  }

  Future<void> _deleteCliente(int id) async {
    try {
      await ApiService.instance.deleteCliente(id);
      fetchClientes();
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text("Erro: $e")));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Clientes"), backgroundColor: Colors.deepPurple),
      floatingActionButton: FloatingActionButton(
        backgroundColor: Colors.deepPurple,
        onPressed: () => _showForm(),
        child: Icon(Icons.add),
      ),
      body: loading
          ? Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: fetchClientes,
              child: ListView.builder(
                padding: EdgeInsets.all(8),
                itemCount: clientes.length,
                itemBuilder: (ctx, i) {
                  final c = clientes[i];
                  return Card(
                    margin: EdgeInsets.symmetric(vertical: 6, horizontal: 12),
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12)),
                    elevation: 3,
                    child: ListTile(
                      title: Text("${c['nome']} ${c['sobrenome']}",
                          style: TextStyle(fontWeight: FontWeight.bold)),
                      subtitle:
                          Text("${c['email']} • ${c['idade']} anos"),
                      trailing: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          IconButton(
                            icon: Icon(Icons.edit, color: Colors.teal),
                            onPressed: () => _showForm(cliente: c),
                          ),
                          IconButton(
                            icon: Icon(Icons.delete, color: Colors.redAccent),
                            onPressed: () => _deleteCliente(c['id']),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
      backgroundColor: Colors.grey[100],
    );
  }
}

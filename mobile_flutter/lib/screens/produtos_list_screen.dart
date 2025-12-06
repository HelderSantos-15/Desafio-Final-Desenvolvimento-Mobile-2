import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../models/produto.dart';
import 'produto_form_screen.dart';

class ProdutosListScreen extends StatefulWidget {
  @override
  State<ProdutosListScreen> createState() => _ProdutosListScreenState();
}

class _ProdutosListScreenState extends State<ProdutosListScreen> {
  bool loading = true;
  List<Produto> produtos = [];
  String? error;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() {
      loading = true;
      error = null;
    });
    try {
      final list = await ApiService.instance.fetchProdutos();
      setState(() {
        produtos = list.map((e) => Produto.fromJson(e)).toList();
      });
    } catch (e) {
      setState(() {
        error = e.toString();
      });
    } finally {
      setState(() {
        loading = false;
      });
    }
  }

  Future<void> _delete(int id) async {
    try {
      await ApiService.instance.deleteProduto(id);
      await _load();
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Erro: $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Produtos'),
        backgroundColor: Colors.deepOrange,
        elevation: 3,
      ),
      floatingActionButton: FloatingActionButton(
        backgroundColor: Colors.teal,
        onPressed: () => Navigator.of(context)
            .push(MaterialPageRoute(builder: (_) => ProdutoFormScreen()))
            .then((_) => _load()),
        child: Icon(Icons.add, size: 28),
      ),
      body: loading
          ? Center(child: CircularProgressIndicator())
          : error != null
              ? Center(child: Text(error!))
              : ListView.builder(
                  padding: EdgeInsets.symmetric(vertical: 12),
                  itemCount: produtos.length,
                  itemBuilder: (_, i) {
                    final p = produtos[i];
                    return Card(
                      margin: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14),
                      ),
                      elevation: 4,
                      child: ListTile(
                        contentPadding:
                            EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                        title: Text(
                          p.nome,
                          style: TextStyle(
                              fontWeight: FontWeight.bold, fontSize: 18),
                        ),
                        subtitle: Padding(
                          padding: const EdgeInsets.only(top: 4.0),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(p.descricao),
                              SizedBox(height: 4),
                              Text(
                                'R\$ ${p.preco.toStringAsFixed(2)}',
                                style: TextStyle(color: Colors.green[700]),
                              ),
                              SizedBox(height: 2),
                              Text(
                                p.dataAtualizado,
                                style: TextStyle(fontSize: 12, color: Colors.grey),
                              ),
                            ],
                          ),
                        ),
                        trailing: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            IconButton(
                              icon: Icon(Icons.edit, color: Colors.teal),
                              onPressed: () => Navigator.of(context)
                                  .push(MaterialPageRoute(
                                      builder: (_) =>
                                          ProdutoFormScreen(produto: p)))
                                  .then((_) => _load()),
                            ),
                            IconButton(
                              icon: Icon(Icons.delete, color: Colors.redAccent),
                              onPressed: () => _delete(p.id!),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
      backgroundColor: Colors.grey[100],
    );
  }
}

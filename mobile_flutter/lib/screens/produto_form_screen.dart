import 'package:flutter/material.dart';
import '../models/produto.dart';
import '../services/api_service.dart';
import 'package:intl/intl.dart';

class ProdutoFormScreen extends StatefulWidget {
  final Produto? produto;
  ProdutoFormScreen({this.produto});

  @override
  State<ProdutoFormScreen> createState() => _ProdutoFormScreenState();
}

class _ProdutoFormScreenState extends State<ProdutoFormScreen> {
  final _formKey = GlobalKey<FormState>();
  final nomeCtrl = TextEditingController();
  final descricaoCtrl = TextEditingController();
  final precoCtrl = TextEditingController();
  DateTime? selectedDate;

  @override
  void initState() {
    super.initState();
    if (widget.produto != null) {
      nomeCtrl.text = widget.produto!.nome;
      descricaoCtrl.text = widget.produto!.descricao;
      precoCtrl.text = widget.produto!.preco.toString();
      selectedDate =
          DateTime.tryParse(widget.produto!.dataAtualizado) ?? DateTime.now();
    }
  }

  @override
  void dispose() {
    nomeCtrl.dispose();
    descricaoCtrl.dispose();
    precoCtrl.dispose();
    super.dispose();
  }

  Future<void> _save() async {
    if (!_formKey.currentState!.validate()) return;
    final preco = double.tryParse(precoCtrl.text.replaceAll(',', '.')) ?? 0;
    final isoDate = selectedDate!.toIso8601String();
    try {
      if (widget.produto == null) {
        await ApiService.instance.createProduto({
          'nome': nomeCtrl.text.trim(),
          'descricao': descricaoCtrl.text.trim(),
          'preco': preco,
          'data_atualizado': isoDate
        });
      } else {
        await ApiService.instance.updateProduto(widget.produto!.id!, {
          'nome': nomeCtrl.text.trim(),
          'descricao': descricaoCtrl.text.trim(),
          'preco': preco,
          'data_atualizado': isoDate
        });
      }
      Navigator.of(context).pop();
    } catch (e) {
      ScaffoldMessenger.of(context)
          .showSnackBar(SnackBar(content: Text('Erro: $e')));
    }
  }

  Future<void> _pickDate() async {
    final now = selectedDate ?? DateTime.now();
    final dt = await showDatePicker(
        context: context,
        initialDate: now,
        firstDate: DateTime(2000),
        lastDate: DateTime(2025));
    if (dt != null) {
      final tm = await showTimePicker(
          context: context, initialTime: TimeOfDay.fromDateTime(now));
      if (tm != null) {
        setState(() {
          selectedDate = DateTime(dt.year, dt.month, dt.day, tm.hour, tm.minute);
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final formatted = selectedDate == null
        ? 'Escolher data'
        : DateFormat('yyyy-MM-dd HH:mm').format(selectedDate!);

    return Scaffold(
      appBar: AppBar(
        title: Text(widget.produto == null ? 'Novo Produto' : 'Editar Produto'),
        backgroundColor: Colors.deepOrange,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              Card(
                elevation: 3,
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12)),
                margin: EdgeInsets.symmetric(vertical: 8),
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: TextFormField(
                    controller: nomeCtrl,
                    decoration: InputDecoration(
                        labelText: 'Nome', border: OutlineInputBorder()),
                    validator: (v) =>
                        (v == null || v.length < 3) ? 'Nome (3+ chars)' : null,
                  ),
                ),
              ),
              Card(
                elevation: 3,
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12)),
                margin: EdgeInsets.symmetric(vertical: 8),
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: TextFormField(
                    controller: descricaoCtrl,
                    decoration: InputDecoration(
                        labelText: 'Descrição', border: OutlineInputBorder()),
                    validator: (v) => (v == null || v.length < 3)
                        ? 'Descrição (3+ chars)'
                        : null,
                  ),
                ),
              ),
              Card(
                elevation: 3,
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12)),
                margin: EdgeInsets.symmetric(vertical: 8),
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: TextFormField(
                    controller: precoCtrl,
                    decoration: InputDecoration(
                        labelText: 'Preço', border: OutlineInputBorder()),
                    keyboardType: TextInputType.number,
                    validator: (v) => (v == null ||
                            double.tryParse(v.replaceAll(',', '.')) == null)
                        ? 'Preço inválido'
                        : null,
                  ),
                ),
              ),
              SizedBox(height: 16),
              ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.teal,
                    padding:
                        EdgeInsets.symmetric(horizontal: 24, vertical: 14),
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12))),
                onPressed: _pickDate,
                icon: Icon(Icons.calendar_today),
                label: Text(formatted),
              ),
              SizedBox(height: 24),
              ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.deepOrange,
                    padding:
                        EdgeInsets.symmetric(horizontal: 32, vertical: 16),
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12))),
                onPressed: _save,
                icon: Icon(Icons.save),
                label: Text('Salvar'),
              ),
            ],
          ),
        ),
      ),
      backgroundColor: Colors.grey[100],
    );
  }
}

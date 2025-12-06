import 'package:flutter/material.dart';
import 'clientes_list_screen.dart';
import 'produtos_list_screen.dart';
import '../services/api_service.dart';
import 'package:shared_preferences/shared_preferences.dart';

class HomeScreen extends StatelessWidget {
  Future<void> _logout(BuildContext context) async {
    await ApiService.instance.logout();
    Navigator.of(context).pushReplacementNamed('/');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Desafio Mobile II'),
        backgroundColor: Colors.deepPurple,
        actions: [
          IconButton(
              onPressed: () => _logout(context),
              icon: Icon(Icons.logout, color: Colors.white)),
        ],
      ),
      body: Container(
        color: Colors.grey[100],
        width: double.infinity,
        padding: EdgeInsets.all(24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            _menuCard(context, 'Clientes', Icons.people, Colors.orangeAccent,
                () => Navigator.of(context).push(MaterialPageRoute(
                      builder: (_) => ClientesListScreen(),
                    ))),
            SizedBox(height: 20),
            _menuCard(context, 'Produtos', Icons.shopping_bag,
                Colors.tealAccent[700]!, () => Navigator.of(context).push(
                      MaterialPageRoute(builder: (_) => ProdutosListScreen()),
                    )),
          ],
        ),
      ),
    );
  }

  Widget _menuCard(BuildContext context, String label, IconData icon,
      Color color, VoidCallback onTap) {
    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      elevation: 6,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Container(
          height: 120,
          alignment: Alignment.center,
          padding: EdgeInsets.symmetric(horizontal: 24),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.start,
            children: [
              Icon(icon, size: 48, color: color),
              SizedBox(width: 24),
              Text(
                label,
                style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: Colors.black87),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

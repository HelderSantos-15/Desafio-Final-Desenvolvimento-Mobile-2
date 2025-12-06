class Produto {
  int? id;
  String nome;
  String descricao;
  double preco;
  String dataAtualizado; // ISO string

  Produto({this.id, required this.nome, required this.descricao, required this.preco, required this.dataAtualizado});

  factory Produto.fromJson(Map<String, dynamic> json) => Produto(
    id: json['id'],
    nome: json['nome'],
    descricao: json['descricao'],
    preco: (json['preco'] is num) ? (json['preco'] as num).toDouble() : double.parse(json['preco'].toString()),
    dataAtualizado: json['data_atualizado'] ?? json['dataAtualizado'] ?? '',
  );

  Map<String, dynamic> toJson() => {
    if (id != null) 'id': id,
    'nome': nome,
    'descricao': descricao,
    'preco': preco,
    'data_atualizado': dataAtualizado,
  };
}

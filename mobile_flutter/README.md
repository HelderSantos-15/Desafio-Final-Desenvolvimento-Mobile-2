# Desafio Final - Desenvolvimento Mobile II

Este projeto é um **app Flutter** para gerenciar **clientes** e **produtos**, implementando **CRUD completo** e integração com backend.

---

## Funcionalidades

* CRUD completo para **Clientes**:

  * Campos: id, nome, sobrenome, email, idade, foto.
* CRUD completo para **Produtos**:

  * Campos: id, nome, descrição, preço, data_atualizado.
* Layout global e centralizado para todas as telas (`AppLayout`).
* Feedback para usuário: loading, validação e mensagens de erro.
* Navegação fluida entre telas usando `Navigator`.

---

## Estrutura do Projeto

```
lib/
  screens/
    home_screen.dart         # Tela inicial (opções Clientes/Produtos)
    clientes_list_screen.dart
    cliente_form_screen.dart
    produtos_list_screen.dart
    produto_form_screen.dart
  services/
    api_service.dart         # Comunicação com backend
  widgets/
    app_layout.dart          # Layout centralizado global
```

---

## AppLayout

O `AppLayout` é um wrapper global que centraliza e limita a largura do conteúdo:

```dart
body: AppLayout(
  maxWidth: 400,
  child: Card(
    child: Column(
      children: [
        Text('Exemplo'),
        // Conteúdo da tela
      ],
    ),
  ),
)
```

* `maxWidth`: largura máxima da tela.
* `padding`: espaçamento interno.

---

## Como Rodar o Projeto

1. Clone o repositório:

```
git clone <URL_DO_REPOSITORIO>
```

2. Entre na pasta do projeto:

```
cd flutter_desafio_final
```

3. Instale as dependências:

```
flutter pub get
```

4. Execute no emulador ou dispositivo:

```
flutter run
```

---

## Integração com Backend

* Todas as operações CRUD usam `ApiService`:

  * `GET`: listar clientes/produtos
  * `POST`: adicionar
  * `PUT`: editar
  * `DELETE`: remover
* Scripts para criação e alimentação do banco estão inclusos.

---

## Funcionalidades Extras

* Layout responsivo em diferentes dispositivos.
* Feedback visual:

  * Botões com loading.
  * Mensagens de erro.
* Código limpo e modular, fácil de manter.

---

## Preview

**HomeScreen** | **Clientes** | **Produtos**
![Preview](preview_app.png)

---

## Licença

MIT License

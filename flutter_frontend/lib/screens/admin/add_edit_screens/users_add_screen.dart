import 'package:flutter/material.dart';
import 'package:flutter_frontend/api/users_api.dart';
import 'package:flutter_frontend/classes/user.dart';
import 'package:flutter_frontend/controllers/user_controller.dart';

class UsersAddScreen extends StatefulWidget {
  const UsersAddScreen({super.key, required this.user});

  final User? user;

  @override
  State<UsersAddScreen> createState() => _UsersAddScreenState();
}

class _UsersAddScreenState extends State<UsersAddScreen> {
  final _nameTextEditingController = TextEditingController();
  final _emailTextEditingController = TextEditingController();
  final _passwordTextEditingController = TextEditingController();
  var _type = "common";

  Future<void> _submitForm() async {
    final token = UserController.to.token.value;
    final usersApi = UsersApi(token: token);

    final name = _nameTextEditingController.text;
    final email = _emailTextEditingController.text;
    final password = _passwordTextEditingController.text;
    final type = _type;

    late final User user;

    try {
      if (widget.user == null) {
        user = await usersApi.insertOne(
          name,
          email,
          password,
          type,
        );
      } else {
        user = await usersApi.updateOne(
          widget.user!.id,
          name,
          email,
          password,
          type,
        );
      }
    } catch (err) {
      const snackBar = SnackBar(
        content: Text("Não foi possível concluir a operação"),
      );

      ScaffoldMessenger.of(context).showSnackBar(snackBar);
      return;
    }

    Navigator.of(context).pop(user);
  }

  Future<void> _loadUser(User user) async {
    _nameTextEditingController.text = user.name;
    _emailTextEditingController.text = user.email;
    _passwordTextEditingController.text = "";

    setState(() {
      _type = user.type;
    });
  }

  @override
  void initState() {
    super.initState();

    final user = widget.user;

    if (user != null) {
      _loadUser(user);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        actions: [
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: IconButton(
              onPressed: _submitForm,
              icon: const Icon(Icons.check_outlined),
            ),
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(8.0),
        child: Form(
            child: Column(
          children: [
            TextFormField(
              controller: _nameTextEditingController,
              decoration: const InputDecoration(
                border: OutlineInputBorder(),
                label: Text("Nome"),
              ),
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return "Campo inválido";
                }

                return null;
              },
            ),
            const SizedBox(
              height: 8.0,
            ),
            TextFormField(
              controller: _emailTextEditingController,
              decoration: const InputDecoration(
                border: OutlineInputBorder(),
                label: Text("E-mail"),
              ),
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return "Campo inválido";
                }

                return null;
              },
            ),
            const SizedBox(
              height: 8.0,
            ),
            TextFormField(
              controller: _passwordTextEditingController,
              autocorrect: false,
              enableSuggestions: false,
              obscureText: true,
              decoration: const InputDecoration(
                  border: OutlineInputBorder(),
                  label: Text("Senha"),
                  hintText: "Para manter a mesma, deixe vazio"),
            ),
            const SizedBox(
              height: 8.0,
            ),
            ListView(
              shrinkWrap: true,
              children: [
                ListTile(
                  title: const Text("Administrador"),
                  leading: Radio(
                    value: "admin",
                    groupValue: _type,
                    onChanged: (value) {
                      setState(() {
                        _type = value!;
                      });
                    },
                  ),
                ),
                ListTile(
                  title: const Text("Professor"),
                  leading: Radio(
                    value: "common",
                    groupValue: _type,
                    onChanged: (value) {
                      setState(() {
                        _type = value!;
                      });
                    },
                  ),
                ),
              ],
            )
          ],
        )),
      ),
    );
  }
}

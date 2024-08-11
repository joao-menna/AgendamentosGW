import 'package:flutter/material.dart';
import 'package:flutter_frontend/api/users_api.dart';
import 'package:flutter_frontend/classes/user.dart';
import 'package:flutter_frontend/controllers/user_controller.dart';
import 'package:flutter_frontend/screens/admin/add_edit_screens/users_add_screen.dart';
import 'package:get/get.dart';

class UsersScreen extends StatefulWidget {
  const UsersScreen({super.key});

  @override
  State<UsersScreen> createState() => _UsersScreenState();
}

class _UsersScreenState extends State<UsersScreen> {
  final List<User> _users = [];
  var _loadingUsers = true;

  Future<void> _deleteUser(int userId) async {
    final token = UserController.to.token.value;
    final usersApi = UsersApi(token: token);

    try {
      final deletedUser = await usersApi.deleteOne(userId);

      _users.removeWhere((user) => user.id == deletedUser.id);
    } catch (err) {
      const snackBar = SnackBar(
        content: Text(
          "Não foi possível deletar o usuário, é necessário deletar os"
          "relacionamentos com classes (trocando o professor)",
        ),
      );

      ScaffoldMessenger.of(context).showSnackBar(snackBar);
    }
  }

  Future<void> _addOrEditUser(User? user) async {
    final result = await Get.to<User>(
      () => UsersAddScreen(user: user),
    );

    if (result == null) {
      return;
    }

    if (user == null) {
      _users.add(result);
    } else {
      final updatedUser = _users.firstWhere(
        (user) => user.id == result.id,
      );

      updatedUser.name = result.name;
      updatedUser.email = result.email;
      updatedUser.type = result.type;
    }

    setState(() {});
  }

  Future<void> _fetchUsers() async {
    final token = UserController.to.token.value;
    final usersApi = UsersApi(token: token);

    final users = await usersApi.getAll();

    _users.addAll(users);

    setState(() {
      _loadingUsers = false;
    });
  }

  @override
  void initState() {
    super.initState();

    _fetchUsers();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Usuários"),
        actions: [
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: IconButton(
              onPressed: () => _addOrEditUser(null),
              icon: const Icon(Icons.add_circle_outline),
            ),
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(8.0),
        child: _loadingUsers
            ? const Center(
                child: CircularProgressIndicator(),
              )
            : ListView.separated(
                itemCount: _users.length,
                itemBuilder: (context, index) {
                  final user = _users[index];
                  final name = switch (user.type) {
                    "common" => "Prof. ${user.name}",
                    "admin" => "Adm. ${user.name}",
                    "owner" => "Dono",
                    _ => "Não especificado",
                  };

                  return ListTile(
                    title: Text(name),
                    trailing: user.type != "owner"
                        ? Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              IconButton(
                                onPressed: () => _addOrEditUser(user),
                                icon: const Icon(Icons.edit_outlined),
                              ),
                              IconButton(
                                onPressed: () => _deleteUser(user.id),
                                icon: const Icon(Icons.delete_forever_outlined),
                              ),
                            ],
                          )
                        : null,
                  );
                },
                separatorBuilder: (context, index) {
                  return const Divider(
                    thickness: 0.1,
                    height: 1.0,
                  );
                },
              ),
      ),
    );
  }
}

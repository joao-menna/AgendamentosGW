import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_frontend/api/users_api.dart';
import 'package:flutter_frontend/controllers/user_controller.dart';
import 'package:flutter_frontend/screens/schedule_screen.dart';
import 'package:get/get.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailTextEditingController = TextEditingController();
  final _passwordTextEditingController = TextEditingController();
  var _wrongPassword = false;
  var _serverOffline = false;
  var _showPassword = false;
  var _loading = false;

  Future<void> login() async {
    setState(() {
      _loading = true;
    });

    final email = _emailTextEditingController.text;
    final password = _passwordTextEditingController.text;

    final usersApi = UsersApi();
    var token = "";

    try {
      token = await usersApi.login(email, password);
    } catch (err) {
      setState(() {
        _wrongPassword = true;
        _loading = false;
      });
      startWrongPasswordTimer();
      return;
    }

    UserController.to.token.value = token;

    final tokenedUsersApi = UsersApi(token: token);
    int? id;
    String? type;

    try {
      var user = await tokenedUsersApi.getOneByToken();
      id = user.id;
      type = user.type;
    } catch (err) {
      setState(() {
        _serverOffline = true;
        _loading = false;
      });
      startWrongPasswordTimer();
      return;
    }

    UserController.to.id.value = id;
    UserController.to.type.value = type;

    Get.off(() => const ScheduleScreen());
  }

  void startWrongPasswordTimer() {
    Timer(const Duration(seconds: 5), () {
      setState(() {
        _wrongPassword = false;
        _serverOffline = false;
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Container(
          padding: const EdgeInsets.all(16.0),
          constraints: const BoxConstraints(maxWidth: 700.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                "Agendamentos GW",
                style: TextStyle(
                  color: Colors.blue[800]!,
                  fontSize: 24.0,
                ),
              ),
              const SizedBox(
                height: 16.0,
              ),
              TextField(
                controller: _emailTextEditingController,
                enabled: !_loading,
                textInputAction: TextInputAction.next,
                decoration: const InputDecoration(
                  border: OutlineInputBorder(),
                  label: Text("E-mail"),
                ),
              ),
              const SizedBox(
                height: 16.0,
              ),
              TextField(
                controller: _passwordTextEditingController,
                enabled: !_loading,
                onSubmitted: (value) => login(),
                autocorrect: false,
                enableSuggestions: false,
                obscureText: !_showPassword,
                decoration: InputDecoration(
                  border: const OutlineInputBorder(),
                  label: const Text("Senha"),
                  suffixIcon: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 4.0),
                    child: IconButton(
                      onPressed: () {
                        setState(() {
                          _showPassword = !_showPassword;
                        });
                      },
                      icon: Icon(
                        _showPassword
                            ? Icons.visibility_off_outlined
                            : Icons.visibility_outlined,
                      ),
                    ),
                  ),
                ),
              ),
              const SizedBox(
                height: 16.0,
              ),
              ElevatedButton.icon(
                icon: _loading
                    ? Container(
                        width: 24.0,
                        height: 24.0,
                        padding: const EdgeInsets.all(2.0),
                        child: const CircularProgressIndicator(),
                      )
                    : const Icon(Icons.login_outlined),
                onPressed: _loading ? null : login,
                label: Text(_loading ? "Carregando" : "Entrar"),
              ),
              const SizedBox(
                height: 16.0,
              ),
              if (_wrongPassword)
                const Text(
                  "E-mail ou senha inválidos",
                ),
              if (_serverOffline)
                const Text(
                  "O servidor está fora do ar!",
                ),
            ],
          ),
        ),
      ),
    );
  }
}

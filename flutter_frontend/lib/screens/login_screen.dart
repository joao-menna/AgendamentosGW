import 'package:flutter/material.dart';
import 'package:flutter_frontend/constants/shared_preferences.dart';
import 'package:shared_preferences/shared_preferences.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailTextEditingController = TextEditingController();
  final _passwordTextEditingController = TextEditingController();
  var _showPassword = false;
  var _loading = false;

  Future<void> deleteTokenIfExists() async {
    var prefs = await SharedPreferences.getInstance();

    prefs.remove(tokenKey);
  }

  Future<void> login() async {
    setState(() {
      _loading = true;
    });
  }

  @override
  void initState() {
    super.initState();

    deleteTokenIfExists();
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
              )
            ],
          ),
        ),
      ),
    );
  }
}

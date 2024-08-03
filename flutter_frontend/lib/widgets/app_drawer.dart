import 'package:flutter/material.dart';
import 'package:flutter_frontend/constants/drawer_options.dart';
import 'package:flutter_frontend/constants/shared_preferences.dart';
import 'package:flutter_frontend/screens/login_screen.dart';
import 'package:get/get.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AppDrawer extends StatelessWidget {
  const AppDrawer({super.key, required this.isAdmin});

  final bool isAdmin;

  Future<void> logoff() async {
    final prefs = await SharedPreferences.getInstance();

    await prefs.remove(tokenKey);

    Get.off(() => const LoginScreen());
  }

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: Column(
        children: [
          ListView.builder(
            itemCount: commonDrawerOptions.length,
            itemBuilder: (context, index) {
              final drawerOption = commonDrawerOptions[index];

              return ListTile(
                leading: Icon(drawerOption.icon),
                title: Text(drawerOption.text),
                onTap: () => Get.to(() => drawerOption.location),
              );
            },
          ),
          if (isAdmin)
            ListView.separated(
              itemCount: adminDrawerOptions.length,
              separatorBuilder: (context, index) {
                return const Divider();
              },
              itemBuilder: (context, index) {
                final drawerOption = adminDrawerOptions[index];

                return ListTile(
                  leading: Icon(drawerOption.icon),
                  title: Text(drawerOption.text),
                  onTap: () => Get.to(() => drawerOption.location),
                );
              },
            ),
          const Divider(),
          ListView(
            padding: const EdgeInsets.symmetric(vertical: 36.0),
            children: [
              ListTile(
                title: const Text("Deslogar"),
                leading: const Icon(Icons.logout_outlined),
                onTap: logoff,
              ),
            ],
          ),
        ],
      ),
    );
  }
}

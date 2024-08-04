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
      child: ListView(
        children: [
          const ListTile(),
          ListTile(
            leading: Icon(commonDrawerOptions[0].icon),
            title: Text(commonDrawerOptions[0].text),
            onTap: () {
              if (Get.currentRoute != "ScheduleScreen") {
                Get.to(() => commonDrawerOptions[0].location);
              }
            },
          ),
          if (isAdmin)
            ListView.separated(
              shrinkWrap: true,
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
            shrinkWrap: true,
            children: [
              ListTile(
                title: const Text("Sair"),
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

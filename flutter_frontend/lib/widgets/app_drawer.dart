import 'package:flutter/material.dart';
import 'package:flutter_frontend/constants/drawer_options.dart';
import 'package:flutter_frontend/controllers/user_controller.dart';
import 'package:flutter_frontend/screens/login_screen.dart';
import 'package:get/get.dart';

class AppDrawer extends StatelessWidget {
  const AppDrawer({super.key, required this.isAdmin});

  final bool isAdmin;

  Future<void> logoff() async {
    UserController.to.id.value = 0;
    UserController.to.token.value = "";
    UserController.to.type.value = "common";

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
            const Divider(
              height: 0.1,
              thickness: 0.1,
            ),
          if (isAdmin)
            ListView.separated(
              shrinkWrap: true,
              itemCount: adminDrawerOptions.length,
              separatorBuilder: (context, index) {
                return const Divider(
                  height: 0.1,
                  thickness: 0.1,
                );
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
          const Divider(
            height: 0.1,
            thickness: 0.1,
          ),
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

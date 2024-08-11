import 'package:flutter/material.dart';
import 'package:flutter_frontend/api/resources_api.dart';
import 'package:flutter_frontend/classes/resource.dart';
import 'package:flutter_frontend/controllers/schedule_controller.dart';
import 'package:flutter_frontend/controllers/user_controller.dart';
import 'package:flutter_frontend/screens/admin/add_edit_screens/resources_add_screen.dart';
import 'package:get/get.dart';

class ResourcesScreen extends StatefulWidget {
  const ResourcesScreen({super.key});

  @override
  State<ResourcesScreen> createState() => _ResourcesScreenState();
}

class _ResourcesScreenState extends State<ResourcesScreen> {
  Future<void> _deleteResource(int resourceId) async {
    final token = UserController.to.token.value;
    final resourcesApi = ResourcesApi(token: token);

    try {
      final deletedResource = await resourcesApi.deleteOne(resourceId);

      ScheduleController.to.resources.removeWhere(
        (resource) => resource.id == deletedResource.id,
      );
    } catch (err) {
      const snackBar = SnackBar(
        content: Text(
          "Não foi possível deletar o recurso, é necessário deletar "
          "os relacionamentos com classe e os agendamentos antigos",
        ),
      );

      ScaffoldMessenger.of(context).showSnackBar(snackBar);
    }
  }

  Future<void> _addOrEditResource(Resource? resource) async {
    final result = await Get.to(() => ResourcesAddScreen(resource: resource));

    if (result != null && result) {
      setState(() {});
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Recursos"),
        actions: [
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: IconButton(
              onPressed: () => _addOrEditResource(null),
              icon: const Icon(Icons.add_circle_outline),
            ),
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(8.0),
        child: Obx(
          () => ListView.separated(
            itemCount: ScheduleController.to.resources.length,
            itemBuilder: (context, index) {
              final resource = ScheduleController.to.resources[index];
              return ListTile(
                title: Text(resource.name),
                trailing: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    IconButton(
                      onPressed: () => _addOrEditResource(resource),
                      icon: const Icon(Icons.edit_outlined),
                    ),
                    IconButton(
                      onPressed: () => _deleteResource(resource.id),
                      icon: const Icon(Icons.delete_forever_outlined),
                    ),
                  ],
                ),
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
      ),
    );
  }
}

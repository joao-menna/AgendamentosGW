import 'package:flutter/material.dart';
import 'package:flutter_frontend/classes/klass.dart';
import 'package:flutter_frontend/controllers/schedule_controller.dart';
import 'package:flutter_frontend/screens/admin/add_edit_screens/classes_add_screen.dart';
import 'package:get/get.dart';

class ClassesScreen extends StatefulWidget {
  const ClassesScreen({super.key});

  @override
  State<ClassesScreen> createState() => _ClassesScreenState();
}

class _ClassesScreenState extends State<ClassesScreen> {
  Future<void> _addOrEditClass(Klass? klass) async {
    final result = await Get.to<bool>(
      () => ClassesAddScreen(
        klass: klass,
      ),
    );

    if (result != null && result) {
      setState(() {});
    }
  }

  Future<void> _deleteClass() async {}

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Turmas"),
        actions: [
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: IconButton(
              onPressed: () => _addOrEditClass(null),
              icon: const Icon(Icons.add_circle_outline),
            ),
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(8.0),
        child: Obx(
          () => ListView.separated(
            itemCount: ScheduleController.to.classes.length,
            itemBuilder: (context, index) {
              final klass = ScheduleController.to.classes[index];

              return ListTile(
                title: Text(klass.name),
                trailing: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    IconButton(
                      onPressed: () => _addOrEditClass(klass),
                      icon: const Icon(Icons.edit_outlined),
                    ),
                    const SizedBox(
                      width: 8.0,
                    ),
                    IconButton(
                      onPressed: _deleteClass,
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

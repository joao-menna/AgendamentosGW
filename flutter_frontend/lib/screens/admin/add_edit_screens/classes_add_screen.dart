import 'package:flutter/material.dart';
import 'package:flutter_frontend/api/users_api.dart';
import 'package:flutter_frontend/classes/class_resource.dart';
import 'package:flutter_frontend/classes/klass.dart';
import 'package:flutter_frontend/classes/user.dart';
import 'package:flutter_frontend/constants/periods.dart';
import 'package:flutter_frontend/controllers/schedule_controller.dart';
import 'package:flutter_frontend/controllers/user_controller.dart';

class ClassesAddScreen extends StatefulWidget {
  const ClassesAddScreen({super.key, this.klass});

  final Klass? klass;

  @override
  State<ClassesAddScreen> createState() => _ClassesAddScreenState();
}

class _ClassesAddScreenState extends State<ClassesAddScreen> {
  final _nameTextEditingController = TextEditingController();
  List<ClassResource> _classResources = [];
  bool _loadingClassResources = true;
  List<User> _teachers = [];
  String? _period = "matutine";
  int? _teacherId;

  Future<void> _submitForm() async {}

  Future<void> _loadClass(Klass klass) async {
    _nameTextEditingController.text = klass.name;
    setState(() {
      _period = klass.period;
      _teacherId = klass.teacherId;
    });

    _classResources = ScheduleController.to.classResources
        .where(
          (classResource) => classResource.classId == klass.id,
        )
        .toList();

    setState(() {
      _loadingClassResources = false;
    });
  }

  Future<void> _getAllTeachers() async {
    final token = UserController.to.token.value;
    final usersApi = UsersApi(token: token);

    _teachers = await usersApi.getAll();
    setState(() {});
  }

  @override
  void initState() {
    super.initState();

    _getAllTeachers();

    final klass = widget.klass;

    if (klass != null) {
      _loadClass(klass);
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
        child: SingleChildScrollView(
          child: Form(
            child: Column(
              children: [
                TextFormField(
                  controller: _nameTextEditingController,
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return "Campo inválido";
                    }

                    return null;
                  },
                  decoration: const InputDecoration(
                    border: OutlineInputBorder(),
                    label: Text("Nome"),
                  ),
                ),
                DropdownMenu<String>(
                  label: const Text("Período"),
                  initialSelection: _period,
                  onSelected: (value) {
                    setState(() {
                      _period = value;
                    });
                  },
                  dropdownMenuEntries: periods.keys.map(
                    (key) {
                      final value = periods[key];
                      return DropdownMenuEntry(value: key, label: "$value");
                    },
                  ).toList(),
                ),
                DropdownMenu<int>(
                  label: const Text("Professor"),
                  onSelected: (value) {
                    setState(() {
                      _teacherId = value;
                    });
                  },
                  initialSelection: _teacherId,
                  dropdownMenuEntries: _teachers.isNotEmpty
                      ? _teachers.map(
                          (user) {
                            return DropdownMenuEntry(
                                value: user.id, label: user.name);
                          },
                        ).toList()
                      : [],
                  trailingIcon: _teachers.isNotEmpty
                      ? null
                      : const CircularProgressIndicator(),
                ),
                if (_loadingClassResources)
                  const Center(
                    child: CircularProgressIndicator(),
                  ),
                if (!_loadingClassResources)
                  Row(
                    children: [
                      DropdownMenu<int>(
                        dropdownMenuEntries:
                            ScheduleController.to.resources.map(
                          (resource) {
                            return DropdownMenuEntry(
                              value: resource.id,
                              label: resource.name,
                            );
                          },
                        ).toList(),
                      ),
                      const SizedBox(
                        width: 8.0,
                      ),
                      ElevatedButton(
                        onPressed: () {},
                        child: const Text("Adicionar"),
                      ),
                    ],
                  ),
                if (!_loadingClassResources)
                  ListView.separated(
                    shrinkWrap: true,
                    itemBuilder: (context, index) {
                      final classResource = _classResources[index];
                      final resource =
                          ScheduleController.to.resources.singleWhere(
                        (resource) => resource.id == classResource.resourceId,
                      );
                      return ListTile(
                        title: Text(resource.name),
                        trailing: IconButton(
                          icon: const Icon(Icons.delete_forever_outlined),
                          onPressed: () {},
                        ),
                      );
                    },
                    separatorBuilder: (context, index) {
                      return const Divider(
                        thickness: 0.1,
                        height: 1.0,
                      );
                    },
                    itemCount: _classResources.length,
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

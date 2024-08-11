import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_frontend/api/classes_api.dart';
import 'package:flutter_frontend/api/users_api.dart';
import 'package:flutter_frontend/classes/class_resource.dart';
import 'package:flutter_frontend/classes/klass.dart';
import 'package:flutter_frontend/classes/user.dart';
import 'package:flutter_frontend/constants/periods.dart';
import 'package:flutter_frontend/controllers/schedule_controller.dart';
import 'package:flutter_frontend/controllers/user_controller.dart';
import 'package:get/get.dart';

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
  int? _resourceId;
  int? _teacherId;

  Future<void> _addClassResource() async {
    ClassResource? foundClassResource = _classResources.firstWhereOrNull(
      (classResource) => classResource.resourceId == _resourceId,
    );

    if (foundClassResource != null) {
      const snackBar = SnackBar(content: Text("Recurso já presente na lista"));
      ScaffoldMessenger.of(context).showSnackBar(snackBar);
      return;
    }

    setState(() {
      _loadingClassResources = true;
    });

    final token = UserController.to.token.value;
    final classesApi = ClassesApi(token: token);

    try {
      final classResource = await classesApi.insertOneResource(
        widget.klass!.id,
        _resourceId!,
      );
      _classResources.add(classResource);
      ScheduleController.to.classResources.add(classResource);
    } catch (err) {
      const snackBar = SnackBar(
        content: Text("Não foi possível concluir a operação"),
      );
      ScaffoldMessenger.of(context).showSnackBar(snackBar);
    }

    setState(() {
      _loadingClassResources = false;
    });
  }

  Future<void> _deleteClassResource(int resourceId) async {
    setState(() {
      _loadingClassResources = true;
    });

    final token = UserController.to.token.value;
    final classesApi = ClassesApi(token: token);

    try {
      final classResource = await classesApi.deleteOneResource(
        widget.klass!.id,
        resourceId,
      );

      ScheduleController.to.classResources.removeWhere(
        (klassResource) => klassResource.id == classResource.id,
      );

      _classResources.removeWhere(
        (klassResource) => klassResource.id == classResource.id,
      );
    } catch (err) {
      const snackBar = SnackBar(
        content: Text("Não foi possível concluir a operação"),
      );

      ScaffoldMessenger.of(context).showSnackBar(snackBar);
    }

    setState(() {
      _loadingClassResources = false;
    });
  }

  Future<void> _submitForm() async {
    if (_period == null || _teacherId == null) {
      const snackBar = SnackBar(
        content: Text("Preencha os campos corretamente"),
      );
      ScaffoldMessenger.of(context).showSnackBar(snackBar);
      return;
    }

    final token = UserController.to.token.value;
    final classesApi = ClassesApi(token: token);

    final name = _nameTextEditingController.text;
    final period = _period!;
    final teacherId = _teacherId!;

    try {
      if (widget.klass == null) {
        final klass = await classesApi.insertOne(
          name,
          period,
          teacherId,
        );

        ScheduleController.to.classes.add(klass);
      } else {
        final updatedKlass = await classesApi.updateOne(
          widget.klass!.id,
          name,
          period,
          teacherId,
        );

        var klass = ScheduleController.to.classes.firstWhere(
          (klass) => klass.id == widget.klass!.id,
        );

        klass.name = updatedKlass.name;
        klass.period = updatedKlass.period;
        klass.teacherId = updatedKlass.teacherId;
      }
    } catch (err) {
      const snackBar = SnackBar(
        content: Text("Não foi possível concluir a operação"),
      );

      ScaffoldMessenger.of(context).showSnackBar(snackBar);
      return;
    }

    Navigator.of(context).pop(true);
  }

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
                const SizedBox(
                  height: 8.0,
                ),
                DropdownMenu<String>(
                  width: MediaQuery.of(context).size.width - 16.0,
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
                const SizedBox(
                  height: 8.0,
                ),
                DropdownMenu<int>(
                  width: MediaQuery.of(context).size.width - 16.0,
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
                      : const SizedBox(
                          width: 24.0,
                          height: 24.0,
                          child: CircularProgressIndicator(),
                        ),
                ),
                if (widget.klass != null)
                  const SizedBox(
                    height: 8.0,
                  ),
                if (widget.klass != null)
                  const Center(
                    child: Text(
                      "Relacionar recursos",
                      style: TextStyle(fontSize: 16.0),
                    ),
                  ),
                if (widget.klass != null)
                  const SizedBox(
                    height: 8.0,
                  ),
                if (_loadingClassResources && widget.klass != null)
                  const Center(
                    child: CircularProgressIndicator(),
                  ),
                if (!_loadingClassResources)
                  Column(
                    children: [
                      DropdownMenu<int>(
                        width: MediaQuery.of(context).size.width - 16.0,
                        label: const Text("Recurso"),
                        onSelected: (value) {
                          setState(() {
                            _resourceId = value;
                          });
                        },
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
                        height: 8.0,
                      ),
                      ElevatedButton(
                        onPressed:
                            _resourceId != null ? _addClassResource : null,
                        child: const Text("Adicionar"),
                      ),
                      const SizedBox(
                        height: 8.0,
                      ),
                      ListView.separated(
                        shrinkWrap: true,
                        itemBuilder: (context, index) {
                          final classResource = _classResources[index];
                          final resource =
                              ScheduleController.to.resources.singleWhere(
                            (resource) =>
                                resource.id == classResource.resourceId,
                          );
                          return ListTile(
                            title: Text(resource.name),
                            trailing: IconButton(
                              icon: const Icon(Icons.delete_forever_outlined),
                              onPressed: () =>
                                  _deleteClassResource(resource.id),
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
                  )
              ],
            ),
          ),
        ),
      ),
    );
  }
}

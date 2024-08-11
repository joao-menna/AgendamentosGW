import 'package:flutter/material.dart';
import 'package:flutter_frontend/api/resources_api.dart';
import 'package:flutter_frontend/classes/resource.dart';
import 'package:flutter_frontend/controllers/schedule_controller.dart';
import 'package:flutter_frontend/controllers/user_controller.dart';

class ResourcesAddScreen extends StatefulWidget {
  const ResourcesAddScreen({super.key, required this.resource});

  final Resource? resource;

  @override
  State<ResourcesAddScreen> createState() => _ResourcesAddScreenState();
}

class _ResourcesAddScreenState extends State<ResourcesAddScreen> {
  final _nameTextEditingController = TextEditingController();

  Future<void> _submitForm() async {
    final token = UserController.to.token.value;
    final resourcesApi = ResourcesApi(token: token);

    final name = _nameTextEditingController.text;

    try {
      if (widget.resource == null) {
        final resource = await resourcesApi.insertOne(
          name,
        );

        ScheduleController.to.resources.add(resource);
      } else {
        final updatedResource = await resourcesApi.updateOne(
          widget.resource!.id,
          name,
        );

        var resource = ScheduleController.to.resources.firstWhere(
          (res) => res.id == widget.resource!.id,
        );

        resource.name = updatedResource.name;
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

  Future<void> _loadResource(Resource resource) async {
    _nameTextEditingController.text = resource.name;
  }

  @override
  void initState() {
    super.initState();

    final resource = widget.resource;

    if (resource != null) {
      _loadResource(resource);
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
        child: Form(
          child: Column(
            children: [
              TextFormField(
                controller: _nameTextEditingController,
                decoration: const InputDecoration(
                  border: OutlineInputBorder(),
                  label: Text("Nome"),
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return "Campo inválido";
                  }

                  return null;
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}

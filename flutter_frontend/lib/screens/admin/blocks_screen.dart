import 'package:flutter/material.dart';
import 'package:flutter_frontend/controllers/schedule_controller.dart';
import 'package:get/get.dart';

class BlocksScreen extends StatefulWidget {
  const BlocksScreen({super.key});

  @override
  State<BlocksScreen> createState() => _BlocksScreenState();
}

class _BlocksScreenState extends State<BlocksScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Bloqueios"),
      ),
      body: Padding(
        padding: const EdgeInsets.all(8.0),
        child: Obx(
          () => ListView.separated(
            itemCount: ScheduleController.to.blocks.length,
            itemBuilder: (context, index) {
              final block = ScheduleController.to.blocks[index];
              final hourUsed = ScheduleController.to.hours.singleWhere(
                (hour) => hour.id == block.hourId,
              );
              final hourNumberClassText = switch (hourUsed.classNumber) {
                1 => 'Primeira aula',
                2 => 'Segunda aula',
                3 => 'Terceira aula',
                4 => 'Quarta aula',
                5 => 'Quinta aula',
                _ => 'Aula não identificada'
              };

              return ListTile(
                title: Text("${block.date} - $hourNumberClassText"),
                trailing: IconButton(
                  onPressed: () {},
                  icon: const Icon(Icons.delete_forever_outlined),
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

import 'package:calendar_view/calendar_view.dart';
import 'package:flutter/material.dart';
import 'package:flutter_frontend/api/blocks_api.dart';
import 'package:flutter_frontend/constants/schedule_colors.dart';
import 'package:flutter_frontend/controllers/schedule_controller.dart';
import 'package:flutter_frontend/controllers/user_controller.dart';
import 'package:flutter_frontend/functions/format_date.dart';
import 'package:flutter_frontend/screens/admin/add_edit_screens/blocks_add_screen.dart';
import 'package:get/get.dart';

class BlocksScreen extends StatefulWidget {
  const BlocksScreen({super.key});

  @override
  State<BlocksScreen> createState() => _BlocksScreenState();
}

class _BlocksScreenState extends State<BlocksScreen> {
  Future<void> _removeBlock(int blockId) async {
    final token = UserController.to.token.value;
    final blocksApi = BlocksApi(token: token);

    try {
      final block = await blocksApi.deleteOne(blockId);

      ScheduleController.to.blocks.removeWhere(
        (blockEl) => blockEl.id == blockId,
      );

      final hourUsed = ScheduleController.to.hours.singleWhere(
        (hour) => hour.id == block.hourId,
      );

      final date = DateTime.parse(block.date);
      final dateStr = date.toIso8601String().split("T")[0];
      DateTime startTime = DateTime.parse("$dateStr ${hourUsed.start}:00");
      DateTime endTime = DateTime.parse("$dateStr ${hourUsed.finish}:00");

      if (block.period == "vespertine") {
        const duration = Duration(hours: 6);

        startTime = startTime.add(duration);
        endTime = endTime.add(duration);
      }

      CalendarControllerProvider.of(context).controller.removeWhere(
            (ev) =>
                ev.date == date &&
                ev.startTime == startTime &&
                ev.endTime == endTime &&
                ev.color == blockColor,
          );
    } catch (err) {
      const snackBar = SnackBar(
        content: Text("Erro ao remover bloqueio"),
      );

      ScaffoldMessenger.of(context).showSnackBar(snackBar);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Bloqueios"),
        actions: [
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: IconButton(
              onPressed: () => Get.to(() => const BlocksAddScreen()),
              icon: const Icon(Icons.add_circle_outline),
            ),
          )
        ],
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

              final date = DateTime.parse(block.date);
              final dateFormatted = formatFullDate(date);

              return ListTile(
                title: Text("$dateFormatted - $hourNumberClassText"),
                trailing: IconButton(
                  onPressed: () => _removeBlock(block.id),
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

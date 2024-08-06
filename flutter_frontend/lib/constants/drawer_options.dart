import 'package:flutter/material.dart';
import 'package:flutter_frontend/classes/drawer_option.dart';
import 'package:flutter_frontend/screens/admin/blocks_screen.dart';
import 'package:flutter_frontend/screens/admin/classes_screen.dart';
import 'package:flutter_frontend/screens/admin/resources_screen.dart';
import 'package:flutter_frontend/screens/admin/users_screen.dart';

final adminDrawerOptions = <DrawerOption>[
  DrawerOption(
    icon: Icons.devices_outlined,
    text: "Recursos",
    location: const ResourcesScreen(),
  ),
  DrawerOption(
    icon: Icons.school_outlined,
    text: "Turmas",
    location: const ClassesScreen(),
  ),
  DrawerOption(
    icon: Icons.group_outlined,
    text: "Usuários",
    location: const UsersScreen(),
  ),
  DrawerOption(
    icon: Icons.block_outlined,
    text: "Bloqueios",
    location: const BlocksScreen(),
  ),
];

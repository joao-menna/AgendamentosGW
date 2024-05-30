import React, { useState, useEffect } from "react";
import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useAppSelector } from "../../hooks";
import ClassesService from "../../services/classes";
import UserService from "../../services/users";
import SideMenu from "../../components/sideMenu";
import { UserType } from "../../slices/userSlice";

interface IClass {
  id: number;
  name: string;
  period: "matutine" | "vespertine";
  teacherId: number;
}

interface User {
  id: number;
  name: string;
  type: UserType;
}

const ClassPage: React.FC = () => {
  const [classes, setClasses] = useState<IClass[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [period, setPeriod] = useState<"matutine" | "vespertine">("matutine");
  const [teacherId, setTeacherId] = useState<number | string>("");
  const [teachers, setTeachers] = useState<User[]>([]);
  const [editing, setEditing] = useState<IClass | null>(null);
  const token = useAppSelector((state) => state.user.token);

  useEffect(() => {
    const fetchClasses = async () => {
      const classService = new ClassesService(token);
      const fetchedClasses = await classService.getAll();
      const classData = fetchedClasses.map(
        (item: { class: IClass }) => item.class
      );
      setClasses(classData);
    };

    const fetchTeachers = async () => {
      const userService = new UserService(token);
      const fetchedUsers = await userService.getAll();
      const teacherData = fetchedUsers.filter(
        (user: User) => user.type === "common"
      );
      setTeachers(teacherData);
    };

    fetchClasses();
    fetchTeachers();
  }, [token]);

  const handleAddClass = async () => {
    const classService = new ClassesService(token);
    const newClass = {
      name,
      period,
      teacherId: parseInt(teacherId as string, 10),
    };
    const addedClass = await classService.insertOne(newClass);
    setClasses([...classes, addedClass]);
    setIsModalOpen(false);
    resetForm();
  };

  const handleEditClass = async () => {
    if (editing) {
      const classService = new ClassesService(token);
      const updatedClass = {
        name,
        period,
        teacherId: parseInt(teacherId as string, 10),
      };
      const updated = await classService.updateOne(editing.id, updatedClass);
      setClasses(classes.map((cls) => (cls.id === editing.id ? updated : cls)));
      setIsModalOpen(false);
      resetForm();
    }
  };

  const handleDeleteClass = async (classId: number) => {
    const classService = new ClassesService(token);
    await classService.deleteOne(classId);
    setClasses(classes.filter((cls) => cls.id !== classId));
  };

  const openEditModal = (cls: IClass) => {
    setEditing(cls);
    setName(cls.name);
    setPeriod(cls.period);
    setTeacherId(cls.teacherId);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setName("");
    setPeriod("matutine");
    setTeacherId("");
    setEditing(null);
  };

  return (
    <div style={{ display: "flex" }}>
      <SideMenu />
      <Container maxWidth="md">
        <h1>Turma</h1>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setIsModalOpen(true);
            resetForm();
          }}
        >
          Adicionar
        </Button>
        <Dialog
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            {editing ? "Editar Turma" : "Adicionar Turma"}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Nome"
              type="text"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Período</InputLabel>
              <Select
                value={period}
                onChange={(e) =>
                  setPeriod(e.target.value as "matutine" | "vespertine")
                }
              >
                <MenuItem value="matutine">Matutino</MenuItem>
                <MenuItem value="vespertine">Vespertino</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="dense">
              <InputLabel>Professor</InputLabel>
              <Select
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value as number)}
              >
                {teachers.map((teacher) => (
                  <MenuItem key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsModalOpen(false)} color="primary">
              Cancelar
            </Button>
            <Button
              onClick={editing ? handleEditClass : handleAddClass}
              color="primary"
            >
              {editing ? "Salvar" : "Adicionar"}
            </Button>
          </DialogActions>
        </Dialog>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Período</TableCell>
              <TableCell>Professor</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {classes.map((cls) => (
              <TableRow key={cls.id}>
                <TableCell>{cls.name}</TableCell>
                <TableCell>{cls.period}</TableCell>
                <TableCell>
                  {teachers.find((t) => t.id === cls.teacherId)?.name}
                </TableCell>
                <TableCell>
                  <IconButton
                    aria-label="editar"
                    onClick={() => openEditModal(cls)}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    aria-label="deletar"
                    onClick={() => handleDeleteClass(cls.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Container>
    </div>
  );
};

export default ClassPage;

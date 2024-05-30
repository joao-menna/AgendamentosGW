import React, { useState, useEffect } from "react";
import {
  Button,
  Container,
  Checkbox,
  FormControlLabel,
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
  FormGroup,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import SideMenu from "../../components/sideMenu";
import { useAppSelector } from "../../hooks";
import UserService from "../../services/users";
import { UserType } from "../../slices/userSlice";

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  type: UserType;
}

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isAdminChecked, setIsAdminChecked] = useState(false);
  const [isProfessorChecked, setIsProfessorChecked] = useState(false);
  const token = useAppSelector((state) => state.user.token);

  useEffect(() => {
    (async () => {
      const userService = new UserService(token);
      const fetchedUsers = await userService.getAll();
      setUsers(fetchedUsers);
    })();
  }, [token]);

  const handleAddUser = async () => {
    const userService = new UserService(token);
    const newUserType: UserType = isAdminChecked ? "admin" : "common";
    const newUser = { name, email, password, type: newUserType };
    const addedUser = await userService.insertOne(newUser);
    setUsers([...users, addedUser]);
    setIsModalOpen(false);
    setName("");
    setEmail("");
    setPassword("");
    setIsAdminChecked(false);
    setIsProfessorChecked(false);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setName(user.name);
    setEmail(user.email);
    setPassword(user.password);
    setIsAdminChecked(user.type === "admin");
    setIsProfessorChecked(user.type === "common");
    setIsModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (editingUser) {
      const userService = new UserService(token);
      const updatedUserType: UserType = isAdminChecked ? "admin" : "common";
      const updatedUser = { name, email, password, type: updatedUserType };
      await userService.updateOne(editingUser.id, updatedUser);
      const updatedUsers = users.map((user) =>
        user.id === editingUser.id ? { ...user, ...updatedUser } : user
      );
      setUsers(updatedUsers);
      setIsModalOpen(false);
      setEditingUser(null);
      setName("");
      setEmail("");
      setPassword("");
      setIsAdminChecked(false);
      setIsProfessorChecked(false);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    const userService = new UserService(token);
    await userService.deleteOne(userId);
    const updatedUsers = users.filter((user) => user.id !== userId);
    setUsers(updatedUsers);
  };

  const handleAdminCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsAdminChecked(event.target.checked);
    if (event.target.checked) {
      setIsProfessorChecked(false);
    }
  };

  const handleProfessorCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsProfessorChecked(event.target.checked);
    if (event.target.checked) {
      setIsAdminChecked(false);
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <SideMenu />
      <Container maxWidth="md">
        <h1>Usuários</h1>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setIsModalOpen(true);
            setEditingUser(null);
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
            {editingUser ? "Editar Usuário" : "Adicionar Usuário"}
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
            <TextField
              margin="dense"
              label="E-mail"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Senha"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isProfessorChecked}
                    onChange={handleProfessorCheckboxChange}
                    name="professor"
                  />
                }
                label="Professor"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isAdminChecked}
                    onChange={handleAdminCheckboxChange}
                    name="admin"
                  />
                }
                label="Admin"
              />
            </FormGroup>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsModalOpen(false)} color="primary">
              Cancelar
            </Button>
            <Button
              onClick={editingUser ? handleSaveEdit : handleAddUser}
              color="primary"
            >
              {editingUser ? "Salvar" : "Adicionar"}
            </Button>
          </DialogActions>
        </Dialog>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Senha</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.password}</TableCell>
                <TableCell>{user.type}</TableCell>
                <TableCell>
                  <IconButton
                    aria-label="editar"
                    onClick={() => handleEditUser(user)}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    aria-label="deletar"
                    onClick={() => handleDeleteUser(user.id)}
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

export default UsersPage;

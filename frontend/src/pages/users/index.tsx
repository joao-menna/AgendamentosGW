import { UserInsertBody, UserUpdateBody } from "../../interfaces/user"
import FormControlLabel from "@mui/material/FormControlLabel"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import FormControl from "@mui/material/FormControl"
import { UserType } from "../../slices/userSlice"
import IconButton from "@mui/material/IconButton"
import RadioGroup from "@mui/material/RadioGroup"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableHead from "@mui/material/TableHead"
import Container from "@mui/material/Container"
import TextField from "@mui/material/TextField"
import FormLabel from "@mui/material/FormLabel"
import { useNavigate } from "react-router-dom"
import UserService from "../../services/users"
import TableRow from "@mui/material/TableRow"
import { useAppSelector } from "../../hooks"
import { useState, useEffect } from "react"
import Dialog from "@mui/material/Dialog"
import Button from "@mui/material/Button"
import Table from "@mui/material/Table"
import Radio from "@mui/material/Radio"
import Icon from "@mui/material/Icon"


interface User {
  id: number
  name: string
  email: string
  password: string
  type: UserType
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [editingUserId, setEditingUserId] = useState<number | undefined>()
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [typeInput, setTypeInput] = useState<UserType>('common')
  const [loading, setLoading] = useState<boolean>(false)
  const { token, type } = useAppSelector((state) => state.user);
  const navigate = useNavigate()

  useEffect(() => {
    if (!type) {
      return
    }

    if (!['admin', 'owner'].includes(type)) {
      navigate('/')
      return
    }

    (async () => {
      const userService = new UserService(token);
      const fetchedUsers = await userService.getAll();
      setUsers(fetchedUsers);
    })();
  }, []);

  const getUserToSend = () => ({
    name,
    email,
    password,
    type: typeInput
  })

  const handleAddUser = async () => {
    setLoading(true)

    const userService = new UserService(token);

    const newUser: UserInsertBody = getUserToSend()

    const addedUser = await userService.insertOne(newUser)
    setUsers([...users, addedUser])

    clearInput()
    setModalOpen(false)

    setLoading(false)
  }

  const clearInput = () => {
    setName("")
    setEmail("")
    setPassword("")
    setTypeInput("common")
  }

  const handleEditUser = (user: User) => {
    setEditingUserId(user.id)

    setModalOpen(true)

    setName(user.name)
    setEmail(user.email)
    setTypeInput(user.type)
    setPassword(user.password)
  }

  const handleSaveEdit = async () => {
    if (!editingUserId) {
      return
    }

    setLoading(true)

    const userService = new UserService(token)
    const updatedUser: UserUpdateBody = getUserToSend()

    await userService.updateOne(editingUserId, updatedUser)

    const newUsers = users
    const user = newUsers.find((val) => val.id === editingUserId)
    if (!user) {
      return
    }

    user.name = updatedUser.name!
    user.email = updatedUser.email!
    user.password = updatedUser.password!
    user.type = updatedUser.type!

    setUsers(newUsers)
    clearInput()

    setEditingUserId(undefined)
    setModalOpen(false)

    setLoading(false)
  }

  const handleDeleteUser = async (userId: number) => {
    const userService = new UserService(token)
    await userService.deleteOne(userId)

    const updatedUsers = users.filter((user) => user.id !== userId)

    setUsers(updatedUsers)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    clearInput()
  }

  return (
    <div style={{ display: "flex" }}>
      <Container maxWidth="md">
        <h1>Usuários</h1>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setModalOpen(true)}
        >
          Adicionar
        </Button>
        <Dialog
          open={modalOpen}
          onClose={() => loading ? undefined : setModalOpen(false)}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            {editingUserId ? "Editar Usuário" : "Adicionar Usuário"}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Nome"
              type="text"
              fullWidth
              value={name ?? ''}
              onChange={(e) => setName(e.target.value)}
            />

            <TextField
              margin="dense"
              label="E-mail"
              type="email"
              autoComplete="off"
              fullWidth
              value={email ?? ''}
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              margin="dense"
              label="Senha"
              type="password"
              autoComplete="off"
              fullWidth
              value={password ?? ''}
              onChange={(e) => setPassword(e.target.value)}
            />

            <FormControl>
              <FormLabel>Tipo</FormLabel>

              <RadioGroup value={typeInput ?? 'common'} onChange={(e) => setTypeInput(e.target.value as UserType)}>
                <FormControlLabel value={'common'} control={<Radio />} label="Professor" />

                <FormControlLabel value={'admin'} control={<Radio />} label="Administrador" />
              </RadioGroup>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseModal}
              disabled={loading}
              color="primary"
            >
              Cancelar
            </Button>

            <Button
              onClick={editingUserId ? handleSaveEdit : handleAddUser}
              disabled={loading}
              color="primary"
            >
              {editingUserId ? "Salvar" : "Adicionar"}
            </Button>
          </DialogActions>
        </Dialog>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.type === 'admin' && 'Administrador'}
                  {user.type === 'common' && 'Professor'}
                  {user.type === 'owner' && 'Dono(a)'}
                </TableCell>
                <TableCell>
                  {
                    user.type !== 'owner' &&
                    <>
                      <IconButton
                        aria-label="editar"
                        onClick={() => handleEditUser(user)}
                        size="small"
                      >
                        <Icon>edit_outline</Icon>
                      </IconButton>
                      <IconButton
                        size="small"
                        aria-label="deletar"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Icon>delete_outline</Icon>
                      </IconButton>
                    </>
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Container>
    </div>
  )
}

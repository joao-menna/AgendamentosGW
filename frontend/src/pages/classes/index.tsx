import { ClassInsertBody, ClassUpdateBody } from "../../interfaces/class"
import CircularProgress from "@mui/material/CircularProgress"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import ClassesService from "../../services/classes"
import DialogTitle from "@mui/material/DialogTitle"
import FormControl from "@mui/material/FormControl"
import ClassService from "../../services/classes"
import { UserType } from "../../slices/userSlice"
import IconButton from "@mui/material/IconButton"
import InputLabel from "@mui/material/InputLabel"
import Container from "@mui/material/Container"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableHead from "@mui/material/TableHead"
import TextField from "@mui/material/TextField"
import { useNavigate } from "react-router-dom"
import UserService from "../../services/users"
import TableRow from "@mui/material/TableRow"
import MenuItem from "@mui/material/MenuItem"
import { useAppSelector } from "../../hooks"
import { useState, useEffect } from "react"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import Select from "@mui/material/Select"
import Table from "@mui/material/Table"
import Icon from "@mui/material/Icon"
import Box from "@mui/material/Box"
import { Typography } from "@mui/material"
import ResourcesService from "../../services/resources"

type Period = "matutine" | "vespertine"

interface Class {
  id: number
  name: string
  period: Period
  teacherId: number
}

interface Resource {
  id: number
  name: string
}

interface ClassResourceResponse {
  resource: Resource
}

interface User {
  id: number
  name: string
  type: UserType
}

export default function ClassPage() {
  const [classes, setClasses] = useState<Class[]>([])
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [name, setName] = useState<string>("")
  const [resources, setResources] = useState<Resource[]>([])
  const [selectedResourceId, setSelectedResourceId] = useState<number | undefined>()
  const [classResources, setClassResources] = useState<Resource[]>([])
  const [period, setPeriod] = useState<Period>("matutine")
  const [teacherId, setTeacherId] = useState<number | undefined>()
  const [teachers, setTeachers] = useState<User[]>([])
  const [editingId, setEditingId] = useState<number | undefined>()
  const [loading, setLoading] = useState<boolean>(false)
  const { token, type } = useAppSelector((state) => state.user)
  const navigate = useNavigate()

  useEffect(() => {
    if (!['admin', 'owner'].includes(type)) {
      navigate('/')
      return
    }

    const fetchClasses = async () => {
      const classService = new ClassesService(token)
      const fetchedClasses = await classService.getAll()
      const classData = fetchedClasses.map(
        (item: { class: Class }) => item.class
      )

      setClasses(classData)
      setLoading(false)
    }

    const fetchResources = async () => {
      const resourcesService = new ResourcesService(token)
      const response = await resourcesService.getAll()
      
      setResources(response)
    }

    const fetchTeachers = async () => {
      const userService = new UserService(token)
      const fetchedUsers = await userService.getAll()

      setTeachers(fetchedUsers)
      fetchClasses()
    }

    setLoading(true)
    fetchTeachers()
    fetchResources()
  }, [])

  const getClassToSend = () => ({
    name,
    period,
    teacherId: teacherId!
  })

  const handleAddResourceToClass = async () => {
    const classService = new ClassService(token)

    if (!editingId || !selectedResourceId) {
      return
    }

    await classService.insertOneResource(editingId, {
      classId: editingId,
      resourceId: selectedResourceId
    })

    const classResource = await classService.getAllResource(editingId)
    setClassResources(classResource.map((val: ClassResourceResponse) => val.resource))
  }

  const handleAddClass = async () => {
    setLoading(true)

    const classService = new ClassesService(token)

    const newClass: ClassInsertBody = getClassToSend()

    const addedClass = await classService.insertOne(newClass)
    setClasses([...classes, addedClass])
    setModalOpen(false)
    resetForm()

    setLoading(false)
  }

  const handleEditClass = async () => {
    if (!editingId) {
      return
    }

    setLoading(true)

    const classService = new ClassesService(token)

    const updatedClass: ClassUpdateBody = getClassToSend()

    const updated = await classService.updateOne(editingId, updatedClass)

    setClasses(classes.map((cls) => (cls.id === editingId ? updated : cls)))
    setModalOpen(false)
    resetForm()

    setLoading(false)
  }

  const handleDeleteClass = async (classId: number) => {
    setLoading(true)

    const classService = new ClassesService(token)
    await classService.deleteOne(classId)
    setClasses(classes.filter((cls) => cls.id !== classId))

    setLoading(false)
  }

  const handleDeleteClassResource = async (resourceId: number) => {
    if (!editingId) {
      return
    }

    const classService = new ClassesService(token)
    await classService.deleteOneResource(editingId, resourceId)
    
    setClassResources(classResources.filter((val) => val.id !== resourceId))
  }

  const openEditModal = async (cls: Class) => {
    setEditingId(cls.id)
    setName(cls.name)
    setPeriod(cls.period)
    setTeacherId(cls.teacherId)

    const classService = new ClassService(token)
    const classResource = await classService.getAllResource(cls.id)
    setClassResources(classResource.map((val: ClassResourceResponse) => val.resource))

    setModalOpen(true)
  }

  const resetForm = () => {
    setName("")
    setPeriod("matutine")
    setTeacherId(undefined)
    setEditingId(undefined)
    setClassResources([])
  }

  return (
    <div style={{ display: "flex" }}>
      <Container maxWidth="md">
        <h1>Turma</h1>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setModalOpen(true)}
        >
          Adicionar
        </Button>
        <Dialog
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            {editingId ? "Editar Turma" : "Adicionar Turma"}
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
                onChange={(e) => setPeriod(e.target.value as Period)}
              >
                <MenuItem value="matutine">Matutino</MenuItem>
                <MenuItem value="vespertine">Vespertino</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="dense">
              <InputLabel>Professor</InputLabel>
              <Select
                value={teacherId ?? 0}
                onChange={(e) => setTeacherId(e.target.value as number)}
              >
                <MenuItem value={0} disabled></MenuItem>
                {teachers.map((teacher) => (
                  <MenuItem key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {
              !!editingId &&
              <>
                <Typography variant="h6" align="center">
                  Relacionar recursos a {classes.find((c) => c.id === editingId)?.name}
                </Typography>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Select
                    fullWidth
                    value={selectedResourceId ?? ''}
                    onChange={(e) => setSelectedResourceId(e.target.value as number)}
                  >
                    {
                      resources.map((val) => (
                        <MenuItem value={val.id}>{val.name}</MenuItem>
                      ))
                    }
                  </Select>

                  <Button onClick={handleAddResourceToClass}>Adicionar</Button>
                </Box>
                
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Classes</TableCell>
                      <TableCell>Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {classResources.map((val) => (
                      <TableRow key={val.id}>
                        <TableCell>{val.name}</TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            aria-label="deletar"
                            onClick={() => handleDeleteClassResource(val.id)}
                          >
                            <Icon>delete_outline</Icon>
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            }
          </DialogContent>
          <DialogActions>
            <Button disabled={loading} onClick={() => setModalOpen(false)} color="primary">
              Cancelar
            </Button>
            <Button
              disabled={loading}
              onClick={editingId ? handleEditClass : handleAddClass}
              color="primary"
            >
              {editingId ? "Salvar" : "Adicionar"}
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
                <TableCell>{cls.period === 'matutine' ? 'Matutino' : 'Vespertino'}</TableCell>
                <TableCell>
                  {teachers.find((t) => t.id === cls.teacherId)!.name}
                </TableCell>
                <TableCell>
                  <IconButton
                    aria-label="editar"
                    onClick={() => openEditModal(cls)}
                    size="small"
                  >
                    <Icon>edit_outline</Icon>
                  </IconButton>
                  <IconButton
                    size="small"
                    aria-label="deletar"
                    onClick={() => handleDeleteClass(cls.id)}
                  >
                    <Icon>delete_outline</Icon>
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {
          loading &&
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress />
          </Box>
        }
      </Container>
    </div>
  )
}

import CircularProgress from "@mui/material/CircularProgress"
import ResourcesService from "../../services/resources"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import Container from "@mui/material/Container"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableHead from "@mui/material/TableHead"
import TextField from "@mui/material/TextField"
import { useNavigate } from "react-router-dom"
import TableRow from "@mui/material/TableRow"
import { useAppSelector } from "../../hooks"
import { useState, useEffect } from "react"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import Table from "@mui/material/Table"
import Icon from "@mui/material/Icon"
import Box from "@mui/material/Box"

interface Resource {
  id: number
  name: string
}

export default function ResourcePage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [editingResourceId, setEditingResourceId] = useState<number | undefined>()
  const [loading, setLoading] = useState<boolean>(false)
  const [name, setName] = useState<string>("")
  const [wentWrong, setWentWrong] = useState<string>("")
  const { token, type } = useAppSelector((state) => state.user);
  const navigate = useNavigate()

  useEffect(() => {
    if (type === 'common') {
      navigate('/')
      return
    }

    (async () => {
      setLoading(true)

      const resourcesService = new ResourcesService(token)

      try {
        const response = await resourcesService.getAll();
        setResources(response);
      } catch (error) {
        console.error("Erro ao carregar recursos", error);
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  useEffect(() => {
    if (!wentWrong) {
      return
    }

    setTimeout(() => {
      setWentWrong("")
    }, 5000)
  }, [wentWrong])

  const handleAddResource = async () => {
    const resourcesService = new ResourcesService(token)

    setLoading(true)

    let newResource

    try {
      newResource = await resourcesService.insertOne({ name })
    } catch (error) {
      console.error("Erro ao adicionar recurso", error)
    }

    setResources([...resources, newResource])

    setLoading(false)

    setModalOpen(false)
    setName("")
  }

  const handleEditResource = async (resource: Resource) => {
    setName(resource.name)
    setEditingResourceId(resource.id)
    setModalOpen(true)
  }

  const handleSaveEdit = async () => {
    const resourcesService = new ResourcesService(token)

    setLoading(true)

    let editedResource: Resource | undefined

    try {
      editedResource = await resourcesService.updateOne(editingResourceId!, { name })
    } catch (error) {
      console.error("Erro ao editar recurso", error)
    }

    setLoading(false)

    const newResources = resources
    const resource = newResources.find((val) => editedResource!.id === val.id)
    resource!.name = editedResource?.name ?? ''

    setResources(newResources)

    setModalOpen(false)
    setEditingResourceId(undefined)
    setName("")
  }

  const handleDeleteResource = async (resourceId: number) => {
    const resourcesService = new ResourcesService(token)

    setLoading(true)

    try {
      await resourcesService.deleteOne(resourceId)
      setResources(resources.filter((res) => res.id !== resourceId))
    } catch (err) {
      setWentWrong("Não foi possível excluir o recurso, provavelmente há classes relacionadas a ele")
    }

    setLoading(false)
  }

  return (
    <div style={{ display: "flex" }}>
      <Container maxWidth="md">
        <h1>Recursos</h1>
        <Box display={'flex'} alignItems={'center'} gap={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setModalOpen(true)}
          >
            Adicionar
          </Button>
          <Typography variant="body1">{wentWrong}</Typography>
        </Box>
        <Dialog
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          fullWidth={true}
        >
          <DialogTitle id="form-dialog-title">
            {editingResourceId ? "Editar Recurso" : "Adicionar Recurso"}
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
          </DialogContent>
          <DialogActions>
            <Button disabled={loading} onClick={() => setModalOpen(false)} color="primary">
              Cancelar
            </Button>
            <Button
              disabled={loading}
              onClick={editingResourceId ? handleSaveEdit : handleAddResource}
              color="primary"
            >
              {editingResourceId ? "Salvar" : "Adicionar"}
            </Button>
          </DialogActions>
        </Dialog>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {resources.map((resource) => (
              <TableRow key={resource.id}>
                <TableCell>{resource.name}</TableCell>
                <TableCell>
                  <IconButton
                    aria-label="editar"
                    onClick={() => handleEditResource(resource)}
                    size="small"
                  >
                    <Icon>edit_outline</Icon>
                  </IconButton>
                  <IconButton
                    aria-label="deletar"
                    onClick={() => handleDeleteResource(resource.id)}
                    size="small"
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

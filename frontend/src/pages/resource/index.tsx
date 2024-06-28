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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ResourcesService from "../../services/resources";
import { useAppSelector } from "../../hooks";

interface Resource {
  id: number;
  name: string;
}

const ResourcePage: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [editingResourceId, setEditingResourceId] = useState<number | null>(
    null
  );
  const token = useAppSelector((state) => state.user.token);
  const resourcesService = new ResourcesService(token);

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      const response = await resourcesService.getAll();
      setResources(response);
    } catch (error) {
      console.error("Erro ao carregar recursos", error);
    }
  };

  const handleAddResource = async () => {
    try {
      await resourcesService.insertOne({ name });
      setIsModalOpen(false);
      setName("");
      loadResources();
    } catch (error) {
      console.error("Erro ao adicionar recurso", error);
    }
  };

  const handleEditResource = (resource: Resource) => {
    setName(resource.name);
    setEditingResourceId(resource.id);
    setIsModalOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      await resourcesService.updateOne(editingResourceId!, { name });
      setIsModalOpen(false);
      setEditingResourceId(null);
      setName("");
      loadResources();
    } catch (error) {
      console.error("Erro ao editar recurso", error);
    }
  };

  const handleDeleteResource = async (resourceId: number) => {
    try {
      await resourcesService.deleteOne(resourceId);
      loadResources();
    } catch (error) {
      console.error("Erro ao excluir recurso", error);
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Container maxWidth="md">
        <h1>Recursos</h1>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setIsModalOpen(true);
            setEditingResourceId(null);
          }}
        >
          Adicionar
        </Button>
        <Dialog
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          aria-labeledby="form-dialog-title"
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
            <Button onClick={() => setIsModalOpen(false)} color="primary">
              Cancelar
            </Button>
            <Button
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
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    aria-label="deletar"
                    onClick={() => handleDeleteResource(resource.id)}
                    size="small"
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

export default ResourcePage;

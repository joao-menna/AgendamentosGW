import CircularProgress from "@mui/material/CircularProgress"
import FormControlLabel from "@mui/material/FormControlLabel"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import IconButton from "@mui/material/IconButton"
import RadioGroup from "@mui/material/RadioGroup"
import { DatePicker } from "@mui/x-date-pickers"
import BlockService from "../../services/blocks"
import FormLabel from "@mui/material/FormLabel"
import Container from "@mui/material/Container"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableHead from "@mui/material/TableHead"
import { useNavigate } from "react-router-dom"
import MenuItem from "@mui/material/MenuItem"
import TableRow from "@mui/material/TableRow"
import { useAppSelector } from "../../hooks"
import { useState, useEffect } from "react"
import Select from "@mui/material/Select"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import Table from "@mui/material/Table"
import Radio from "@mui/material/Radio"
import Icon from "@mui/material/Icon"
import Box from "@mui/material/Box"
import dayjs, { Dayjs } from "dayjs"
import HourService from "../../services/hours"

type Period = 'matutine' | 'vespertine'

interface Block {
  id: number
  hourId: number
  date: string
  period: Period
}

interface Hour {
  id: number
  start: string
  finish: string
  classNumber: number
  createdAt: string
  updatedAt: string
}

export default function BlocksPage() {
  const [blocks, setBlocks] = useState<Block[]>([])
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [date, setDate] = useState<Dayjs | null>(null)
  const [hours, setHours] = useState<Hour[]>([])
  const [hourId, setHourId] = useState<number | undefined>()
  const [period, setPeriod] = useState<Period>('matutine')
  const { token, type } = useAppSelector((state) => state.user);
  const navigate = useNavigate()

  useEffect(() => {
    if (type === 'common') {
      navigate('/')
      return
    }

    (async () => {
      setLoading(true)

      const blockService = new BlockService(token)
      const hourService = new HourService(token)

      try {
        const blockResponse = await blockService.getAll()
        setBlocks(blockResponse)
        const hourResponse = await hourService.getAll()
        setHours(hourResponse)
      } catch (error) {
        console.error("Erro ao carregar bloqueios", error)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const handleAddBlock = async () => {
    if (!hourId || !date) {
      return
    }

    const blockService = new BlockService(token)

    setLoading(true)

    let newBlock

    try {
      newBlock = await blockService.insertOne({
        date: date.toISOString(),
        hourId,
        period
      })
    } catch (error) {
      console.error("Erro ao adicionar bloqueio", error)
    }

    setBlocks([...blocks, newBlock])

    setLoading(false)

    setModalOpen(false)
    setDate(null)
    setHourId(undefined)
    setPeriod('matutine')
  }

  const handleDeleteBlock = async (blockId: number) => {
    const blockService = new BlockService(token)

    setLoading(true)

    try {
      await blockService.deleteOne(blockId)
    } catch (error) {
      console.error("Erro ao excluir bloqueio", error)
    }

    setBlocks(blocks.filter((b) => b.id !== blockId))

    setLoading(false)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setDate(null)
    setHourId(undefined)
  }

  const getDateFormatted = (date: string) => {
    const [year, month, day] = date.split('-')
    return `${day}/${month}/${year}`
  }

  return (
    <div style={{ display: "flex" }}>
      <Container maxWidth="md">
        <h1>Bloqueios</h1>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setModalOpen(true)}
        >
          Adicionar
        </Button>
        <Dialog
          open={modalOpen}
          onClose={handleCloseModal}
          fullWidth
        >
          <DialogTitle id="form-dialog-title">
            Adicionar Bloqueio
          </DialogTitle>
          <DialogContent>
            <FormControl fullWidth margin="dense">
              <DatePicker minDate={dayjs(new Date())} value={date} onChange={(e) => setDate(e)} />
            </FormControl>

            <FormControl fullWidth margin="dense">
              <InputLabel>Aula</InputLabel>
              <Select
                value={hourId ?? ""}
                onChange={(e) => setHourId(e.target.value as number)}
              >
                <MenuItem value={0} disabled></MenuItem>
                {hours.map((val) => (
                  <MenuItem key={val.id} value={val.id}>
                    {val.classNumber === 1 && "1 - Primeira"}
                    {val.classNumber === 2 && "2 - Segunda"}
                    {val.classNumber === 3 && "3 - Terceira"}
                    {val.classNumber === 4 && "4 - Quarta"}
                    {val.classNumber === 5 && "5 - Quinta"}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Período</FormLabel>

              <RadioGroup
                value={period ?? 'matutine'}
                onChange={(e) => setPeriod(e.target.value as Period)}
              >
                <FormControlLabel value={'matutine'} control={<Radio />} label="Matutino" />

                <FormControlLabel value={'vespertine'} control={<Radio />} label="Vespertino" />
              </RadioGroup>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button disabled={loading} onClick={handleCloseModal} color="primary">
              Cancelar
            </Button>
            <Button
              disabled={loading}
              onClick={handleAddBlock}
              color="primary"
            >
              Adicionar
            </Button>
          </DialogActions>
        </Dialog>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Data</TableCell>
              <TableCell>Aula</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {blocks.map((block) => (
              <TableRow key={block.id}>
                <TableCell>{getDateFormatted(block.date)}</TableCell>
                <TableCell>{hours.find((val) => val.id === block.hourId)?.classNumber}</TableCell>
                <TableCell>
                  <IconButton
                    aria-label="deletar"
                    onClick={() => handleDeleteBlock(block.id)}
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

import interactionPlugin from "@fullcalendar/interaction"
import { ScheduleInsertBody } from "../../interfaces/schedule"
import CircularProgress from "@mui/material/CircularProgress"
import DialogContent from "@mui/material/DialogContent"
import DialogActions from "@mui/material/DialogActions"
import ScheduleService from "../../services/schedule"
import { SESSION_PERIOD_KEY } from "../../services"
import timeGridPlugin from "@fullcalendar/timegrid"
import DialogTitle from "@mui/material/DialogTitle"
import FormControl from "@mui/material/FormControl"
import dayGridPlugin from "@fullcalendar/daygrid"
import ClassService from "../../services/classes"
import InputLabel from "@mui/material/InputLabel"
import TextField from "@mui/material/TextField"
import { useNavigate } from "react-router-dom"
import FullCalendar from "@fullcalendar/react"
import HourService from "../../services/hours"
import MenuItem from "@mui/material/MenuItem"
import { useAppSelector } from "../../hooks"
import { useState, useEffect } from "react"
import Dialog from "@mui/material/Dialog"
import Button from "@mui/material/Button"
import Select from "@mui/material/Select"
import Box from "@mui/material/Box"
import { DatePicker } from "@mui/x-date-pickers"
import { Dayjs } from "dayjs"

type Period = 'matutine' | 'vespertine'

interface ScheduleData {
  date: string
  hourId: number
  classResourceId: number
}

interface Hour {
  id: number
  start: string
  stop: string
  classNumber: number
  createdAt: string
  updatedAt: string
}

interface Class {
  id: number
  name: string
  period: Period
  teacherId: number
}

interface ClassResource {
  classId: number
  className: string
  period: Period
  schedule: ScheduleData[]
}

export default function SchedulePage() {
  const [scheduleData, setScheduleData] = useState<ScheduleData[]>([])
  const [classResources, setClassResources] = useState<ClassResource[]>([])
  const [hours, setHours] = useState<Hour[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [date, setDate] = useState<Dayjs | null>(null)
  const [hourId, setHourId] = useState<number | undefined>()
  const [classResourceId, setClassResourceId] = useState<number | undefined>()
  const [selectedTime, setSelectedTime] = useState<string | undefined>()
  const [selectedPeriod, setSelectedPeriod] = useState<Period>()
  const [loading, setLoading] = useState<boolean>()
  const { token, type } = useAppSelector((state) => state.user)
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) {
      navigate('/')
      return
    }

    setSelectedPeriod(sessionStorage.getItem(SESSION_PERIOD_KEY) as Period)

    const fetchSchedule = async () => {
      const scheduleService = new ScheduleService(token)
      const fetchedSchedule = await scheduleService.getAllFiltered({})
      setScheduleData(fetchedSchedule)
    }

    const fetchHour = async () => {
      const hourService = new HourService(token)
      let fetchedHour = await hourService.getAll()

      if (!fetchedHour.length) {
        await hourService.insertAll()
        fetchedHour = await hourService.getAll()
      }

      setHours(fetchedHour)
    }

    const fetchClassResource = async () => {
      const classService = new ClassService(token)
      const fetchedClasses: Class[] = (await classService.getAll()).map((val: any) => val.class)
      
      const klassResources: ClassResource[] = []
      for (const klass of fetchedClasses) {
        const resources = await classService.getAllResource(klass.id)

        klassResources.push({
          classId: klass.id,
          className: klass.name,
          period: klass.period,
          schedule: []
        })

        for (const resource of resources) {
          console.log(resource)
        }

        setClassResources(klassResources)
      }
    }

    (async () => {
      setLoading(true)

      await fetchClassResource()
      await fetchSchedule()
      await fetchHour()

      setLoading(false)
    })()
  }, [])

  const handleAddSchedule = async () => {
    if (!token) {
      return
    }

    setLoading(true)

    const scheduleService = new ScheduleService(token)
    const newSchedule: ScheduleInsertBody = {
      date: date!.toISOString().split("T")[0],
      hourId: hourId!,
      classResourceId: classResourceId!,
    }
    const addedSchedule = await scheduleService.insertOne(newSchedule)
    setScheduleData([...scheduleData, addedSchedule])

    setLoading(false)

    setModalOpen(false)
    resetForm()
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    resetForm()
  }

  const handleChangePeriod = (period: Period) => {
    setSelectedPeriod(period)
    sessionStorage.setItem(SESSION_PERIOD_KEY, period)
  }

  const resetForm = () => {
    setDate(null)
    setHourId(undefined)
    setClassResourceId(undefined)
  }

  return (
    <div style={{ display: "flex", flexDirection: 'column' }}>
      <div style={{ padding: "20px" }}>
        <Box>
          <Button
            variant="contained"
            onClick={() => setModalOpen(true)}
          >Marcar horário para recurso</Button>
        </Box>
        {
          !loading ?
          <>
            <Box>
              <Button
                variant="contained"
                onClick={() => handleChangePeriod('matutine')}
              >Matutino</Button>
              <Button
                variant="contained"
                onClick={() => handleChangePeriod('vespertine')}
              >Vespertino</Button>
            </Box>
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              expandRows={true}
              initialView="timeGridWeek"
              slotDuration="00:50:00"
              slotMinTime={
                selectedPeriod === 'matutine' ?
                { hours: 7, minutes: 30 } :
                { hours: 13, minutes: 30 }
              }
              slotMaxTime={
                selectedPeriod === 'matutine' ?
                { hours: 11, minutes: 45 } :
                { hours: 17, minutes: 30 }
              }
              allDaySlot={false}
              selectable={true}
              locale={"pt-br"}
              events={scheduleData.map((schedule) => {
                const hour = hours.find((hour) => hour.id === schedule.hourId)
                if (!hour) {
                  return {}
                }

                return {
                }
              })}
            />
          </>
          :
          <CircularProgress />
        }
      </div>
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
        <DialogTitle>Adicionar Evento</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <DatePicker value={date} onChange={(e) => setDate(e)} />
          </FormControl>

          <FormControl fullWidth margin="dense">
            <InputLabel>Aula</InputLabel>
            <Select
              value={selectedTime ?? ""}
              onChange={(e) => setSelectedTime(e.target.value)}
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

          <FormControl fullWidth margin="dense">
            <InputLabel>Recurso da Classe</InputLabel>
            <Select
              value={classResourceId}
              onChange={(e) => setClassResourceId(e.target.value as number)}
            >
              <MenuItem value={1}>Recurso 1</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleAddSchedule} color="primary">
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

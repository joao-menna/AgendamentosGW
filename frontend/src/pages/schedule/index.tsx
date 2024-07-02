import { EventClickArg, EventSourceInput } from "@fullcalendar/core/index.js"
import { ScheduleInsertBody } from "../../interfaces/schedule"
import CircularProgress from "@mui/material/CircularProgress"
import interactionPlugin from "@fullcalendar/interaction"
import ResourcesService from "../../services/resources"
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
import Typography from "@mui/material/Typography"
import { DatePicker } from "@mui/x-date-pickers"
import BlockService from "../../services/blocks"
import { useNavigate } from "react-router-dom"
import FullCalendar from "@fullcalendar/react"
import HourService from "../../services/hours"
import MenuItem from "@mui/material/MenuItem"
import { useAppSelector } from "../../hooks"
import { useState, useEffect } from "react"
import Dialog from "@mui/material/Dialog"
import Button from "@mui/material/Button"
import Select from "@mui/material/Select"
import dayjs, { Dayjs } from "dayjs"
import Box from "@mui/material/Box"

const ALREADY_INSERTED_MESSAGE = "Não foi possível agendar, provavelmente o recurso já está alocado!"
const HOUR_BLOCKED_MESSAGE = "Não foi possível agendar, este horário está bloqueado!"

type Period = 'matutine' | 'vespertine'

interface ScheduleData {
  id: number
  date: string
  hourId: number
  classResourceId: number
}

interface Hour {
  id: number
  start: string
  finish: string
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

interface Block {
  id: number
  hourId: number
  date: string
  period: Period
}

export default function SchedulePage() {
  const [scheduleData, setScheduleData] = useState<ScheduleData[]>([])
  const [resources, setResources] = useState<any[]>([])
  const [selectedClassId, setSelectedClassId] = useState<number | undefined>()
  const [selectedResourceId, setSelectedResourceId] = useState<number | undefined>()
  const [classes, setClasses] = useState<Class[]>([])
  const [blocks, setBlocks] = useState<Block[]>([])
  const [hours, setHours] = useState<Hour[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [date, setDate] = useState<Dayjs | null>(null)
  const [hourId, setHourId] = useState<number | undefined>()
  const [allClassResources, setAllClassResources] = useState<any[]>([])
  const [allResources, setAllResources] = useState<any[]>([])
  const [classResources, setClassResources] = useState<any[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState<Period>()
  const [loading, setLoading] = useState<boolean>(false)
  const [editingId, setEditingId] = useState<number | undefined>()
  const [insertWentWrong, setInsertWentWrong] = useState<string>("")
  const { token, type, userId } = useAppSelector((state) => state.user)
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) {
      navigate('/')
      return
    }

    setSelectedPeriod(sessionStorage.getItem(SESSION_PERIOD_KEY) as Period ?? 'matutine')

    fetchAll()
  }, [])

  const fetchAll = async () => {
    setLoading(true)

    try {
      const klasses = await fetchClasses()
      await fetchClassResources(klasses)
      await fetchResources()
      await fetchSchedule()
      await fetchBlocks()
      await fetchHour()
    } catch (err) {
      navigate('/logoff')
      return
    }

    setLoading(false)
  }

  const fetchBlocks = async () => {
    const blockService = new BlockService(token)

    const blockResponse = await blockService.getAll()

    setBlocks(blockResponse)
  }

  const fetchSchedule = async () => {
    const scheduleService = new ScheduleService(token)
    const fetchedSchedule = await scheduleService.getAllFiltered({})

    setScheduleData(fetchedSchedule.map((val: any) => val.hour_class))
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

  const fetchClasses = async () => {
    const classService = new ClassService(token)
    const fetchedClasses: Class[] = (await classService.getAll()).map((val: any) => val.class)
    
    setClasses(fetchedClasses)
    return fetchedClasses
  }

  const fetchClassResources = async (klasses: Class[]) => {
    const classService = new ClassService(token)

    const allResources: any[] = []
    for (const klass of klasses) {
      const allResourcesFromClass = (await classService.getAllResource(klass.id))
        .map((val: any) => val.class_resource)

      allResources.push(...allResourcesFromClass)
    }

    setAllClassResources(allResources)
  }

  const fetchResources = async () => {
    const resourcesService = new ResourcesService(token)

    const allResource = await resourcesService.getAll()
    setAllResources(allResource)
  }

  const handleAddSchedule = async () => {
    if (!token) {
      return
    }

    const newSchedule: ScheduleInsertBody = {
      date: date!.toISOString().split("T")[0],
      hourId: hourId!,
      classResourceId: classResources.find(
        (val) => val.classId === selectedClassId && val.resourceId === selectedResourceId
      )!.id
    }

    const klass = classes.find((val) => val.id === selectedClassId)
    if (!klass) {
      return
    }

    const blockFound = blocks.find((val) => (
      val.date === newSchedule.date &&
      val.hourId === newSchedule.hourId &&
      val.period === klass.period
    ))

    if (blockFound) {
      setInsertWentWrong(HOUR_BLOCKED_MESSAGE)
      return
    }

    const schedules = scheduleData.filter((val) =>
      val.date === newSchedule.date &&
      val.hourId === newSchedule.hourId
    )

    if (schedules.length > 0) {
      const resources = allClassResources.filter((val) =>
        val.resourceId === selectedResourceId
      )

      if (resources.length > 1) {
        setInsertWentWrong(ALREADY_INSERTED_MESSAGE)
        return
      }
    }

    setLoading(true)

    let addedSchedule
    try {
      const scheduleService = new ScheduleService(token)
      addedSchedule = await scheduleService.insertOne(newSchedule)
      setScheduleData([...scheduleData, addedSchedule])
    } catch (err) {
      setLoading(false)
      setInsertWentWrong(ALREADY_INSERTED_MESSAGE)
      return
    }

    setModalOpen(false)
    setLoading(false)
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

  const handleChangeClassId = async (classId: number) => {
    setSelectedClassId(classId)

    const classService = new ClassService(token)
    const getAllResource = await classService.getAllResource(classId)
    const resources = getAllResource.map((val: any) => val.resource)
    const klassResources = getAllResource.map((val: any) => val.class_resource)

    setResources(resources)
    setClassResources(klassResources)
  }

  const handleEventClick = (arg: EventClickArg) => {
    const scheduleId = parseInt(arg.event.id)
    const schedule = scheduleData.find((val) => val.id === scheduleId)

    if (!schedule) {
      return
    }

    const klassResource = allClassResources
      .find((val) => val.id === schedule.classResourceId)

    const klass = classes.find((val) => val.id === klassResource.classId)

    const resource = allResources.find((val) => val.id === klassResource.resourceId)

    setHourId(schedule.hourId)
    setDate(dayjs(schedule.date))
    setSelectedClassId(klass!.id)
    handleChangeClassId(klass!.id)
    setSelectedResourceId(resource!.id)
    setEditingId(schedule.id)
    setModalOpen(true)
  }

  const handleEventDelete = async () => {
    if (!editingId) {
      return
    }

    const scheduleService = new ScheduleService(token)
    await scheduleService.deleteOne(editingId)

    setScheduleData((state) => state.filter((val) => val.id !== editingId))
    handleCloseModal()
  }

  const prepareHour = (hour: string) => {
    const [hourStr, minuteStr] = hour.split(':')

    return `${parseInt(hourStr) + 3}:${minuteStr}`
  }

  const prepareVespertineHour = (hour: string) => {
    const [hourStr, minuteStr] = hour.split(':')

    // 3 de timezone
    // 6 de 13:30
    return `${parseInt(hourStr) + 3 + 6}:${minuteStr}`
  }

  const getCalendarEvents = (schedule: ScheduleData) => {
    const klassResource = allClassResources
      .find((val) => val.id === schedule.classResourceId)

    const klass = classes.find((val) => val.id === klassResource.classId)

    const resource = allResources.find((val) => val.id === klassResource.resourceId)

    const hour = hours.find((hour) => hour.id === schedule.hourId)

    if (!hour || !resource || !klass) {
      return {}
    }

    let hourStart = prepareHour(hour.start)
    let hourFinish = prepareHour(hour.finish)

    if (klass.period === 'vespertine' && selectedPeriod === 'vespertine') {
      hourStart = prepareVespertineHour(hour.start)
      hourFinish = prepareVespertineHour(hour.finish)
    }

    if (klass.period !== selectedPeriod) {
      return {}
    }

    return {
      id: schedule.id,
      title: `${klass.name} - ${resource.name}`,
      start: dayjs(`${schedule.date}T${hourStart}:00.000Z`).toDate(),
      end: dayjs(`${schedule.date}T${hourFinish}:00.000Z`).toDate()
    }
  }

  const getCalendarBlocks = (block: Block) => {
    const hour = hours.find((hour) => hour.id === block.hourId)

    if (!hour) {
      return {}
    }

    let hourStart = prepareHour(hour.start)
    let hourFinish = prepareHour(hour.finish)

    if (block.period === 'vespertine' && selectedPeriod === 'vespertine') {
      hourStart = prepareVespertineHour(hour.start)
      hourFinish = prepareVespertineHour(hour.finish)
    }

    if (block.period !== selectedPeriod) {
      return {}
    }

    return {
      title: 'BLOQUEADO',
      start: dayjs(`${block.date}T${hourStart}:00.000Z`).toDate(),
      end: dayjs(`${block.date}T${hourFinish}:00.000Z`).toDate()
    }
  }

  const getUserIdFromScheduleId = (scheduleId: number) => {
    const schedule = scheduleData.find((val) => val.id === scheduleId)
    const classResource = allClassResources.find((val) => val.id === schedule?.classResourceId)
    const klass = classes.find((val) => val.id === classResource.classId)

    if (!klass) {
      return
    }

    return klass.teacherId
  }

  const resetForm = () => {
    setDate(null)
    setHourId(undefined)
    setInsertWentWrong("")
    setEditingId(undefined)
    setSelectedClassId(undefined)
    setSelectedResourceId(undefined)
  }

  return (
    <div style={{ display: "flex", flexDirection: 'column' }}>
      <div style={{ padding: "20px" }}>
        {
          !loading ?
          <>
            <Box display={'flex'} justifyContent={'space-between'} mb={2}>
              <Box>
                <Button
                  variant="contained"
                  onClick={() => setModalOpen(true)}
                >Marcar horário</Button>
              </Box>
              <Box display={'flex'} gap={2}>
                <Button
                  variant="contained"
                  onClick={() => handleChangePeriod('matutine')}
                >Matutino</Button>
                <Button
                  variant="contained"
                  onClick={() => handleChangePeriod('vespertine')}
                >Vespertino</Button>
              </Box>
            </Box>
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              expandRows={true}
              initialView="timeGridWeek"
              slotDuration="00:45:00"
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
              eventClick={handleEventClick}
              selectable={true}
              locale={"pt-br"}
              events={
                [
                  ...scheduleData.map(getCalendarEvents),
                  ...blocks.map(getCalendarBlocks)
                ] as EventSourceInput
              }
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
            <DatePicker
              minDate={dayjs(new Date())}
              value={date}
              onChange={(e: any) => setDate(e)}
              readOnly={!!editingId}
              format="DD/MM/YYYY"
            />
          </FormControl>

          <FormControl fullWidth margin="dense">
            <InputLabel>Aula</InputLabel>
            <Select
              value={hourId ?? ""}
              onChange={(e) => setHourId(e.target.value as number)}
              readOnly={!!editingId}
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
            <InputLabel>Classe</InputLabel>
            <Select
              value={selectedClassId}
              onChange={(e) => handleChangeClassId(e.target.value as number)}
              readOnly={!!editingId}
            >
              {classes.map((val) =>
                (val.teacherId === userId || ['admin', 'owner'].includes(type)) && (
                  <MenuItem key={val.id} value={val.id}>{val.name}</MenuItem>
                )
              )}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="dense">
            <InputLabel>Recurso</InputLabel>
            <Select
              value={selectedResourceId}
              onChange={(e) => setSelectedResourceId(e.target.value as number)}
              readOnly={!!editingId}
            >
              {resources.map((val) => (
                <MenuItem key={val.id} value={val.id}>{val.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography mt={2} align="center" variant="body1">{insertWentWrong}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Cancelar
          </Button>
          {!editingId ?
            <Button
              disabled={!date || !selectedClassId || !selectedResourceId || !hourId}
              onClick={handleAddSchedule}
              color="primary"
            >
              Adicionar
            </Button>
            :
            <Button
              disabled={!['admin', 'owner'].includes(type) && userId !== getUserIdFromScheduleId(editingId)}
              onClick={handleEventDelete}
              color="primary"
            >
              Excluir
            </Button>
          }
        </DialogActions>
      </Dialog>
    </div>
  )
}

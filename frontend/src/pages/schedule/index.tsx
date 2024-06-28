import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import SideMenu from "../../components/sideMenu";
import ScheduleService from "../../services/schedule";
import HourService from "../../services/hours";
import { useAppSelector } from "../../hooks";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import { ScheduleInsertBody } from "../../interfaces/schedule";

interface ScheduleData {
  date: string;
  hourId: number;
  classResourceId: number;
}

const SchedulePage: React.FC = () => {
  const [scheduleData, setScheduleData] = useState<ScheduleData[]>([]);
  const [hourData, setHourData] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [date, setDate] = useState<string>("");
  const [hourId, setHourId] = useState<number | undefined>(undefined);
  const [classResourceId, setClassResourceId] = useState<number | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const { token } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (!token) {
      return
    }

    const fetchSchedule = async () => {
      const scheduleService = new ScheduleService(token);
      const fetchedSchedule = await scheduleService.getAllFiltered({});
      setScheduleData(fetchedSchedule);
    };

    const fetchHour = async () => {
      const hourService = new HourService(token);
      const fetchedHour = await hourService.getAll();
      setHourData(fetchedHour);
    };

    fetchSchedule();
    fetchHour();
  }, [token]);

  const handleAddSchedule = async () => {
    if (!token) {
      return
    }

    const scheduleService = new ScheduleService(token);
    const newSchedule: ScheduleInsertBody = {
      date: date,
      hourId: hourId!,
      classResourceId: classResourceId!,
    };
    const addedSchedule = await scheduleService.insertOne(newSchedule);
    setScheduleData([...scheduleData, addedSchedule]);
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setDate("");
    setHourId(undefined);
    setClassResourceId(0);
  };

  const handleDateClick = (info: DateClickArg) => {
    const clickedDate = info.dateStr.split("T")[0];
    const clickedTime = info.dateStr.split("T")[1].slice(0, 5);

    setIsModalOpen(true);
    const hour = hourData.find((h) => h.time === clickedTime);
    if (!hour) return;

    setDate(clickedDate);
    setHourId(hour.id);
    setSelectedTime(info.dateStr);
  };

  return (
    <div style={{ display: "flex" }}>
      <SideMenu />
      <div style={{ flex: 1, padding: "20px" }}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          slotDuration="04:00:00"
          allDaySlot={false}
          selectable={true}
          dateClick={handleDateClick}
          locale={"pt-br"}
          events={scheduleData.map((schedule) => {
            const hour = hourData.find((hour) => hour.id === schedule.hourId);
            return {
              title: `Recurso ${schedule.classResourceId}`,
              start: `${schedule.date}T${hour?.time}`,
            };
          })}
        />
      </div>
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <DialogTitle>Adicionar Evento</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Data"
            type="text"
            fullWidth
            value={date}
            disabled
          />
          <TextField
            margin="dense"
            label="Hora"
            type="text"
            fullWidth
            value={selectedTime ? selectedTime.split("T")[1]?.slice(0, 5) : ""}
            disabled
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Recurso da Classe</InputLabel>
            <Select
              value={classResourceId}
              onChange={(e) => setClassResourceId(e.target.value as number)}
            >
              <MenuItem value={1}>Recurso 1</MenuItem>
              <MenuItem value={2}>Recurso 2</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsModalOpen(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={() => handleAddSchedule()} color="primary">
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SchedulePage;

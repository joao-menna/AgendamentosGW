import InputAdornment from "@mui/material/InputAdornment";
import { SyntheticEvent, useEffect, useState } from "react";
import SystemService from "../../services/system";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import { FirstTimeContainer } from "./styles";
import { useAppSelector } from "../../hooks";
import { LOGIN_TOKEN } from "../../services";
import Button from "@mui/material/Button";
import Icon from "@mui/material/Icon";
import Box from "@mui/material/Box";

export default function FirstTimePage() {
  const firstTime = useAppSelector((state) => state.firstTime);
  const [name, setName] = useState<string>(firstTime.name || "");
  const [email, setEmail] = useState<string>(firstTime.email || "");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showingPassword, setShowingPassword] = useState<boolean>(false);
  const [wentWrong, setWentWrong] = useState<string>("");
  const redirect = useNavigate();

  useEffect(() => {
    if (!firstTime.firstTime) {
      redirect("/");
    }
  }, []);

  const onSubmitForm = async (event: SyntheticEvent) => {
    event.preventDefault();

    if (!name) {
      setWentWrong("Insira um nome");
      return;
    }

    if (!email) {
      setWentWrong("Insira um e-mail");
      return;
    }

    if (password !== confirmPassword) {
      setWentWrong("As senhas não coincidem!");
      return;
    }

    const systemService = new SystemService();
    await systemService.systemFirstTime({
      name,
      email,
      password,
      token: LOGIN_TOKEN,
    });

    redirect("/login");
  };

  return (
    <FirstTimeContainer>
      <form onSubmit={onSubmitForm}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            gap: "15px",
          }}
        >
          <TextField
            label="Nome"
            variant="outlined"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Icon>person_outline</Icon>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="E-mail"
            variant="outlined"
            type="email"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Icon>mail_outline</Icon>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Senha"
            variant="outlined"
            type={showingPassword ? "text" : "password"}
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment
                  position="end"
                  onClick={() => setShowingPassword(!showingPassword)}
                >
                  {showingPassword ? (
                    <Icon>visibility_outline</Icon>
                  ) : (
                    <Icon>visibility_off_outline</Icon>
                  )}
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Confirmar senha"
            variant="outlined"
            type={showingPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(ev) => setConfirmPassword(ev.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment
                  position="end"
                  onClick={() => setShowingPassword(!showingPassword)}
                >
                  {showingPassword ? (
                    <Icon>visibility_outline</Icon>
                  ) : (
                    <Icon>visibility_off_outline</Icon>
                  )}
                </InputAdornment>
              ),
            }}
          />
          <Typography variant="subtitle1">{wentWrong}</Typography>
          <Button type="submit" variant="contained">
            Configurar primeiro usuário
          </Button>
        </Box>
      </form>
    </FirstTimeContainer>
  );
}

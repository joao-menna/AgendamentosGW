import { SyntheticEvent, useEffect, useState } from "react";
import { SESSION_TOKEN_KEY } from "../../services";
import { useNavigate } from "react-router-dom";
import UserService from "../../services/users";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Icon from "@mui/material/Icon";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useAppDispatch } from "../../hooks";
import { setUserToken, setUserType } from "../../slices/userSlice";
import { FirstTimeContainer } from "../first-time/styles";
import { Card } from "@mui/material";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showingPassword, setShowingPassword] = useState<boolean>(false);
  const [wentWrong, setWentWrong] = useState<string>("");
  const dispatch = useAppDispatch();
  const redirect = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem(SESSION_TOKEN_KEY);
    if (token) {
      redirect("/schedule");
      return;
    }
  }, []);

  const onSubmitLogin = async (event: SyntheticEvent) => {
    event.preventDefault();

    const userService = new UserService();

    const req = await userService.login({
      email,
      password,
    });

    if (req.token) {
      userService.token = req.token;
      const user = await userService.getOneByToken();

      dispatch(setUserToken(req.token));
      dispatch(setUserType(user.type));
      sessionStorage.setItem(SESSION_TOKEN_KEY, req.token);

      redirect("/schedule");
      return;
    }

    setWentWrong("E-mail ou senha inválidos!");
  };

  return (
    <>
      <FirstTimeContainer>
        <form onSubmit={onSubmitLogin}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              height: "100%",
              justifyContent: "center",
            }}
          >
            <Card sx={{ maxWidth: 500, padding: 10 }}>
              <Typography variant="h4" align="center">
                Agendamentos GW
              </Typography>
              <Box sx={{ mt: 2 }}>
                <TextField
                  required
                  label="E-mail"
                  variant="outlined"
                  fullWidth
                  type="email"
                  value={email}
                  sx={{ flex: 1 }}
                  onChange={(ev) => setEmail(ev.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Icon>mail_outline</Icon>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              <Box sx={{ mt: 2 }}>
                <TextField
                  required
                  label="Senha"
                  variant="outlined"
                  fullWidth
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
              </Box>
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" color="error">
                  {wentWrong}
                </Typography>
              </Box>
              <Box sx={{ mt: 2 }}>
                <Button type="submit" variant="contained" fullWidth>
                  Login
                </Button>
              </Box>
            </Card>
          </Box>
        </form>
      </FirstTimeContainer>
    </>
  );
}

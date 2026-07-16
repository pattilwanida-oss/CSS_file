import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Grid,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { TypeAnimation } from "react-type-animation";
import { useGame } from "@/store/GameContext";
import { useTranslate } from "@/i18n/TranslateContext";

export default function Home() {
  const { actions } = useGame();
  const { t, lang, setLang } = useTranslate();
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);
  const [hostName, setHostName] = useState("");

  const handleCreateClick = () => {
    setShowDialog(true);
  };

  const createNewGame = async () => {
    if (!hostName.trim()) return;
    setShowDialog(false);
    const game = await actions.createGame(lang);
    const slug = hostName.trim().replace(/\s+/g, "-").toLowerCase();
    // Auto-add creator as a player
    await actions.addPlayerDirect({
      nickname: hostName.trim(),
      slug,
      gameId: game.gameId,
    });
    // Store host info so Game.jsx can show player controls
    localStorage.setItem(
      "hostPlayer_" + game.gameId,
      JSON.stringify({ name: hostName.trim(), slug }),
    );
    navigate("/game/" + game.gameId);
  };

  return (
    <Container sx={{ height: "100%" }}>
      <Grid container sx={{ height: "100%" }} alignItems="center">
        <Grid item xs={12} lg={6} xl={4} sx={{ marginLeft: { xl: "33.333%" } }}>
          <h1 style={{ marginBottom: "1rem" }}>CSS Files</h1>
          <h2 className="display-2">
            {t("A game of")}
            <TypeAnimation
              key={lang}
              sequence={[
                t("deception"),
                2000,
                "",
                500,
                t("deduction"),
                2000,
                "",
                500,
              ]}
              wrapper="span"
              repeat={Infinity}
              style={{
                color: "#2962ff",
                display: "block",
                fontFamily: "kingthings_trypewriter_2Rg",
              }}
              speed={40}
            />
          </h2>

          <p
            className="subtitle-1"
            style={{ marginTop: "1rem", marginBottom: "2.5rem" }}
          >
            {t(
              "In the game, players take on the roles of investigators attempting to solve a murder case – but there's a twist. The killer is one of the investigators! Find out who among you can cut through deception to find the truth and who is capable of getting away with murder!",
            )}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
            <Button
              component={Link}
              to="/join"
              size="large"
              sx={{
                background: "rgba(255, 255, 255, 0.15)",
                backdropFilter: "blur(15px)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "#fff",
                boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                textTransform: "none",
                fontSize: "1.1rem",
                padding: "10px 24px",
                "&:hover": {
                  background: "rgba(255, 255, 255, 0.25)",
                  borderColor: "rgba(255,255,255,0.4)",
                },
              }}
            >
              {t("Join game")}
            </Button>
            <Button
              onClick={handleCreateClick}
              size="large"
              sx={{
                background: "rgba(255, 100, 100, 0.2)",
                backdropFilter: "blur(15px)",
                border: "1px solid rgba(255, 100, 100, 0.3)",
                color: "#fff",
                boxShadow: "0 4px 30px rgba(255, 0, 0, 0.1)",
                textTransform: "none",
                fontSize: "1.1rem",
                padding: "10px 24px",
                "&:hover": {
                  background: "rgba(255, 100, 100, 0.35)",
                  borderColor: "rgba(255, 100, 100, 0.5)",
                },
              }}
            >
              {t("Create new game")}
            </Button>
          </div>

          <div style={{ display: "flex", gap: "8px", marginTop: "2rem" }}>
            <Button
              size="small"
              variant={lang === "en" ? "contained" : "outlined"}
              onClick={() => setLang("en")}
            >
              EN
            </Button>
            <Button
              size="small"
              variant={lang === "th" ? "contained" : "outlined"}
              onClick={() => setLang("th")}
            >
              TH
            </Button>
          </div>
        </Grid>
      </Grid>

      <Dialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        PaperProps={{
          sx: {
            background: "rgba(30, 20, 30, 0.7)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            color: "#fff",
            borderRadius: "16px",
            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.5)",
          },
        }}
      >
        <DialogTitle>{t("Enter your nickname")}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            value={hostName}
            onChange={(e) => setHostName(e.target.value)}
            label={t("Your nickname")}
            variant="filled"
            sx={{
              mt: 1,
              input: { color: "#fff" },
              label: { color: "rgba(255,255,255,0.7)" },
              background: "rgba(0,0,0,0.3)",
              borderRadius: "4px",
            }}
            onKeyDown={(e) => e.key === "Enter" && createNewGame()}
          />
        </DialogContent>
        <DialogActions sx={{ padding: "16px 24px" }}>
          <Button
            onClick={() => setShowDialog(false)}
            sx={{
              color: "rgba(255,255,255,0.7)",
              "&:hover": { color: "#fff" },
            }}
          >
            {t("Cancel") || "Cancel"}
          </Button>
          <Button
            onClick={createNewGame}
            disabled={!hostName.trim()}
            sx={{
              background: "rgba(255, 100, 100, 0.3)",
              border: "1px solid rgba(255, 100, 100, 0.4)",
              color: "#fff",
              "&:hover": {
                background: "rgba(255, 100, 100, 0.5)",
              },
              "&.Mui-disabled": {
                background: "rgba(255, 255, 255, 0.05)",
                color: "rgba(255, 255, 255, 0.3)",
              },
            }}
          >
            {t("Create new game")}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

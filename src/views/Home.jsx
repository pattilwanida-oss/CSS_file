import React, { useState, useEffect } from "react";
import VideoBG from "../components/VideoBG";
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
  Box,
  Typography,
  AppBar,
  Toolbar,
  Chip,
  IconButton,
  Fade
} from "@mui/material";
import { TypeAnimation } from "react-type-animation";
import { useGame } from "@/store/GameContext";

import { Search, Gavel, Group, Extension, InfoOutlined, Close as CloseIcon } from "@mui/icons-material";

export default function Home() {
  const { actions } = useGame();
  const navigate = useNavigate();
  const lang = "th";
  const [showDialog, setShowDialog] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [hostName, setHostName] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [showUI, setShowUI] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Show UI early instead of waiting for the full 9s intro
    const uiTimer = setTimeout(() => {
      setShowUI(true);
    }, 1500);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(uiTimer);
    };
  }, []);

  const handleCreateClick = () => {
    setShowDialog(true);
  };

  const createNewGame = async () => {
    if (!hostName.trim()) return;
    setShowDialog(false);
    const game = await actions.createGame("th");
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

  const features = [
    { icon: <Group fontSize="large" />, title: "เข้าร่วมห้อง", desc: "เข้าร่วมห้องสืบสวนส่วนตัวกับเพื่อน ๆ ของคุณ" },
    { icon: <Search fontSize="large" />, title: "รวบรวมหลักฐาน", desc: "ค้นหาเบาะแสและระบุวิธีการฆาตกรรม" },
    { icon: <Gavel fontSize="large" />, title: "สอบปากคำ", desc: "ซักถามผู้ต้องสงสัยและจับโกหกในหมู่พวกเขา" },
    { icon: <Extension fontSize="large" />, title: "ไขคดี", desc: "ปะติดปะต่อความจริงก่อนที่เวลาจะหมดลง" }
  ];

  return (
    <Box sx={{ height: '100dvh', overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* Video Background - seamless loop */}
      <VideoBG onIntroComplete={() => setShowUI(true)} />

      <Fade in={showUI} timeout={800}>
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', width: '100%', height: '100%', zIndex: 1, position: 'relative', overflow: 'hidden' }}>
          {/* Sticky Navbar */}
          <AppBar 
        position="fixed" 
        elevation={0}
        sx={{
          background: scrolled ? 'rgba(10, 15, 30, 0.8)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : 'none',
          transition: 'all 0.3s ease',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between', minHeight: '70px' }}>
            <Typography 
              variant="h6" 
              component={Link} 
              to="/"
              sx={{ 
                fontFamily: '"kingthings_trypewriter_2Rg", serif',
                color: 'var(--color-primary)',
                textDecoration: 'none',
                textShadow: '0 0 10px var(--color-primary-glow)',
                letterSpacing: '1px'
              }}
            >
              CSS FILES
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Button 
                sx={{ 
                  color: 'var(--color-ink-muted)',
                  display: { xs: 'none', sm: 'inline-flex' },
                  '&:hover': { color: 'white' } 
                }}
                onClick={() => setShowHowToPlay(true)}
              >
                วิธีเล่น
              </Button>
              <IconButton 
                sx={{ display: { xs: 'inline-flex', sm: 'none' }, color: 'var(--color-ink-muted)' }}
                onClick={() => setShowHowToPlay(true)}
              >
                <InfoOutlined />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', pt: { xs: 8, md: 10 }, pb: { xs: 2, md: 4 }, position: 'relative', zIndex: 2, height: 'calc(100dvh - 70px)', overflow: 'hidden' }}>
        <Box sx={{ 
          textAlign: 'left',
          maxWidth: { xs: '100%', md: '650px' },
          position: 'relative'
        }}>
          {/* Tags */}
          <Typography 
            variant="overline" 
            sx={{ 
              color: 'var(--color-primary)', 
              letterSpacing: '0.25em',
              display: 'block',
              mb: 2,
              fontWeight: 700
            }}
          >
            MULTIPLAYER • MYSTERY • INVESTIGATION
          </Typography>

          {/* Main Title */}
          <Typography 
            variant="h1" 
            sx={{ 
              fontFamily: '"kingthings_trypewriter_2Rg", serif',
              fontSize: { xs: '3rem', sm: 'var(--text-display)' },
              color: 'var(--color-ink)',
              letterSpacing: '-0.02em',
              textShadow: '0 4px 24px var(--color-primary-glow)',
              mb: 1,
              lineHeight: 1
            }}
          >
            CSS FILES
          </Typography>



            {/* Divider */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', mb: 4, opacity: 0.8 }}>
              <Typography sx={{ mr: 2, fontFamily: '"Chakra Petch", sans-serif', color: 'var(--color-accent)', letterSpacing: '2px', fontWeight: 600, fontSize: 'var(--text-sm)' }}>
                CASE NO. 001
              </Typography>
              <Box sx={{ height: '1px', flexGrow: 1, maxWidth: '150px', bgcolor: 'var(--color-border-accent)' }} />
            </Box>

            {/* Description */}
            <Typography 
              variant="body1" 
              sx={{ 
                color: 'var(--color-ink-muted)', 
                fontSize: 'var(--text-lg)',
                maxWidth: '100%',
                mb: 5,
                lineHeight: 1.8,
              }}
            >
              ในเกมนี้ ผู้เล่นจะสวมบทบาทเป็นนักสืบที่พยายามไขคดีฆาตกรรม - แต่มีจุดหักมุมคือ ฆาตกรคือหนึ่งในนักสืบ! ค้นหาว่าใครในหมู่พวกคุณที่สามารถไขปริศนาเพื่อหาความจริง และใครที่สามารถรอดพ้นจากการเป็นฆาตกร!
            </Typography>

            {/* CTA Buttons */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'flex-start', mb: 5 }}>
              <Button
                onClick={handleCreateClick}
                variant="contained"
                color="error"
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: 'var(--text-base)',
                  borderRadius: 'var(--radius-md)',
                  fontFamily: '"Chakra Petch", sans-serif',
                  letterSpacing: '1px',
                  boxShadow: 'var(--shadow-glow-accent)',
                }}
              >
                สร้างเกมใหม่
              </Button>
              <Button
                component={Link}
                to="/join"
                variant="outlined"
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: 'var(--text-base)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--color-ink)',
                  borderColor: 'var(--color-border-subtle)',
                  fontFamily: '"Chakra Petch", sans-serif',
                  letterSpacing: '1px',
                  backdropFilter: 'blur(5px)',
                  '&:hover': {
                    borderColor: 'var(--color-ink)',
                    background: 'var(--color-surface-hover)'
                  }
                }}
              >
                เข้าร่วมเกม
              </Button>
            </Box>

            {/* Info Badges */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: 'flex-start' }}>
              {['ผู้เล่น 3-12 คน', '25-45 นาที', 'เล่นผ่านเบราว์เซอร์เท่านั้น'].map((text) => (
                <Typography key={text} variant="caption" sx={{ 
                  fontFamily: '"Chakra Petch", sans-serif', 
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border-subtle)',
                  px: 2, py: 0.75, borderRadius: 'var(--radius-sm)',
                  letterSpacing: '1px',
                  color: 'var(--color-ink-muted)',
                  fontWeight: 500
                }}>
                  {text}
                </Typography>
              ))}
            </Box>
            {/* Copyright */}
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.35)', mt: 4, display: 'block', fontSize: '0.75rem' }}>
              © {new Date().getFullYear()} CSS FILES. A Multiplayer Mystery Game.
            </Typography>
        </Box>
      </Container>
      </Box>
      </Fade>

      {/* How to Play Dialog */}
      <Dialog
        open={showHowToPlay}
        onClose={() => setShowHowToPlay(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(10, 15, 30, 0.95)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '16px',
            boxShadow: '0 24px 60px rgba(0,0,0,0.8)',
            maxHeight: '85dvh',
          },
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          fontFamily: '"Chakra Petch", sans-serif', 
          fontSize: '1.5rem', 
          color: '#fff',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          pb: 1.5
        }}>
          📖 วิธีเล่น CSS FILES
          <IconButton onClick={() => setShowHowToPlay(false)} sx={{ color: 'var(--color-ink-muted)' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: { xs: 2, md: 3 }, mt: 1 }}>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {features.map((feature, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <Box sx={{ 
                  p: 2.5, 
                  height: '100%',
                  bgcolor: 'rgba(255, 255, 255, 0.04)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}>
                  <Box sx={{ color: 'var(--color-primary)', mb: 1 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="subtitle1" sx={{ mb: 1, fontFamily: '"Chakra Petch", sans-serif', fontWeight: 700 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5, fontSize: '0.85rem' }}>
                    {feature.desc}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[
              {
                title: "ขั้นตอนที่ 1: รับบทบาท",
                desc: "ในแต่ละเกม ผู้เล่นจะได้รับบทบาทแบบสุ่ม โดยแบ่งเป็น ฆาตกร และ นักสืบ ส่วน AI จะรับบทเป็นนักนิติวิทยาศาสตร์ ทำหน้าที่ควบคุมเกมและให้คำใบ้ตลอดการเล่น"
              },
              {
                title: "ขั้นตอนที่ 2: ก่อเหตุและให้คำใบ้",
                desc: "เมื่อเกมเริ่มขึ้น ผู้เล่นที่ได้รับบทเป็นฆาตกรจะเป็นผู้เลือก อาวุธที่ใช้ก่อเหตุ และ หลักฐานสำคัญ ซึ่งข้อมูลดังกล่าวจะถูกเก็บเป็นความลับ มีเพียง AI เท่านั้นที่รับรู้คำตอบ จากนั้น AI จะวิเคราะห์ข้อมูลและเปิดเผยคำใบ้ให้ผู้เล่นทุกคนทีละรอบ เพื่อช่วยในการสืบสวน โดยคำใบ้จะไม่เปิดเผยคำตอบของคดีโดยตรง"
              },
              {
                title: "ขั้นตอนที่ 3: สืบสวนและพูดคุย",
                desc: "ผู้เล่นสามารถใช้ระบบแชทเพื่อพูดคุย แลกเปลี่ยนความคิดเห็น และวิเคราะห์คำใบ้ร่วมกัน ขณะที่ฆาตกรสามารถร่วมสนทนาเพื่อสร้างความสับสนหรือเบี่ยงเบนความสนใจของผู้เล่นคนอื่นได้"
              },
              {
                title: "ขั้นตอนที่ 4: ลงคะแนนหรือรอ",
                desc: "เมื่อสิ้นสุดแต่ละรอบ ผู้เล่นสามารถเลือกได้ว่าจะ ลงคะแนน หรือ รอรอบถัดไป หากเลือกลงคะแนน จะต้องระบุผู้ที่คาดว่าเป็นฆาตกร พร้อมทั้งเลือกอาวุธที่ใช้ก่อเหตุและหลักฐานสำคัญ เมื่อส่งคะแนนแล้วจะไม่สามารถลงคะแนนได้อีก แต่ผู้เล่นที่ยังไม่ได้ลงคะแนนจะสามารถรอคำใบ้เพิ่มเติมและใช้สิทธิ์ลงคะแนนในรอบถัดไปได้"
              },
              {
                title: "ขั้นตอนที่ 5: เงื่อนไขการชนะ",
                desc: "เกมจะสิ้นสุดทันทีเมื่อมีผู้เล่นลงคะแนนได้ถูกต้องครบทั้ง ฆาตกร อาวุธที่ใช้ก่อเหตุ และหลักฐานสำคัญ โดยฝ่ายนักสืบจะเป็นผู้ชนะ แต่หากครบจำนวนรอบที่กำหนดแล้วยังไม่มีผู้ใดตอบถูกต้อง ฝ่ายฆาตกรจะเป็นผู้ชนะ"
              }
            ].map((step, index) => (
              <Box key={index} sx={{ 
                display: 'flex', 
                gap: 2, 
                p: 2, 
                bgcolor: 'rgba(255, 255, 255, 0.03)', 
                borderRadius: '12px', 
                border: '1px solid rgba(255, 255, 255, 0.06)',
                alignItems: 'flex-start'
              }}>
                <Box sx={{ 
                  flexShrink: 0,
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  bgcolor: 'rgba(239, 69, 101, 0.15)',
                  color: 'var(--color-accent, #ef4565)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: '"Chakra Petch", sans-serif',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  border: '1px solid rgba(239, 69, 101, 0.3)'
                }}>
                  {index + 1}
                </Box>
                <Box>
                  <Typography variant="subtitle1" sx={{ mb: 0.5, fontFamily: '"Chakra Petch", sans-serif', color: 'white', fontWeight: 600 }}>
                    {step.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'var(--color-ink-muted)', lineHeight: 1.6, fontSize: '0.9rem' }}>
                    {step.desc}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <Button
            onClick={() => setShowHowToPlay(false)}
            variant="contained"
            color="error"
            sx={{ px: 4, py: 1, borderRadius: '8px', fontFamily: '"Chakra Petch", sans-serif' }}
          >
            เข้าใจแล้ว
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Room Dialog */}
      <Dialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            p: 1,
            background: 'var(--color-surface)',
            backdropFilter: 'blur(24px)',
            border: '1px solid var(--color-border-accent)',
            boxShadow: 'var(--shadow-elevated)',
          },
        }}
      >
        <DialogTitle sx={{ 
          fontFamily: '"Chakra Petch", sans-serif', 
          fontSize: '1.5rem', 
          textAlign: 'center',
          color: 'var(--color-ink)'
        }}>
          กรอกชื่อเล่นของคุณ
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            value={hostName}
            onChange={(e) => setHostName(e.target.value)}
            label="ชื่อนักสืบของคุณ"
            variant="filled"
            sx={{ mt: 2 }}
            onKeyDown={(e) => e.key === "Enter" && createNewGame()}
          />
        </DialogContent>
        <DialogActions sx={{ padding: "16px 24px", justifyContent: 'center', gap: 2 }}>
          <Button
            onClick={() => setShowDialog(false)}
            variant="outlined"
            sx={{ flex: 1, color: 'var(--color-ink-muted)', borderColor: 'var(--color-border-subtle)' }}
          >
            ยกเลิก
          </Button>
          <Button
            onClick={createNewGame}
            disabled={!hostName.trim()}
            variant="contained"
            color="error"
            sx={{ flex: 1 }}
          >
            สร้างห้อง
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

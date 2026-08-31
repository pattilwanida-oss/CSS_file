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

import { Search, Gavel, Group, Extension, InfoOutlined } from "@mui/icons-material";

export default function Home() {
  const { actions } = useGame();
  const navigate = useNavigate();
  const lang = "th";
  const [showDialog, setShowDialog] = useState(false);
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
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Video Background - seamless loop */}
      <VideoBG onIntroComplete={() => setShowUI(true)} />

      <Fade in={showUI} timeout={800}>
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', width: '100%', zIndex: 1, position: 'relative' }}>
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
                onClick={() => document.getElementById('how-to-play').scrollIntoView({ behavior: 'smooth' })}
              >
                วิธีเล่น
              </Button>
              <IconButton 
                sx={{ display: { xs: 'inline-flex', sm: 'none' }, color: 'var(--color-ink-muted)' }}
                onClick={() => document.getElementById('how-to-play').scrollIntoView({ behavior: 'smooth' })}
              >
                <InfoOutlined />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', pt: { xs: 12, md: 15 }, pb: { xs: 6, md: 10 }, position: 'relative', zIndex: 2 }}>
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
              fontSize: 'var(--text-display)',
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
        </Box>
      </Container>

      {/* How to Play Section */}
      <Box id="how-to-play" sx={{ bgcolor: 'rgba(0,0,0,0.3)', borderTop: '1px solid var(--color-border-subtle)', py: 10 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" sx={{ mb: 6, color: 'white' }}>
            วิธีเล่น
          </Typography>
          <Grid container spacing={4} sx={{ mb: 8 }}>
            {features.map((feature, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <Box sx={{ 
                  p: 4, 
                  height: '100%',
                  bgcolor: 'var(--color-surface)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-border-subtle)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 'var(--shadow-elevated)',
                    borderColor: 'var(--color-primary-glow)'
                  }
                }}>
                  <Box sx={{ color: 'var(--color-primary)', mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" sx={{ mb: 1.5, fontFamily: '"Chakra Petch", sans-serif' }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {feature.desc}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
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
                gap: 3, 
                mb: 3, 
                p: { xs: 3, md: 4 }, 
                bgcolor: 'var(--color-surface)', 
                borderRadius: 'var(--radius-lg)', 
                border: '1px solid var(--color-border-subtle)',
                alignItems: 'flex-start',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 'var(--shadow-elevated)',
                  borderColor: 'var(--color-primary-glow)'
                }
              }}>
                <Box sx={{ 
                  flexShrink: 0,
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  bgcolor: 'rgba(255, 60, 60, 0.1)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: '"Chakra Petch", sans-serif',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  border: '1px solid var(--color-primary-glow)'
                }}>
                  {index + 1}
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ mb: 1, fontFamily: '"Chakra Petch", sans-serif', color: 'white' }}>
                    {step.title}
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'var(--color-ink-muted)', lineHeight: 1.7, fontSize: '1rem' }}>
                    {step.desc}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Footer CTA */}
      <Box sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ mb: 4, fontFamily: '"Chakra Petch", sans-serif' }}>
          พร้อมที่จะสืบสวนหรือยัง?
        </Typography>
        <Button
          onClick={handleCreateClick}
          variant="contained"
          color="error"
          size="large"
          sx={{ px: 6, py: 1.5, borderRadius: 'var(--radius-full)' }}
        >
          เริ่มเกม
        </Button>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 3, borderTop: '1px solid var(--color-border-subtle)', textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} CSS FILES. A Multiplayer Mystery Game.
        </Typography>
      </Box>
        </Box>
      </Fade>

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

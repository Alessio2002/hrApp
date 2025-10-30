// App.jsx (stacked controls with duration slider + volume)
import { useRef, useState, useEffect } from "react";
import YouTube from "react-youtube";
import "./App.css";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Person from "./components/Person.jsx";

// Extracts the 11-char video ID from common YouTube URL formats
function getYouTubeId(url) {
  const m = url.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

function App() {
  const playerRef = useRef(null);
  const timerRef = useRef(null);

  const [url, setUrl] = useState("");
  const [videoId, setVideoId] = useState("1qvQ4aUw4QY");
  const [expanded, setExpanded] = useState(true);
  const [savedTime, setSavedTime] = useState(0);

  // Slider state
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // Audio state
  const [volume, setVolume] = useState(50);
  const [muted, setMuted] = useState(false);

  const onReady = (e) => {
    playerRef.current = e.target;

    // Apply audio state (YouTube IFrame Player API expects 0–100 volume)
    e.target.setVolume?.(volume);
    if (muted) e.target.mute?.();
    else e.target.unMute?.();

    const d = e.target.getDuration() || 0;
    if (d > 0) setDuration(d);
    if (savedTime > 0) {
      e.target.seekTo(savedTime, true);
      e.target.pauseVideo();
      setCurrentTime(savedTime);
    }
  };

  const onStateChange = (e) => {
    const state = e.data;

    const d = e.target.getDuration() || 0;
    if (d > 0 && d !== duration) setDuration(d);

    const PLAYING = window.YT?.PlayerState?.PLAYING ?? 1;
    const PAUSED = window.YT?.PlayerState?.PAUSED ?? 2;
    const ENDED = window.YT?.PlayerState?.ENDED ?? 0;
    const BUFFERING = window.YT?.PlayerState?.BUFFERING ?? 3;

    if (state === PLAYING) {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        const t = playerRef.current?.getCurrentTime?.() ?? 0;
        setCurrentTime(t);
      }, 250);
    } else if (state === PAUSED || state === ENDED || state === BUFFERING) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      const t = e.target.getCurrentTime?.() ?? 0;
      setCurrentTime(t);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const loadFromUrl = () => {
    const id = getYouTubeId(url);
    if (id) {
      setVideoId(id);
      setSavedTime(0);
      setCurrentTime(0);
      setDuration(0);
    }
  };

  const play = () => {
    playerRef.current?.playVideo();
  };

  const pause = () => {
    playerRef.current?.pauseVideo();
  };

  const restart = () => {
    const p = playerRef.current;
    if (!p) return;
    p.seekTo(0, true);
    p.pauseVideo();
    setCurrentTime(0);
  };

  // Seek handler for the slider
  const seekTo = (seconds) => {
    const p = playerRef.current;
    if (!p) return;
    p.seekTo(seconds, true);
    setCurrentTime(seconds);
  };

  // Volume handler (0–100)
  const handleVolumeChange = (val) => {
    setVolume(val);
    const p = playerRef.current;
    if (!p) return;
    p.setVolume?.(val);
    if (val === 0 && !p.isMuted?.()) p.mute?.();
    if (val > 0 && p.isMuted?.()) p.unMute?.();
  };

  // Mute/unmute toggle
  const toggleMute = () => {
    const p = playerRef.current;
    if (!p) return;
    if (muted) {
      p.unMute?.();
      setMuted(false);
      if ((p.getVolume?.() ?? 0) === 0) {
        p.setVolume?.(20);
        setVolume(20);
      }
    } else {
      p.mute?.();
      setMuted(true);
    }
  };

  const togglePlayer = () => {
    if (expanded) {
      const t = playerRef.current?.getCurrentTime?.() ?? 0;
      setSavedTime(t);
      playerRef.current?.pauseVideo();
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setExpanded(false);
    } else {
      setExpanded(true);
    }
  };

  return (
    <>
      <Header header={"hrApp"} />

      <div className="people-row">
        <Person
          id={"person1"}
          name={"Nimi: Matti Meikäläinen"}
          title={"Tehtävä: Ohjelmistokehittäjä"}
          salary={"Palkka: 3400 € / kk"}
          phone={"Puh. 040-1234567"}
          email={"Sähköposti: matti.meikalainen@ohjelmisto.fi"}
          animal={"Lemmikki: Koira"}
          start={"Aloitus: 01.01.2020"}
          location={"Sijainti: Helsinki"}
          department={"Osasto: Tuotekehitys"}
          skills={"Taidot: JavaScript, React, Node.js"}
        />
        <Person
          id={"person2"}
          name={"Nimi: Katja Korhonen"}
          title={"Tehtävä: UI/UX-suunnittelija"}
          salary={"Palkka: 3400 € / kk"}
          phone={"Puh. 050-7654321"}
          email={"Sähköposti: katja.korhonen@ohjelmisto.fi"}
          animal={"Lemmikki: Kissa"}
          start={"Aloitus: 15.03.2021"}
          location={"Sijainti: Espoo"}
          department={"Osasto: Suunnittelu"}
          skills={"Taidot: Figma, Adobe XD, Sketch"}
        />
        <Person
          id={"person3"}
          name={"Nimi: Elias Virtanen"}
          title={"Tehtävä: DevOps-insinööri"}
          salary={"Palkka: 4500 € / kk"}
          phone={"Puh. 045-9876543"}
          email={"Sähköposti: elias.virtanen@ohjelmisto.fi"}
          animal={"Lemmikki: Papukaija"}
          start={"Aloitus: 10.06.2019"}
          location={"Sijainti: Vantaa"}
          department={"Osasto: IT-tuki"}
          skills={"Taidot: AWS, Docker, Kubernetes"}
        />
        <Person
          id={"person4"}
          name={"Nimi: Pekka Lahtinen"}
          title={"Tehtävä: Ohjelmistokehittäjä"}
          salary={"Palkka: 3400 € / kk"}
          phone={"Puh. 040-2345678"}
          email={"Sähköposti: pekka.lahtinen@ohjelmisto.fi"}
          animal={"Lemmikki: Kaniini"}
          start={"Aloitus: 20.08.2020"}
          location={"Sijainti: Turku"}
          department={"Osasto: Tuotekehitys"}
          skills={"Taidot: Python, Django, React"}
        />
        <Person
          id={"person5"}
          name={"Nimi: Laura Nieminen"}
          title={"Tehtävä: Projektipäällikkö"}
          salary={"Palkka: 5000 € / kk"}
          phone={"Puh. 050-8765432"}
          email={"Sähköposti: laura.nieminen@ohjelmisto.fi"}
          animal={"Lemmikki: Hamsteri"}
          start={"Aloitus: 05.11.2018"}
          location={"Sijainti: Tampere"}
          department={"Osasto: Hallinto"}
          skills={"Taidot: Scrum, Agile, Jira"}
        />
        <Person
          id={"person6"}
          name={"Nimi: Jussi Salminen"}
          title={"Tehtävä: Tietoturva-asiantuntija"}
          salary={"Palkka: 4800 € / kk"}
          phone={"Puh. 045-6789123"}
          email={"Sähköposti: jussi.salminen@ohjelmisto.fi"}
          animal={"Lemmikki: Kilpikonna"}
          start={"Aloitus: 12.02.2019"}
          location={"Sijainti: Oulu"}
          department={"Osasto: Tietoturva"}
          skills={"Taidot: Penetraatiotestaus, Verkkoanalyysi"}
        />
        <Person
          id={"person7"}
          name={"Nimi: Sanna Korpi"}
          title={"Tehtävä: Ohjelmistotestaaja"}
          salary={"Palkka: 3200 € / kk"}
          phone={"Puh. 040-3456789"}
          email={"Sähköposti: sanna.korpi@ohjelmisto.fi"}
          animal={"Lemmikki: Marsu"}
          start={"Aloitus: 18.04.2021"}
          location={"Sijainti: Jyväskylä"}
          department={"Osasto: Laadunvarmistus"}
          skills={"Taidot: Selenium, JUnit, TestRail"}
        />
        <Person
          id={"person8"}
          name={"Nimi: Antti Mäkinen"}
          title={"Tehtävä: Full Stack -kehittäjä"}
          salary={"Palkka: 4600 € / kk"}
          phone={"Puh. 050-9876543"}
          email={"Sähköposti: antti.makinen@ohjelmisto.fi"}
          animal={"Lemmikki: Akvaariokalat"}
          start={"Aloitus: 22.07.2019"}
          location={"Sijainti: Lahti"}
          department={"Osasto: Tuotekehitys"}
          skills={"Taidot: JavaScript, Node.js, Angular, MongoDB"}
        />
        <Person
          id={"person9"}
          name={"Nimi: Emilia Laine"}
          title={"Tehtävä: Data-analyytikko"}
          salary={"Palkka: 4200 € / kk"}
          phone={"Puh. 045-1234987"}
          email={"Sähköposti: emilia.laine@ohjelmisto.fi"}
          animal={"Lemmikki: Hamsteri"}
          start={"Aloitus: 30.09.2020"}
          location={"Sijainti: Kuopio"}
          department={"Osasto: Analytiikka"}
          skills={"Taidot: Python, R, SQL, Tableau"}
        />
        <Person
          id={"person10"}
          name={"Nimi: Tomi Heikkinen"}
          title={"Tehtävä: Pilvipalveluarkkitehti"}
          salary={"Palkka: 5500 € / kk"}
          phone={"Puh. 040-4567890"}
          email={"Sähköposti: tomi.heikkinen@ohjelmisto.fi"}
          animal={"Lemmikki: Rottweiler"}
          start={"Aloitus: 14.01.2018"}
          location={"Sijainti: Espoo"}
          department={"Osasto: IT-arkkitehtuuri"}
          skills={"Taidot: AWS, Azure, GCP"}
        />
      </div>

      <Footer footer={"© Alessio Zanasi WPK25K All rights reserved"} />

      {/* URL input + show/hide */}
      <h2 className="browser">Alessio's YT video browser</h2>
      <div
        className="player-panel"
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          margin: "1rem 0",
        }}
      >
        <input
          type="text"
          placeholder="Search YouTube URL..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ flex: "1" }}
        />
        <button onClick={loadFromUrl}>Load</button>
        <button onClick={togglePlayer}>
          {expanded ? "Hide player" : "Show player"}
        </button>
      </div>

      {/* Stacked controls (slider + buttons) above player */}
      {expanded && (
        <div className="player-stack">
          <div className="controls-bar">
            <input
              type="range"
              className="seek-slider"
              aria-label="Seek"
              min={0}
              max={Math.max(0, duration)}
              step={0.1}
              value={Math.min(currentTime, duration || 0)}
              onChange={(e) => seekTo(e.target.valueAsNumber)}
              disabled={!playerRef.current || !duration}
            />

            {/* Volume slider */}
            <input
              type="range"
              aria-label="Volume"
              min={0}
              max={100}
              step={1}
              value={volume}
              onChange={(e) => handleVolumeChange(e.target.valueAsNumber)}
              disabled={!playerRef.current}
              style={{ width: "120px", marginLeft: "0.75rem" }}
            />

            {/* Mute toggle */}
            <button onClick={toggleMute} disabled={!playerRef.current}>
              {muted || volume === 0 ? "Unmute" : "Mute"}
            </button>

            <button onClick={play} disabled={!playerRef.current}>
              Play
            </button>
            <button onClick={pause} disabled={!playerRef.current}>
              Pause
            </button>
            <button onClick={restart} disabled={!playerRef.current}>
              Restart
            </button>
          </div>

          <div className="player-frame">
            <YouTube
              videoId={videoId}
              onReady={onReady}
              onStateChange={onStateChange}
              opts={{
                width: "1280",
                height: "720",
                playerVars: { playsinline: 1, controls: 0, rel: 0 },
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default App;

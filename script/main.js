window.addEventListener("load", () => {
  const savedSong = localStorage.getItem("selectedSong");

  if (savedSong) {
    const song = JSON.parse(savedSong);
    prepareAutoplay(() => playSelectedSong(song));
    localStorage.removeItem("selectedSong");
  } else {
    Swal.fire({
      title: "Do you want to play music in the background?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        prepareAutoplay(() => playRandomSong());
      }
    });
  }
});

/* === fungsi untuk parsing waktu dari lirik === */
function parseTime(t) {
  const parts = t.split(":").map(Number);
  return parts[0] * 60 + parts[1];
}

/* === trik untuk memastikan autoplay berhasil === */
function prepareAutoplay(callback) {
  const audio = document.querySelector(".song");

  // Langsung coba jalanin
  callback();

  // Kalau autoplay diblokir, tunggu gesture pertama
  const resumeAudio = () => {
    if (audio.paused) {
      audio.play().catch(() => {});
    }
    document.removeEventListener("click", resumeAudio);
    document.removeEventListener("touchstart", resumeAudio);
  };

  document.addEventListener("click", resumeAudio);
  document.addEventListener("touchstart", resumeAudio);
}

/* === fungsi utama pemutar lagu === */
function playSelectedSong(song) {
  fetch("data/lyrics.json")
    .then((response) => response.json())
    .then((allSongs) => {
      const found = allSongs.find((s) => s.file === song.file);
      const audio = document.querySelector(".song");
      audio.src = song.file;
      audio.play().catch(() => {}); // diamkan error autoplay
      if (found) loadLyrics(audio, found.lyrics);
    })
    .catch((err) => console.error("Gagal memuat data lagu:", err));
}

function playRandomSong() {
  fetch("data/lyrics.json")
    .then((response) => response.json())
    .then((allSongs) => {
      const randomIndex = Math.floor(Math.random() * allSongs.length);
      const song = allSongs[randomIndex];
      const audio = document.querySelector(".song");
      audio.src = song.file;
      audio.play().catch(() => {}); // diamkan error autoplay
      loadLyrics(audio, song.lyrics);
    })
    .catch((err) => console.error("Gagal memuat data lagu:", err));
}

/* === fungsi sinkronisasi lirik === */
function loadLyrics(audio, lyricsData) {
  const lyricsContainer = document.getElementById("lyrics");
  const backBtn = document.getElementById("backBtn");

  audio.addEventListener("timeupdate", () => {
    const current = audio.currentTime;
    const line = lyricsData.find((l, i) => {
      const thisTime = parseTime(l.time);
      const next = lyricsData[i + 1] ? parseTime(lyricsData[i + 1].time) : null;
      return current >= thisTime && (!next || current < next);
    });

    if (line) {
      lyricsContainer.textContent = line.text;
      lyricsContainer.style.display = "none";
      void lyricsContainer.offsetHeight;
      lyricsContainer.style.display = "flex";
    }
  });

  audio.addEventListener("ended", () => {
    backBtn.classList.add("show");
  });
}

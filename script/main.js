window.addEventListener("load", () => {
  const savedSong = localStorage.getItem("selectedSong");

  if (savedSong) {
    const song = JSON.parse(savedSong);
    playSelectedSong(song);
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
        playRandomSong();
      }
    });
  }
});

function parseTime(t) {
  const parts = t.split(":").map(Number);
  return parts[0] * 60 + parts[1];
}

function normalizeSongPath(path) {
  return path.replace(/^\.\//, "").replace(/^\.\.\//, "");
}

function playSelectedSong(song) {
  fetch("../data/lyrics.json")
    .then((response) => response.json())
    .then((allSongs) => {
      const found = allSongs.find((s) => normalizeSongPath(s.file) === normalizeSongPath(song.file));
      const audio = document.querySelector(".song");
      const lyricsContainer = document.getElementById("lyrics");

      if (song.removed || found?.removed) {
        if (lyricsContainer) {
          lyricsContainer.textContent = song.comment || found?.comment || "Lirik ini disimpan sebagai catatan karena musik terkait sudah dihapus dari daftar.";
        }
        return;
      }

      const resolvedSongPath = song.file.startsWith("music/") ? "../" + song.file : song.file;

      audio.src = resolvedSongPath;

      audio
        .play()
        .then(() => {
          console.log("Song is playing:", song.name);
        })
        .catch((err) => {
          console.warn("Failed to play:", err);
          showFallbackBtn(audio);
        });

      if (found) loadLyrics(audio, found.lyrics);
    })
    .catch((err) => console.error("Gagal memuat data lagu:", err));
}

function playRandomSong() {
  fetch("../data/lyrics.json")
    .then((response) => response.json())
    .then((allSongs) => {
      const availableSongs = allSongs.filter((song) => !song.removed);

      if (!availableSongs.length) {
        return;
      }

      const randomIndex = Math.floor(Math.random() * availableSongs.length);
      const song = availableSongs[randomIndex];
      const audio = document.querySelector(".song");
      const lyricsContainer = document.getElementById("lyrics");
      const resolvedSongPath = song.file.startsWith("music/") ? "../" + song.file : song.file;

      audio.src = resolvedSongPath;

      audio
        .play()
        .then(() => {
          console.log("Song is playing:", song.name);
          loadLyrics(audio, song.lyrics);
        })
        .catch((err) => {
          console.warn("Failed to play:", err);
          showFallbackBtn(audio);
        });
    })
    .catch((err) => console.error("Gagal memuat data lagu:", err));
}

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

function showFallbackBtn(audio) {
  const fallbackBtn = document.createElement("button");
  fallbackBtn.textContent = "Play Music";
  fallbackBtn.style.padding = "12px 22px";
  fallbackBtn.style.background = "#800020";
  fallbackBtn.style.color = "#fff";
  fallbackBtn.style.border = "none";
  fallbackBtn.style.borderRadius = "10px";
  fallbackBtn.style.cursor = "pointer";

  fallbackBtn.style.position = "fixed";
  fallbackBtn.style.bottom = "30px";
  fallbackBtn.style.left = "50%";
  fallbackBtn.style.transform = "translateX(-50%)";
  fallbackBtn.style.zIndex = "999999";

  document.body.appendChild(fallbackBtn);

  fallbackBtn.addEventListener("click", () => {
    audio.play().catch(err => console.log(err));
    fallbackBtn.style.display = "none"; // tombol hilang setelah diklik
  });
}


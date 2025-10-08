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

/* =====================
   FUNGSI MAIN PLAYER
===================== */
function playSelectedSong(song) {
  fetch("data/lyrics.json")
    .then((response) => response.json())
    .then((allSongs) => {
      const found = allSongs.find((s) => s.file === song.file);
      const audio = document.querySelector(".song");
      const lyricsContainer = document.getElementById("lyrics");

      audio.src = song.file;

      // Coba autoplay, jika gagal munculkan tombol manual
      audio.play().catch(() => {
        console.warn("Autoplay diblokir oleh browser.");
        showManualPlayButton(audio, lyricsContainer);
      });

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
      const lyricsContainer = document.getElementById("lyrics");

      audio.src = song.file;

      // Coba autoplay, jika gagal munculkan tombol manual
      audio.play().catch(() => {
        console.warn("Autoplay diblokir oleh browser.");
        showManualPlayButton(audio, lyricsContainer);
      });

      loadLyrics(audio, song.lyrics);
    })
    .catch((err) => console.error("Gagal memuat data lagu:", err));
}

/* =====================
   FUNGSI TAMBAHAN
===================== */
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
      void lyricsContainer.offsetHeight; // reset animasi
      lyricsContainer.style.display = "flex";
    }
  });

  audio.addEventListener("ended", () => {
    backBtn.classList.add("show");
  });
}

/* =====================
   TOMBOL JIKA AUTOPLAY GAGAL
===================== */
function showManualPlayButton(audio, container) {
  const manualBtn = document.createElement("button");
  manualBtn.textContent = "▶️ Putar Lagu";
  manualBtn.style.padding = "10px 22px";
  manualBtn.style.fontSize = "15px";
  manualBtn.style.marginTop = "30px";
  manualBtn.style.background = "#800020";
  manualBtn.style.color = "#fff";
  manualBtn.style.border = "none";
  manualBtn.style.borderRadius = "8px";
  manualBtn.style.cursor = "pointer";
  manualBtn.style.transition = "0.3s";
  manualBtn.style.boxShadow = "0 3px 8px rgba(0,0,0,0.2)";

  manualBtn.addEventListener("mouseenter", () => {
    manualBtn.style.background = "#a0333f";
  });

  manualBtn.addEventListener("mouseleave", () => {
    manualBtn.style.background = "#800020";
  });

  manualBtn.addEventListener("click", () => {
    audio.play();
    manualBtn.remove(); // hilangkan tombol setelah diklik
  });

  container.appendChild(manualBtn);
}

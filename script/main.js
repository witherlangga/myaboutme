window.addEventListener('load', () => {
    Swal.fire({
        title: 'Do you want to play music in the background?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
    }).then((result) => {
        if (result.isConfirmed) {
            playRandomSong();
        }
    });
});

// fungsi konversi "m:ss" ke detik
function parseTime(t) {
    const parts = t.split(":").map(Number);
    return parts[0] * 60 + parts[1]; // menit*60 + detik
}

function playRandomSong() {
    fetch("data/lyrics.json")
      .then(response => response.json())
      .then(allSongs => {
          const randomIndex = Math.floor(Math.random() * allSongs.length);
          const song = allSongs[randomIndex];

          const audio = document.querySelector('.song');
          audio.src = song.file;
          audio.play().catch(() => console.log("Autoplay mungkin diblokir."));

          loadLyrics(audio, song.lyrics);
      })
      .catch(err => console.error("Gagal load data lagu:", err));
}

function loadLyrics(audio, lyricsData) {
    const lyricsContainer = document.getElementById("lyrics");

    audio.addEventListener("timeupdate", () => {
        const current = audio.currentTime;
        const line = lyricsData.find((l, i) => {
            const thisTime = parseTime(l.time);
            const next = lyricsData[i + 1] ? parseTime(lyricsData[i + 1].time) : null;
            return current >= thisTime && (!next || current < next);
        });

        if (line) {
            lyricsContainer.textContent = line.text;
        }
    });
}

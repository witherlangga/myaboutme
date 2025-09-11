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
        const audio = document.querySelector('.song');
        if (result.isConfirmed) {
            audio.play().catch(() => console.log("Autoplay mungkin diblokir."));
        }
        loadLyrics(audio);
    });
});

function loadLyrics(audio) {
    fetch("data/lyrics.json")
      .then(response => response.json())
      .then(lyricsData => {
          const lyricsContainer = document.getElementById("lyrics");

          audio.addEventListener("timeupdate", () => {
              const current = audio.currentTime;
              const line = lyricsData.find((l, i) => {
                  const next = lyricsData[i+1];
                  return current >= l.time && (!next || current < next.time);
              });

              if (line) {
                  lyricsContainer.textContent = line.text;
              }
          });
      })
      .catch(err => console.error("Gagal load lirik:", err));
}

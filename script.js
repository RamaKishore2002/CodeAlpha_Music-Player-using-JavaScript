const trackList = [
    {
        title: "Neon Dreams",
        artist: "Midnight Drive",
        art: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    },
    {
        title: "Cyberpunk Horizon",
        artist: "Glitch Matrix",
        art: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=400",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
    },
    {
        title: "Lo-Fi Rainfall",
        artist: "Chill Hop Collective",
        art: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
    }
];

let trackIndex = 0;
let isPlaying = false;

const audio = document.getElementById("main-audio");

const playBtn = document.getElementById("play-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");

const trackArt = document.getElementById("art");
const trackTitle = document.getElementById("title");
const trackArtist = document.getElementById("artist");

const progressSlider = document.getElementById("progress-slider");
const volumeSlider = document.getElementById("volume-slider");

const currentTimeDisplay = document.getElementById("current-time");
const durationDisplay = document.getElementById("duration");

const playlistQueue = document.getElementById("playlist-queue");

function initPlayer() {

    loadTrack(trackIndex);
    renderPlaylist();

    playBtn.addEventListener("click", togglePlay);
    nextBtn.addEventListener("click", nextTrack);
    prevBtn.addEventListener("click", prevTrack);

    progressSlider.addEventListener("input", seekTo);
    volumeSlider.addEventListener("input", changeVolume);

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", nextTrack);
}

function loadTrack(index) {

    const track = trackList[index];

    audio.src = track.url;
    audio.load();

    trackArt.style.backgroundImage = `url(${track.art})`;
    trackTitle.textContent = track.title;
    trackArtist.textContent = track.artist;

    audio.volume = volumeSlider.value / 100;

    resetSlider();
    updateActivePlaylistItem();
}

function resetSlider() {

    progressSlider.value = 0;

    currentTimeDisplay.textContent = "0:00";
    durationDisplay.textContent = "0:00";
}

function togglePlay() {

    if (isPlaying) {
        pauseTrack();
    } else {
        playTrack();
    }
}

function playTrack() {

    audio.play()
        .then(() => {

            isPlaying = true;

            playBtn.innerHTML =
                '<i class="fas fa-pause"></i>';
        })
        .catch((error) => {
            console.log(error);
        });
}

function pauseTrack() {

    audio.pause();

    isPlaying = false;

    playBtn.innerHTML =
        '<i class="fas fa-play"></i>';
}

function nextTrack() {

    trackIndex++;

    if (trackIndex >= trackList.length) {
        trackIndex = 0;
    }

    loadTrack(trackIndex);
    playTrack();
}

function prevTrack() {

    trackIndex--;

    if (trackIndex < 0) {
        trackIndex = trackList.length - 1;
    }

    loadTrack(trackIndex);
    playTrack();
}

function seekTo() {

    if (!isNaN(audio.duration)) {

        const seekTime =
            audio.duration * (progressSlider.value / 100);

        audio.currentTime = seekTime;
    }
}

function changeVolume() {

    audio.volume = volumeSlider.value / 100;
}

function updateProgress() {

    if (!isNaN(audio.duration)) {

        const progress =
            (audio.currentTime / audio.duration) * 100;

        progressSlider.value = progress;

        let currentMinutes =
            Math.floor(audio.currentTime / 60);

        let currentSeconds =
            Math.floor(audio.currentTime % 60);

        let durationMinutes =
            Math.floor(audio.duration / 60);

        let durationSeconds =
            Math.floor(audio.duration % 60);

        if (currentSeconds < 10) {
            currentSeconds = "0" + currentSeconds;
        }

        if (durationSeconds < 10) {
            durationSeconds = "0" + durationSeconds;
        }

        currentTimeDisplay.textContent =
            `${currentMinutes}:${currentSeconds}`;

        durationDisplay.textContent =
            `${durationMinutes}:${durationSeconds}`;
    }
}

function renderPlaylist() {

    playlistQueue.innerHTML = "";

    trackList.forEach((track, index) => {

        const li = document.createElement("li");

        li.dataset.index = index;

        li.innerHTML = `
            <div
                class="li-art"
                style="background-image: url(${track.art})"
            ></div>

            <div class="li-details">
                <h4>${track.title}</h4>
                <p>${track.artist}</p>
            </div>
        `;

        li.addEventListener("click", () => {

            trackIndex = index;

            loadTrack(trackIndex);
            playTrack();
        });

        playlistQueue.appendChild(li);
    });
}

function updateActivePlaylistItem() {

    const items =
        playlistQueue.querySelectorAll("li");

    items.forEach((item) => {

        const itemIndex = parseInt(item.dataset.index);

        if (itemIndex === trackIndex) {
            item.classList.add("active-track");
        } else {
            item.classList.remove("active-track");
        }
    });
}

window.addEventListener("load", initPlayer);
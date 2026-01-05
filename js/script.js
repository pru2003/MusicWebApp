console.log("lets write javascript");
let currentIndex = 0;
let currentSong = new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
    currFolder = folder;
    let res = await fetch(`${folder}/info.json`);
    let data = await res.json();

    songs = data.songs;

    // show all the songs in the playlist
    let songUL = document.querySelector(".songList ul");
    songUL.innerHTML = "";

    for (const song of songs) {
        songUL.innerHTML += `
        <li>
            <img class="invert" src="img/music.svg" alt="">
            <div class="info">
                <div>${song}</div>
                <div>Pruthviraj</div>
            </div>
            <div class="playnow">
                <span>Play Now</span>
                <img class="invert" src="img/play.svg" alt="">
            </div>
        </li>`;
    }

    // attach click listeners
    Array.from(songUL.getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            playMusic(e.querySelector(".info div").innerText.trim());
        });
    });

    return songs;
}

const playMusic = (track, pause = false) => {
    currentIndex = songs.indexOf(track);   // ⭐ track index stored
    currentSong.src = `${currFolder}/${track}`;

    if (!pause) {
        currentSong.play().catch(console.error);
        play.src = "img/pause.svg";
    }

    document.querySelector(".songinfo").innerHTML = track;
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};


async function displayAlbums() {
    let folders = ["ncs", "cs", "Soulfulstrings", "Globalgrooves", "Lovenotes", "Powerbeats", "Trending hits", "Phonk"];
    let cardContainer = document.querySelector(".cardContainer");
    cardContainer.innerHTML = "";

    for (const folder of folders) {
        let res = await fetch(`songs/${folder}/info.json`);
        let data = await res.json();

        cardContainer.innerHTML += `
        <div data-folder="${folder}" class="card">
            <div class="play">▶</div>
            <img src="songs/${folder}/cover.jpg">
            <h2>${data.title}</h2>
            <p>${data.description}</p>
        </div>`;
    }

    // load playlist on click
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async () => {
            songs = await getSongs(`songs/${e.dataset.folder}`);
            playMusic(songs[0]);
        });
    });
}

async function main() {
    //get the list of all songs
    await getSongs("songs/ncs")
    playMusic(songs[0], true)


    // Display all the albums of the page
    await displayAlbums()

    //attach an event listener to play, next and previous
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "img/pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "img/play.svg"
        }
    })

    //listen for timeupdate event
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        if (!isNaN(currentSong.duration) && currentSong.duration > 0) {
            document.querySelector(".circle").style.left =
                (currentSong.currentTime / currentSong.duration) * 100 + "%";
        }

    })

    //add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

    //add an event listner for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    //add an event listner for close button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })

    //add avn event listener to previous and next
    previous.addEventListener("click", () => {
    currentIndex--;

    if (currentIndex < 0) {
        currentIndex = songs.length - 1;
    }

    playMusic(songs[currentIndex]);
});



   next.addEventListener("click", () => {
    currentIndex++;

    if (currentIndex >= songs.length) {
        currentIndex = 0; // loop back
    }

    playMusic(songs[currentIndex]);
});

    //Add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("setting volume to", e.target.value)
        currentSong.volume = parseInt(e.target.value) / 100
    })

    //Add event listener to mute the track
    document.querySelector(".volume>img").addEventListener("click", e => {
        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else {
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            currentSong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }
    })


}

main()
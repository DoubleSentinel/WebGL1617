function startMusic(f)
{
    $('#choix_musique').hide();
    $('#musique').show();
    //Source des deux lignes suivantes : http://stackoverflow.com/questions/26745292/canvas-toggle-filling-whole-page-removing-scrollbar
    document.body.scrollTop = 0; // <-- pull the page back up to the top
    //document.body.style.overflow = 'hidden'; // <-- relevant addition

    //On retire les balises audio déjà présente
    var audioDiv = document.getElementById("player-div");
    while(audioDiv.firstChild)
    {
        audioDiv.removeChild(audioDiv.firstChild);
    }
    if(f == null){
      var files = f;
      //var files = this.files;
      //On regarde si Window.URL existe, si ce n'est pas le cas, on utilie webkit
      //ça permet de savoir si on utilise Firefox ou Chrome/Chromium
      var file = $('#musique_sample').val();
    }else{
      var files = f;
      //var files = this.files;
      //On regarde si Window.URL existe, si ce n'est pas le cas, on utilie webkit
      //ça permet de savoir si on utilise Firefox ou Chrome/Chromium
      var file = (window.URL ? URL : webkitURL).createObjectURL(files[0]);
    }

    var audio = new Audio();
    audio.src = file;
    audio.id = 'player';
    audio.controls = true;
    audio.autoplay = true;
    audioDiv.appendChild(audio);
    var context = new AudioContext();

    // Test stéréo
    var memoireTampon = context.createBuffer(2, 22050, 44100);

    var analyser = context.createAnalyser();
    //analyser.fftSize = 2048;
    analyser.fftSize = 2048;
    //La "range" est de [0 , 255] dans le domaine N
    frequencyData = new Uint8Array(analyser.frequencyBinCount);
    // frequencyBinCount : orrespond en général au nombre de valeurs que vous aurez à manipuler pour la visualisation.

    var source = context.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(context.destination);

    $(audio).bind("ended",function(){
        location.reload();
    });

    // Méthode permettant de mettre à jour l'affichage
    function renderFrame() {
        // Va appeler renderFrame en boucle
        requestAnimationFrame(renderFrame);
        // met à jour les données dans frequenCyData
        analyser.getByteFrequencyData(frequencyData);

        //getByteFrequencyData : copie les données de fréquence dans le Uint8Array passé en argument
        animation.initBuffers();
    }
    renderFrame();
};

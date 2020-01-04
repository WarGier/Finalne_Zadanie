

    let canvas = document.getElementById("myCanvas");
    let ctx = canvas.getContext("2d");
    
    const CAR_WIDTH = 256;//sirka jedneho framu z 16tich
    const CAR_HEIGHT = 256;
    

    function drawFrame(Auticko,frameX, frameY, canvasX, canvasY) {//pomocna funkcia, mozno  juani netreba ale rychlejsie sa potom  vypisuje
        ctx.drawImage(Auticko,                                  //funkcia draw image (obrazok,srcX,srcY,destX,destY)
                      frameX * CAR_WIDTH, frameY * CAR_HEIGHT, CAR_WIDTH, CAR_HEIGHT,
                      canvasX, canvasY, CAR_WIDTH, CAR_HEIGHT);
      }
    
    let pristup=0;                              //pristup pri klikani  na auticka aby sa nestalo ze kliknem na ine pokial este jazdi nejake pred nim

    function getCursorPosition(canvas, event) { //funkcia kt vykonava klikanie
        
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        console.log("x: " + x + " y: " + y);
        if(((x>=76)&&(x<=106))&&((y>=223)&&(y<=234))&&(pristup==0)){ //ak som klikol na modre
            pristup=1;
            spustModre();
            setTimeout(function(){ pristup=2;console.log(pristup); }, 5000);//povolim pristup na kliknutie na cervene az po prejdeni modreho
        }

        if(((x>=173)&&(x<=183))&&((y>=84)&&(y<=111))&&(pristup==2)){// ak  na cervene
            pristup=3
            spustCervene();
            setTimeout(function(){ pristup=4;console.log(pristup); }, 5000);//povolim pristup na kliknutie na fialove az po prejdeni cerveneho

        }else if(((x>=173)&&(x<=183))&&((y>=84)&&(y<=111))&&(pristup==0)){//ak na cervene  kliknem ako prve
          alert("Zle riešenie");
        }

        if(((x>=284)&&(x<=311))&&((y>=176)&&(y<=186))&&(pristup==4)){//ak na fialove
            pristup=5;                                           
            console.log(pristup);
            spustFialove();
            setTimeout(function(){ alert("Križovatka je vyriešená správne"); }, 5000);  //vyhodnotenie az po prejdeni posledneho auticka 
        }else if(((x>=284)&&(x<=311))&&((y>=176)&&(y<=186))&&(pristup==0||pristup==2)){//ak na fialove kliknem  ako prve
          alert("Zle riešenie");
        }
    };
    
    
    canvas.addEventListener('mousedown', function(e) {              //klikanie
    getCursorPosition(canvas, e)
    });




//--------------------------------------pridavanie images
    let modreAuticko = new Image();
    let cerveneAuticko = new Image();
    let fialoveAuticko = new Image();

//-------------------------------------------pridam src
    modreAuticko.src = 'modreSprites.png';
    cerveneAuticko.src = 'redcarSprites.png';
    fialoveAuticko.src = 'fialoveSprites.png';

//---------------------------------------------pri nacitani vykreslim prvy frame na vhodnej suradnici destX,destY
    modreAuticko.onload = function() {
        drawFrame(modreAuticko,0,0,70,150);
      };
    cerveneAuticko.onload=function(){
        drawFrame(cerveneAuticko,0,0,160,80);
    };
    fialoveAuticko.onload=function(){
        drawFrame(fialoveAuticko,0,0,170,170);
    };

//-----------------------------------------------funkcia pre spustenie
    function spustCervene() {
        window.requestAnimationFrame(animujCervene);//vyvola sa (rekurzivne) animujCervene
    }

    function spustModre() {
        window.requestAnimationFrame(animujModre);
    }
    function spustFialove() {
        window.requestAnimationFrame(animujFialove);
    }


//--------------------------------------------premenne pre animovanie 

      const cycleLoop = [0, 1, 2, 3];
      let currentLoopIndex = 0;                     //index  pre pole cycleloop
      let frameCount = 0;                           //casovac
      let currentDirection = 0;                     //na skakanie po riadkoch dole
      let animationFrameId=0;
 //-----------------------------------------------------------3funkcie pre  animaciu modreho,cerveneho,fialoveho auta     
      function animujModre() {
        if ((animationFrameId!=0) && (currentDirection >= 4)) {// ked sompresiel nakoniec spritessheet tak ukoncim vykreslovanie
            window.cancelAnimationFrame(animationFrameId);
            frameCount=0;                           //vynulujem premenne
            currentDirection=0;
            animationFrameId=0;
            return;
        }                                           //inak
        frameCount++;                   
        if (frameCount < 15) {                       //ak este nieje 15 nic nevykonavaj, ale chod odznova aby boli medzi snimkami nejake casove medzery
          window.requestAnimationFrame(animujModre);        //rekurzivne volanie funkcie hore
          return;
        }
        frameCount = 0;
        ctx.clearRect(0, 0, 400, 400);               //vycisti plochu
        drawCrossroad();                            //dokresli krizovatku
        drawFrame(cerveneAuticko,0,0,160,80);       // takisto aj auticka na svojich vhodnych poziciach
        drawFrame(fialoveAuticko,0,0,170,170);
        drawFrame(modreAuticko,cycleLoop[currentLoopIndex], currentDirection, 70, 150);// a vykresli auticko na novej pozicii
        currentLoopIndex++;
        if (currentLoopIndex >= cycleLoop.length) {
          currentLoopIndex = 0;
          currentDirection++;                       // Next row/direction in the sprite sheet
        }

        animationFrameId = window.requestAnimationFrame(animujModre);
      }  

      function animujCervene() {
        if ((animationFrameId!=0) && (currentDirection >= 4)) {
            window.cancelAnimationFrame(animationFrameId);
            frameCount=0;
            currentDirection=0;
            animationFrameId=0;
            return;
        }
        frameCount++;
        if (frameCount < 15) {
          window.requestAnimationFrame(animujCervene);
          return;
        }
        frameCount = 0;
        ctx.clearRect(0, 0, 400, 400);
        drawCrossroad();
        drawFrame(modreAuticko,3,3,70,150);
        drawFrame(fialoveAuticko,0,0,170,170);
        drawFrame(cerveneAuticko,cycleLoop[currentLoopIndex], currentDirection, 160, 80);
        currentLoopIndex++;
        if (currentLoopIndex >= cycleLoop.length) {
          currentLoopIndex = 0;
          currentDirection++;                       // Next row/direction in the sprite sheet
        }

        animationFrameId = window.requestAnimationFrame(animujCervene);
      } 

      function animujFialove() {
        if ((animationFrameId!=0) && (currentDirection >= 4)) {
            window.cancelAnimationFrame(animationFrameId);
            frameCount=0;
            currentDirection=0;
            animationFrameId=0;
            return;
        }
        frameCount++;
        if (frameCount < 15) {
          window.requestAnimationFrame(animujFialove);
          return;
        }
        frameCount = 0;
        ctx.clearRect(0, 0, 400, 400);
        drawCrossroad();
        drawFrame(cerveneAuticko,3,3,160,80);
        drawFrame(modreAuticko,3,3,70,150);
        drawFrame(fialoveAuticko,cycleLoop[currentLoopIndex], currentDirection, 170, 170);
        currentLoopIndex++;
        if (currentLoopIndex >= cycleLoop.length) {
          currentLoopIndex = 0;
          currentDirection++;                       // Next row/direction in the sprite sheet
        }

        animationFrameId = window.requestAnimationFrame(animujFialove);
      } 

      function drawCrossroad(){
        ctx.fillStyle = "#000";
        ctx.fillRect(0,150,400,100);
        ctx.fillRect(150,0,100,400);
      }

    
    

    ctx.fillStyle = "#000";                             //pociatocne vykreslenie
    canvas.style.backgroundColor="#009800"
    ctx.fillRect(0,150,400,100);
    ctx.fillRect(150,0,100,400);
    


    function demo() {
      spustModre();
      setTimeout(function(){ spustCervene(); }, 5000);
      setTimeout(function(){ spustFialove(); }, 10000);
     }

    function reset(){
      ctx.clearRect(0, 0, 400, 400);               //vycisti plochu
      drawCrossroad();
      drawFrame(modreAuticko,0,0,70,150);
      drawFrame(cerveneAuticko,0,0,160,80);
      drawFrame(fialoveAuticko,0,0,170,170);
      pristup=0;
    }
    let ukaz=0;
    function vysvetlenie(){
      if(ukaz==0){
        document.getElementById("vysvetlenie").style.display="unset";
        ukaz=1;
      }else if(ukaz==1){
        document.getElementById("vysvetlenie").style.display="none";
        ukaz=0;
      }
    }


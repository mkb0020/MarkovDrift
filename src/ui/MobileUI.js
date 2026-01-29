// MobileUI.js
export class MobileUI {
  constructor(onGameStart) {
    this.onGameStart = onGameStart;
    this.gameStarted = false;
    
    this.createUI();
    this.checkOrientation();
    
    // DETECT ORIENTATION CHANGE
    window.addEventListener('resize', () => this.checkOrientation());
    window.addEventListener('orientationchange', () => {
      setTimeout(() => this.checkOrientation(), 100);
    });
  }

  createUI() {
    // OVERLAY
    this.overlay = document.createElement('div');
    this.overlay.id = 'mobile-overlay';
    this.overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #000000 0%, #1a0033 100%);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      padding: 20px;
      box-sizing: border-box;
    `;

    // START SCREEN
    this.startScreen = document.createElement('div');
    this.startScreen.id = 'start-screen';
    this.startScreen.style.cssText = `
      text-align: center;
      color: white;
      display: none;
    `;
    this.startScreen.innerHTML = `
      <h1 style="
        font-size: 3rem;
        margin: 0 0 1rem 0;
        background: linear-gradient(45deg, #00ffff, #ff00ff);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-shadow: 0 0 30px rgba(0,255,255,0.5);
        font-weight: bold;
        letter-spacing: 2px;
      ">MARKOV DRIFT</h1>
      <p style="
        font-size: 1.2rem;
        margin: 0 0 2rem 0;
        color: #00ffff;
        text-shadow: 0 0 10px rgba(0,255,255,0.7);
      ">Navigate the neon highway</p>
      <button id="start-button" style="
        font-size: 1.5rem;
        padding: 1rem 3rem;
        background: linear-gradient(135deg, #ff00ff, #00ffff);
        border: none;
        border-radius: 50px;
        color: white;
        font-weight: bold;
        cursor: pointer;
        box-shadow: 0 0 20px rgba(255,0,255,0.6), 0 0 40px rgba(0,255,255,0.4);
        transition: all 0.3s ease;
        text-transform: uppercase;
        letter-spacing: 2px;
        touch-action: manipulation;
      ">START</button>
      <div style="
        margin-top: 2rem;
        font-size: 0.9rem;
        color: #888;
      ">
        <p style="margin: 0.5rem 0;">Tap LEFT or RIGHT to steer</p>
        <p style="margin: 0.5rem 0;">Stay on the road!</p>
      </div>
    `;

    // ROTATE PHONE MESSAGE
    this.orientationWarning = document.createElement('div');
    this.orientationWarning.id = 'orientation-warning';
    this.orientationWarning.style.cssText = `
      text-align: center;
      color: white;
      display: none;
    `;
    this.orientationWarning.innerHTML = `
      <div style="
        font-size: 4rem;
        margin-bottom: 1rem;
        animation: rotate 2s ease-in-out infinite;
      ">📱</div>
      <h2 style="
        font-size: 2rem;
        margin: 0 0 1rem 0;
        color: #00ffff;
        text-shadow: 0 0 10px rgba(0,255,255,0.7);
      ">Rotate Your Device</h2>
      <p style="
        font-size: 1.2rem;
        color: #888;
      ">This game requires landscape orientation</p>
      <style>
        @keyframes rotate {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(90deg); }
        }
      </style>
    `;

    // UI
    this.overlay.appendChild(this.startScreen);
    this.overlay.appendChild(this.orientationWarning);
    document.body.appendChild(this.overlay);

    
    const startButton = document.getElementById('start-button');
    startButton.addEventListener('click', () => this.startGame());
    
    
    startButton.addEventListener('mouseenter', () => {
      startButton.style.transform = 'scale(1.1)';
      startButton.style.boxShadow = '0 0 30px rgba(255,0,255,0.8), 0 0 60px rgba(0,255,255,0.6)';
    });
    startButton.addEventListener('mouseleave', () => {
      startButton.style.transform = 'scale(1)';
      startButton.style.boxShadow = '0 0 20px rgba(255,0,255,0.6), 0 0 40px rgba(0,255,255,0.4)';
    });
  }

  checkOrientation() {
    const isLandscape = window.innerWidth > window.innerHeight;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (!isMobile) {
      if (!this.gameStarted) {
        this.showStartScreen();
      } else {
        this.hideOverlay();
      }
      return;
    }

    // LANDSCAPE ONLY
    if (isLandscape) {
      if (!this.gameStarted) {
        this.showStartScreen();
      } else {
        this.hideOverlay();
      }
    } else {
      this.showOrientationWarning();
    }
  }

  showStartScreen() {
    this.overlay.style.display = 'flex';
    this.startScreen.style.display = 'block';
    this.orientationWarning.style.display = 'none';
  }

  showOrientationWarning() {
    this.overlay.style.display = 'flex';
    this.startScreen.style.display = 'none';
    this.orientationWarning.style.display = 'block';
  }

  hideOverlay() {
    this.overlay.style.display = 'none';
  }

  startGame() {
    this.gameStarted = true;
    this.hideOverlay();
    this.onGameStart();
  }
}
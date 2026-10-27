(function() {
  function init() {
    if (document.getElementById('btn-apri-telescopio')) return;

    const btn = document.createElement('button');
    btn.id = 'btn-apri-telescopio';
    btn.innerText = "🔭 Apri Telescopio";
    
    // Stile: Pulsante giallo flottante in basso a destra
    btn.style.cssText = "position:fixed; bottom:20px; right:20px; z-index:999999; padding:15px 25px; background:#d4af37; color:#000; font-weight:bold; border-radius:50px; border:none; cursor:pointer; box-shadow:0 4px 15px rgba(0,0,0,0.6); font-size:16px; font-family:sans-serif; transition: all 0.3s ease;";

    btn.onmouseenter = () => { btn.style.transform = 'scale(1.05)'; btn.style.background = '#f3e5ab'; };
    btn.onmouseleave = () => { btn.style.transform = 'scale(1)'; btn.style.background = '#d4af37'; };

    btn.onclick = function() {
      // URL della tua app satellite (basato sullo screenshot)
      const TELESCOPE_APP_URL = 'https://egastrodiscover.github.io/EGASTROmount/'; 
      
      let url = TELESCOPE_APP_URL;
      // Se l'app madre ha le coordinate, passale
      if (window.state && window.state.lat) {
        url += `?lat=${window.state.lat}&lon=${window.state.lon}`;
        // Se c'è un target selezionato, passalo
        if (window.state.target && window.state.target.ra) {
          url += `&targetName=${encodeURIComponent(window.state.target.n)}&targetRa=${window.state.target.ra}&targetDec=${window.state.target.dec}`;
        }
      }
      window.open(url, 'EGASTROmountWindow');
    };

    document.body.appendChild(btn);
    console.log("✅ Pulsante Telescopio caricato con successo!");
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
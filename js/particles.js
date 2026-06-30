/* Lightweight particles.js-style network background — drifting dots
   with proximity links, sitting behind all page content. */
(function () {
  var canvas = document.getElementById('particles-bg');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var COLORS = ['255,111,97', '124,58,237', '255,180,162'];
  var DENSITY = 16000;       // px^2 per particle — lower = more dots
  var MAX_PARTICLES = 140;
  var LINK_DIST = 130;
  var SPEED = 0.18;

  var particles = [];
  var width, height, dpr;
  var rafId = null;
  var running = true;

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildParticles();
  }

  function buildParticles() {
    var count = Math.min(MAX_PARTICLES, Math.floor((width * height) / DENSITY));
    particles = [];
    for (var i = 0; i < count; i++) {
      particles.push({
        x: rand(0, width),
        y: rand(0, height),
        vx: rand(-SPEED, SPEED),
        vy: rand(-SPEED, SPEED),
        r: rand(1.2, 3.2),
        c: COLORS[i % COLORS.length],
        a: rand(0.25, 0.6)
      });
    }
  }

  function step() {
    ctx.clearRect(0, 0, width, height);

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;
      if (p.y < -10) p.y = height + 10;
      if (p.y > height + 10) p.y = -10;
    }

    for (var i = 0; i < particles.length; i++) {
      for (var j = i + 1; j < particles.length; j++) {
        var a = particles[i], b = particles[j];
        var dx = a.x - b.x, dy = a.y - b.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < LINK_DIST) {
          var lineAlpha = (1 - dist / LINK_DIST) * 0.12;
          ctx.strokeStyle = 'rgba(' + a.c + ',' + lineAlpha + ')';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + p.c + ',' + p.a + ')';
      ctx.fill();
    }

    if (running && !reduceMotion) rafId = requestAnimationFrame(step);
  }

  document.addEventListener('visibilitychange', function () {
    running = !document.hidden;
    if (running && !reduceMotion) {
      rafId = requestAnimationFrame(step);
    } else if (rafId) {
      cancelAnimationFrame(rafId);
    }
  });

  window.addEventListener('resize', resize);

  resize();
  if (reduceMotion) {
    step(); // draw a single static frame, no animation loop
  } else {
    rafId = requestAnimationFrame(step);
  }
})();

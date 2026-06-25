(function () {
  "use strict";

  const root = document.getElementById("page-reviewers-map");
  if (!root) return;

  const siteId = root.getAttribute("data-feedpulse-site-id");
  const publicHost = root.getAttribute("data-feedpulse-host") || "g-alois.github.io";
  const isDashboard = root.getAttribute("data-reviewer-mode") === "dashboard";
  const dashboardUrl = root.getAttribute("data-dashboard-url") || "/visitor-map/";
  const apiOrigin = "https://visitor-tracker-129.emergent.host";
  const scriptUrl = document.currentScript && document.currentScript.src ? document.currentScript.src : window.location.href;
  const landTopologyUrl = new URL("../data/land-110m.json", scriptUrl).toString();
  const maxCountries = 8;
  const pollMs = 60000;
  const lonMin = -180;
  const lonMax = 180;
  const latMin = -60;
  const latMax = 84;

  const countryPoints = {
    AD: [42.5, 1.5], AE: [24.0, 54.0], AF: [33.0, 65.0], AG: [17.1, -61.8],
    AI: [18.2, -63.1], AL: [41.0, 20.0], AM: [40.0, 45.0], AO: [-12.5, 18.5],
    AR: [-34.0, -64.0], AS: [-14.3, -170.7], AT: [47.5, 14.5], AU: [-25.0, 133.0],
    AW: [12.5, -69.9], AZ: [40.5, 47.5], BA: [44.0, 18.0], BB: [13.2, -59.5],
    BD: [24.0, 90.0], BE: [50.8, 4.5], BF: [13.0, -2.0], BG: [43.0, 25.0],
    BH: [26.0, 50.6], BI: [-3.5, 30.0], BJ: [9.5, 2.3], BM: [32.3, -64.8],
    BN: [4.5, 114.7], BO: [-17.0, -65.0], BR: [-10.0, -55.0], BS: [24.3, -76.0],
    BT: [27.5, 90.5], BW: [-22.0, 24.0], BY: [53.0, 28.0], BZ: [17.2, -88.5],
    CA: [56.0, -106.0], CD: [0.0, 25.0], CF: [7.0, 21.0], CG: [-1.0, 15.0],
    CH: [47.0, 8.0], CI: [8.0, -5.0], CL: [-30.0, -71.0], CM: [6.0, 12.0],
    CN: [35.0, 103.0], CO: [4.0, -72.0], CR: [10.0, -84.0], CU: [21.5, -80.0],
    CV: [16.0, -24.0], CY: [35.0, 33.0], CZ: [49.8, 15.5], DE: [51.0, 9.0],
    DJ: [11.5, 43.0], DK: [56.0, 10.0], DM: [15.4, -61.4], DO: [19.0, -70.7],
    DZ: [28.0, 3.0], EC: [-2.0, -77.5], EE: [59.0, 26.0], EG: [27.0, 30.0],
    ES: [40.0, -4.0], ET: [8.0, 38.0], FI: [64.0, 26.0], FJ: [-18.0, 178.0],
    FK: [-51.8, -59.0], FM: [6.9, 158.2], FR: [46.0, 2.0], GA: [-1.0, 11.8],
    GB: [54.0, -2.0], GD: [12.1, -61.7], GE: [42.0, 43.5], GH: [8.0, -2.0],
    GI: [36.1, -5.3], GL: [72.0, -40.0], GM: [13.5, -15.5], GN: [11.0, -10.0],
    GQ: [2.0, 10.0], GR: [39.0, 22.0], GT: [15.5, -90.2], GU: [13.4, 144.8],
    GW: [12.0, -15.0], GY: [5.0, -59.0], HK: [22.3, 114.2], HN: [15.0, -86.5],
    HR: [45.1, 15.2], HT: [19.0, -72.4], HU: [47.0, 20.0], ID: [-5.0, 120.0],
    IE: [53.0, -8.0], IL: [31.5, 34.8], IM: [54.2, -4.5], IN: [20.0, 77.0],
    IQ: [33.0, 44.0], IR: [32.0, 53.0], IS: [65.0, -18.0], IT: [42.8, 12.8],
    JM: [18.2, -77.3], JO: [31.0, 36.0], JP: [36.0, 138.0], KE: [1.0, 38.0],
    KG: [41.0, 75.0], KH: [13.0, 105.0], KI: [1.4, 173.0], KM: [-12.2, 44.4],
    KN: [17.3, -62.7], KP: [40.0, 127.0], KR: [36.0, 128.0], KW: [29.5, 47.8],
    KY: [19.3, -81.2], KZ: [48.0, 68.0], LA: [18.0, 105.0], LB: [33.8, 35.8],
    LC: [13.9, -61.0], LI: [47.2, 9.6], LK: [7.0, 81.0], LR: [6.5, -9.5],
    LS: [-29.5, 28.5], LT: [55.0, 24.0], LU: [49.8, 6.1], LV: [57.0, 25.0],
    LY: [25.0, 17.0], MA: [32.0, -5.0], MC: [43.7, 7.4], MD: [47.0, 29.0],
    ME: [42.5, 19.3], MG: [-20.0, 47.0], MH: [7.1, 171.2], MK: [41.6, 21.7],
    ML: [17.0, -4.0], MM: [22.0, 98.0], MN: [46.0, 105.0], MO: [22.2, 113.5],
    MP: [15.2, 145.7], MQ: [14.6, -61.0], MR: [20.0, -12.0], MT: [35.9, 14.4],
    MU: [-20.3, 57.6], MV: [3.2, 73.2], MW: [-13.5, 34.0], MX: [23.0, -102.0],
    MY: [4.2, 102.0], MZ: [-18.3, 35.0], NA: [-22.0, 17.0], NC: [-21.5, 165.5],
    NE: [16.0, 8.0], NG: [10.0, 8.0], NI: [13.0, -85.0], NL: [52.5, 5.8],
    NO: [62.0, 10.0], NP: [28.0, 84.0], NZ: [-41.0, 174.0], OM: [21.0, 57.0],
    PA: [9.0, -80.0], PE: [-10.0, -76.0], PF: [-17.7, -149.5], PG: [-6.0, 147.0],
    PH: [13.0, 122.0], PK: [30.0, 70.0], PL: [52.0, 20.0], PR: [18.2, -66.5],
    PS: [31.9, 35.2], PT: [39.5, -8.0], PY: [-23.0, -58.0], QA: [25.5, 51.2],
    RO: [46.0, 25.0], RS: [44.0, 21.0], RU: [60.0, 90.0], RW: [-2.0, 30.0],
    SA: [25.0, 45.0], SB: [-8.0, 159.0], SC: [-4.6, 55.5], SD: [15.0, 30.0],
    SE: [62.0, 15.0], SG: [1.35, 103.8], SI: [46.0, 15.0], SK: [48.7, 19.7],
    SL: [8.5, -11.5], SM: [43.9, 12.5], SN: [14.0, -14.0], SO: [10.0, 49.0],
    SR: [4.0, -56.0], SS: [7.0, 30.0], ST: [1.0, 7.0], SV: [13.8, -88.9],
    SY: [35.0, 38.0], SZ: [-26.5, 31.5], TD: [15.0, 19.0], TG: [8.0, 1.2],
    TH: [15.0, 101.0], TJ: [39.0, 71.0], TL: [-8.8, 125.8], TM: [40.0, 60.0],
    TN: [34.0, 9.0], TO: [-21.2, -175.2], TR: [39.0, 35.0], TT: [10.5, -61.2],
    TW: [23.7, 121.0], TZ: [-6.0, 35.0], UA: [49.0, 32.0], UG: [1.0, 32.0],
    US: [37.8, -96.0], UY: [-33.0, -56.0], UZ: [41.0, 64.0], VA: [41.9, 12.5],
    VC: [13.2, -61.2], VE: [8.0, -66.0], VG: [18.4, -64.6], VI: [18.3, -64.9],
    VN: [16.0, 106.0], VU: [-16.0, 167.0], WS: [-13.8, -172.1], YE: [15.0, 48.0],
    ZA: [-29.0, 24.0], ZM: [-15.0, 30.0], ZW: [-20.0, 30.0]
  };

  let canvas;
  let tooltip;
  let resizeObserver;
  let landRings = [];
  let landLoadFailed = false;
  let currentCountries = [];
  let currentStats = { total: 0, today: 0 };
  let currentRecent = [];
  let hitTargets = [];
  let hoverTarget = null;
  let viewScale = 1;
  let viewTx = 0;
  let viewTy = 0;
  let refreshTimer;

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>"']/g, function (character) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;",
        "'": "&#39;"
      }[character];
    });
  }

  function formatNumber(value) {
    return Number(value || 0).toLocaleString("en-US");
  }

  function mercatorY(lat) {
    const clipped = Math.max(latMin, Math.min(latMax, lat));
    const radians = clipped * Math.PI / 180;
    return Math.log(Math.tan(Math.PI / 4 + radians / 2));
  }

  function createProjection(width, height) {
    const worldWidth = (lonMax - lonMin) * Math.PI / 180;
    const worldHeight = mercatorY(latMax) - mercatorY(latMin);
    const worldAspect = worldWidth / worldHeight;
    let mapWidth;
    let mapHeight;
    let offsetX;
    let offsetY;

    if (width / height > worldAspect) {
      mapHeight = height;
      mapWidth = height * worldAspect;
      offsetX = (width - mapWidth) / 2;
      offsetY = 0;
    } else {
      mapWidth = width;
      mapHeight = width / worldAspect;
      offsetX = 0;
      offsetY = (height - mapHeight) / 2;
    }

    return function project(lat, lon) {
      const x = offsetX + ((lon - lonMin) / (lonMax - lonMin)) * mapWidth;
      const y = offsetY + ((mercatorY(latMax) - mercatorY(lat)) / worldHeight) * mapHeight;
      if (!isDashboard) return { x: x, y: y };
      return {
        x: width / 2 + (x - width / 2) * viewScale + viewTx,
        y: height / 2 + (y - height / 2) * viewScale + viewTy
      };
    };
  }

  function shouldTrack() {
    return window.location.hostname === publicHost;
  }

  function shouldShowLocalPreviewVisit() {
    return window.location.hostname !== publicHost;
  }

  function localPreviewCountry() {
    return {
      country_code: "CN",
      country_name: "China",
      country_flag: "🇨🇳",
      city: "Guangzhou",
      region: "Guangdong",
      latitude: 23.1291,
      longitude: 113.2644,
      location_label: "Guangzhou",
      location_name: "Guangzhou, China",
      count: 1
    };
  }

  function locationKey(location) {
    return [
      location.city || location.city_name || "",
      location.region || location.region_name || location.subdivision || "",
      location.country_code || location.country_name || ""
    ].join("|").toLowerCase();
  }

  function displayLocationName(location) {
    if (location.location_name) return location.location_name;

    const city = location.city || location.city_name || "";
    const region = location.region || location.region_name || location.subdivision || "";
    const country = location.country_name || location.country_code || "Unknown";
    if (city && country) return city + ", " + country;
    if (region && country) return region + ", " + country;
    return country;
  }

  function displayLocationLabel(location) {
    if (location.location_label) return location.location_label;
    return location.city || location.city_name || String(location.country_code || "").toUpperCase();
  }

  function firstPresent(values) {
    for (let index = 0; index < values.length; index += 1) {
      if (values[index] !== undefined && values[index] !== null && values[index] !== "") return values[index];
    }
    return undefined;
  }

  function locationPoint(location) {
    const lat = Number(firstPresent([location.latitude, location.lat]));
    const lon = Number(firstPresent([location.longitude, location.lon, location.lng]));
    if (Number.isFinite(lat) && Number.isFinite(lon)) return [lat, lon];
    return countryPoints[String(location.country_code || "").toUpperCase()];
  }

  function buildCityLocations(flags, traffic) {
    const rows = []
      .concat(flags.cities || [])
      .concat(flags.locations || [])
      .concat(traffic.cities || [])
      .concat(traffic.locations || [])
      .concat(traffic.visits || []);
    const buckets = {};

    rows.forEach(function (row) {
      const city = row.city || row.city_name;
      const point = locationPoint(row);
      if (!city || !point) return;

      const key = locationKey(row);
      if (!buckets[key]) {
        buckets[key] = {
          city: city,
          region: row.region || row.region_name || row.subdivision || "",
          country_code: row.country_code,
          country_name: row.country_name,
          country_flag: row.country_flag || "",
          latitude: point[0],
          longitude: point[1],
          location_label: city,
          location_name: displayLocationName(row),
          count: 0
        };
      }
      buckets[key].count += Number(row.count || row.visits || row.pageviews || 1);
    });

    return Object.keys(buckets).map(function (key) {
      return buckets[key];
    }).sort(function (a, b) {
      return b.count - a.count;
    });
  }

  function buildCountryLocations(flags) {
    return (flags.countries || []).filter(function (country) {
      return locationPoint(country);
    }).map(function (country) {
      return Object.assign({}, country, {
        location_label: String(country.country_code || "").toUpperCase(),
        location_name: country.country_name || country.country_code || "Unknown"
      });
    });
  }

  function trackVisit() {
    if (!siteId || !shouldTrack()) return;

    const payload = {
      path: window.location.pathname || "/",
      title: (document.title || "").slice(0, 160),
      host: window.location.host,
      ref: document.referrer || "",
      tz: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
      lang: navigator.language || "",
      sw: window.screen ? window.screen.width : 0,
      sh: window.screen ? window.screen.height : 0
    };

    fetch(apiOrigin + "/api/track/" + encodeURIComponent(siteId), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true
    }).catch(function () {});
  }

  function fetchJson(path) {
    return fetch(apiOrigin + path, { cache: "no-store" }).then(function (response) {
      if (!response.ok) throw new Error("FeedPulse returned " + response.status);
      return response.json();
    });
  }

  function decodeTopology(topology) {
    const transform = topology.transform || {};
    const scale = transform.scale || [1, 1];
    const translate = transform.translate || [0, 0];
    const arcs = (topology.arcs || []).map(function (arc) {
      let x = 0;
      let y = 0;
      return arc.map(function (point) {
        x += point[0];
        y += point[1];
        return [x * scale[0] + translate[0], y * scale[1] + translate[1]];
      });
    });
    const rings = [];

    function resolveArc(index) {
      if (index >= 0) return arcs[index] || [];
      return (arcs[~index] || []).slice().reverse();
    }

    function stitchRing(arcIndexes) {
      const ring = [];
      arcIndexes.forEach(function (arcIndex) {
        const points = resolveArc(arcIndex);
        points.forEach(function (point, pointIndex) {
          if (ring.length && pointIndex === 0) return;
          ring.push(point);
        });
      });
      return ring;
    }

    function collectGeometry(geometry) {
      if (!geometry) return;
      if (geometry.type === "GeometryCollection") {
        (geometry.geometries || []).forEach(collectGeometry);
      } else if (geometry.type === "Polygon") {
        (geometry.arcs || []).forEach(function (ring) {
          rings.push(stitchRing(ring));
        });
      } else if (geometry.type === "MultiPolygon") {
        (geometry.arcs || []).forEach(function (polygon) {
          polygon.forEach(function (ring) {
            rings.push(stitchRing(ring));
          });
        });
      }
    }

    collectGeometry(topology.objects && topology.objects.land);
    return rings.filter(function (ring) {
      return ring.length > 2;
    });
  }

  function loadLand() {
    return fetch(landTopologyUrl, { cache: "force-cache" })
      .then(function (response) {
        if (!response.ok) throw new Error("World map returned " + response.status);
        return response.json();
      })
      .then(function (topology) {
        landRings = decodeTopology(topology);
        drawMap();
      })
      .catch(function () {
        landLoadFailed = true;
        drawMap();
      });
  }

  function mount() {
    root.innerHTML = isDashboard ? dashboardMarkup() : compactMarkup();

    canvas = root.querySelector(".reviewer-map__canvas-layer");
    tooltip = root.querySelector(".reviewer-map__tooltip");

    canvas.addEventListener("mousemove", handlePointerMove);
    canvas.addEventListener("mouseleave", hideTooltip);
    canvas.addEventListener("focus", hideTooltip);
    if (isDashboard) {
      bindDashboardControls();
    } else {
      canvas.addEventListener("click", openDashboard);
      canvas.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openDashboard();
        }
      });
    }

    if ("ResizeObserver" in window) {
      resizeObserver = new ResizeObserver(drawMap);
      resizeObserver.observe(canvas);
    } else {
      window.addEventListener("resize", drawMap);
    }
  }

  function compactMarkup() {
    return '<div class="reviewer-map reviewer-map--compact reviewer-map--link">' +
      '<div class="reviewer-map__canvas" title="Open visitor analytics">' +
        '<canvas class="reviewer-map__canvas-layer" aria-label="Open visitor analytics" role="link" tabindex="0"></canvas>' +
        '<div class="reviewer-map__tooltip" aria-hidden="true"></div>' +
      '</div>' +
      '<div class="reviewer-map__stats">' +
        '<div class="reviewer-map__stat"><strong data-reviewer-total>0</strong><span>total visits</span></div>' +
        '<div class="reviewer-map__stat"><strong data-reviewer-today>0</strong><span>today</span></div>' +
        '<div class="reviewer-map__stat"><strong data-reviewer-countries>0</strong><span>countries</span></div>' +
      '</div>' +
      '<ul class="reviewer-map__countries"><li><strong>No public visits yet</strong><span>0</span></li></ul>' +
      '<ul class="reviewer-map__recent"><li><strong>Waiting for recent visits</strong><span>live</span></li></ul>' +
      '<div class="reviewer-map__footer"><span>Click map for analytics</span><a href="https://feed-pulse.com/site/' + encodeURIComponent(publicHost) + '/traffic" target="_blank" rel="noopener">via FeedPulse</a></div>' +
    '</div>';
  }

  function dashboardMarkup() {
    return '<div class="visitor-dashboard__shell">' +
      '<div class="visitor-dashboard__header">' +
        '<div><p class="visitor-dashboard__eyebrow">Live visitor map</p><h2>Visitor Analytics</h2><p>' + escapeHtml(publicHost) + '</p></div>' +
        '<a class="visitor-dashboard__home" href="/">Back to homepage</a>' +
      '</div>' +
      '<div class="visitor-dashboard__kpis">' +
        '<div><span>Total</span><strong data-reviewer-total>0</strong></div>' +
        '<div><span>Today</span><strong data-reviewer-today>0</strong></div>' +
        '<div><span>Regions</span><strong data-reviewer-countries>0</strong></div>' +
        '<div><span>Refresh</span><strong>' + Math.round(pollMs / 1000) + 's</strong></div>' +
      '</div>' +
      '<div class="visitor-dashboard__main">' +
        '<div class="visitor-dashboard__map-panel">' +
          '<div class="visitor-dashboard__panel-title">World map</div>' +
          '<div class="reviewer-map__canvas visitor-dashboard__canvas">' +
            '<canvas class="reviewer-map__canvas-layer" aria-label="Visitor world map"></canvas>' +
            '<div class="reviewer-map__tooltip" aria-hidden="true"></div>' +
            '<div class="visitor-dashboard__zoom"><button type="button" data-reviewer-zoom="in">+</button><button type="button" data-reviewer-zoom="out">-</button><button type="button" data-reviewer-zoom="reset">Reset</button></div>' +
          '</div>' +
        '</div>' +
        '<div class="visitor-dashboard__side">' +
          '<div class="visitor-dashboard__panel"><div class="visitor-dashboard__panel-title">Top regions</div><ul class="reviewer-map__countries"><li><strong>No public visits yet</strong><span>0</span></li></ul></div>' +
          '<div class="visitor-dashboard__panel"><div class="visitor-dashboard__panel-title">Recent visitors</div><ul class="reviewer-map__recent"><li><strong>Waiting for recent visits</strong><span>live</span></li></ul></div>' +
        '</div>' +
      '</div>' +
      '<div class="visitor-dashboard__footer"><span>Live visit data from FeedPulse.</span><a href="https://feed-pulse.com/site/' + encodeURIComponent(publicHost) + '/traffic" target="_blank" rel="noopener">FeedPulse report</a></div>' +
    '</div>';
  }

  function bindDashboardControls() {
    root.querySelectorAll("[data-reviewer-zoom]").forEach(function (button) {
      button.addEventListener("click", function () {
        const action = button.getAttribute("data-reviewer-zoom");
        if (action === "in") {
          viewScale = Math.min(4, viewScale * 1.35);
        } else if (action === "out") {
          viewScale = Math.max(1, viewScale / 1.35);
          if (viewScale === 1) {
            viewTx = 0;
            viewTy = 0;
          }
        } else {
          viewScale = 1;
          viewTx = 0;
          viewTy = 0;
        }
        hideTooltip();
        drawMap();
      });
    });
  }

  function openDashboard() {
    if (dashboardUrl) window.location.href = dashboardUrl;
  }

  function drawBackground(context, width, height) {
    const gradient = context.createRadialGradient(width * 0.5, height * 0.08, 20, width * 0.5, height * 0.2, width * 0.78);
    gradient.addColorStop(0, "#123f5c");
    gradient.addColorStop(0.5, "#082a44");
    gradient.addColorStop(1, "#04121f");
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);
  }

  function drawGraticule(context, project) {
    context.save();
    context.strokeStyle = "rgba(129, 204, 235, 0.12)";
    context.lineWidth = 1;

    for (let lon = -150; lon <= 150; lon += 30) {
      context.beginPath();
      for (let lat = latMin; lat <= latMax; lat += 3) {
        const point = project(lat, lon);
        if (lat === latMin) context.moveTo(point.x, point.y);
        else context.lineTo(point.x, point.y);
      }
      context.stroke();
    }

    for (let lat = -45; lat <= 75; lat += 15) {
      context.beginPath();
      for (let lon = lonMin; lon <= lonMax; lon += 3) {
        const point = project(lat, lon);
        if (lon === lonMin) context.moveTo(point.x, point.y);
        else context.lineTo(point.x, point.y);
      }
      context.stroke();
    }

    context.restore();
  }

  function drawLand(context, project) {
    if (!landRings.length) return;

    context.save();
    context.beginPath();
    landRings.forEach(function (ring) {
      let prevLon = null;
      let broken = false;
      ring.forEach(function (coordinate, index) {
        const point = project(coordinate[1], coordinate[0]);
        if (index === 0 || (prevLon !== null && Math.abs(coordinate[0] - prevLon) > 180)) {
          context.moveTo(point.x, point.y);
          if (index !== 0) broken = true;
        }
        else context.lineTo(point.x, point.y);
        prevLon = coordinate[0];
      });
      if (!broken) context.closePath();
    });
    context.fillStyle = "rgba(92, 151, 164, 0.86)";
    context.strokeStyle = "rgba(148, 221, 239, 0.34)";
    context.lineWidth = 0.7;
    context.fill("evenodd");
    context.stroke();
    context.restore();
  }

  function drawEmptyState(context, width, height) {
    if (currentCountries.length || !landLoadFailed) return;
    context.save();
    context.fillStyle = "rgba(255, 151, 151, 0.92)";
    context.font = "600 12px ui-monospace, Menlo, Consolas, monospace";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText("World map unavailable", width / 2, height / 2);
    context.restore();
  }

  function drawDots(context, project) {
    hitTargets = [];
    if (!currentCountries.length) return;

    const max = Math.max.apply(null, currentCountries.map(function (country) {
      return country.count || 0;
    }).concat([1]));

    currentCountries.forEach(function (country, index) {
      const point = locationPoint(country);
      if (!point) return;

      const projected = project(point[0], point[1]);
      const count = country.count || 0;
      const radius = 4 + Math.sqrt(count / max) * 8;
      const key = locationKey(country);
      const isHovered = hoverTarget && hoverTarget.location_key === key;

      context.save();
      context.beginPath();
      context.arc(projected.x, projected.y, radius + 7, 0, Math.PI * 2);
      context.strokeStyle = isHovered ? "rgba(255, 211, 107, 0.72)" : "rgba(255, 201, 77, 0.38)";
      context.lineWidth = isHovered ? 2 : 1.4;
      context.stroke();

      context.beginPath();
      context.arc(projected.x, projected.y, radius, 0, Math.PI * 2);
      context.fillStyle = isHovered ? "#ffd36b" : "#ffc94d";
      context.shadowColor = "#ffc94d";
      context.shadowBlur = 12;
      context.fill();
      context.restore();

      if (index < 5) {
        context.save();
        context.font = "700 10.5px ui-monospace, Menlo, Consolas, monospace";
        context.textBaseline = "middle";
        context.lineWidth = 4;
        context.strokeStyle = "rgba(4, 18, 31, 0.88)";
        context.fillStyle = "#d7f4ff";
        const label = displayLocationLabel(country) + " " + formatNumber(count);
        context.strokeText(label, projected.x + radius + 6, projected.y);
        context.fillText(label, projected.x + radius + 6, projected.y);
        context.restore();
      }

      hitTargets.push({
        x: projected.x,
        y: projected.y,
        radius: radius + 10,
        location_key: key,
        location_name: displayLocationName(country),
        country_code: country.country_code,
        country_flag: country.country_flag || "",
        count: count
      });
    });
  }

  function drawMap() {
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const width = Math.max(320, Math.round(rect.width || canvas.parentNode.clientWidth || 620));
    const height = Math.max(160, Math.round(rect.height || width / 2));
    const ratio = window.devicePixelRatio || 1;

    if (canvas.width !== Math.round(width * ratio) || canvas.height !== Math.round(height * ratio)) {
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
    }

    const context = canvas.getContext("2d");
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, width, height);

    const project = createProjection(width, height);
    drawBackground(context, width, height);
    drawGraticule(context, project);
    drawLand(context, project);
    drawDots(context, project);
    drawEmptyState(context, width, height);
  }

  function hideTooltip() {
    hoverTarget = null;
    if (tooltip) tooltip.classList.remove("is-visible");
    drawMap();
  }

  function handlePointerMove(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const target = hitTargets.find(function (item) {
      const dx = item.x - x;
      const dy = item.y - y;
      return Math.sqrt(dx * dx + dy * dy) <= item.radius;
    });

    if (!target) {
      hideTooltip();
      return;
    }

    hoverTarget = target;
    tooltip.innerHTML = '<strong>' + escapeHtml((target.country_flag ? target.country_flag + " " : "") + target.location_name) + '</strong><span>' + formatNumber(target.count) + ' visit' + (target.count === 1 ? '' : 's') + '</span>';
    tooltip.style.left = Math.min(Math.max(x + 12, 8), rect.width - 132) + "px";
    tooltip.style.top = Math.max(y - 42, 8) + "px";
    tooltip.classList.add("is-visible");
    drawMap();
  }

  function updateText(selector, value) {
    const element = root.querySelector(selector);
    if (element) element.textContent = value;
  }

  function render(data) {
    const flags = data.flags || {};
    const traffic = data.traffic || {};
    const cityLocations = buildCityLocations(flags, traffic);
    currentCountries = (cityLocations.length ? cityLocations : buildCountryLocations(flags)).slice(0, maxCountries);
    currentRecent = (traffic.visits || []).slice(0, 6);
    currentStats = {
      total: flags.all_time || flags.total || 0,
      today: flags.today || 0
    };

    const isLocalPreview = shouldShowLocalPreviewVisit() && !currentCountries.length;
    if (isLocalPreview) {
      currentCountries = [localPreviewCountry()];
      currentRecent = [{
        country_code: "CN",
        country_name: "China",
        country_flag: "🇨🇳",
        city: "Guangzhou",
        region: "Guangdong",
        location_name: "Guangzhou, China",
        relative_time: "preview"
      }];
      currentStats = { total: 1, today: 1 };
    }

    updateText("[data-reviewer-total]", formatNumber(currentStats.total));
    updateText("[data-reviewer-today]", formatNumber(currentStats.today));
    updateText("[data-reviewer-countries]", formatNumber(currentCountries.length));

    const countriesList = currentCountries.length
      ? currentCountries.map(function (country) {
        return '<li><span>' + escapeHtml(country.country_flag || "") + '</span><strong>' +
          escapeHtml(displayLocationName(country)) + '</strong><span>' +
          formatNumber(country.count) + '</span></li>';
      }).join("")
      : '<li><strong>No public visits yet</strong><span>0</span></li>';

    const recentList = currentRecent.length
      ? currentRecent.map(function (visit) {
        return '<li><span>' + escapeHtml(visit.country_flag || "") + '</span><strong>' +
          escapeHtml(displayLocationName(visit)) + '</strong><span>' +
          escapeHtml(visit.relative_time || "") + '</span></li>';
      }).join("")
      : '<li><strong>Waiting for recent visits</strong><span>live</span></li>';

    const countryListNode = root.querySelector(".reviewer-map__countries");
    const recentListNode = root.querySelector(".reviewer-map__recent");
    if (countryListNode) countryListNode.innerHTML = countriesList;
    if (recentListNode) recentListNode.innerHTML = recentList;

    drawMap();
  }

  function renderError() {
    const recentListNode = root.querySelector(".reviewer-map__recent");
    if (recentListNode) {
      recentListNode.innerHTML = '<li><strong>Visitor data unavailable</strong><span>retrying</span></li>';
    }
    drawMap();
  }

  function refresh() {
    if (document.hidden) return;

    Promise.all([
      fetchJson("/api/widget/flags/" + encodeURIComponent(siteId) + "?include_bots=0"),
      fetchJson("/api/widget/traffic/" + encodeURIComponent(siteId) + "?limit=6&include_bots=0")
    ]).then(function (responses) {
      render({ flags: responses[0], traffic: responses[1] });
    }).catch(renderError);
  }

  function startPolling() {
    refreshTimer = window.setInterval(refresh, pollMs);
    document.addEventListener("visibilitychange", function () {
      if (!document.hidden) refresh();
    });
  }

  if (!siteId) {
    root.innerHTML = '<div class="page-reviewers__loading">Visitor statistics are not connected.</div>';
    return;
  }

  mount();
  trackVisit();
  loadLand();
  refresh();
  startPolling();
  window.addEventListener("beforeunload", function () {
    if (refreshTimer) window.clearInterval(refreshTimer);
    if (resizeObserver) resizeObserver.disconnect();
  });
})();

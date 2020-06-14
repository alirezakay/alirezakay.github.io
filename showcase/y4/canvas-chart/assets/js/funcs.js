
/**
 * zip
 * @param {Array} a 
 * @param {Array} b
 * @param {string} aName 
 * @param {string} bName
 * @returns {Array} - zipped array like: [{a1, b1}, {a2, b2}, ...]
 */
const zip = (a, b, aName, bName) => {
  const ret = [];
  for (let i = 0; i < a.length; i++) {
    ret.push({ [aName]: a[i], [bName]: b[i] });
  }
  return ret;
}

/**
 * drawRuleX
 * @param {Objext} chart - canvas context object 
 * @param {number} ch - canvas height
 * @param {number} maxCanvWidth
 * @param {number} n - numOfGrids
 */
const drawRuleX = (chart, ch, maxCanvWidth, n) => {
  chart.beginPath();
  chart.strokeStyle = 'rgba(245, 66, 129,0.1)';
  chart.lineWidth = 1;
  for (var i = 1; i < n; i++) {
    const p = i * ch / n;
    chart.moveTo(0, p);
    chart.lineTo(maxCanvWidth, p);
  }
  chart.stroke();
}

/**
 * drawRuleY
 * @param {Objext} chart - canvas context object 
 * @param {number} cw - canvas width
 * @param {number} maxCanvHeight
 * @param {number} n - numOfGrids
 */
const drawRuleY = (chart, cw, maxCanvHeight, n) => {
  chart.beginPath();
  chart.strokeStyle = 'rgba(245, 66, 129,0.1)';
  chart.lineWidth = 1;
  for (var i = 1; i < n; i++) {
    const p = i * cw / n;
    chart.moveTo(p, 0);
    chart.lineTo(p, maxCanvHeight);
  }
  chart.stroke();
}

/**
 * plot 
 * @param {Object} chart - the canvas context
 * @param {Array} f - array of the function pair values
 * @param {number} sX - scale of x axis
 * @param {number} sY - scale of y axis
 * @param {string} color - the graph color
 * @param {number} h - chartHeight
 * @param {number} offset - offset for shifting y values to down (one unit of grid) 
 * @param {number} sXmin - scaled min value of x axis 
 * @param {number} sYmin - scaled min value of y axis
 * @returns {Array} points in canvas
 */
const plot = (chart, f, sX, sY, color, h, offset, sXmin, sYmin) => {
  ret = { color, points: [] };
  chart.strokeStyle = color;
  chart.lineWidth = 1;
  for (let i = 0; i < f.length - 1; i++) {
    chart.beginPath();
    const x1 = f[i].x * sX - sXmin;
    const y1 = h - (f[i].y * sY - sYmin) + offset;
    const x2 = f[i + 1].x * sX - sXmin;
    const y2 = h - (f[i + 1].y * sY - sYmin) + offset;
    chart.moveTo(x1, y1);
    chart.lineTo(x2, y2);
    chart.stroke();
  }

  const pointColor = "#d11544";
  chart.strokeStyle = pointColor;
  chart.fillStyle = pointColor;
  chart.lineWidth = 1;
  for (let i = 0; i < f.length; i++) {
    chart.beginPath();
    const x = f[i].x * sX - sXmin;
    const y = h - (f[i].y * sY - sYmin) + offset;
    ret.points.push({ x, y });
    chart.arc(x, y, 3, 0, 2 * Math.PI);
    chart.fill();
  }

  return ret;
}

/**
 * createCanvas
 * @param {Node} p - parent element for the canvaas
 * @returns {Node} - the current created canvas
 */
const createCanvas = (p) => {
  const el = `<canvas class="chart"></canvas>`;
  $(p).append(el);
  const ret = $(p).find("canvas");
  return ret[ret.length - 1];
}

/**
 * createSpan
 * @param {Node} p - the parent element
 * @returns {Node} - the current created canvas
 */
const createSpan = (p) => {
  const el = `<span></span>`;
  $(p).append(el);
  const ret = $(p).find("span");
  return ret[ret.length - 1];
}

/**
 * 
 * @param {Object} ctx 
 * @param {number} w 
 * @param {number} h 
 */
const clearChartCtx = (ctx, w, h) => {
  ctx.clearRect(0, 0, w, h);
}

/**
 * injectData
 * @param {Object} props - constant properties
 * @param {bool} init - check if the calling is for initializing or not
 */
const injectData = (props, init) => {
  const { numOfGridLines, chartsEl, chartNum, canvasWidth, canvasHeight, timeEl, valuesEl, ignoredChannels } = props;
  let { s } = props;
  s = Math.round(s * 10) / 10;
  if(init) window.graphs = [];

  $.getJSON("/assets/data/chart.json", (data) => {
    $("#scale").text(`${s}x`);
    data.map((d, i) => {
      let chart = "";
      if (init) {
        chart = createCanvas(chartsEl);
      }
      else {
        chart = $(chartsEl).find("canvas")[i];
      }
      const chartCtx = chart.getContext("2d");
      chartCtx.canvas.width = canvasWidth;
      chartCtx.canvas.height = canvasHeight;
      const cw = chartCtx.canvas.width;   // canvas width
      const ch = chartCtx.canvas.height;  // canvas height
      if (chartNum !== i) $(chart).addClass("d-none");
      if (!init) {
        clearChartCtx(chartCtx, canvasWidth, canvasHeight);
      }

      const chartColor = [];
      const f = []; // both x and y axis data, sorted by key: x
      d.data.map((channel, j) => {
        f.push(zip(channel.valX, channel.valY, "x", "y"));
        f[j] = f[j].sort((a, b) => a.x - b.x);
        channel.color ? chartColor.push(channel.color) : chartColor.push("#000");
      });

      const timeMin = Math.min(...f.map(g => Math.min(...g.map(a => a.x))));
      const timeMax = Math.max(...f.map(g => Math.max(...g.map(a => a.x))));
      const valuesMin = Math.min(...f.map(g => Math.min(...g.map(a => a.y))));
      const valuesMax = Math.max(...f.map(g => Math.max(...g.map(a => a.y))));

      ////////////////////////////////////// draw grid
      drawRuleX(chartCtx, ch, canvasWidth, numOfGridLines);
      drawRuleY(chartCtx, cw, canvasHeight, numOfGridLines);

      ///////////////////////////////////////////// initialize axis values to variables: time, values
      let time = [...Array(numOfGridLines).keys()]
        .map(counter => Math.round((counter * (timeMax - timeMin) / (numOfGridLines - 1) + timeMin) / s * 10) / 10);      // x axis value titles
      let values = [...Array(numOfGridLines).keys()]
        .map(counter => Math.round((counter * (valuesMax - valuesMin) / (numOfGridLines - 1) + valuesMin) / s));  // y axis value titles

      ///////////////////////// create charts' span elements with values stored in: time, values
      time.map((t, j) => {
        let span = "";
        if (init) {
          span = createSpan(timeEl);
        }
        else {
          span = $(timeEl).find("span")[i * time.length + j];
        }
        $(span).text(t);

        if (i !== chartNum) $(span).addClass('d-none');
      });
      values.map((v, j) => {
        let span = "";
        if (init) {
          span = createSpan(valuesEl);
        }
        else {
          span = $(valuesEl).find("span")[i * values.length + j];
        }
        $(span).text(v);
        if (i !== chartNum) $(span).addClass('d-none');
      });

      //////////////////////////// plot
      const _n = 1 / (numOfGridLines);        // one unit of the gird
      const w = (1 - _n) * canvasWidth;       // width of operational zone of canvas
      const h = (1 - _n) * canvasHeight;      // height of operational zone of canvas
      const offsetY = _n * canvasHeight;      // one unit of grid needed to be shift down for values: y 
      if(init) window.graphs[i] = [];
      f.forEach((g, j) => {
        const sX = w / (timeMax - timeMin);     // scale in x axis 
        const sY = h / (valuesMax - valuesMin); // scale in y axis
        const sXmin = timeMin * sX;             // scaled minimum of times: x
        const sYmin = valuesMin * sY;           // scaled minimum of values: y
        if(init){
          window.graphs[i].push(plot(chartCtx, g, sX * s, sY * s, chartColor[j], h, offsetY, sXmin * s, sYmin * s));
        }
        else{
          if(!shouldBeIgnored(ignoredChannels, i, j)){
            plot(chartCtx, g, sX * s, sY * s, chartColor[j], h, offsetY, sXmin * s, sYmin * s);
          }
        }
      })
    });
  });
}

/**
 * 
 * @param {Array} ignored 
 * @param {number} i - chart number
 * @param {number} j - channel number
 */
const shouldBeIgnored = (ignored, i, j) => {
  for(let k=0; k<ignored.length; k++){
    if(ignored[k].i == i && ignored[k].j == j){
      return true;
    }
  }
  return false;
}

/**
 * showCharts
 * @param {number} chartNum 
 * @param {number} numOfGridLines 
 */
const showChart = (chartNum, numOfGridLines) => {
  $("#desc-btn").html(`Chart <b style="color: #777">${chartNum + 1}</b> Description`);

  $("#charts").find("canvas").addClass("d-none");
  const canvas = $("#charts").find("canvas")[chartNum];
  $(canvas).removeClass("d-none");

  const timeSpans = $("#time").find("span");
  const valuesSpans = $("#values").find("span");
  timeSpans.addClass('d-none');
  valuesSpans.addClass('d-none');
  for (let i = chartNum * numOfGridLines; i < (chartNum + 1) * numOfGridLines; i++) {
    $(timeSpans[i]).removeClass("d-none");
    $(valuesSpans[i]).removeClass("d-none");
  }
}